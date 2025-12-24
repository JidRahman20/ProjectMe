-- Script SQL untuk menambahkan kolom approval dan vendor ke tabel orders
-- Jalankan secara manual di Supabase SQL Editor jika diperlukan

-- Tambahkan kolom approval_status
ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';

-- Tambahkan kolom admin_status
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'pending';

-- Tambahkan kolom vendor_status
ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_status TEXT DEFAULT 'pending';

-- Tambahkan kolom approval_rejection_reason
ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_rejection_reason TEXT;

-- Tambahkan kolom admin_rejection_reason
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_rejection_reason TEXT;

-- Tambahkan kolom vendor_rejection_reason
ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_rejection_reason TEXT;

-- Tambahkan kolom approved_by_approval
ALTER TABLE orders ADD COLUMN IF NOT EXISTS approved_by_approval TEXT;

-- Tambahkan kolom approved_by_admin
ALTER TABLE orders ADD COLUMN IF NOT EXISTS approved_by_admin TEXT;

-- Tambahkan kolom processed_by_vendor
ALTER TABLE orders ADD COLUMN IF NOT EXISTS processed_by_vendor TEXT;

-- Tambahkan kolom approval_date
ALTER TABLE orders ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP;

-- Tambahkan kolom admin_approval_date
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_approval_date TIMESTAMP;

-- Tambahkan kolom vendor_accepted_date
ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_accepted_date TIMESTAMP;

-- Tambahkan kolom vendor_completed_date
ALTER TABLE orders ADD COLUMN IF NOT EXISTS vendor_completed_date TIMESTAMP;

-- Update existing orders untuk set default values
UPDATE orders 
SET 
  approval_status = COALESCE(approval_status, 'pending'),
  admin_status = COALESCE(admin_status, 'pending'),
  vendor_status = COALESCE(vendor_status, 'pending')
WHERE approval_status IS NULL OR admin_status IS NULL OR vendor_status IS NULL;

-- Verifikasi perubahan
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN (
    'approval_status', 
    'admin_status',
    'vendor_status',
    'approval_rejection_reason',
    'admin_rejection_reason',
    'vendor_rejection_reason',
    'approved_by_approval',
    'approved_by_admin',
    'processed_by_vendor',
    'approval_date',
    'admin_approval_date',
    'vendor_accepted_date',
    'vendor_completed_date'
  )
ORDER BY column_name;
