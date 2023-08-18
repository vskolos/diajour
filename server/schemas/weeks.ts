import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'

export const weeks = sqliteTable('weeks', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  start: text('start').notNull(),
  dosage: real('dosage'),
  weight: real('weight'),

  createdAt: text('created_at')
    .default(sql`CURRENT_DATE`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_DATE`)
    .notNull(),
})

export const Week = createSelectSchema(weeks)
export const InsertWeek = createInsertSchema(weeks)

export type Week = z.infer<typeof Week>
export type InsertWeek = z.infer<typeof InsertWeek>
