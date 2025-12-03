const response = await fetch('http://localhost:3000/api/konsumsi/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    kegiatan: 'Tes API',
    tamu: 'REGULAR',
    jumlahTamu: 12,
    bagian: 'IT',
    pengaju: 'Tester',
    tanggalPengajuan: '2025-12-03',
    tanggalPengiriman: '2025-12-04',
    menu: [
      { name: 'Nasi Uduk', qty: 12, satuan: 'Porsi' }
    ]
  })
})

console.log('Status:', response.status)
const text = await response.text()
console.log('Body:', text)
