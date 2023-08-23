import type { Entry, User, Week } from '../schemas'

export const sanitizedUser = (user: User) => ({
  username: user.username,
  avatar: user.avatar,
})

export const sanitizedWeek = (week: Week) => ({
  start: week.start,
  dosage: week.dosage,
  weight: week.weight,
})

export const sanitizedEntry = (entry: Entry) => ({
  id: entry.id,
  date: entry.date,
  timePeriod: entry.timePeriod,
  glucose: entry.glucose,
})
