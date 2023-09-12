import { TRPCError, initTRPC } from '@trpc/server'
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import cookie, { type CookieSerializeOptions } from 'cookie'
import { addDays, compareAsc, format } from 'date-fns'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { deleteExpiredSessions } from './helpers'
import { sessions } from './schemas'

export const createContext = ({ req, res }: CreateHTTPContextOptions) => ({
  setCookie: (
    name: string,
    value: string,
    options?: CookieSerializeOptions
  ) => {
    res.appendHeader('Set-Cookie', cookie.serialize(name, value, options))
  },
  getCookie: (name: string) => {
    if (!req.headers.cookie) return
    const cookies = cookie.parse(req.headers.cookie)
    return cookies[name]
  },
  sessionId: req.headers.cookie
    ? cookie.parse(req.headers.cookie)?.sessionId
    : undefined,
})

const t = initTRPC.context<typeof createContext>().create()

export const router = t.router
export const middleware = t.middleware

const authMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.sessionId) throw new TRPCError({ code: 'UNAUTHORIZED' })

  const session = db
    .select()
    .from(sessions)
    .where(eq(sessions.id, ctx.sessionId))
    .get()

  if (!session || compareAsc(new Date(session.expiresAt), new Date()) === -1) {
    deleteExpiredSessions()

    ctx.setCookie(
      'sessionId',
      '',
      process.env.NODE_ENV === 'development'
        ? { sameSite: 'none', secure: true, expires: new Date(0), path: '/' }
        : { expires: new Date(0), path: '/' }
    )

    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const inOneDay = addDays(new Date(), 1)

  db.update(sessions)
    .set({
      expiresAt: format(inOneDay, 'yyyy-MM-dd HH:mm:ss'),
    })
    .where(eq(sessions.id, session.id))
    .run()

  ctx.setCookie(
    'sessionId',
    session.id,
    process.env.NODE_ENV === 'development'
      ? {
          sameSite: 'none',
          secure: true,
          expires: inOneDay,
          path: '/',
        }
      : { expires: inOneDay, path: '/' }
  )

  return next({ ctx })
})

export const publicProcedure = t.procedure
export const authedProcedure = t.procedure.use(authMiddleware)
