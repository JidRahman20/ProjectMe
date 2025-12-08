import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/konsumsi/orders/[id] - update order status by ID
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { status } = body

    console.log('PATCH /api/konsumsi/orders/[id]', { id, status })

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    // Update status
    const updatedOrder = await db.orders.update(id, { status })

    console.log('Order updated successfully:', updatedOrder.id)

    return NextResponse.json({
      success: true,
      order: updatedOrder
    })
  } catch (error) {
    const err = error as Error
    console.error('Error updating order:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to update order', message: err.message },
      { status: 500 }
    )
  }
}
