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
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    // Find order first
    const existingOrder = await db.orders.findByCode(code)
    
    // Update status
    const updatedOrder = await db.orders.update(existingOrder.id, { status })

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
