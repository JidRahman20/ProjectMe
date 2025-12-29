# ProjectMe - Portal Karyawan Demplon

Portal karyawan internal dengan fitur konsumsi, absensi, manajemen dokumen, dan multi-role access.

## Build Status ✅

All TypeScript errors resolved - Ready for production deployment.

## ✨ Fitur Utama

- 🔐 **Authentication** - Login dengan role-based access
- 👥 **Multi-Role Support** - Admin, Approval, Pendor, dan User
- 🍽️ **Konsumsi** - Sistem pemesanan konsumsi
- 📅 **Absensi** - Manajemen kehadiran karyawan
- 📚 **Library** - Perpustakaan dokumen digital
- 👔 **Employee Directory** - Direktori karyawan
- 🎨 **Dark Mode** - Tema gelap dan terang

## 🚀 Quick Start

### 1. Setup Database

1. Buat project di [Supabase](https://supabase.com)
2. Copy connection strings dari Supabase Dashboard → Settings → Database
3. Buat file `.env` di root folder:

```env
DATABASE_URL=your_pooling_connection_string
DIRECT_URL=your_direct_connection_string
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_anon_key
```

4. Disable RLS (Row Level Security) di Supabase SQL Editor:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
```

5. Seed database dengan data awal:

```bash
npm run db:seed
```

### 2. Install & Run

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🔑 Default Login Credentials

Lihat file `ADMIN-CREDENTIALS.md` untuk daftar lengkap akun test.

**Quick Test:**
- User biasa: `user@demplon.com` / `user123`
- Admin: `admin@demplon.com` / `admin123`
- Approval: `approval@demplon.com` / `approval123`
- Pendor: `pendor@demplon.com` / `pendor123`

## 📁 Struktur Folder

```
ProjectMe/
├── app/              # Next.js App Router
│   ├── page.tsx      # Home untuk user biasa
│   ├── admin/        # Dashboard Admin
│   ├── approval/     # Dashboard Approval
│   ├── pendor/       # Dashboard Pendor
│   ├── menu/         # Menu aplikasi
│   ├── api/          # API Routes
│   └── login/        # Halaman login
├── components/       # React components
│   └── ui/           # UI components
├── context/          # React Context (Auth, Theme)
├── lib/              # Utilities & DB helpers
└── prisma/           # Database schema
```

Lihat `app/README.md` untuk detail struktur folder.

## 🛠️ Scripts Tersedia

```bash
# Development
npm run dev          # Jalankan development server

# Database
npm run db:seed      # Seed database dengan data awal
npm run db:users     # List semua users
npm run db:orders    # List semua orders

# Production
npm run build        # Build untuk production
npm start            # Jalankan production server
```

## 🎯 Role-Based Routing

Setelah login, user otomatis diredirect ke halaman sesuai role:

| Role | Home Page | Akses |
|------|-----------|-------|
| User | `/` | Menu utama aplikasi |
| Admin | `/admin` | Full access ke semua fitur |
| Approval | `/approval` | Approval konsumsi & pengajuan |
| Pendor | `/pendor` | Kelola order konsumsi |

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Auth**: Custom JWT-less auth with localStorage
- **Icons**: Lucide React

## 📝 Development Notes

- Gunakan `tsx` untuk menjalankan TypeScript scripts
- Database helper ada di `lib/db.ts` (menggunakan Supabase client)
- Protected routes menggunakan `<ProtectedRoute>` component
- Theme dikelola oleh `ThemeContext`

## 🐛 Troubleshooting

**Login gagal / User tidak ditemukan:**
```bash
npm run db:seed
```

**RLS Error saat seed:**
- Disable RLS di Supabase SQL Editor (lihat Quick Start step 4)

**Dev server error:**
```bash
rm -rf .next
npm run dev
```

## 📄 License

Private - Internal Use Only
