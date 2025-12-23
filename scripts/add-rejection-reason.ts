import { supabase } from '../lib/supabase'

async function addRejectionReasonColumn() {
  console.log('Adding rejection_reason column to orders table...')

  try {
    // Execute raw SQL to add the column
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add rejection_reason column if it doesn't exist
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' 
            AND column_name = 'rejection_reason'
          ) THEN
            ALTER TABLE orders ADD COLUMN rejection_reason TEXT;
            RAISE NOTICE 'Column rejection_reason added successfully';
          ELSE
            RAISE NOTICE 'Column rejection_reason already exists';
          END IF;
        END $$;
      `
    })

    if (error) {
      // If RPC doesn't exist, try direct query
      console.log('RPC method not available, trying direct query...')
      
      const { error: directError } = await supabase
        .from('orders')
        .select('rejection_reason')
        .limit(1)

      if (directError) {
        console.error('❌ Error checking column:', directError)
        console.log('\nPlease run this SQL manually in Supabase SQL Editor:')
        console.log('----------------------------------------')
        console.log(`
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
        `)
        console.log('----------------------------------------')
      } else {
        console.log('✅ Column rejection_reason already exists')
      }
    } else {
      console.log('✅ Column added successfully')
    }
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('\nPlease run this SQL manually in Supabase SQL Editor:')
    console.log('----------------------------------------')
    console.log(`
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
    `)
    console.log('----------------------------------------')
  }
}

addRejectionReasonColumn()
  .then(() => {
    console.log('\n✅ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
