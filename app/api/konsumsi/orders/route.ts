import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ConsumptionOrder, ConsumptionOrderMenuItem, MenuItem } from '@prisma/client'

type IncomingMenuItem = {
  name: string
  qty?: number | string
  satuan?: string
  timePeriod?: 'PAGI' | 'SIANG' | 'SORE' | 'MALAM'
}

// GET /api/konsumsi/orders - list orders with menu items
export async function GET() {
  try {
    const orders = await prisma.consumptionOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: { menuItems: { include: { menuItem: true } } }
    })
  type OrderWithItems = ConsumptionOrder & { menuItems: (ConsumptionOrderMenuItem & { menuItem: MenuItem })[] }
  const mapped = orders.map((o: OrderWithItems) => ({
      id: o.code,
      tanggalPengajuan: o.tanggalPengajuan.toISOString().split('T')[0],
      tanggalPengiriman: o.tanggalPengiriman.toISOString().split('T')[0],
      kegiatan: o.kegiatan,
      tamu: o.tamu,
      jumlahTamu: o.jumlahTamu,
      bagian: o.bagian,
      pengaju: o.pengaju,
  menu: o.menuItems.map((mi: ConsumptionOrderMenuItem & { menuItem: MenuItem }) => ({ label: `${mi.menuItem.name} @ ${mi.qty} ${mi.satuan}` })),
      status: o.status
    }))
    return NextResponse.json({ orders: mapped })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST /api/konsumsi/orders - create order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received body:', JSON.stringify(body, null, 2))
    const { kegiatan, tamu, jumlahTamu, bagian, pengaju, tanggalPengajuan, tanggalPengiriman, status, menu } = body

    if (!kegiatan || !tamu || !jumlahTamu || !bagian || !pengaju || !tanggalPengajuan || !tanggalPengiriman) {
      console.error('Missing fields:', { kegiatan, tamu, jumlahTamu, bagian, pengaju, tanggalPengajuan, tanggalPengiriman })
      return NextResponse.json({ error: 'Missing required fields', details: { kegiatan, tamu, jumlahTamu, bagian, pengaju, tanggalPengajuan, tanggalPengiriman } }, { status: 400 })
    }

    if (!menu || !Array.isArray(menu) || menu.length === 0) {
      console.error('Invalid menu:', menu)
      return NextResponse.json({ error: 'Menu is required and must be a non-empty array' }, { status: 400 })
    }

    // Generate code similar to existing pattern: ORD/YYYYMMDD/####
    const datePart = new Date().toISOString().slice(0,10).replace(/-/g,'')
    const random = Math.floor(1000 + Math.random() * 9000)
    const code = `ORD/${datePart}/${random}`
    console.log('Generated code:', code)

  const created = await prisma.consumptionOrder.create({
      data: {
        code,
        kegiatan,
        tamu,
        jumlahTamu,
        bagian,
        pengaju,
        tanggalPengajuan: new Date(tanggalPengajuan),
        tanggalPengiriman: new Date(tanggalPengiriman),
        status: status || 'Menunggu konfirmasi',
        menuItems: {
          create: (menu as IncomingMenuItem[] | undefined || []).map((m) => {
            console.log('Processing menu item:', m)
            return {
              qty: (typeof m.qty === 'string' ? parseInt(m.qty) : m.qty) || 0,
              satuan: m.satuan || 'Unit',
              menuItem: {
                connectOrCreate: {
                  where: { name_timePeriod_guestType: { name: m.name, timePeriod: m.timePeriod || 'PAGI', guestType: tamu } },
                  create: { name: m.name, timePeriod: m.timePeriod || 'PAGI', guestType: tamu }
                }
              }
            }
          })
        }
      },
      include: { menuItems: { include: { menuItem: true } } }
    })
    console.log('Order created successfully:', created.code)

    return NextResponse.json({
      order: {
        id: created.code,
        tanggalPengajuan: created.tanggalPengajuan.toISOString().split('T')[0],
        tanggalPengiriman: created.tanggalPengiriman.toISOString().split('T')[0],
        kegiatan: created.kegiatan,
        tamu: created.tamu,
        jumlahTamu: created.jumlahTamu,
        bagian: created.bagian,
        pengaju: created.pengaju,
  menu: created.menuItems.map((mi: { menuItem: { name: string }; qty: number; satuan: string }) => ({ label: `${mi.menuItem.name} @ ${mi.qty} ${mi.satuan}` })),
        status: created.status
      }
    }, { status: 201 })
  } catch (e) {
    console.error('Error creating order:', e)
    if (e instanceof Error) {
      return NextResponse.json({ error: 'Failed to create order', details: e.message, stack: e.stack }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to create order', details: String(e) }, { status: 500 })
  }
}
