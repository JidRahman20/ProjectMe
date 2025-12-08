import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface User {
  id: string
  email: string
  name: string | null
  password: string
  role: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  code: string
  user_id: string
  items: unknown
  total_amount: number
  status: string
  created_at: string
  updated_at: string
}
