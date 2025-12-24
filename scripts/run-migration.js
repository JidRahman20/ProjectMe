const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env file');
  console.log('Looking for: SUPABASE_URL and SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
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

  for (let i = 0; i < migrations.length; i++) {
    const sql = migrations[i];
    console.log(`📝 Running migration ${i + 1}/${migrations.length}...`);
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error(`❌ Error in migration ${i + 1}:`, error.message);
      console.log('\n⚠️  Migration failed. Please run the SQL manually in Supabase SQL Editor.');
      console.log('📄 SQL file location: scripts/migrate-approval-simple.sql\n');
      process.exit(1);
    }
    
    console.log(`✅ Migration ${i + 1} completed`);
  }

  // Update existing orders
  console.log('\n📝 Updating existing orders...');
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      approval_status: 'pending',
      admin_status: 'pending',
      vendor_status: 'pending'
    })
    .is('approval_status', null);

  if (updateError) {
    console.log('⚠️  Could not update existing orders:', updateError.message);
    console.log('This is OK if there are no existing orders or columns already have values.');
  } else {
    console.log('✅ Existing orders updated');
  }

  console.log('\n🎉 Migration completed successfully!\n');
  process.exit(0);
}

runMigration().catch(err => {
  console.error('❌ Unexpected error:', err);
  console.log('\n⚠️  Please run the SQL manually in Supabase SQL Editor.');
  console.log('📄 SQL file location: scripts/migrate-approval-simple.sql\n');
  process.exit(1);
});
