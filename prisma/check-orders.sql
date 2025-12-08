-- Cek semua kolom di tabel orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Cek isi tabel orders
SELECT * FROM orders ORDER BY created_at DESC;
