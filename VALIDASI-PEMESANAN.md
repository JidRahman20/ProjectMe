# Sistem Validasi Pemesanan Tiga Tingkat

## Deskripsi Perubahan

Sistem approval pemesanan telah diubah menjadi **tiga tingkat persetujuan**:

### Alur Persetujuan

1. **User** membuat pesanan konsumsi
2. **Approval Team** (role: approval) melihat dan menyetujui/menolak pesanan
3. **Admin** (role: admin) melihat pesanan yang sudah disetujui Approval Team dan memberikan persetujuan final
4. **Vendor/Pendor** (role: pendor) melihat pesanan yang sudah disetujui Admin dan memproses pesanan

### Status Pesanan

Setiap pesanan memiliki 4 status tracking:
- `status` - Status keseluruhan pesanan (pending, approved, rejected)
- `approval_status` - Status persetujuan dari Approval Team (pending, approved, rejected)
- `admin_status` - Status persetujuan dari Admin (pending, approved, rejected)
- `vendor_status` - Status pemrosesan dari Vendor (pending, accepted, processing, shipped, completed, rejected)

### Aturan Validasi

1. Pesanan yang baru dibuat memiliki:
   - `status`: pending
   - `approval_status`: pending
   - `admin_status`: pending
   - `vendor_status`: pending

2. **Approval Team** dapat:
   - Menyetujui pesanan → `approval_status` = approved, `status` tetap pending (menunggu admin)
   - Menolak pesanan → `approval_status` = rejected, `status` = rejected

3. **Admin** dapat:
   - Hanya bisa menyetujui pesanan yang sudah `approval_status` = approved
   - Menyetujui pesanan → `admin_status` = approved, `status` = approved, `vendor_status` = pending
   - Menolak pesanan → `admin_status` = rejected, `status` = rejected

4. **Vendor/Pendor** dapat:
   - Hanya melihat pesanan yang sudah `status` = approved dan `admin_status` = approved
   - Accept pesanan → `vendor_status` = accepted
   - Process pesanan → `vendor_status` = processing
   - Ship pesanan → `vendor_status` = shipped
   - Complete pesanan → `vendor_status` = completed
   - Reject pesanan → `vendor_status` = rejected, `status` = rejected

## File yang Diubah

### 1. Database Schema (`prisma/schema.prisma`)
Menambahkan field baru:
- `approvalStatus` - Status approval dari Approval Team
- `adminStatus` - Status approval dari Admin
- `vendorStatus` - Status pemrosesan dari Vendor/Pendor
- `approvalRejectionReason` - Alasan penolakan dari Approval
- `adminRejectionReason` - Alasan penolakan dari Admin
- `vendorRejectionReason` - Alasan penolakan dari Vendor
- `approvedByApproval` - Nama approver dari Approval Team
- `approvedByAdmin` - Nama approver dari Admin
- `processedByVendor` - Nama vendor yang memproses
- `approvalDate` - Tanggal approval dari Approval Team
- `adminApprovalDate` - Tanggal approval dari Admin
- `vendorAcceptedDate` - Tanggal vendor accept pesanan
- `vendorCompletedDate` - Tanggal vendor selesai memproses

### 2. API Endpoint (`app/api/konsumsi/orders/[code]/route.ts`)
- PATCH endpoint sekarang menerima parameter `role` (approval/admin/vendor)
- Validasi untuk memastikan:
  - Admin hanya bisa approve setelah approval team approve
  - Vendor hanya bisa process setelah admin approve
- Tracking siapa yang approve/process dan kapan

### 3. Halaman Approval (`app/approval/detail-pengajuan/page.tsx`)
- Mengirim `role: 'approval'` saat approve/reject
- Menampilkan pesan bahwa pesanan akan diteruskan ke admin setelah di-approve

### 4. Halaman Admin Orders (`app/admin/orders/page.tsx`)
- Menampilkan status dua tingkat approval
- Hanya menampilkan tombol approve jika `approval_status` = approved
- Menampilkan warning jika pesanan belum di-approve oleh Approval Team
- Mengirim `role: 'admin'` saat approve/reject
- Setelah approve, pesanan diteruskan ke Vendor

### 5. Halaman Vendor/Pendor (`app/pendor/page.tsx`)
- Hanya menampilkan pesanan yang sudah `status` = approved dan `admin_status` = approved
- Vendor dapat accept, process, ship, dan complete pesanan
- Mengirim `role: 'vendor'` saat update status
- Tracking vendor yang memproses dan status pesanan

## Cara Migrasi Database

Jalankan script migrasi untuk menambahkan kolom baru:

```bash
npx tsx scripts/add-approval-columns.ts
```

Atau push schema Prisma:

```bash
npx prisma db push
```

## Testing

1. **User membuat pesanan**
   - Pesanan muncul dengan status "Menunggu Persetujuan" di halaman Approval
   - Pesanan juga muncul di halaman Admin Orders tetapi tidak bisa di-approve
   - Pesanan tidak muncul di halaman Vendor/Pendor

2. **Approval Team approve**
   - Status Approval berubah menjadi "Disetujui"
   - Status keseluruhan masih "Menunggu Persetujuan"
   - Pesanan sekarang bisa di-approve oleh Admin
   - Pesanan masih belum muncul di halaman Vendor

3. **Admin approve (final approval)**
   - Status Admin berubah menjadi "Disetujui"
   - Status keseluruhan berubah menjadi "Disetujui"
   - Vendor Status berubah menjadi "Pending"
   - **Pesanan sekarang muncul di halaman Vendor/Pendor**

4. **Vendor/Pendor process pesanan**
   - Vendor bisa Accept pesanan → vendor_status = 'accepted'
   - Vendor bisa Process → vendor_status = 'processing'
   - Vendor bisa Ship → vendor_status = 'shipped'
   - Vendor bisa Complete → vendor_status = 'completed'
   - Pesanan selesai diproses

5. **Jika Approval Team reject**
   - Status Approval berubah menjadi "Ditolak"
   - Status keseluruhan berubah menjadi "Dibatalkan"
   - Admin dan Vendor tidak bisa lagi approve/process pesanan tersebut

6. **Jika Admin reject (setelah Approval approve)**
   - Status Admin berubah menjadi "Ditolak"
   - Status keseluruhan berubah menjadi "Dibatalkan"
   - Vendor tidak bisa process pesanan tersebut

7. **Jika Vendor reject**
   - Status Vendor berubah menjadi "Ditolak"
   - Status keseluruhan berubah menjadi "Dibatalkan"

## Catatan Penting

- Pesanan baru benar-benar approved (status = 'approved') setelah **Admin menyetujui**
- Vendor **hanya bisa melihat dan memproses** pesanan yang sudah di-approve oleh Admin
- Admin **tidak bisa** approve pesanan yang belum di-approve oleh Approval Team
- Vendor **tidak bisa** memproses pesanan yang belum di-approve oleh Admin
- Penolakan di tingkat manapun akan membuat pesanan dibatalkan (status = 'rejected')
- Setiap approval/process tercatat dengan nama approver/processor dan tanggal

## Alur Lengkap

```
User Membuat Pesanan
        ↓
[Approval Team Review]
        ↓
    Approve? ─── Reject → Pesanan Dibatalkan
        ↓ Yes
[Admin Review]
        ↓
    Approve? ─── Reject → Pesanan Dibatalkan
        ↓ Yes
[Vendor/Pendor Melihat & Process]
        ↓
    Accept → Processing → Shipped → Completed
        ↓ (atau Reject → Pesanan Dibatalkan)
    Pesanan Selesai
```
