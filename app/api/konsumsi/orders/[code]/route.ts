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
    const { status, rejectionReason, role, approverName, vendorName } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!role || (role !== 'approval' && role !== 'admin' && role !== 'vendor')) {
      return NextResponse.json(
        { success: false, error: 'Valid role (approval, admin, or vendor) is required' },
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
    const updateData: any = {}
    
    // Handle approval role (first tier)
    if (role === 'approval') {
      
      updateData.approval_status = status
      if (status === 'approved') {
        updateData.approved_by_approval = approverName || 'Approval'
        updateData.approval_date = new Date()
        // Status keseluruhan tetap pending sampai admin approve
        updateData.status = 'pending'
      } else if (status === 'rejected') {
        updateData.approval_rejection_reason = rejectionReason
        updateData.status = 'rejected' // Rejected di approval berarti order ditolak
      }
    }
    
    // Handle admin role (second tier)
    else if (role === 'admin') {
      // Admin hanya bisa approve jika approval sudah approve
      if (existingOrder.approval_status !== 'approved') {
        return NextResponse.json(
          { success: false, error: 'Order must be approved by Approval first before Admin can approve' },
          { status: 400 }
        )
      }
      
      updateData.admin_status = status
      if (status === 'approved') {
        updateData.approved_by_admin = approverName || 'Admin'
        updateData.admin_approval_date = new Date()
        updateData.status = 'approved' // Approved oleh admin, siap untuk vendor
        updateData.vendor_status = 'pending' // Set vendor status ke pending
      } else if (status === 'rejected') {
        updateData.admin_rejection_reason = rejectionReason
        updateData.status = 'rejected'
      }
    }
    
    // Handle vendor role (third tier)
    else if (role === 'vendor') {
      // Vendor hanya bisa process jika sudah approved oleh admin
      if (existingOrder.status !== 'approved' || existingOrder.admin_status !== 'approved') {
        return NextResponse.json(
          { success: false, error: 'Order must be approved by Admin first before Vendor can process' },
          { status: 400 }
        )
      }
      
      // Vendor can accept, process, ship, complete, or reject
      updateData.vendor_status = status
      if (status === 'accepted') {
        updateData.processed_by_vendor = vendorName || 'Vendor'
        updateData.vendor_accepted_date = new Date()
      } else if (status === 'completed') {
        updateData.vendor_completed_date = new Date()
      } else if (status === 'rejected') {
        updateData.vendor_rejection_reason = rejectionReason
        updateData.status = 'rejected'
      }
    }
    
    // Update order
    console.log('📝 Updating order:', existingOrder.id, 'with data:', updateData)
    const updatedOrder = await db.orders.update(existingOrder.id, updateData)
    console.log('✅ Order updated successfully:', updatedOrder)

    return NextResponse.json({
      success: true,
      order: updatedOrder
    })
  } catch (error) {
    const err = error as Error
    console.error('❌ Error updating order:', err.message)
    console.error('Error stack:', err.stack)
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
