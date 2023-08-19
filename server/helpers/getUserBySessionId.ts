import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { User, sessions, users } from '../schemas'

export function getUserBySessionId(sessionId: string | undefined): User {
  if (!sessionId)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Не найдена активная сессия',
    })

  const user = db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .innerJoin(users, eq(sessions.userId, users.id))
    .get()?.users

  if (!user)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Не найден пользователь активной сесии',
    })

  return user
}
