import { addDays, format, startOfWeek } from 'date-fns'

export function generateWeekDates(date: Date) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })

  return [
    format(weekStart, 'yyyy-MM-dd'),
    format(addDays(weekStart, 1), 'yyyy-MM-dd'),
    format(addDays(weekStart, 2), 'yyyy-MM-dd'),
    format(addDays(weekStart, 3), 'yyyy-MM-dd'),
    format(addDays(weekStart, 4), 'yyyy-MM-dd'),
    format(addDays(weekStart, 5), 'yyyy-MM-dd'),
    format(addDays(weekStart, 6), 'yyyy-MM-dd'),
  ] as [string, string, string, string, string, string, string]
}
