import { createHTTPServer } from '@trpc/server/adapters/standalone'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './routers'
import { createContext, router } from './trpc'

dotenv.config()

if (!process.env.SALT) throw new Error('Add SALT .env variable to proceed')
if (process.env.PORT && isNaN(parseInt(process.env.PORT)))
  throw new Error('PORT .env variable must be a number')

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001

const appRouter = router({
  user: userRouter,
})

const server = createHTTPServer({
  router: appRouter,
  middleware:
    process.env.NODE_ENV === 'dev'
      ? (req, res, next) => {
          res.setHeader('Access-Control-Allow-Credentials', 'true')
          cors({
            origin: 'http://localhost:5173',
          })(req, res, next)
        }
      : undefined,
  createContext,
})

server.listen(port)
console.log(`TRPC server listening on port ${port}`)

export type AppRouter = typeof appRouter
