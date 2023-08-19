import { TRPCError } from '@trpc/server'
import { format, isValid, startOfWeek } from 'date-fns'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { weeks, type User } from '../schemas'

export function getUserWeekFromDateString(user: User, dateString: string) {
  const date = new Date(dateString)

  if (!isValid(date))
    throw new TRPCError({
      code: 'PARSE_ERROR',
      message: 'Не удалось распознать дату. Ожидаемый формат: ДД.ММ.ГГГГ',
    })

  const weekStart = format(
    startOfWeek(date, {
      weekStartsOn: 1,
    }),
    'yyyy-MM-dd'
  )

  let week = db.select().from(weeks).where(eq(weeks.start, weekStart)).get()

  if (!week)
    week = db
      .insert(weeks)
      .values({ start: weekStart, userId: user.id })
      .returning()
      .get()

  if (!week)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Не удалось найти или создать неделю',
    })

  return week
}
