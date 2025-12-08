import 'dotenv/config'

async function testLoginAPI() {
  console.log('Testing Login API...\n')
  
  const url = 'http://localhost:3000/api/auth/login'
  const body = {
    email: 'test@example.com',
    password: 'password123'
  }
  
  try {
    console.log('Sending request to:', url)
    console.log('Body:', JSON.stringify(body, null, 2))
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    console.log('\n📥 Response Status:', response.status, response.statusText)
    
    const data = await response.json()
    console.log('Response Data:', JSON.stringify(data, null, 2))
    
    if (data.success) {
      console.log('\nSUCCESS: Login berhasil!')
      console.log('User:', data.user.name || data.user.email)
    } else {
      console.log('\nERROR: Login gagal:', data.error)
    }
    
  } catch (error) {
    const err = error as Error
    console.error('\nERROR:', err.message)
    console.log('\nINFO: Pastikan dev server running:')
    console.log('   npm run dev')
  }
}

testLoginAPI()
