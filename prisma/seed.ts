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

  // Create two sample consumption orders if they don't exist yet
  // Order 1: Cancelled
  const today = new Date()
  const formatDate = (d: Date) => d
  const cancelledCode = 'ORD/SEED/0001'
  const confirmedCode = 'ORD/SEED/0002'

  const menuItemRegularPagi = await prisma.menuItem.findFirst({ where: { timePeriod: 'PAGI', guestType: 'REGULAR' } })
  const menuItemVipSiang = await prisma.menuItem.findFirst({ where: { timePeriod: 'SIANG', guestType: 'VVIP' } })

  if (menuItemRegularPagi && !(await prisma.consumptionOrder.findUnique({ where: { code: cancelledCode } }))) {
    await prisma.consumptionOrder.create({
      data: {
        code: cancelledCode,
        kegiatan: 'Rapat Pembatalan Anggaran',
        tamu: 'REGULAR',
        jumlahTamu: 15,
        bagian: 'Keuangan',
        pengaju: 'John Doe',
        tanggalPengajuan: formatDate(today),
        tanggalPengiriman: formatDate(new Date(today.getTime() + 2*24*60*60*1000)),
        status: 'Dibatalkan',
        catatan: 'Agenda dibatalkan oleh manajemen',
        menuItems: {
          create: [
            { qty: 15, satuan: 'Porsi', menuItem: { connect: { id: menuItemRegularPagi.id } } }
          ]
        }
      }
    })
  }

  if (menuItemVipSiang && !(await prisma.consumptionOrder.findUnique({ where: { code: confirmedCode } }))) {
    await prisma.consumptionOrder.create({
      data: {
        code: confirmedCode,
        kegiatan: 'Jamuan Makan Siang Direksi',
        tamu: 'VVIP',
        jumlahTamu: 8,
        bagian: 'Direksi',
        pengaju: 'Jane Smith',
        tanggalPengajuan: formatDate(today),
        tanggalPengiriman: formatDate(new Date(today.getTime() + 3*24*60*60*1000)),
        status: 'Dikonfirmasi',
        catatan: 'Disetujui oleh sekretaris direksi',
        menuItems: {
          create: [
            { qty: 8, satuan: 'Box', menuItem: { connect: { id: menuItemVipSiang.id } } }
          ]
        }
      }
    })
  }

  console.log('Seed completed (users, menu items, and sample orders)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
