import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool, type PoolConfig } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL must be set before running this script')
}

const poolConfig: PoolConfig = { connectionString }

if (!connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')) {
  poolConfig.ssl = { rejectUnauthorized: false }
}

const adapter = new PrismaPg(new Pool(poolConfig))
const prisma = new PrismaClient({ adapter })

async function main() {
  const orderCount = await prisma.consumptionOrder.count()
  console.log(`Total consumption orders: ${orderCount}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
