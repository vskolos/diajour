import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'

export const entries = sqliteTable('entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  weekId: integer('week_id').notNull(),
  userId: integer('user_id').notNull(),

  date: text('date').notNull(),
  timePeriod: text('time_period', {
    enum: ['morning', 'midday', 'evening'],
  }).notNull(),
  glucose: real('glucose').notNull(),

  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const Entry = createSelectSchema(entries)
export const InsertEntry = createInsertSchema(entries)

export type Entry = z.infer<typeof Entry>
export type InsertEntry = z.infer<typeof InsertEntry>
