import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db'
import {
  createWeek,
  getUserBySessionId,
  getWeekByUserIdAndDate,
} from '../helpers'
import { InsertWeek, weeks } from '../schemas'
import { authedProcedure, router } from '../trpc'
import { sanitizedWeek } from '../utils'

export const weekRouter = router({
  get: authedProcedure
    .input(z.object({ date: z.string() }))
    .query(({ input, ctx }) => {
      const user = getUserBySessionId(ctx.sessionId)
      const week = getWeekByUserIdAndDate({
        userId: user.id,
        date: input.date,
      })
      return week ? sanitizedWeek(week) : null
    }),

  create: authedProcedure
    .input(InsertWeek.omit({ userId: true }))
    .mutation(({ input, ctx }) => {
      const user = getUserBySessionId(ctx.sessionId)
      createWeek({ userId: user.id, ...input })
    }),

  update: authedProcedure
    .input(InsertWeek.pick({ start: true, dosage: true, weight: true }))
    .mutation(({ input, ctx }) => {
      const user = getUserBySessionId(ctx.sessionId)
      const week = getWeekByUserIdAndDate({
        userId: user.id,
        date: input.start,
      })

      if (week)
        db.update(weeks)
          .set({ dosage: input.dosage, weight: input.weight })
          .where(eq(weeks.id, week.id))
          .get()
      else
        db.insert(weeks)
          .values({ userId: user.id, ...input })
          .get()
    }),
})
