import { supabase } from '../lib/supabase'

async function checkColumns() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('📋 Sample order data with all columns:')
  console.log(JSON.stringify(data[0], null, 2))
  
  if (data[0]) {
    console.log('\n🔑 Column names in database:')
    Object.keys(data[0]).forEach(key => {
      console.log(`  - ${key}`)
    })
  }
}

checkColumns()
