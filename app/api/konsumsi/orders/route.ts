import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

type IncomingMenuItem = {
  name: string
  qty?: number | string
  satuan?: string
  timePeriod?: 'PAGI' | 'SIANG' | 'SORE' | 'MALAM'
}

// GET /api/konsumsi/orders - list orders with menu items
export async function GET() {
  try {
    const orders = await db.orders.findMany()
    
    return NextResponse.json({
      success: true,
      orders,
      count: orders.length
    })
  } catch (error) {
    const err = error as Error
    console.error('Error fetching orders:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', message: err.message },
      { status: 500 }
    )
  }
}

// POST /api/konsumsi/orders - create order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      userId, 
      items,
      kegiatan,
      tamu,
      jumlahTamu,
      bagian,
      pengaju,
      tanggalPengajuan,
      tanggalPengiriman,
      // Optional fields
      approval,
      lokasi,
      waktu,
      keterangan
    } = body

    if (!userId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'userId and items array are required' },
        { status: 400 }
      )
    }

    // Calculate total
    let totalAmount = 0
    items.forEach((item: IncomingMenuItem) => {
      const qty = Number(item.qty) || 1
      // Assume price based on time period or default
      const price = 15000 // Default price, you can customize this
      totalAmount += qty * price
    })

    // Generate order code
    const orderCode = `ORD-${Date.now()}`
    const orderId = `order-${Date.now()}`

    // Create order with all data
    const order = await db.orders.create({
      id: orderId,
      code: orderCode,
      user_id: userId,
      items,
      total_amount: totalAmount,
      status: 'pending',
      kegiatan: kegiatan || null,
      tamu: tamu || null,
      jumlah_tamu: jumlahTamu || null,
      bagian: bagian || null,
      pengaju: pengaju || null,
      tanggal_pengajuan: tanggalPengajuan || null,
      tanggal_pengiriman: tanggalPengiriman || null,
      // Optional fields
      approval: approval || null,
      lokasi: lokasi || null,
      waktu: waktu || null,
      keterangan: keterangan || null
    })

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    const err = error as Error
    console.error('Error creating order:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to create order', message: err.message },
      { status: 500 }
    )
  }
}
