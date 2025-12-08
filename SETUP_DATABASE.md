# Setup Database Supabase

Proyek ini sudah dikonfigurasi untuk menggunakan Supabase sebagai database.

## ✅ Yang Sudah Dikonfigurasi

- ✅ Connection string ke Supabase baru
- ✅ Supabase client library (@supabase/supabase-js)
- ✅ Database schema (users & orders tables)
- ✅ Seed script untuk test data
- ✅ Helper scripts

## 📋 Langkah Setup

### 1. Environment Variables

File `.env` sudah berisi:
```env
SUPABASE_URL=https://ivgdmroiitdaghkkzhbh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

### 2. Buat Tabel di Supabase

Jalankan command ini untuk melihat SQL yang perlu dijalankan:

```bash
npm run db:setup
```

Kemudian:
1. Buka Supabase SQL Editor: https://ivgdmroiitdaghkkzhbh.supabase.co/project/ivgdmroiitdaghkkzhbh/sql/new
2. Copy SQL yang ditampilkan
3. Paste dan Run di SQL Editor

SQL akan membuat:
- ✅ `users` table (id, email, name, password, role, timestamps)
- ✅ `orders` table (id, code, user_id, items, total_amount, status, timestamps)
- ✅ Indexes untuk performa

### 3. Test Koneksi

```bash
npm run db:test
```

Ini akan test apakah koneksi ke Supabase berhasil dan tabel sudah dibuat.

### 4. Seed Database (Optional)

Untuk menambahkan data test:

```bash
npm run db:seed
```

Ini akan membuat:
- 1 test user (`test@example.com` / `password123`)
- 1 test order

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run db:setup` | Tampilkan SQL untuk membuat tabel |
| `npm run db:test` | Test koneksi ke Supabase |
| `npm run db:seed` | Insert test data |

## 💡 Menggunakan Database

### Menggunakan Supabase Client

```typescript
import { supabase } from '@/lib/supabase'

// Query users
const { data, error } = await supabase
  .from('users')
  .select('*')

// Insert order
const { data: order, error } = await supabase
  .from('orders')
  .insert({
    id: 'order-123',
    code: 'ORD-123',
    user_id: 'user-id',
    items: [{ name: 'Item', quantity: 1, price: 10000 }],
    total_amount: 10000,
    status: 'pending'
  })
```

## 🔍 Troubleshooting

### Connection Failed
- ✅ Pastikan SUPABASE_URL dan SUPABASE_ANON_KEY benar di `.env`
- ✅ Pastikan project Supabase aktif

### Table Not Found
- ✅ Jalankan `npm run db:setup` dan copy SQL ke Supabase SQL Editor
- ✅ Pastikan SQL sudah di-run di Supabase

### Authentication Error
- ✅ Check API key di `.env` match dengan Supabase dashboard

## 📚 Resources

- Supabase Dashboard: https://ivgdmroiitdaghkkzhbh.supabase.co
- Supabase Docs: https://supabase.com/docs
- Schema: `prisma/schema.prisma`
- Client: `lib/supabase.ts`
