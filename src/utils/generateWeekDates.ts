import { addDays, format, startOfWeek } from 'date-fns'

export function generateWeekDates(date: Date) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })

  return [
    format(weekStart, 'dd.MM.yyyy'),
    format(addDays(weekStart, 1), 'dd.MM.yyyy'),
    format(addDays(weekStart, 2), 'dd.MM.yyyy'),
    format(addDays(weekStart, 3), 'dd.MM.yyyy'),
    format(addDays(weekStart, 4), 'dd.MM.yyyy'),
    format(addDays(weekStart, 5), 'dd.MM.yyyy'),
    format(addDays(weekStart, 6), 'dd.MM.yyyy'),
  ] as [string, string, string, string, string, string, string]
}
