import { db } from '../lib/db'

async function listUsers() {
  console.log('👥 Daftar Akun Terdaftar:\n')
  
  try {
    const users = await db.users.findMany()
    
    if (users.length === 0) {
      console.log('Belum ada user terdaftar')
      console.log('INFO: Jalankan: npm run db:seed')
      return
    }
    
    console.log(`Total: ${users.length} user\n`)
    console.log('─'.repeat(80))
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name || 'No Name'}`)
      console.log(`   Email    : ${user.email}`)
      console.log(`   Role     : ${user.role}`)
      console.log(`   ID       : ${user.id}`)
      console.log(`   Dibuat   : ${new Date(user.created_at).toLocaleString('id-ID')}`)
    })
    
    console.log('\n' + '─'.repeat(80))
    console.log('\nINFO: Test login dengan:')
    console.log('   Email    : test@example.com')
    console.log('   Password : password123\n')
    
  } catch (error) {
    const err = error as Error
    console.error('ERROR:', err.message)
    
    if (err.message.includes('relation "users" does not exist')) {
      console.log('\nINFO: Table belum ada. Jalankan SQL di Supabase dulu!')
      console.log('   Lihat: NEXT_STEPS.md')
    }
  }
}

listUsers()
