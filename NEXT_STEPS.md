# 🚀 LANGKAH TERAKHIR - SETUP DATABASE

## ✅ Yang Sudah Selesai:
- ✅ Supabase client terinstall
- ✅ Environment variables sudah dikonfigurasi
- ✅ Database helper functions siap pakai (`lib/db.ts`)
- ✅ Seed script siap

## 📋 Yang Perlu Dilakukan (3 menit):

### 1️⃣ Buka Supabase SQL Editor

Klik link ini: **[Buka SQL Editor](https://ivgdmroiitdaghkkzhbh.supabase.co/project/ivgdmroiitdaghkkzhbh/sql/new)**

### 2️⃣ Copy & Paste SQL Ini

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
```

### 3️⃣ Klik Tombol "RUN" ▶️

Di pojok kanan bawah SQL Editor

### 4️⃣ Verifikasi & Seed

Jalankan command ini di terminal:

```bash
npm run db:test
```

Jika berhasil, tambahkan data test:

```bash
npm run db:seed
```

## 🎉 Selesai!

Setelah itu, database sudah siap digunakan!

---

## 💡 Cara Menggunakan Database

### Contoh Query User:

```typescript
import { db } from '@/lib/db'

// Get all users
const users = await db.users.findMany()

// Find by email
const user = await db.users.findByEmail('test@example.com')

// Create user
const newUser = await db.users.create({
  id: 'user-123',
  email: 'new@example.com',
  password: 'hashed_password',
  name: 'John Doe'
})
```

### Contoh Query Order:

```typescript
import { db } from '@/lib/db'

// Get all orders
const orders = await db.orders.findMany()

// Find by code
const order = await db.orders.findByCode('ORD-123')

// Create order
const newOrder = await db.orders.create({
  id: 'order-123',
  code: 'ORD-123',
  user_id: 'user-123',
  items: [
    { name: 'Nasi Goreng', quantity: 2, price: 25000 }
  ],
  total_amount: 50000,
  status: 'pending'
})
```

## 📚 File Penting:

- `lib/supabase.ts` - Supabase client
- `lib/db.ts` - Database helper functions (RECOMMENDED)
- `prisma/setup.sql` - SQL untuk create tables
- `prisma/seed.ts` - Script untuk seed data

## ❓ Troubleshooting

### "Table not found"
➡️ Jalankan SQL di Supabase SQL Editor (langkah 1-3 di atas)

### "Connection error"
➡️ Check `.env` file, pastikan SUPABASE_URL dan SUPABASE_ANON_KEY benar

### npm run db:test gagal
➡️ Pastikan sudah run SQL di Supabase dulu

---

**Need help?** Tanyakan saja! 😊
