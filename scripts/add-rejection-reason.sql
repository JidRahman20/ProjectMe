-- Add rejection_reason column to orders table
-- Run this in Supabase SQL Editor

-- Add column if it doesn't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'rejection_reason';
