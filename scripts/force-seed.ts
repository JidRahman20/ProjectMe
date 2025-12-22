import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

// Try to use service role key if available
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

async function forceSeed() {
  console.log('🌱 Force seeding database...\n')
  
  const usersToCreate = [
    { email: 'ajid@gmail.com', name: 'Admin Ajid', password: 'ajid123', role: 'admin' },
    { email: 'dika@gmail.com', name: 'User Dika', password: 'dika123', role: 'user' },
    { email: 'fauji@gmail.com', name: 'User Fauji', password: 'fauji123', role: 'user' },
    { email: 'gading@gmail.com', name: 'User Gading', password: 'gading123', role: 'user' },
    { email: 'riza@gmail.com', name: 'User Riza', password: 'riza123', role: 'user' },
  ]

  let successCount = 0

  for (const userData of usersToCreate) {
    console.log(`\n📝 Creating: ${userData.email}`)
    
    try {
      // Delete if exists
      await client.from('users').delete().eq('email', userData.email)
      
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
        if (error.code === '42501') {
          console.log('\n⚠️  RLS ERROR! Please run this SQL in Supabase Dashboard:')
          console.log('   ALTER TABLE users DISABLE ROW LEVEL SECURITY;')
          console.log('   ALTER TABLE orders DISABLE ROW LEVEL SECURITY;')
          break
        }
      } else {
        console.log(`✅ Success: ${data.email}`)
        successCount++
      }
    } catch (e) {
      console.error(`❌ Error:`, e)
    }
  }
  
  console.log(`\n\n✨ Created ${successCount}/${usersToCreate.length} users`)
  
  if (successCount > 0) {
    console.log('\n🔑 Login credentials:')
    usersToCreate.forEach(u => {
      console.log(`   ${u.email} / ${u.password}`)
    })
  }
}

forceSeed().catch(console.error)
