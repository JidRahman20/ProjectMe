/**
 * Script untuk menambahkan kolom baru ke tabel orders via Supabase RPC
 * Jalankan: npx tsx scripts/add-order-fields.ts
 */

async function addColumns() {
  try {
    console.log('🔧 Menambahkan kolom baru ke tabel orders...\n')
    
    console.log('⚠️  INSTRUKSI: Buka Supabase Dashboard dan jalankan SQL berikut:\n')
    console.log('📍 https://supabase.com/dashboard/project/[PROJECT-ID]/sql/new\n')
    console.log('--- Copy SQL ini ke Supabase SQL Editor ---\n')
    
    const sql = `
-- Tambahkan kolom baru ke tabel orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS approval TEXT,
ADD COLUMN IF NOT EXISTS lokasi TEXT,
ADD COLUMN IF NOT EXISTS waktu TEXT,
ADD COLUMN IF NOT EXISTS keterangan TEXT;

-- Verifikasi kolom sudah ditambahkan
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;
`
    
    console.log(sql)
    console.log('\n--- End SQL ---\n')
    
    console.log('📝 Langkah-langkah:')
    console.log('1. Buka Supabase Dashboard (https://supabase.com/dashboard)')
    console.log('2. Pilih project Anda')
    console.log('3. Klik "SQL Editor" di menu kiri')
    console.log('4. Klik "New query"')
    console.log('5. Copy-paste SQL di atas')
    console.log('6. Klik "Run" atau tekan Ctrl+Enter')
    console.log('7. Pastikan berhasil (lihat hasil query)')
    console.log('\n✅ Setelah selesai, coba edit order lagi!\n')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

addColumns()
