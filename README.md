# ProjectMe

Portal karyawan internal dengan fitur konsumsi, absensi, dan manajemen dokumen.

## Setup Database

1. Buat project Supabase dan aktifkan Postgres database
2. Copy connection string dari Supabase Database settings
3. Buat file `.env` dengan variabel:
   - `DATABASE_URL` → Connection pooling string
   - `DIRECT_URL` → Direct connection string
4. Jalankan `npm run db:seed` untuk setup database

## Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - Jalankan development server
- `npm run build` - Build untuk production
- `npm run db:seed` - Seed database dengan data awal
- `npm run db:users` - List semua users
- `npm run db:orders` - List semua orders

