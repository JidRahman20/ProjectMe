import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password: rawPassword } = await request.json()

    if (!email || !rawPassword) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(rawPassword, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const { password: hashedPassword, ...safeUser } = user
    void hashedPassword // drop hashed password from response without lint noise
    // Keep id as string to match existing client type
    return NextResponse.json({ user: { ...safeUser, id: String(safeUser.id) } })
  } catch (err) {
    console.error('Login error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
