/**
 * Script untuk menambahkan kolom baru ke tabel orders
 * Jalankan: npx tsx scripts/update-database.ts
 */

import pkg from 'pg'
const { Client } = pkg
import 'dotenv/config'

async function updateDatabase() {
  // Use pooler connection without pgbouncer parameter
  const connectionString = process.env.DATABASE_URL?.replace('?pgbouncer=true&connection_limit=1', '') || process.env.DIRECT_URL
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🔌 Connecting to database...')
    await client.connect()
    console.log('✅ Connected!')

    console.log('🔧 Adding new columns to orders table...')
    
    const alterQuery = `
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS approval TEXT,
      ADD COLUMN IF NOT EXISTS lokasi TEXT,
      ADD COLUMN IF NOT EXISTS waktu TEXT,
      ADD COLUMN IF NOT EXISTS keterangan TEXT;
    `
    
    await client.query(alterQuery)
    console.log('✅ Columns added successfully!')

    // Verify columns
    const verifyQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
      ORDER BY ordinal_position;
    `
    
    const result = await client.query(verifyQuery)
    console.log('\n📋 Current columns in orders table:')
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.end()
    console.log('\n🔒 Database connection closed')
  }
}

updateDatabase()
