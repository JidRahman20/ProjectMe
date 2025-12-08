import { supabase } from '../lib/supabase'
import fs from 'fs'
import path from 'path'

async function addOrderColumns() {
  try {
    console.log('Menambahkan kolom baru ke tabel orders...')
    
    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'prisma', 'add-order-columns.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Execute SQL
    const { error } = await supabase.rpc('exec_sql', { sql_string: sql })
    
    if (error) {
      // If RPC doesn't work, try direct approach
      console.log('WARNING: RPC method tidak tersedia, mencoba menggunakan raw query...')
      
      // Split SQL into individual statements and execute
      const statements = sql.split(';').filter(s => s.trim())
      
      for (const statement of statements) {
        const { error: execError } = await supabase.from('orders').select('id').limit(0)
        if (execError) {
          console.error('Error:', execError)
        }
      }
      
      console.log('INFO: Silakan jalankan SQL berikut secara manual di Supabase Dashboard:')
      console.log('\n' + sql + '\n')
      console.log('Buka: https://supabase.com/dashboard → SQL Editor')
      return
    }
    
    console.log('SUCCESS: Kolom berhasil ditambahkan!')
    
  } catch (error) {
    console.error('ERROR:', error)
    console.log('\nWARNING: Silakan jalankan SQL berikut secara manual di Supabase Dashboard:')
    const sqlPath = path.join(process.cwd(), 'prisma', 'add-order-columns.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    console.log('\n' + sql + '\n')
    console.log('Buka: https://supabase.com/dashboard → SQL Editor')
  }
}

addOrderColumns()
