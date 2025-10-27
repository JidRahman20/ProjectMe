# 🔐 Sistem Autentikasi DEMPLON

Sistem login, register, dan logout yang sudah terintegrasi dengan aplikasi DEMPLON menggunakan data dummy untuk demo.

## 📋 Fitur

- ✅ **Login** - Halaman login dengan validasi
- ✅ **Register** - Halaman pendaftaran akun baru
- ✅ **Logout** - Fungsi logout yang terintegrasi di navbar
- ✅ **Protected Routes** - Halaman yang hanya bisa diakses setelah login
- ✅ **User Context** - State management untuk user yang sedang login
- ✅ **Local Storage** - Menyimpan session user di browser

## 🚀 Cara Menggunakan

### 1. Jalankan Development Server

```bash
npm run dev
```

Buka browser di `http://localhost:3000`

### 2. Login dengan Akun Dummy

Tersedia 3 akun dummy untuk testing:

**Admin:**
- Email: `admin@demplon.com`
- Password: `admin123`
- Role: Admin

**User 1:**
- Email: `john@demplon.com`
- Password: `john123`
- Role: User

**User 2:**
- Email: `jane@demplon.com`
- Password: `jane123`
- Role: User

### 3. Mendaftar Akun Baru

1. Klik "Daftar sekarang" di halaman login
2. Isi form registrasi:
   - Nama lengkap
   - Email (harus unik)
   - Password (minimal 6 karakter)
   - Konfirmasi password
3. Klik "Daftar"
4. Anda akan otomatis login dan diarahkan ke dashboard

### 4. Logout

1. Klik foto profil di navbar (pojok kanan atas)
2. Pilih "Logout"
3. Anda akan diarahkan kembali ke halaman login

## 📁 Struktur File

```
app/
├── login/
│   └── page.tsx          # Halaman login
├── register/
│   └── page.tsx          # Halaman register
├── page.tsx              # Dashboard (protected)
└── layout.tsx            # Root layout dengan AuthProvider

components/ui/
├── navbar.tsx            # Navbar dengan user menu & logout
├── protected-route.tsx   # HOC untuk protected pages
└── ...

context/
└── auth-context.tsx      # Auth context & provider
```

## 🎨 Fitur Dashboard

Setelah login, Anda akan melihat:

1. **Welcome Banner** - Menyambut user dengan nama
2. **Statistics Cards** - Menampilkan data statistik
3. **Quick Access** - Shortcut ke menu-menu utama
4. **Recent Activity** - Log aktivitas terbaru
5. **User Profile Menu** - Di navbar dengan info user dan tombol logout

## 🔧 Teknologi

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Context API** - State management
- **Local Storage** - Session persistence

## 📝 Catatan

- Data dummy disimpan di memori (akan hilang saat refresh halaman kecuali data di localStorage)
- Untuk production, ganti dengan API backend yang sesungguhnya
- Password tidak di-encrypt (hanya untuk demo)
- Session menggunakan localStorage (untuk production gunakan JWT/cookies)

## 🔒 Security Notes (Untuk Production)

Untuk implementasi production, pastikan:

1. ✅ Gunakan HTTPS
2. ✅ Hash password dengan bcrypt
3. ✅ Implementasi JWT untuk token authentication
4. ✅ Tambahkan CSRF protection
5. ✅ Rate limiting untuk login attempts
6. ✅ Validasi input di backend
7. ✅ Gunakan secure cookies untuk session
8. ✅ Implementasi refresh token

## 🎯 Next Steps

- [ ] Integrasi dengan backend API
- [ ] Implementasi forgot password
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Role-based access control (RBAC)
- [ ] User profile management
- [ ] Change password feature

---

**Made with ❤️ for DEMPLON Project**
