import { db } from '../lib/db'
import bcrypt from 'bcrypt'

async function testConnection() {
  console.log('🔍 Testing database connection...\n')
  
  try {
    // Test 1: Fetch all users
    console.log('Test 1: Fetching all users...')
    const users = await db.users.findMany()
    console.log(`✅ Found ${users.length} users`)
    
    if (users.length > 0) {
      console.log('\n👥 Users in database:')
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`)
      })
    }
    
    // Test 2: Find specific user
    console.log('\n\nTest 2: Finding ajid@gmail.com...')
    const ajidUser = await db.users.findByEmail('ajid@gmail.com')
    
    if (ajidUser) {
      console.log('✅ User found:', {
        id: ajidUser.id,
        email: ajidUser.email,
        name: ajidUser.name,
        role: ajidUser.role,
        hasPassword: !!ajidUser.password
      })
      
      // Test 3: Password verification
      console.log('\n\nTest 3: Testing password verification...')
      const testPassword = 'ajid123'
      const isValid = await bcrypt.compare(testPassword, ajidUser.password)
      console.log(`Password "${testPassword}" is ${isValid ? '✅ VALID' : '❌ INVALID'}`)
      
      if (!isValid) {
        console.log('\n⚠️  Password mismatch! The stored password hash might be wrong.')
        console.log('Try running: npm run db:seed')
      }
    } else {
      console.log('❌ User not found!')
      console.log('\n⚠️  Run: npm run db:seed to create users')
    }
    
    console.log('\n✨ Connection test completed!')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    console.log('\n⚠️  Check your .env file:')
    console.log('  - SUPABASE_URL')
    console.log('  - SUPABASE_ANON_KEY')
  }
}

testConnection()
