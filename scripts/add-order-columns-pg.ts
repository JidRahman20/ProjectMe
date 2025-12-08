import 'dotenv/config'
import { Client } from 'pg'

async function addOrderColumns() {
  console.log('Menambahkan kolom baru ke tabel orders...\n')
  
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
    
    console.log('Adding columns to orders table...')
    await client.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS kegiatan TEXT,
      ADD COLUMN IF NOT EXISTS tamu TEXT,
      ADD COLUMN IF NOT EXISTS jumlah_tamu INTEGER,
      ADD COLUMN IF NOT EXISTS bagian TEXT,
      ADD COLUMN IF NOT EXISTS pengaju TEXT,
      ADD COLUMN IF NOT EXISTS tanggal_pengajuan TEXT,
      ADD COLUMN IF NOT EXISTS tanggal_pengiriman TEXT
    `)
    console.log('SUCCESS: Kolom berhasil ditambahkan!')
    
    // Verify columns were added
    console.log('\nVerifying columns...')
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
      ORDER BY ordinal_position
    `)
    
    console.log('\nKolom yang ada di tabel orders:')
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`)
    })
    
  } catch (error) {
    console.error('ERROR:', error)
    process.exit(1)
  } finally {
    await client.end()
    console.log('\nDone!')
  }
}

addOrderColumns()
