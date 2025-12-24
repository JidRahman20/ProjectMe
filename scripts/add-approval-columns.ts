import { db } from '../lib/db'

async function addApprovalColumns() {
  try {
    console.log('🔄 Adding approval columns to orders table...')
    
    // Add new columns using raw SQL
    const queries = [
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'pending'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_rejection_reason TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_rejection_reason TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS approved_by_approval TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS approved_by_admin TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_approval_date TIMESTAMP`
    ]

    for (const query of queries) {
      await db.raw(query)
      console.log('✅ Executed:', query)
    }

    console.log('✅ Successfully added all approval columns!')
    console.log('📊 Updating existing orders to set default approval_status...')
    
    // Update existing orders
    await db.raw(`
      UPDATE orders 
      SET approval_status = 'pending',
          admin_status = 'pending'
      WHERE approval_status IS NULL OR admin_status IS NULL
    `)
    
    console.log('✅ Migration complete!')
  } catch (error) {
    console.error('❌ Error adding approval columns:', error)
    throw error
  }
}

addApprovalColumns()
  .then(() => {
    console.log('✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })
