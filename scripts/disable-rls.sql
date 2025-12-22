-- Disable Row Level Security for development
-- Run this in Supabase SQL Editor to allow seed script to work

-- Disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on orders table  
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Optional: Create policies for future use
-- Uncomment these if you want to enable RLS with proper policies later

/*
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON orders
  FOR ALL USING (true) WITH CHECK (true);
*/
