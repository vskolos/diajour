import { sql, type InferModel } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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
    .default(sql`CURRENT_DATE`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_DATE`)
    .notNull(),
})

// export const entriesRelations = relations(entries, ({ one }) => ({
//   week: one(weeks, {
//     fields: [entries.weekId],
//     references: [weeks.id],
//   }),
//   users: one(users, {
//     fields: [entries.userId],
//     references: [users.id],
//   }),
// }))

export type Entry = InferModel<typeof entries>
