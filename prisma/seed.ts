import 'dotenv/config'
import { PrismaClient, TimePeriod } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool, type PoolConfig } from 'pg'
import bcrypt from 'bcryptjs'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set before running the seed script')
}

const poolConfig: PoolConfig = { connectionString: databaseUrl }

if (!databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1')) {
  poolConfig.ssl = { rejectUnauthorized: false }
}

const pool = new Pool(poolConfig)
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

const menuKey = (name: string, timePeriod: TimePeriod, guestType: string) =>
  `${name}-${timePeriod}-${guestType}`

async function main() {
  const users = [
    { name: 'Ajid', email: 'ajid@gmail.com', password: 'ajid123', role: 'admin' },
    { name: 'Dika', email: 'dika@gmail.com', password: 'dika123', role: 'user' },
    { name: 'Nadia', email: 'nadia@gmail.com', password: 'nadia123', role: 'user' },
    {name: 'Fauji', email: 'fauji@gmail.com', password: 'fauji123', role: 'user' },
    { name: 'Gading', email: 'gading@gmail.com', password: 'gading123', role: 'user' }
  ]

  const baseMenuItems = [
    { name: 'Nasi Uduk', timePeriod: TimePeriod.PAGI, guestType: 'REGULAR' },
    { name: 'Nasi Uduk Premium', timePeriod: TimePeriod.PAGI, guestType: 'VIP' },
    { name: 'Nasi Box Ayam Goreng', timePeriod: TimePeriod.SIANG, guestType: 'REGULAR' },
    { name: 'Nasi Box Wagyu Teriyaki', timePeriod: TimePeriod.SIANG, guestType: 'VVIP' },
    { name: 'Kopi Hitam', timePeriod: TimePeriod.PAGI, guestType: 'REGULAR' },
    { name: 'Beef Wellington', timePeriod: TimePeriod.MALAM, guestType: 'VVIP' }
  ]

  console.log('Seeding menu items...')

  const menuMap = new Map<string, number>()

  for (const item of baseMenuItems) {
    const record = await prisma.menuItem.upsert({
      where: {
        name_timePeriod_guestType: {
          name: item.name,
          timePeriod: item.timePeriod,
          guestType: item.guestType
        }
      },
      update: {},
      create: item
    })

    menuMap.set(menuKey(item.name, item.timePeriod, item.guestType), record.id)
  }

  console.log('Menu items seeded')

  console.log('Seeding users...')

  for (const user of users) {
    const exists = await prisma.user.findUnique({ where: { email: user.email } })
    if (!exists) {
      const hash = await bcrypt.hash(user.password, 10)
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hash,
          role: user.role
        }
      })
    }
  }

  console.log('Users seeded')

  console.log('Seeding sample consumption orders...')

  const today = new Date()
  const addDays = (base: Date, days: number) => new Date(base.getTime() + days * 24 * 60 * 60 * 1000)

  const orderSeeds = [
    {
      code: 'ORD/SEED/0001',
      kegiatan: 'Rapat Pembatalan Anggaran',
      tamu: 'REGULAR',
      jumlahTamu: 15,
      bagian: 'Keuangan',
      pengaju: 'John Doe',
      status: 'Dibatalkan',
      catatan: 'Agenda dibatalkan oleh manajemen',
      tanggalPengajuan: today,
      tanggalPengiriman: addDays(today, 2),
      menu: [
        { key: menuKey('Nasi Uduk', TimePeriod.PAGI, 'REGULAR'), qty: 15, satuan: 'Porsi' }
      ]
    },
    {
      code: 'ORD/SEED/0002',
      kegiatan: 'Jamuan Makan Siang Direksi',
      tamu: 'VVIP',
      jumlahTamu: 8,
      bagian: 'Direksi',
      pengaju: 'Jane Smith',
      status: 'Dikonfirmasi',
      catatan: 'Disetujui oleh sekretaris direksi',
      tanggalPengajuan: today,
      tanggalPengiriman: addDays(today, 3),
      menu: [
        { key: menuKey('Nasi Box Wagyu Teriyaki', TimePeriod.SIANG, 'VVIP'), qty: 8, satuan: 'Box' }
      ]
    }
  ]

  for (const order of orderSeeds) {
    const existing = await prisma.consumptionOrder.findUnique({ where: { code: order.code } })
    if (existing) continue

    await prisma.consumptionOrder.create({
      data: {
        code: order.code,
        kegiatan: order.kegiatan,
        tamu: order.tamu,
        jumlahTamu: order.jumlahTamu,
        bagian: order.bagian,
        pengaju: order.pengaju,
        status: order.status,
        catatan: order.catatan,
        tanggalPengajuan: order.tanggalPengajuan,
        tanggalPengiriman: order.tanggalPengiriman,
        menuItems: {
          create: order.menu.map((item) => {
            const menuId = menuMap.get(item.key)
            if (!menuId) {
              throw new Error(`Menu item for key ${item.key} not found`)
            }
            return {
              qty: item.qty,
              satuan: item.satuan,
              menuItem: {
                connect: { id: menuId }
              }
            }
          })
        }
      }
    })
  }

  console.log('Seed completed (users, menu items, sample orders)')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
