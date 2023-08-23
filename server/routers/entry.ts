import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { TIME_PERIODS } from '../../src/constants'
import { db } from '../db'
import {
  createWeek,
  getUserBySessionId,
  getWeekByUserIdAndDate,
} from '../helpers'
import { Entry, InsertEntry, entries } from '../schemas'
import { authedProcedure, router } from '../trpc'
import { sanitizedEntry } from '../utils'

export const entryRouter = router({
  list: authedProcedure
    .input(z.object({ weekStart: z.string() }))
    .query(({ input, ctx }) => {
      const user = getUserBySessionId(ctx.sessionId)
      const week = getWeekByUserIdAndDate({
        userId: user.id,
        date: input.weekStart,
      })

      if (!week) return []

      const entryList = db
        .select()
        .from(entries)
        .where(eq(entries.weekId, week.id))
        .all()
        .map(sanitizedEntry)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .sort(
          (a, b) =>
            TIME_PERIODS.indexOf(a.timePeriod) -
            TIME_PERIODS.indexOf(b.timePeriod)
        )

      return entryList
    }),

  create: authedProcedure
    .input(InsertEntry.pick({ date: true, timePeriod: true, glucose: true }))
    .mutation(({ input, ctx }) => {
      const user = getUserBySessionId(ctx.sessionId)
      const week =
        getWeekByUserIdAndDate({ userId: user.id, date: input.date }) ??
        createWeek({ userId: user.id, start: input.date })

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
      const week =
        getWeekByUserIdAndDate({ userId: user.id, date: input.date }) ??
        createWeek({ userId: user.id, start: input.date })

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
