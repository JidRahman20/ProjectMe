import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Regular client for app usage
export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client for bypassing RLS (use only in server-side scripts)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase // fallback to regular client if no service key

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
