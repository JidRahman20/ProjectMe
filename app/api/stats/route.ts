import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Get dashboard statistics
export async function GET() {
  try {
    // Get current month's orders
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

    // Get all orders for current month
    const { data: monthOrders, error: monthError } = await supabase
      .from('orders')
      .select('*')
      .gte('tanggal_kegiatan', firstDayOfMonth)
      .lte('tanggal_kegiatan', lastDayOfMonth)

    if (monthError) {
      console.error('Error fetching month orders:', monthError)
    }

    // Get orders by status
    const { data: pendingOrders } = await supabase
      .from('orders')
      .select('id')
      .eq('status', 'pending')

    const { data: approvedOrders } = await supabase
      .from('orders')
      .select('id')
      .eq('status', 'approved')
      .gte('tanggal_kegiatan', firstDayOfMonth)
      .lte('tanggal_kegiatan', lastDayOfMonth)

    // Calculate totals
    const totalOrders = monthOrders?.length || 0
    const totalCost = monthOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const pendingCount = pendingOrders?.length || 0
    const approvedCount = approvedOrders?.length || 0

    // Get today's orders
    const today = now.toISOString().split('T')[0]
    const { data: todayOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('tanggal_kegiatan', today)

    const todayCount = todayOrders?.length || 0
    const todayCost = todayOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const todayApproved = todayOrders?.filter(o => o.status === 'approved').length || 0

    // Get last 6 months data
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]

      const { data: monthData } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('tanggal_kegiatan', monthStart)
        .lte('tanggal_kegiatan', monthEnd)

      monthlyData.push({
        month: date.toLocaleString('id-ID', { month: 'short' }),
        orders: monthData?.length || 0,
        cost: (monthData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0) / 1000000
      })
    }

    // Get top divisions (assuming division field exists)
    const { data: allOrders } = await supabase
      .from('orders')
      .select('division')
      .gte('tanggal_kegiatan', firstDayOfMonth)
      .lte('tanggal_kegiatan', lastDayOfMonth)

    const divisionCounts: Record<string, number> = {}
    allOrders?.forEach(order => {
      const div = order.division || 'Unknown'
      divisionCounts[div] = (divisionCounts[div] || 0) + 1
    })

    const topDivisions = Object.entries(divisionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }))

    return NextResponse.json({
      stats: {
        totalOrders,
        totalCost,
        pending: pendingCount,
        approved: approvedCount,
        todayOrders: todayCount,
        todayCost,
        todayApproved,
        monthlyData,
        topDivisions
      }
    })
  } catch (error) {
    console.error('Error in GET /api/stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
