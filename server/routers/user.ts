import { TRPCError } from '@trpc/server'
import crypto from 'crypto'
import { addDays } from 'date-fns'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db'
import { sessions, users } from '../schemas'
import { authedProcedure, publicProcedure, router } from '../trpc'
import { PASSWORD_REGEX, hashPassword } from '../utils'

export const userRouter = router({
  data: authedProcedure.query(({ ctx }) => {
    const sessionId = ctx.sessionId!

    const user = db
      .select()
      .from(users)
      .innerJoin(sessions, eq(users.id, sessions.userId))
      .where(eq(sessions.id, sessionId))
      .get()?.users

    return user
  }),
  signup: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(({ input }) => {
      if (!input.username)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Не указано имя пользователя',
        })

      if (!input.password)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Не указан пароль',
        })

      const user = db
        .select()
        .from(users)
        .where(eq(users.username, input.username))
        .get()

      if (user)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Пользователь уже существует',
        })

      if (!PASSWORD_REGEX.test(input.password))
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Пароль слишком простой',
        })

      db.insert(users)
        .values({
          username: input.username,
          password: hashPassword(input.password),
        })
        .run()

      return db.select().from(users).all()
    }),

  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.getCookie('sessionId')) return

      if (!input.username)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Не указано имя пользователя',
        })

      if (!input.password)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Не указан пароль',
        })

      const user = db
        .select()
        .from(users)
        .where(eq(users.username, input.username))
        .get()

      if (!user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Пользователь не найден',
        })

      if (user.password !== hashPassword(input.password))
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Неверно введен пароль',
        })

      let session = db
        .select({ id: sessions.id })
        .from(sessions)
        .where(eq(sessions.userId, user.id))
        .get()

      if (!session) {
        session = db
          .insert(sessions)
          .values({
            id: crypto.randomBytes(64).toString('hex'),
            userId: user.id,
          })
          .returning({ id: sessions.id })
          .get()
      }

      ctx.setCookie(
        'sessionId',
        session.id,
        process.env.NODE_ENV === 'development'
          ? {
              sameSite: 'none',
              secure: true,
              expires: addDays(new Date(), 1),
              path: '/',
            }
          : { expires: addDays(new Date(), 1), path: '/' }
      )
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const sessionId = ctx.getCookie('sessionId')
    if (!sessionId) return

    db.delete(sessions).where(eq(sessions.id, sessionId)).run()

    ctx.setCookie(
      'sessionId',
      '',
      process.env.NODE_ENV === 'development'
        ? { sameSite: 'none', secure: true, expires: new Date(0) }
        : { expires: new Date(0) }
    )
  }),
})
