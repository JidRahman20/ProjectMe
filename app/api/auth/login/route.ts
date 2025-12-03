import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const { password, ...safeUser } = user
    void password // drop hashed password from response without lint noise
    // Keep id as string to match existing client type
    return NextResponse.json({ user: { ...safeUser, id: String(safeUser.id) } })
  } catch (err) {
    console.error('Login error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
