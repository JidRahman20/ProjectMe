import { supabase } from '../lib/supabase'

async function testConnection() {
  console.log('🔌 Testing Supabase connection...\n')
  
  try {
    // Test 1: Check if we can connect
    console.log('1. Testing basic connection...')
    const { error: pingError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (pingError) {
      if (pingError.message.includes('relation "users" does not exist')) {
        console.log('ERROR: Table "users" does not exist yet')
        console.log('SUCCESS: But connection to Supabase is successful!')
        console.log('\nNext step: Run `npm run db:setup` to get SQL for creating tables\n')
        return
      }
      throw pingError
    }
    
    console.log('SUCCESS: Connection successful!')
    
    // Test 2: Count users
    console.log('\n2. Checking users table...')
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    if (countError) throw countError
    
    console.log(`SUCCESS: Users table exists. Current users: ${count}`)
    
    // Test 3: Count orders
    console.log('\n3. Checking orders table...')
    const { count: orderCount, error: orderError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    if (orderError) throw orderError
    
    console.log(`SUCCESS: Orders table exists. Current orders: ${orderCount}`)
    
    console.log('\nAll tests passed! Database is ready to use.')
    console.log('You can now run `npm run db:seed` to add test data\n')
    
  } catch (error) {
    const err = error as Error
    console.error('\nERROR: Connection test failed:', err.message)
    console.log('\nMake sure you have:')
    console.log('1. Created tables in Supabase (run `npm run db:setup`)')
    console.log('2. Set correct environment variables in .env')
    process.exit(1)
  }
}

testConnection()
