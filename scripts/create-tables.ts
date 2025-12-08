import 'dotenv/config'

async function setupTables() {
  console.log('Creating tables in Supabase...')
  
  // SQL untuk create tables
  const createTablesSql = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  `.trim()
  
  console.log('\n' + '='.repeat(60))
  console.log('SQL to run in Supabase SQL Editor:')
  console.log('='.repeat(60))
  console.log(createTablesSql)
  console.log('='.repeat(60) + '\n')
  
  console.log('Instructions:')
  console.log('1. Go to: https://ivgdmroiitdaghkkzhbh.supabase.co/project/ivgdmroiitdaghkkzhbh/sql/new')
  console.log('2. Copy the SQL above')
  console.log('3. Paste and Run it')
  console.log('4. Then run: npm run seed')
  console.log('')
}

setupTables()
