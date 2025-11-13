import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ConsumptionOrder } from '@prisma/client'

// PATCH /api/konsumsi/orders/:code - update status (confirm or cancel)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params
    if (!code) {
      return NextResponse.json({ error: 'Missing order code' }, { status: 400 })
    }

    const body = await request.json().catch(() => ({})) as { action?: string; catatan?: string }
    const action = body.action?.toLowerCase()

    if (!action || !['konfirmasi','batalkan'].includes(action)) {
      return NextResponse.json({ error: "Invalid or missing action. Use 'konfirmasi' or 'batalkan'" }, { status: 400 })
    }

    const targetStatus = action === 'konfirmasi' ? 'Dikonfirmasi' : 'Dibatalkan'

    const existing = await prisma.consumptionOrder.findUnique({ where: { code } }) as ConsumptionOrder | null
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Prevent duplicate transitions
    if (existing.status === targetStatus) {
      return NextResponse.json({ message: 'Status already set', status: existing.status })
    }

    const updated = await prisma.consumptionOrder.update({
      where: { code },
      data: { status: targetStatus, catatan: body.catatan }
    })

    return NextResponse.json({
      order: {
        code: updated.code,
        status: updated.status,
        catatan: updated.catatan
      }
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}
