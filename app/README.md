# Struktur Folder Aplikasi

## 📁 Struktur Folder (Bersih & Rapi)

```
app/
├── page.tsx              # Landing page (auto-redirect jika sudah login)
│
├── login/                # Halaman login
│
├── (role-specific)       # Halaman khusus per role
│   ├── user/             # Portal User (menu aplikasi lengkap)
│   ├── admin/            # Dashboard Admin
│   ├── approval/         # Dashboard Approval Manager  
│   └── pendor/           # Dashboard Pendor Staff
│
├── menu/                 # Menu aplikasi (hanya yang aktif digunakan)
│   ├── konsumsi/         # ✅ Sistem konsumsi
│   ├── absen/            # ✅ Absensi karyawan
│   ├── Employee_Directory/  # ✅ Direktori karyawan
│   ├── library/          # ✅ Perpustakaan dokumen
│   ├── e-prosedur/       # ✅ E-Prosedur & SOP
│   ├── work-area/        # ✅ Manajemen area kerja
│   └── profile/          # ✅ Profile pengguna
│
├── dashboard/            # Dashboard umum
├── api/                  # API Routes
│   ├── auth/             # Auth endpoints
│   └── konsumsi/         # Konsumsi endpoints
│
└── layout.tsx            # Root layout
```

## 🗑️ Folder yang Sudah Dihapus

**Dihapus karena tidak digunakan:**
- ❌ `register/` - Registrasi tidak digunakan (user dibuat oleh admin)
- ❌ `welcome/` - Landing page sudah ada di root
- ❌ `menu/dokumenku/` - Digantikan oleh library
- ❌ `menu/portal/` - Redundan dengan user portal
- ❌ `menu/employee/` - Duplikat dengan Employee_Directory
- ❌ `menu/employment/` - Duplikat
- ❌ `menu/mystatement/` - Tidak digunakan
- ❌ `menu/statement/` - Tidak digunakan
- ❌ `menu/shortlink/` - Tidak digunakan
- ❌ `menu/siadil/` - Tidak digunakan
- ❌ `menu/systik/` - Tidak digunakan
- ❌ `menu/kujangai/` - Tidak digunakan
- ❌ `menu/peraturan/` - Tidak digunakan
- ❌ `menu/peraturan perundangan/` - Tidak digunakan

## 🎯 Routing Berdasarkan Role

| Role | Redirect To | Deskripsi |
|------|-------------|-----------|
| `user` | `/user` | Portal dengan menu aplikasi lengkap |
| `admin` | `/admin` | Dashboard administrator |
| `approval` | `/approval` | Dashboard approval manager |
| `pendor` | `/pendor` | Dashboard pendor staff |

## 📝 Menu yang Tersedia

### Menu Utama (Untuk User):
1. **Konsumsi** - Sistem pemesanan konsumsi
2. **Dashboard** - Ringkasan dan statistik
3. **Absensi** - Kelola kehadiran

### Menu Lainnya:
4. **Employee Directory** - Direktori karyawan
5. **Library** - Perpustakaan dokumen digital
6. **E-Prosedur** - Prosedur dan panduan kerja
7. **Work Area** - Area kerja dan ruangan
8. **Profile** - Pengaturan profil

## 🚀 Cara Kerja

1. User yang belum login → Landing page (`/`)
2. User sudah login → Auto-redirect ke `/user`, `/admin`, `/approval`, atau `/pendor`
3. Semua halaman (kecuali `/` dan `/login`) dilindungi `<ProtectedRoute>`

## 🔑 Test Accounts

Lihat `ADMIN-CREDENTIALS.md` untuk daftar akun test.

