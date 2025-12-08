import { supabase } from '../lib/supabase'
import { readFileSync } from 'fs'
import { join } from 'path'

async function setupDatabase() {
  console.log('Setting up database...')
  
  try {
    // Read SQL file
    const sqlPath = join(__dirname, 'setup.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    
    console.log('SQL Script loaded')
    console.log('WARNING: Please run this SQL manually in Supabase SQL Editor:')
    console.log('\n' + '='.repeat(60))
    console.log(sql)
    console.log('='.repeat(60) + '\n')
    
    console.log('SUCCESS: After running the SQL, test the connection...')
    
    // Test connection
    const { error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "users" does not exist')) {
        console.log('ERROR: Table "users" belum ada. Silakan jalankan SQL di atas dulu!')
      } else {
        console.error('ERROR:', error.message)
      }
      process.exit(1)
    }
    
    console.log('SUCCESS: Connection to Supabase successful!')
    console.log('Database ready to use')
    
  } catch (error) {
    console.error('ERROR: Setup failed:', error)
    process.exit(1)
  }
}

setupDatabase()
