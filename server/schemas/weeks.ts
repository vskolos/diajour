import { sql, type InferModel } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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

// export const weeksRelations = relations(weeks, ({ many }) => ({
//   entries: many(entries),
// }))

export type Week = InferModel<typeof weeks>
