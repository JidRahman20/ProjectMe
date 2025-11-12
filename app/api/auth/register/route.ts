import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const created = await prisma.user.create({ data: { name, email, password: hashed, role: 'user' } })
    const { password: _pw, ...safeUser } = created
    return NextResponse.json({ user: { ...safeUser, id: String(safeUser.id) } }, { status: 201 })
  } catch (err) {
    console.error('Register error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
