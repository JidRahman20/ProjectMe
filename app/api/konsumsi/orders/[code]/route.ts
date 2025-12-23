import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'

// GET /api/konsumsi/orders/:code - get order by code
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params
    const order = await db.orders.findByCode(code)

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { success: false, error: 'Order not found', message: err.message },
      { status: 404 }
    )
  }
}

// PATCH /api/konsumsi/orders/:code - update status (confirm or cancel)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params
    const body = await request.json()
    const { status, rejectionReason } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate rejection reason if status is rejected
    if (status === 'rejected' && !rejectionReason) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required when rejecting an order' },
        { status: 400 }
      )
    }

    // Find order first
    const existingOrder = await db.orders.findByCode(code)
    
    // Prepare update data
    const updateData: any = { status }
    if (rejectionReason) {
      updateData.rejection_reason = rejectionReason
    }
    
    // Update status
    const updatedOrder = await db.orders.update(existingOrder.id, updateData)

    return NextResponse.json({
      success: true,
      order: updatedOrder
    })
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { success: false, error: 'Failed to update order', message: err.message },
      { status: 500 }
    )
  }
}

// PUT /api/konsumsi/orders/:code - update entire order
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params
    const body = await request.json()
    
    console.log('[PUT] Updating order:', code)
    console.log('[PUT] Request body:', body)
    
    const { 
      items,
      kegiatan,
      tamu,
      jumlahTamu,
      bagian,
      pengaju,
      tanggalPengajuan,
      tanggalPengiriman,
      approval,
      lokasi,
      waktu,
      keterangan
    } = body

    // Find order first
    const existingOrder = await db.orders.findByCode(code)
    console.log('[PUT] Existing order found:', existingOrder.id)
    
    // Calculate new total if items provided
    let totalAmount = existingOrder.total_amount
    if (items && Array.isArray(items)) {
      totalAmount = 0
      items.forEach((item: { qty?: number | string }) => {
        const qty = Number(item.qty) || 1
        const price = 15000
        totalAmount += qty * price
      })
    }

    // Update order with all fields
    const updateData = {
      items: items || existingOrder.items,
      total_amount: totalAmount,
      kegiatan: kegiatan !== undefined ? kegiatan : existingOrder.kegiatan,
      tamu: tamu !== undefined ? tamu : existingOrder.tamu,
      jumlah_tamu: jumlahTamu !== undefined ? jumlahTamu : existingOrder.jumlah_tamu,
      bagian: bagian !== undefined ? bagian : existingOrder.bagian,
      pengaju: pengaju !== undefined ? pengaju : existingOrder.pengaju,
      tanggal_pengajuan: tanggalPengajuan !== undefined ? tanggalPengajuan : existingOrder.tanggal_pengajuan,
      tanggal_pengiriman: tanggalPengiriman !== undefined ? tanggalPengiriman : existingOrder.tanggal_pengiriman,
      // Optional fields
      approval: approval !== undefined ? approval : existingOrder.approval,
      lokasi: lokasi !== undefined ? lokasi : existingOrder.lokasi,
      waktu: waktu !== undefined ? waktu : existingOrder.waktu,
      keterangan: keterangan !== undefined ? keterangan : existingOrder.keterangan,
      status: 'pending' // Reset to pending after edit
    }
    
    console.log('[PUT] Update data:', updateData)
    
    const updatedOrder = await db.orders.update(existingOrder.id, updateData)
    console.log('[PUT] Order updated successfully')

    return NextResponse.json({
      success: true,
      order: updatedOrder
    })
  } catch (error) {
    const err = error as Error
    console.error('[PUT] Error updating order:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to update order', message: err.message },
      { status: 500 }
    )
  }
}

// DELETE /api/konsumsi/orders/:code - delete order (and its menu items)
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params
    
    // Find order first
    const existingOrder = await db.orders.findByCode(code)
    
    // Delete order
    await db.orders.delete(existingOrder.id)

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { success: false, error: 'Failed to delete order', message: err.message },
      { status: 500 }
    )
  }
}
