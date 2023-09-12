import { TRPCError } from '@trpc/server'
import crypto from 'crypto'
import { addDays, format } from 'date-fns'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { deleteExpiredSessions, getUserBySessionId } from '../helpers'
import { InsertUser, User, sessions, users } from '../schemas'
import { authedProcedure, publicProcedure, router } from '../trpc'
import { PASSWORD_REGEX, hashPassword, sanitizedUser } from '../utils'

export const userRouter = router({
  data: authedProcedure.query(({ ctx }) => {
    const user = getUserBySessionId(ctx.sessionId)
    return sanitizedUser(user)
  }),

  signup: publicProcedure.input(InsertUser).mutation(({ input }) => {
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
  }),

  login: publicProcedure
    .input(User.pick({ username: true, password: true }))
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

      deleteExpiredSessions()

      let session = db
        .select()
        .from(sessions)
        .where(eq(sessions.userId, user.id))
        .get()

      if (!session) {
        session = db
          .insert(sessions)
          .values({
            id: crypto.randomBytes(64).toString('hex'),
            userId: user.id,
            expiresAt: format(addDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
          })
          .returning()
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

  logout: authedProcedure.mutation(({ ctx }) => {
    const sessionId = ctx.sessionId

    if (!sessionId)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Не найдена активная сессия',
      })

    db.delete(sessions).where(eq(sessions.id, sessionId)).run()

    ctx.setCookie(
      'sessionId',
      '',
      process.env.NODE_ENV === 'development'
        ? { sameSite: 'none', secure: true, expires: new Date(0), path: '/' }
        : { expires: new Date(0), path: '/' }
    )
  }),
})
