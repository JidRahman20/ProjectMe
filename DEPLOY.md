# Deploy ke Vercel

## Langkah-Langkah:

### 1. Persiapan
Pastikan database Supabase sudah setup lengkap dengan SQL yang ada di `prisma/setup.sql`

### 2. Deploy via Vercel Dashboard

1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik "Add New Project"
4. Import repository: **JidRahman20/ProjectMe**
5. Klik "Import"

### 3. Configure Environment Variables

Di Vercel dashboard, tambahkan environment variables berikut:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Cara dapat nilai-nilai ini:**
- Buka Supabase Dashboard
- Pilih project Anda
- Pergi ke Settings → Database
- Copy connection string untuk `DATABASE_URL` dan `DIRECT_URL`
- Pergi ke Settings → API
- Copy `URL` untuk `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon/public` key untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Deploy

Klik "Deploy" dan tunggu proses build selesai (biasanya 2-3 menit)

### 5. Seed Database (Opsional)

Setelah deploy berhasil, Anda bisa seed database dengan cara:

1. Clone repository di local
2. Setup `.env` dengan credentials production
3. Jalankan: `npm run db:seed`

Atau jalankan SQL manual di Supabase SQL Editor:
```sql
-- Lihat file prisma/seed.ts untuk SQL yang dibutuhkan
```

### 6. Test

Buka URL yang diberikan Vercel (biasanya: `https://project-me-xyz.vercel.app`)

Test dengan:
1. Login dengan kredensial dari seed
2. Buat order baru
3. Test edit dan batalkan order

## Troubleshooting

### Error: "Database connection failed"
- Cek apakah environment variables sudah benar
- Pastikan Supabase project tidak di-pause (free tier bisa auto-pause)

### Error: "Table does not exist"
- Jalankan SQL setup di Supabase: `prisma/setup.sql`
- Jalankan migration untuk kolom baru: `prisma/add-order-columns.sql`

### Error: "Foreign key constraint"
- Jalankan: `prisma/fix-foreign-key.sql` di Supabase SQL Editor

## Deploy via CLI (Alternatif)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Untuk production
vercel --prod
```

## Auto Deploy

Setelah setup pertama, setiap push ke branch `main` akan auto-deploy ke production!

## Custom Domain

Di Vercel dashboard:
1. Pergi ke Settings → Domains
2. Tambahkan custom domain Anda
3. Update DNS records sesuai instruksi
