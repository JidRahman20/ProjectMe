import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const client = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createRoleUsers() {
  console.log('🌱 Creating users for each role...\n')
  
  const usersToCreate = [
    { email: 'admin@demplon.com', name: 'Administrator', password: 'admin123', role: 'admin' },
    { email: 'approval@demplon.com', name: 'Approval Manager', password: 'approval123', role: 'approval' },
    { email: 'pendor@demplon.com', name: 'Pendor Staff', password: 'pendor123', role: 'pendor' },
    { email: 'user@demplon.com', name: 'Regular User', password: 'user123', role: 'user' },
  ]

  let successCount = 0

  for (const userData of usersToCreate) {
    console.log(`📝 Creating: ${userData.email} (${userData.role})`)
    
    try {
      // Check if exists
      const { data: existing } = await client
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single()

      if (existing) {
        console.log(`⚠️  User already exists, skipping...`)
        continue
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      
      // Insert user
      const { data, error } = await client
        .from('users')
        .insert({
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: userData.role,
        })
        .select()
        .single()
      
      if (error) {
        console.error(`❌ Failed:`, error.message)
      } else {
        console.log(`✅ Success: ${data.email}`)
        successCount++
      }
    } catch (e) {
      console.error(`❌ Error:`, e)
    }
  }
  
  console.log(`\n✨ Created ${successCount}/${usersToCreate.length} users`)
  
  console.log('\n🔑 Test Login credentials for each role:')
  console.log('\n📌 Admin:')
  console.log('   admin@demplon.com / admin123')
  console.log('\n📌 Approval:')
  console.log('   approval@demplon.com / approval123')
  console.log('\n📌 Pendor:')
  console.log('   pendor@demplon.com / pendor123')
  console.log('\n📌 User:')
  console.log('   user@demplon.com / user123')
}

createRoleUsers().catch(console.error)
