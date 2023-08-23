import { and, eq } from 'drizzle-orm'
import { db } from '../db'
import { weeks } from '../schemas'
import { getWeekStart } from '../utils'

type Params = {
  userId: number
  date: string
}

export function getWeekByUserIdAndDate({ userId, date }: Params) {
  const weekStart = getWeekStart(date)

  const week = db
    .select()
    .from(weeks)
    .where(and(eq(weeks.start, weekStart), eq(weeks.userId, userId)))
    .get()

  return week || null
}
