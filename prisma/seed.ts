import { supabase, supabaseAdmin } from '../lib/supabase'
import bcrypt from 'bcrypt'

async function main() {
  console.log('🌱 Starting seed...')
  
  // Use admin client to bypass RLS
  const client = supabaseAdmin

  // Define users to create
  const usersToCreate = [
    {
      email: 'ajid@gmail.com',
      name: 'Admin Ajid',
      password: 'ajid123',
      role: 'admin'
    },
    {
      email: 'dika@gmail.com',
      name: 'User Dika',
      password: 'dika123',
      role: 'user'
    },
    {
      email: 'fauji@gmail.com',
      name: 'User Fauji',
      password: 'fauji123',
      role: 'user'
    },
    {
      email: 'gading@gmail.com',
      name: 'User Gading',
      password: 'gading123',
      role: 'user'
    },
    {
      email: 'riza@gmail.com',
      name: 'User Riza',
      password: 'riza123',
      role: 'user'
    },
  ]

  const createdUsers: Array<{
    id: string
    email: string
    name: string | null
    role: string
  }> = []

  // Create users
  for (const userData of usersToCreate) {
    console.log(`\n📝 Creating user: ${userData.email}`)
    
    // Check if user already exists
    const { data: existingUser } = await client
      .from('users')
      .select('email')
      .eq('email', userData.email)
      .single()

    if (existingUser) {
      console.log(`⚠️  User ${userData.email} already exists, skipping...`)
      continue
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Create user
    const { data: user, error: userError } = await client
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

    if (userError) {
      console.error(`❌ Error creating user ${userData.email}:`, userError)
      continue
    }

    console.log(`✅ User created: ${user.email} (${user.role})`)
    createdUsers.push(user)
  }

  if (createdUsers.length === 0) {
    console.log('\n⚠️  No new users created')
    return
  }

  // Use first created user for test order
  const user = createdUsers[0]

  // Create sample order with complete data
  console.log(`\n📦 Creating sample order for ${user.email}...`)
  const { data: order, error: orderError } = await client
    .from('orders')
    .insert({
      id: 'order-' + Date.now(),
      code: 'ORD-' + Date.now(),
      user_id: user.id,
      items: [
        { name: 'Nasi Goreng', qty: 2, satuan: 'porsi', timePeriod: 'SIANG' },
        { name: 'Es Teh', qty: 2, satuan: 'gelas', timePeriod: 'SIANG' },
      ],
      total_amount: 60000,
      status: 'pending',
      kegiatan: 'Rapat Koordinasi',
      tamu: 'Tamu VIP',
      jumlah_tamu: 10,
      bagian: 'Divisi IT',
      pengaju: user.name,
      tanggal_pengajuan: new Date().toISOString().split('T')[0],
      tanggal_pengiriman: new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow
    })
    .select()
    .single()

  if (orderError) {
    console.error('❌ ERROR: Error creating order:', orderError)
  } else {
    console.log('✅ SUCCESS: Order created:', order.code)
  }
  
  console.log('\n✨ Seed completed successfully!')
  console.log('\n🔑 Login credentials:')
  usersToCreate.forEach(u => {
    console.log(`   - ${u.email} / ${u.password} (${u.role})`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

