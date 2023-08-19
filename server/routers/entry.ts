import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { TIME_PERIODS } from '../../src/constants'
import type { WeekData } from '../../src/types'
import { db } from '../db'
import { getUserBySessionId, getUserWeekFromDateString } from '../helpers'
import { Entry, InsertEntry, entries, weeks } from '../schemas'
import { authedProcedure, router } from '../trpc'

export const entryRouter = router({
  list: authedProcedure
    .input(z.object({ weekStart: z.string() }))
    .query(({ input, ctx }) => {
      const user = getUserBySessionId(ctx.sessionId)

      const entriesAndWeeks = db
        .select()
        .from(entries)
        .innerJoin(weeks, eq(entries.weekId, weeks.id))
        .where(
          and(
            eq(entries.userId, user.id),
            eq(weeks.userId, user.id),
            eq(weeks.start, input.weekStart)
          )
        )
        .all()

      const entryList = entriesAndWeeks
        .map((item) => ({
          id: item.entries.id,
          date: item.entries.date,
          period: item.entries.timePeriod,
          glucose: item.entries.glucose,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .sort(
          (a, b) =>
            TIME_PERIODS.indexOf(a.period) - TIME_PERIODS.indexOf(b.period)
        )

      const week = entriesAndWeeks[0]?.weeks

      const weekData: WeekData = {
        dosage: week?.dosage ?? null,
        weight: week?.weight ?? null,
        entries: entryList,
      }

      return weekData
    }),

  create: authedProcedure
    .input(InsertEntry.pick({ date: true, timePeriod: true, glucose: true }))
    .mutation(({ input, ctx }) => {
      const user = getUserBySessionId(ctx.sessionId)
      const week = getUserWeekFromDateString(user, input.date)

      const entry = db
        .select()
        .from(entries)
        .where(
          and(
            eq(entries.userId, user.id),
            eq(entries.date, input.date),
            eq(entries.timePeriod, input.timePeriod)
          )
        )
        .get()

      if (entry)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Запись с указанными датой и периодом уже существует',
        })

      db.insert(entries)
        .values({ weekId: week.id, userId: user.id, ...input })
        .run()
    }),

  update: authedProcedure
    .input(InsertEntry.pick({ date: true, timePeriod: true, glucose: true }))
    .mutation(({ input, ctx }) => {
      const user = getUserBySessionId(ctx.sessionId)
      const week = getUserWeekFromDateString(user, input.date)

      const entry = db
        .select()
        .from(entries)
        .where(
          and(
            eq(entries.userId, user.id),
            eq(entries.date, input.date),
            eq(entries.timePeriod, input.timePeriod)
          )
        )
        .get()

      if (entry)
        db.update(entries)
          .set({ weekId: week.id, userId: user.id, ...input })
          .where(
            and(
              eq(entries.userId, user.id),
              eq(entries.date, input.date),
              eq(entries.timePeriod, input.timePeriod)
            )
          )
          .run()
      else
        db.insert(entries)
          .values({
            weekId: week.id,
            userId: user.id,
            ...input,
          })
          .run()
    }),

  delete: authedProcedure
    .input(Entry.pick({ id: true }))
    .mutation(({ input, ctx }) => {
      const user = getUserBySessionId(ctx.sessionId)

      db.delete(entries)
        .where(and(eq(entries.userId, user.id), eq(entries.id, input.id)))
        .run()
    }),
})
