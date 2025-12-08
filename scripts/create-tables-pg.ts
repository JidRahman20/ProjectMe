import 'dotenv/config'
import { Client } from 'pg'

async function createTablesWithPg() {
  console.log('Creating tables using PostgreSQL client...\n')
  
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
    
    // Create users table
    console.log('1. Creating users table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    console.log('SUCCESS: Users table created')
    
    // Create orders table
    console.log('2. Creating orders table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL REFERENCES users(id),
        items JSONB NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    console.log('SUCCESS: Orders table created')
    
    // Create indexes
    console.log('3. Creating indexes...')
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`)
    console.log('SUCCESS: Indexes created')

    console.log('\nDatabase setup completed successfully!')
    console.log('Now run: npm run db:seed\n')  } catch (error) {
    const err = error as Error
    console.error('\nERROR:', err.message)
    console.log('\nMake sure:')
    console.log('1. Database connection string is correct in .env')
    console.log('2. Database is accessible')
    console.log('3. You have permissions to create tables\n')
    process.exit(1)
  } finally {
    await client.end()
  }
}

createTablesWithPg()
