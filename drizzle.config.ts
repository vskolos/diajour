import type { Config } from 'drizzle-kit'

export default {
  schema: './server/schemas',
  out: './server/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './server/database/sqlite.db',
  },
} satisfies Config
