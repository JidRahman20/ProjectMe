# 🧪 TEST LOGIN DI BROWSER

## Langkah Test Login:

### 1. Pastikan Dev Server Running
```bash
npm run dev
```

Server harus menunjukkan:
```
✓ Ready in X.Xs
- Local: http://localhost:3000
```

### 2. Buka Browser
Buka: **http://localhost:3000/login**

### 3. Login dengan Akun Test
- **Email**: `test@example.com`
- **Password**: `password123`

### 4. Hasil yang Diharapkan
- ✅ Login berhasil → Redirect ke dashboard
- ❌ Jika error "Failed to fetch":
  - Check console browser (F12)
  - Pastikan server masih running
  - Check Network tab di DevTools

---

## 🔍 Debug Failed to Fetch

### Kemungkinan Penyebab:

#### 1. Server Crash
**Solusi:**
- Stop server (Ctrl+C)
- Restart: `npm run dev`
- Cek error di terminal

#### 2. API Route Error
**Test manual di browser console (F12):**
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test@example.com', 
    password: 'password123' 
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

#### 3. Database Connection Issue
**Test koneksi:**
```bash
npm run db:test
npm run db:users
```

#### 4. CORS atau Network Issue
- Check browser Network tab
- Lihat response dari `/api/auth/login`
- Status code harus 200 atau 401 (bukan error 500)

---

## ✅ Checklist Debug:

- [ ] Server running di http://localhost:3000
- [ ] Database connection OK (`npm run db:test`)
- [ ] User exists (`npm run db:users`)
- [ ] Browser bisa akses http://localhost:3000
- [ ] No TypeScript errors
- [ ] Check browser console untuk error details

---

## 📝 Alternative Test (Postman/Thunder Client):

**POST** `http://localhost:3000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "test-user-xxx",
    "email": "test@example.com",
    "name": "Test User",
    "role": "user"
  },
  "message": "Login successful"
}
```
