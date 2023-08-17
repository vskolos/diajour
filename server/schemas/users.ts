import { sql, type InferModel } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  password: text('password').notNull(),
  avatar: text('avatar'),

  createdAt: text('created_at')
    .default(sql`CURRENT_DATE`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_DATE`)
    .notNull(),
})

// export const usersRelations = relations(users, ({ many }) => ({
//   entries: many(entries),
// }))

export type User = InferModel<typeof users>
