import { TRPCError } from '@trpc/server'
import { format, isValid, startOfWeek } from 'date-fns'

export function getWeekStart(str: string) {
  const date = new Date(str)

  if (!isValid(date))
    throw new TRPCError({
      code: 'PARSE_ERROR',
      message: 'Не удалось распознать дату. Ожидаемый формат: ГГГГ-ММ-ДД',
    })

  const weekStart = format(
    startOfWeek(date, {
      weekStartsOn: 1,
    }),
    'yyyy-MM-dd'
  )

  return weekStart
}
