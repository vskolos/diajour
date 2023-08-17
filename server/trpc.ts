import { TRPCError, initTRPC } from '@trpc/server'
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import cookie, { type CookieSerializeOptions } from 'cookie'

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
  return next({ ctx })
})

export const publicProcedure = t.procedure
export const authedProcedure = t.procedure.use(authMiddleware)
