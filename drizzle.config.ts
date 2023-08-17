import type { Config } from 'drizzle-kit'

export default {
  schema: './server/schemas',
  out: './server/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './server/sqlite.db',
  },
} satisfies Config
