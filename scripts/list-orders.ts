import { db } from '../lib/db'

async function listOrders() {
  console.log('Daftar Order:\n')
  
  try {
    const orders = await db.orders.findMany()
    
    if (orders.length === 0) {
      console.log('Belum ada order')
      console.log('INFO: Jalankan: npm run db:seed')
      return
    }
    
    console.log(`Total: ${orders.length} order\n`)
    console.log('─'.repeat(80))
    
    orders.forEach((order, index) => {
      console.log(`\n${index + 1}. Order Code: ${order.code}`)
      console.log(`   Status       : ${order.status}`)
      console.log(`   Total        : Rp ${order.total_amount.toLocaleString('id-ID')}`)
      console.log(`   User ID      : ${order.user_id}`)
      console.log(`   Items        :`)
      
      const items = order.items as any[]
      items.forEach((item: any) => {
        console.log(`     - ${item.name} (${item.quantity}x) @ Rp ${item.price?.toLocaleString('id-ID') || '0'}`)
      })
      
      console.log(`   Dibuat       : ${new Date(order.created_at).toLocaleString('id-ID')}`)
    })
    
    console.log('\n' + '─'.repeat(80))
    console.log('\nINFO: Test API dengan:')
    console.log('   GET  http://localhost:3000/api/konsumsi/orders')
    console.log(`   GET  http://localhost:3000/api/konsumsi/orders/${orders[0]?.code}\n`)
    
  } catch (error) {
    const err = error as Error
    console.error('ERROR:', err.message)
  }
}

listOrders()
