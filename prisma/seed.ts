import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const users = [
    { name: 'Admin User', email: 'admin@demplon.com', password: 'admin123', role: 'admin' },
    { name: 'John Doe', email: 'john@demplon.com', password: 'john123', role: 'user' },
    { name: 'Jane Smith', email: 'jane@demplon.com', password: 'jane123', role: 'user' },
  ]
  // Seed minimal menu items (timePeriod + guestType variants)
  const baseMenuItems: { name: string; timePeriod: string; guestType: string }[] = [
    { name: 'Nasi Uduk', timePeriod: 'PAGI', guestType: 'REGULAR' },
    { name: 'Nasi Uduk Premium', timePeriod: 'PAGI', guestType: 'VIP' },
    { name: 'Nasi Box Ayam Goreng', timePeriod: 'SIANG', guestType: 'REGULAR' },
    { name: 'Nasi Box Wagyu Teriyaki', timePeriod: 'SIANG', guestType: 'VVIP' },
    { name: 'Kopi Hitam', timePeriod: 'PAGI', guestType: 'REGULAR' },
    { name: 'Beef Wellington', timePeriod: 'MALAM', guestType: 'VVIP' },
  ]

  for (const item of baseMenuItems) {
    await prisma.menuItem.upsert({
      where: { name_timePeriod_guestType: { name: item.name, timePeriod: item.timePeriod, guestType: item.guestType } },
      update: {},
      create: item
    })
  }

  console.log('Menu items seeded')

  for (const u of users) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } })
    if (!exists) {
      const hash = await bcrypt.hash(u.password, 10)
      await prisma.user.create({ data: { name: u.name, email: u.email, password: hash, role: u.role } })
    }
  }

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
