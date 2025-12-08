# Perbaikan Error Order Konsumsi

## Masalah yang Ditemukan

Error `"userId and items array are required"` terjadi karena:

1. **Payload frontend tidak sesuai dengan API**: Frontend mengirim data dengan field `menu` tapi API mengharapkan `items`
2. **userId tidak dikirim**: Frontend tidak mengirim `userId` yang diperlukan API
3. **Kolom database tidak lengkap**: Tabel `orders` tidak memiliki kolom untuk menyimpan data detail order (kegiatan, tamu, dll)

## Perubahan yang Sudah Dilakukan

### 1. Frontend (`app/menu/konsumsi/page.tsx`)
- ✅ Menambahkan import `useAuth` dari auth context
- ✅ Mendapatkan user dari auth context menggunakan `useAuth()`
- ✅ Validasi user login sebelum submit order
- ✅ Mengubah payload untuk mengirim:
  - `userId` (dari user.id)
  - `items` (bukan `menu`)
  - Data tambahan: kegiatan, tamu, jumlahTamu, bagian, pengaju, tanggalPengajuan, tanggalPengiriman

### 2. Backend API (`app/api/konsumsi/orders/route.ts`)
- ✅ Menerima dan memproses field tambahan dari frontend
- ✅ Menyimpan semua data ke database

### 3. Database Helper (`lib/db.ts`)
- ✅ Menambahkan type definition untuk field baru di fungsi `create`
- ✅ Support untuk kolom: kegiatan, tamu, jumlah_tamu, bagian, pengaju, tanggal_pengajuan, tanggal_pengiriman

## Yang Perlu Dilakukan (Manual)

### **LANGKAH PENTING: Update Database Schema**

Anda perlu menambahkan kolom baru ke tabel `orders` di Supabase. Ikuti langkah berikut:

1. **Buka Supabase Dashboard**
   - Masuk ke: https://supabase.com/dashboard
   - Pilih project Anda
   - Buka **SQL Editor**

2. **Jalankan SQL Query Berikut:**

```sql
-- Add additional columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS kegiatan TEXT,
ADD COLUMN IF NOT EXISTS tamu TEXT,
ADD COLUMN IF NOT EXISTS jumlah_tamu INTEGER,
ADD COLUMN IF NOT EXISTS bagian TEXT,
ADD COLUMN IF NOT EXISTS pengaju TEXT,
ADD COLUMN IF NOT EXISTS tanggal_pengajuan TEXT,
ADD COLUMN IF NOT EXISTS tanggal_pengiriman TEXT;
```

3. **Klik "Run"** untuk menjalankan query

4. **Verifikasi** bahwa kolom berhasil ditambahkan:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;
```

### Alternatif: Menggunakan Script (jika koneksi database tersedia)

Jika koneksi database sudah configured dengan benar, jalankan:
```bash
npx tsx scripts/add-order-columns-pg.ts
```

## Testing

Setelah menambahkan kolom di database:

1. **Login** ke aplikasi
2. Buka halaman **Konsumsi**
3. Klik **Tambah Order**
4. Isi form dan klik **Simpan**
5. Order seharusnya berhasil tersimpan ke database tanpa error

## Troubleshooting

### Error: "Anda harus login terlebih dahulu!"
- Pastikan Anda sudah login
- Cek browser console untuk memastikan `user` object ada
- Refresh halaman dan login ulang jika perlu

### Error: Database column doesn't exist
- Pastikan SQL query sudah dijalankan di Supabase Dashboard
- Verifikasi kolom sudah ada dengan query SELECT di atas

### Error: Failed to create order
- Cek console browser untuk detail error
- Pastikan semua field required terisi (userId, items array)
- Verifikasi koneksi ke Supabase

## File yang Diubah

1. `app/menu/konsumsi/page.tsx` - Frontend form handler
2. `app/api/konsumsi/orders/route.ts` - API endpoint
3. `lib/db.ts` - Database helper types
4. `scripts/add-order-columns-pg.ts` - Script untuk update database (NEW)
5. `prisma/add-order-columns.sql` - SQL migration file (NEW)

## Summary

Masalah utama adalah **mismatch antara data yang dikirim frontend dengan yang diharapkan backend**, dan **database schema yang tidak lengkap**. 

Setelah menjalankan SQL query untuk menambahkan kolom, sistem akan berfungsi dengan baik dan data order akan tersimpan lengkap di database.
