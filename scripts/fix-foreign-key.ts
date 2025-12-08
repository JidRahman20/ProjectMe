import 'dotenv/config'
import { Client } from 'pg'

async function fixForeignKey() {
  console.log('Fixing foreign key constraint...\n')
  
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
  
  if (!connectionString) {
    console.error('ERROR: No DATABASE_URL found in .env')
    process.exit(1)
  }
  
  const client = new Client({ connectionString })
  
  try {
    console.log('Connecting to database...')
    await client.connect()
    console.log('Connected!\n')
    
    // Drop old constraint
    console.log('1. Dropping old foreign key constraint...')
    await client.query(`
      ALTER TABLE orders 
      DROP CONSTRAINT IF EXISTS orders_user_id_fkey
    `)
    console.log('SUCCESS: Old constraint dropped')
    
    // Create new constraint with CASCADE
    console.log('\n2. Creating new constraint with ON DELETE CASCADE...')
    await client.query(`
      ALTER TABLE orders 
      ADD CONSTRAINT orders_user_id_fkey 
      FOREIGN KEY (user_id) 
      REFERENCES users(id) 
      ON DELETE CASCADE
    `)
    console.log('SUCCESS: New constraint created')
    
    // Verify
    console.log('\n3. Verifying constraint...')
    const result = await client.query(`
      SELECT 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.delete_rule
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      JOIN information_schema.referential_constraints AS rc
        ON rc.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name='orders'
    `)
    
    console.log('\nForeign Key Constraints:')
    result.rows.forEach(row => {
      console.log(`  - ${row.constraint_name}`)
      console.log(`    Column: ${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`)
      console.log(`    On Delete: ${row.delete_rule}`)
    })
    
  } catch (error) {
    console.error('ERROR:', error)
    process.exit(1)
  } finally {
    await client.end()
    console.log('\nDone!')
  }
}

fixForeignKey()
