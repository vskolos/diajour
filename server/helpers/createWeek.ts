import { db } from '../db'
import { InsertWeek, weeks } from '../schemas'
import { getWeekStart } from '../utils'

export function createWeek(input: InsertWeek) {
  const weekStart = getWeekStart(input.start)

  const week = db
    .insert(weeks)
    .values({
      start: weekStart,
      userId: input.userId,
      dosage: input.dosage,
      weight: input.weight,
    })
    .returning()
    .get()

  return week
}
