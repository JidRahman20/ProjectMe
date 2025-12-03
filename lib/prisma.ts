import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error('DATABASE_URL is not set')
}

const pool = new Pool({ connectionString: databaseUrl })
const adapter = new PrismaPg(pool)

// @ts-expect-error Prisma adapter option is available at runtime but not yet in types
const prismaClient = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prismaClient
}

export const prisma = prismaClient
