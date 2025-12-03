import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool, type PoolConfig } from 'pg'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error('DATABASE_URL is not set')
}

const poolConfig: PoolConfig = { connectionString: databaseUrl }

// Supabase and most managed Postgres providers require SSL in serverless envs
if (!databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1')) {
	poolConfig.ssl = { rejectUnauthorized: false }
}

const pool = new Pool(poolConfig)
const adapter = new PrismaPg(pool)

const prismaClient = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prismaClient
}

export const prisma = prismaClient
