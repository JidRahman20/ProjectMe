import 'dotenv/config'

async function createTablesDirectly() {
  console.log('Creating tables directly via Supabase API...\n')
  
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_ANON_KEY!
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env')
    process.exit(1)
  }
  
  // SQL statements
  const sqlStatements = [
    // Create users table
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    
    // Create orders table
    `CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id),
      items JSONB NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    
    // Create indexes
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`
  ]
  
  try {
    // Use Supabase REST API to execute SQL
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i]
      console.log(`${i + 1}. Executing SQL statement...`)
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ query: sql })
      })
      
      if (!response.ok) {
        console.log(`WARNING: Statement ${i + 1} might need manual execution`)
      } else {
        console.log(`SUCCESS: Statement ${i + 1} executed`)
      }
    }
    
    console.log('\nTable creation completed!')
    console.log('Now run: npm run db:test')
    
  } catch (err) {
    const error = err as Error
    console.error('\nERROR: Auto-creation failed:', error.message)
    console.log('Using manual method...\n')
    
    // Show manual instructions
    const fullSql = sqlStatements.join(';\n\n') + ';'
    
    console.log('='.repeat(60))
    console.log('Copy this SQL and run it manually:')
    console.log('='.repeat(60))
    console.log(fullSql)
    console.log('='.repeat(60))
    console.log('\nGo to: https://ivgdmroiitdaghkkzhbh.supabase.co/project/ivgdmroiitdaghkkzhbh/sql/new')
    console.log('Then run: npm run db:test\n')
  }
}

createTablesDirectly()
