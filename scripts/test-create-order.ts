import { supabase } from '../lib/supabase'

async function testCreateOrder() {
  console.log('Testing order creation...\n')
  
  try {
    // 1. Check if we can read orders
    console.log('1. Reading existing orders...')
    const { data: existingOrders, error: readError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
    
    if (readError) {
      console.error('ERROR - Read error:', readError)
    } else {
      console.log(`SUCCESS: Found ${existingOrders?.length || 0} orders`)
      if (existingOrders && existingOrders.length > 0) {
        console.log('Latest order:', JSON.stringify(existingOrders[0], null, 2))
      }
    }
    
    // 2. Try to create a test order
    console.log('\n2. Creating test order...')
    const testOrder = {
      id: `test-order-${Date.now()}`,
      code: `TEST-${Date.now()}`,
      user_id: 'test-user-1764821721599', // Use existing user ID from your screenshot
      items: [
        { name: 'Nasi Goreng', qty: 2, satuan: 'porsi', timePeriod: 'SIANG' }
      ],
      total_amount: 30000,
      status: 'pending',
      kegiatan: 'Test Kegiatan',
      tamu: 'Test Tamu',
      jumlah_tamu: 5,
      bagian: 'Test Bagian',
      pengaju: 'Test Pengaju',
      tanggal_pengajuan: '2025-12-08',
      tanggal_pengiriman: '2025-12-09'
    }
    
    const { data: newOrder, error: createError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
      .single()
    
    if (createError) {
      console.error('ERROR - Create error:', createError)
      console.error('Error details:', JSON.stringify(createError, null, 2))
    } else {
      console.log('SUCCESS: Order created successfully!')
      console.log('New order:', JSON.stringify(newOrder, null, 2))
    }
    
    // 3. Verify it was created
    console.log('\n3. Verifying order was created...')
    const { data: verifyOrders, error: verifyError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (verifyError) {
      console.error('ERROR - Verify error:', verifyError)
    } else {
      console.log('SUCCESS: Latest order in DB:', JSON.stringify(verifyOrders?.[0], null, 2))
    }
    
  } catch (error) {
    console.error('ERROR - Unexpected error:', error)
  }
}

testCreateOrder()
