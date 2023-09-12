import { compareAsc } from 'date-fns'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { sessions } from '../schemas'

export function deleteExpiredSessions() {
  const sessionList = db.select().from(sessions).all()

  const expiredSessions = sessionList.filter(
    (session) => compareAsc(new Date(session.expiresAt), new Date()) === -1
  )

  expiredSessions.forEach((session) =>
    db.delete(sessions).where(eq(sessions.id, session.id)).run()
  )
}
