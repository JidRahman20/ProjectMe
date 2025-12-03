import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

const datasourceUrl = env('DIRECT_URL') ?? env('DATABASE_URL')

if (!datasourceUrl) {
  throw new Error('DIRECT_URL or DATABASE_URL must be defined for Prisma CLI commands')
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: datasourceUrl,
  },
})
