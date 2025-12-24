const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  console.error('❌ Error: DIRECT_URL not found in .env file');
  process.exit(1);
}

async function runMigration() {
  const pool = new Pool({ connectionString });
  
  console.log('🚀 Starting migration...\n');

  const migrations = [
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending'",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'pending'",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_status TEXT DEFAULT 'pending'",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_rejection_reason TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_rejection_reason TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_rejection_reason TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS approved_by_approval TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS approved_by_admin TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS processed_by_vendor TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_approval_date TIMESTAMPTZ",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_accepted_date TIMESTAMPTZ",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_completed_date TIMESTAMPTZ",
  ];

  try {
    for (let i = 0; i < migrations.length; i++) {
      const sql = migrations[i];
      console.log(`📝 Running migration ${i + 1}/${migrations.length}...`);
      
      await pool.query(sql);
      console.log(`✅ Migration ${i + 1} completed`);
    }

    // Update existing orders
    console.log('\n📝 Updating existing orders...');
    const result = await pool.query(`
      UPDATE orders 
      SET 
        approval_status = COALESCE(approval_status, 'pending'),
        admin_status = COALESCE(admin_status, 'pending'),
        vendor_status = COALESCE(vendor_status, 'pending')
      WHERE approval_status IS NULL OR admin_status IS NULL OR vendor_status IS NULL
    `);
    
    console.log(`✅ Updated ${result.rowCount} orders`);
    console.log('\n🎉 Migration completed successfully!\n');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.log('\n⚠️  Please run the SQL manually in Supabase SQL Editor.');
    console.log('📄 SQL file location: scripts/migrate-approval-simple.sql\n');
    await pool.end();
    process.exit(1);
  }
}

runMigration();
