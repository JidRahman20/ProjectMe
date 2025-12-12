import { supabase } from '../lib/supabase'

async function addColumns() {
  try {
    console.log('🔧 Menambahkan kolom baru ke tabel orders...')
    
    // Check current columns
    const { data: existingOrders, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    if (fetchError) {
      console.error('Error fetching orders:', fetchError)
      return
    }

    console.log('📋 Sample order data:', existingOrders?.[0])
    
    // Try to create a test order with new fields to see if columns exist
    const testOrderId = `test-${Date.now()}`
    const { error: testError } = await supabase
      .from('orders')
      .insert({
        id: testOrderId,
        code: `TEST-${Date.now()}`,
        user_id: 'user-test',
        items: [],
        total_amount: 0,
        status: 'pending',
        approval: 'test',
        lokasi: 'test',
        waktu: 'test',
        keterangan: 'test'
      })

    if (testError) {
      console.error('❌ Kolom belum ada, perlu ditambahkan via SQL:')
      console.log('\n--- SQL Query (Jalankan di Supabase SQL Editor) ---\n')
      console.log(`
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS approval TEXT,
ADD COLUMN IF NOT EXISTS lokasi TEXT,
ADD COLUMN IF NOT EXISTS waktu TEXT,
ADD COLUMN IF NOT EXISTS keterangan TEXT;
      `)
      console.log('\n--- End SQL Query ---\n')
    } else {
      console.log('✅ Kolom sudah ada atau berhasil ditambahkan!')
      // Delete test order
      await supabase.from('orders').delete().eq('id', testOrderId)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

addColumns()
