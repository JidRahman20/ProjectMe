-- Simple migration script untuk approval columns
-- Copy paste ke Supabase SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_rejection_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_rejection_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_rejection_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS approved_by_approval TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS approved_by_admin TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS processed_by_vendor TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_approval_date TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_accepted_date TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_completed_date TIMESTAMPTZ;

-- Update existing orders
UPDATE orders 
SET 
  approval_status = 'pending',
  admin_status = 'pending',
  vendor_status = 'pending'
WHERE approval_status IS NULL;

SELECT 'Migration completed successfully!' as message;
