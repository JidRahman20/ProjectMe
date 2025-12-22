import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Get report data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') // Format: YYYY-MM
    const type = searchParams.get('type') // monthly, vendor, division

    // Get all orders (filter by month if provided)
    const query = supabase
      .from('orders')
      .select(`
        *,
        users:user_id (
          id,
          name,
          email
        )
      `)

    let orders: any[] = []

    if (month) {
      const [year, monthNum] = month.split('-')
      const startDate = `${year}-${monthNum}-01`
      const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate()
      const endDate = `${year}-${monthNum}-${lastDay}T23:59:59`
      
      // Fetch all orders and filter in memory since OR query is complex
      const { data: allOrders, error: fetchError } = await query
      
      if (fetchError) {
        console.error('Error fetching orders for report:', fetchError)
        return NextResponse.json({ error: fetchError.message }, { status: 500 })
      }

      // Filter by month in memory
      const filteredOrders = allOrders?.filter(order => {
        const dateToCheck = order.tanggal_kegiatan || order.created_at
        if (!dateToCheck) return false
        
        const orderDate = new Date(dateToCheck)
        const orderMonth = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`
        return orderMonth === month
      })

      orders = filteredOrders
    } else {
      const { data: allOrders, error: fetchError } = await query
      if (fetchError) {
        console.error('Error fetching orders for report:', fetchError)
        return NextResponse.json({ error: fetchError.message }, { status: 500 })
      }
      orders = allOrders
    }

    // Calculate statistics
    const totalOrders = orders?.length || 0
    const totalCost = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

    // Group by vendor (if items contain vendor info)
    const byVendor: Record<string, { orders: number; cost: number }> = {}
    const byDivision: Record<string, { orders: number; cost: number }> = {}

    orders?.forEach(order => {
      // For now, use dummy vendor data
      // In real implementation, extract from order.items
      const vendor = 'Vendor ' + (Math.floor(Math.random() * 3) + 1)
      if (!byVendor[vendor]) {
        byVendor[vendor] = { orders: 0, cost: 0 }
      }
      byVendor[vendor].orders++
      byVendor[vendor].cost += order.total_amount || 0

      // Group by division (assuming division field exists)
      const division = order.division || 'Unknown'
      if (!byDivision[division]) {
        byDivision[division] = { orders: 0, cost: 0 }
      }
      byDivision[division].orders++
      byDivision[division].cost += order.total_amount || 0
    })

    const reportData = {
      month: month || 'All time',
      totalOrders,
      totalCost,
      byVendor: Object.entries(byVendor).map(([name, data]) => ({
        name,
        orders: data.orders,
        cost: data.cost
      })),
      byDivision: Object.entries(byDivision).map(([name, data]) => ({
        name,
        orders: data.orders,
        cost: data.cost
      }))
    }

    return NextResponse.json({ report: reportData })
  } catch (error) {
    console.error('Error in GET /api/reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
