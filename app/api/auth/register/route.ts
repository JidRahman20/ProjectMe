import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    try {
      const existingUser = await db.users.findByEmail(email)
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 409 }
        )
      }
    } catch {
      // User doesn't exist, continue with registration
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userId = `user-${Date.now()}`
    const newUser = await db.users.create({
      id: userId,
      email,
      password: hashedPassword,
      name: name || null,
      role: 'user'
    })

    // Don't send password back
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Registration successful'
    }, { status: 201 })
  } catch (error) {
    const err = error as Error
    console.error('Registration error:', err)
    return NextResponse.json(
      { success: false, error: 'Registration failed', message: err.message },
      { status: 500 }
    )
  }
}
