"use client";
import React, { useState } from "react";
import { Calendar, Plus, Eye } from "lucide-react";
import SearchableCombobox from "@/components/ui/searchable-combobox";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";

interface Order {
  id: string;
  tanggalPengajuan: string;
  tanggalPengiriman: string;
  kegiatan: string;
  tamu: string;
  jumlahTamu: number;
  bagian: string;
  pengaju: string;
  menu: { label: string; price?: string }[];
  items?: Array<{ name: string; qty: number; satuan: string; timePeriod?: string }>;
  status: string;
  approval?: string;
  lokasi?: string;
  waktu?: string;
  keterangan?: string;
}

// Data menu berdasarkan waktu DAN tipe tamu
const menuByTimeAndGuest = {
  "Pagi": {
    "PERTA": [
      "Nasi Uduk",
      "Nasi Kuning",
      "Bubur Ayam",
      "Lontong Sayur",
      "Roti Bakar",
      "Donat",
      "Kopi Hitam",
      "Teh Manis",
      "Teh Tawar",
      "Air Mineral",
    ],
    "Regular": [
      "Nasi Uduk",
      "Nasi Kuning",
      "Bubur Ayam",
      "Lontong Sayur",
      "Roti Bakar",
      "Donat",
      "Kopi Hitam",
      "Teh Manis",
      "Teh Tawar",
      "Air Mineral",
    ],
    "Standar": [
      "Nasi Uduk",
      "Nasi Kuning",
      "Bubur Ayam",
      "Lontong Sayur",
      "Roti Bakar",
      "Donat",
      "Kopi Hitam",
      "Teh Manis",
      "Teh Tawar",
      "Air Mineral",
    ],
    "VIP": [
      "Nasi Uduk Premium",
      "Nasi Kuning Spesial",
      "Bubur Ayam Kampung",
      "Lontong Sayur Komplit",
      "Roti Bakar Keju",
      "Sandwich Club",
      "Croissant Butter",
      "Danish Pastry",
      "Kopi Susu Premium",
      "Susu Segar",
      "Jus Jeruk Fresh",
      "Yogurt Buah",
    ],
    "VVIP": [
      "Nasi Liwet Komplit Premium",
      "Bubur Ayam Abalone",
      "Eggs Benedict",
      "Smoked Salmon Bagel",
      "Croissant Almond Premium",
      "French Toast",
      "Pancake Blueberry",
      "Waffle Belgium",
      "Cappuccino Premium",
      "Latte Macchiato",
      "Fresh Orange Juice",
      "Smoothie Bowl",
      "Champagne Breakfast",
    ],
  },
  "Siang": {
    "PERTA": [
      "Nasi Box Ayam Goreng",
      "Nasi Box Ayam Bakar",
      "Nasi Goreng",
      "Mie Goreng",
      "Nasi Putih + Lauk",
      "Sayur Asem",
      "Capcay",
      "Air Mineral",
      "Teh Botol",
      "Es Teh",
    ],
    "Regular": [
      "Nasi Box Ayam Goreng",
      "Nasi Box Ayam Bakar",
      "Nasi Goreng",
      "Mie Goreng",
      "Nasi Putih + Lauk",
      "Sayur Asem",
      "Capcay",
      "Air Mineral",
      "Teh Botol",
      "Es Teh",
    ],
    "Standar": [
      "Nasi Box Ayam Goreng",
      "Nasi Box Ayam Bakar",
      "Nasi Goreng",
      "Mie Goreng",
      "Nasi Putih + Lauk",
      "Sayur Asem",
      "Capcay",
      "Air Mineral",
      "Teh Botol",
      "Es Teh",
    ],
    "VIP": [
      "Nasi Box Ayam Goreng Bumbu Rujak",
      "Nasi Box Rendang Sapi",
      "Nasi Box Ikan Bakar",
      "Nasi Goreng Seafood",
      "Mie Goreng Spesial",
      "Sop Iga Sapi",
      "Ayam Geprek Sambal Matah",
      "Jus Buah Segar",
      "Es Kelapa Muda",
      "Soft Drink",
    ],
    "VVIP": [
      "Nasi Box Wagyu Teriyaki",
      "Nasi Box Salmon Teriyaki",
      "Nasi Box Tenderloin Steak",
      "Nasi Goreng Lobster",
      "Spaghetti Aglio Olio Premium",
      "Grilled Chicken Premium",
      "Seafood Pasta",
      "Caesar Salad",
      "Mineral Water Premium",
      "Fresh Fruit Juice",
      "Iced Lemon Tea",
      "Dessert (Tiramisu/Panna Cotta)",
    ],
  },
  "Sore": {
    "PERTA": [
      "Kue Lapis",
      "Risoles",
      "Lemper",
      "Pastel",
      "Pisang Goreng",
      "Tahu Isi",
      "Kopi",
      "Teh",
      "Air Mineral",
    ],
    "Regular": [
      "Kue Lapis",
      "Risoles",
      "Lemper",
      "Pastel",
      "Pisang Goreng",
      "Tahu Isi",
      "Kopi",
      "Teh",
      "Air Mineral",
    ],
    "Standar": [
      "Kue Lapis",
      "Risoles",
      "Lemper",
      "Pastel",
      "Pisang Goreng",
      "Tahu Isi",
      "Kopi",
      "Teh",
      "Air Mineral",
    ],
    "VIP": [
      "Kue Lapis Legit",
      "Risoles Mayo",
      "Lemper Ayam Premium",
      "Pastel Tutup",
      "Kue Cubit Premium",
      "Martabak Mini Coklat Keju",
      "Bika Ambon",
      "Kopi Latte",
      "Thai Tea",
      "Jus Buah",
    ],
    "VVIP": [
      "Petit Fours Assorted",
      "French Macaron",
      "Chocolate Eclair",
      "Red Velvet Cake",
      "Tiramisu Cup",
      "Cheese Cake",
      "Fruit Tart",
      "Espresso Premium",
      "Cappuccino",
      "Smoothie",
      "Sparkling Water",
    ],
  },
  "Malam": {
    "PERTA": [
      "Nasi Box Ayam",
      "Nasi Liwet",
      "Soto Ayam",
      "Gado-Gado",
      "Pecel",
      "Bakso",
      "Air Mineral",
      "Teh Panas",
      "Kopi",
    ],
    "Regular": [
      "Nasi Box Ayam",
      "Nasi Liwet",
      "Soto Ayam",
      "Gado-Gado",
      "Pecel",
      "Bakso",
      "Air Mineral",
      "Teh Panas",
      "Kopi",
    ],
    "Standar": [
      "Nasi Box Ayam",
      "Nasi Liwet",
      "Soto Ayam",
      "Gado-Gado",
      "Pecel",
      "Bakso",
      "Air Mineral",
      "Teh Panas",
      "Kopi",
    ],
    "VIP": [
      "Nasi Box Premium Ayam Bakar",
      "Nasi Timbel Komplit",
      "Soto Betawi",
      "Rawon Daging",
      "Nasi Bakar Ayam Sisit",
      "Mie Ayam Spesial",
      "Bakso Urat Premium",
      "Soft Drink",
      "Jus Alpukat",
      "Es Kelapa Muda",
    ],
    "VVIP": [
      "Nasi Box Wagyu Premium",
      "Nasi Timbel Iga Bakar Premium",
      "Beef Wellington",
      "Grilled Salmon Premium",
      "Lamb Chop",
      "Seafood Platter",
      "Sushi & Sashimi Set",
      "Premium Dessert",
      "Wine Selection",
      "Mineral Water Premium",
      "Fresh Juice Bar",
    ],
  },
};

// Data tipe tamu dengan multiplier porsi
const tamuMultiplier = {
  "PERTA": 1,
  "Regular": 1,
  "Standar": 1,
  "VIP": 1.5,
  "VVIP": 2,
};

export default function KonsumsiPage() {
  // Get user from auth context
  const { user } = useAuth();
  
  // Initialize with today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const minDate = getTodayDate();

  // State untuk order (loaded from API)
  const [orders, setOrders] = useState<Order[]>([]);

  

  
  const [showForm, setShowForm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  
  // State untuk Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Normalisasi & konstanta status agar sinkron di semua tempat
  type CanonicalStatus = "Semua" | "Dipesan" | "Pesanan Disetujui" | "Pesanan Dibatalkan";
  const STATUS = React.useMemo(() => ({
    ALL: "Semua",
    ORDERED: "Dipesan",
    APPROVED: "Pesanan Disetujui",
    CANCELLED: "Pesanan Dibatalkan",
  } as const), []);

  const normalizeStatus = React.useCallback((s: string): CanonicalStatus => {
    const t = (s || "").trim().toLowerCase();
    if (["menunggu konfirmasi", "menunggu persetujuan", "pending", "menunggu", "dipesan"].includes(t)) return STATUS.ORDERED;
    if (["disetujui", "dikonfirmasi", "confirmed", "approved", "pesanan disetujui"].includes(t)) return STATUS.APPROVED;
    if (["dibatalkan", "pesanan dibatalkan", "cancelled", "batal"].includes(t)) return STATUS.CANCELLED;
    return s as CanonicalStatus;
  }, [STATUS]);

  // Load orders from database (set status kanonik saat load)
  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/konsumsi/orders', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data.orders)) {
          setOrders(data.orders.map((o: Record<string, unknown>) => {
            // Transform items to menu format for frontend compatibility
            const menu = o.items ? (o.items as Array<Record<string, unknown>>).map((item: Record<string, unknown>) => ({
              label: `${item.name} @ ${item.qty} ${item.satuan}`
            })) : (o.menu || [])
            
            return {
              ...o,
              menu,
              items: o.items,
              tanggalPengajuan: o.tanggal_pengajuan || o.tanggalPengajuan || '',
              tanggalPengiriman: o.tanggal_pengiriman || o.tanggalPengiriman || '',
              kegiatan: o.kegiatan || '',
              tamu: o.tamu || '',
              jumlahTamu: o.jumlah_tamu || o.jumlahTamu || 0,
              bagian: o.bagian || '',
              pengaju: o.pengaju || '',
              status: normalizeStatus(o.status as string)
            }
          }))
        }
      } catch (e) {
        console.error('Failed to load orders', e)
      }
    }
    load()
  }, [normalizeStatus])
  
  // State untuk Toast Notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const guestTypeOptions = React.useMemo(() => ([
    { label: "PERTA", value: "PERTA" },
    { label: "Regular", value: "Regular" },
    { label: "Standar", value: "Standar" },
    { label: "VIP", value: "VIP" },
    { label: "VVIP", value: "VVIP" },
  ]), []);
  const lokasiOptions = React.useMemo(() => ([
    "Bagging",
    "CCB Club House",
    "Departemen Riset",
    "Gedung 101-K",
    "Gedung Anggrek",
    "Gedung Bidding Center",
    "Gedung Contraction Office",
    "Gedung K3",
    "Gedung LC",
    "Gedung Maintenance Office",
    "Gedung Mawar",
    "Gedung Melati",
    "Gedung Purna Bhakti",
    "Gedung Pusat Administrasi",
    "Gedung RPK",
    "Gedung Saorga",
    "GH-B",
    "GH-C",
    "GPA Lt-3",
    "Gudang Bahan Baku",
    "Gudang Bulk Material",
    "Gudang Suku Cadang Jakarta",
    "Kantor SP2K",
    "Kebon Bibit",
    "Klinik PT HPH",
    "Kolam Pancing Type B",
    "Kolam Renang",
    "Kujang Kampioen Riset",
    "Laboraturium / Main Lab",
    "Lapang Basket Type B",
    "Lapang Futsal",
    "Lapang Sepak Bola Type E",
    "Lapang Tenis Type B",
    "Lapang Volly Type E",
    "Lapangan Helipad",
    "Lapangan Panahan",
    "Lapangan Volley",
    "Mekanik K1A",
    "Mekanik K1B",
    "Not Defined",
    "NPK-2",
    "Pos Selatan 01",
    "Posko Pengamanan Bawah",
    "Ruang Rapat NPK-1",
    "Ruang Rapat NPK-2",
    "Utility K-1A"
  ].map(l => ({ label: l, value: l }))), []);
  const waktuOptions = React.useMemo(() => ([
    "Sahur",
    "Pagi",
    "Siang",
    "Sore",
    "Buka puasa",
    "Malam",
    "Snack malam",
    "Tengah Malam"
  ].map(w => ({ label: w, value: w }))), []);
  const kegiatanOptions = React.useMemo(() => ([
    "Bahan Minum Karyawan",
    "Baporkes",
    "BK3N",
    "Extra Fooding",
    "Extra Fooding Shift",
    "Extra Fooding SKJ",
    "Festival Inovasi",
    "Halal bil Halal",
    "Hari Guru",
    "Hari Raya Idul Adha",
    "Hari Raya Idul Fitri",
    "HUT PKC",
    "HUT RI",
    "Jamuan di Luar Kawasan",
    "Jamuan Tamu Perusahaan",
    "Jum'at Bersih",
    "Ketupat Lebaran",
    "Konsumsi Buka Puasa",
    "Konsumsi Makan Sahur",
    "Konsumsi TA",
    "Lain-lain Jamuan Tamu",
    "Lain-lain Perayaan",
    "Lain-lain Rapat Kantor",
    "Lembur Perta",
    "Lembur Rutin",
    "Lembur Shutdown",
    "Not Defined",
    "Nuzulul Quran",
    "Open Storage",
    "Pengajian Keliling",
    "Pengantongan Akhir Tahun",
    "Pengembangan SDM",
    "PKM Masjid Nahrul Hayat",
    "Program AKHLAK",
    "Program Makmur",
    "Program WMS",
    "Proper Emas",
    "Proyek Replacement K1A & NZE",
    "Rakor Direksi Anper PI Grup",
    "Rapat Direksi",
    "Rapat Distribusi B",
    "Rapat Distribusi D",
    "Rapat Gabungan Dekom, Direksi, SVP",
    "Rapat Internal",
    "Rapat Komite Audit",
    "Rapat LKS Bipartit",
    "Rapat Monitoring Anper PKC",
    "Rapat Pra RUPS",
    "Rapat Tamu",
    "Rumah Tahfidz",
    "Safari Malam Takbiran",
    "Safari Ramadhan",
    "Shutdown Pabrik",
    "SP2K",
    "Srikandi PKC",
    "Tabligh Akbar",
    "Washing Pabrik"
  ].map(k => ({ label: k, value: k }))), []);
  
  const [form, setForm] = useState({
    kegiatan: "",
    tanggalPermintaan: selectedDate,
    tanggalPengiriman: selectedDate,
    untukBagian: "",
    yangMengajukan: "",
    approval: "",
    tamu: "",
    jumlahTamu: 0,
    lokasi: "",
    waktu: "",
    keterangan: "",
  });
  const [menuItems, setMenuItems] = useState([
    { id: 1, jenis: "", satuan: "", qty: 0 }
  ]);
  const [errors, setErrors] = useState({
    kegiatan: "",
    tanggalPermintaan: "",
    tanggalPengiriman: "",
    untukBagian: "",
    yangMengajukan: "",
    approval: "",
    tamu: "",
    jumlahTamu: "",
    lokasi: "",
    waktu: "",
  });
  
  // Get available menu based on selected time AND guest type
  // Map waktu to database timePeriod
  const mapWaktuToTimePeriod = (waktu: string): 'PAGI' | 'SIANG' | 'SORE' | 'MALAM' => {
    const waktuLower = waktu.toLowerCase();
    if (waktuLower.includes('sahur') || waktuLower.includes('pagi')) {
      return 'PAGI';
    } else if (waktuLower.includes('siang')) {
      return 'SIANG';
    } else if (waktuLower.includes('sore') || waktuLower.includes('buka')) {
      return 'SORE';
    } else {
      return 'MALAM';
    }
  };

  // Check if form is valid and complete
  const isFormValid = (): boolean => {
    // Check all required fields
    if (!form.kegiatan || !form.tanggalPermintaan || !form.tanggalPengiriman || 
        !form.untukBagian.trim() || !form.yangMengajukan.trim() || !form.approval.trim() || 
        !form.tamu || !form.jumlahTamu || form.jumlahTamu <= 0 || 
        !form.lokasi || !form.waktu) {
      return false;
    }
    
    // Check if at least one valid menu item exists
    const validMenuItems = menuItems.filter(item => item.jenis && item.satuan && item.qty > 0);
    if (validMenuItems.length === 0) {
      return false;
    }
    
    return true;
  };

  const getAvailableMenu = (): string[] => {
    if (!form.waktu || !form.tamu) return [];
    
    // Parse waktu format sederhana: "Sahur", "Pagi", "Siang", "Sore", "Buka puasa", "Malam", "Snack malam", "Tengah Malam"
    let period: "Pagi" | "Siang" | "Sore" | "Malam" = "Pagi";
    
    const waktuLower = form.waktu.toLowerCase();
    
    // Mapping waktu ke periode menu
    if (waktuLower.includes("sahur") || waktuLower.includes("pagi")) {
      period = "Pagi";
    } else if (waktuLower.includes("siang")) {
      period = "Siang";
    } else if (waktuLower.includes("sore") || waktuLower.includes("buka")) {
      period = "Sore";
    } else if (waktuLower.includes("malam") || waktuLower.includes("tengah")) {
      period = "Malam";
    }
    
    const guestType = form.tamu as "PERTA" | "Regular" | "Standar" | "VIP" | "VVIP";
    
    const timeMenu = menuByTimeAndGuest[period];
    if (!timeMenu) return [];
    
    return timeMenu[guestType] || [];
  };

  const validateForm = () => {
    const newErrors = {
      kegiatan: "",
      tanggalPermintaan: "",
      tanggalPengiriman: "",
      untukBagian: "",
      yangMengajukan: "",
      approval: "",
      tamu: "",
      jumlahTamu: "",
      lokasi: "",
      waktu: "",
    };
    let isValid = true;

    if (!form.kegiatan) {
      newErrors.kegiatan = "Kegiatan / Event wajib diisi";
      isValid = false;
    }
    if (!form.tanggalPermintaan) {
      newErrors.tanggalPermintaan = "Tanggal permintaan wajib diisi";
      isValid = false;
    } else if (form.tanggalPermintaan < minDate) {
      newErrors.tanggalPermintaan = "Tanggal permintaan tidak boleh terlewat dari hari ini";
      isValid = false;
    }
    if (!form.tanggalPengiriman) {
      newErrors.tanggalPengiriman = "Tanggal pengiriman wajib diisi";
      isValid = false;
    } else if (form.tanggalPengiriman < minDate) {
      newErrors.tanggalPengiriman = "Tanggal pengiriman tidak boleh terlewat dari hari ini";
      isValid = false;
    }
    if (!form.untukBagian.trim()) {
      newErrors.untukBagian = "Untuk Bagian wajib diisi";
      isValid = false;
    }
    if (!form.yangMengajukan.trim()) {
      newErrors.yangMengajukan = "Yang Mengajukan wajib diisi";
      isValid = false;
    }
    if (!form.approval.trim()) {
      newErrors.approval = "Approval wajib dipilih";
      isValid = false;
    }
    if (!form.tamu) {
      newErrors.tamu = "Tamu wajib diisi";
      isValid = false;
    }
    if (!form.jumlahTamu || form.jumlahTamu <= 0) {
      newErrors.jumlahTamu = "Jumlah tamu wajib diisi dan lebih dari 0";
      isValid = false;
    }
    if (!form.lokasi) {
      newErrors.lokasi = "Lokasi pengiriman wajib diisi";
      isValid = false;
    }
    if (!form.waktu) {
      newErrors.waktu = "Waktu wajib diisi";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const validMenu = menuItems.filter(item => item.jenis && item.satuan && item.qty > 0);
    if (validMenu.length === 0) {
      alert("Harap tambahkan minimal 1 menu konsumsi!");
      return;
    }

    if (isEditMode && editOrderId) {
      // For now local edit only (could implement PATCH later)
      setOrders(orders.map(order => order.id === editOrderId ? {
        ...order,
        tanggalPengajuan: form.tanggalPermintaan.split("-").reverse().join("-"),
        tanggalPengiriman: form.tanggalPengiriman.split("-").reverse().join("-"),
        kegiatan: form.kegiatan,
        tamu: form.tamu,
        jumlahTamu: form.jumlahTamu,
        bagian: form.untukBagian,
        pengaju: form.yangMengajukan,
        menu: validMenu.map(m => ({ label: `${m.jenis} @ ${m.qty} ${m.satuan}` })),
        status: "Menunggu konfirmasi",
        approval: form.approval,
        lokasi: form.lokasi,
        waktu: form.waktu,
        keterangan: form.keterangan,
      } : order));
      showToastNotification("Order berhasil diupdate!", "success");
    } else {
      try {
        // Check if user is logged in
        if (!user || !user.id) {
          console.error('User not logged in:', user);
          showToastNotification("Anda harus login terlebih dahulu!", "error");
          return;
        }

        const timePeriod = mapWaktuToTimePeriod(form.waktu);
        const payload = {
          userId: user.id,
          items: validMenu.map(m => ({
            name: m.jenis,
            qty: m.qty,
            satuan: m.satuan,
            timePeriod: timePeriod
          })),
          kegiatan: form.kegiatan,
          tamu: form.tamu,
          jumlahTamu: Number(form.jumlahTamu),
          bagian: form.untukBagian,
          pengaju: form.yangMengajukan,
          tanggalPengajuan: form.tanggalPermintaan,
          tanggalPengiriman: form.tanggalPengiriman
        };
        
        console.log('Sending order payload:', payload);
        
        const res = await fetch('/api/konsumsi/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Gagal menyimpan order');
        }
        const data = await res.json();
        console.log('API Response:', data);
        
        if (data.order) {
          // Transform order from API to frontend format
          const transformedOrder = {
            ...data.order,
            menu: data.order.items ? data.order.items.map((item: Record<string, unknown>) => ({
              label: `${item.name} @ ${item.qty} ${item.satuan}`
            })) : [],
            tanggalPengajuan: data.order.tanggal_pengajuan || data.order.tanggalPengajuan || form.tanggalPermintaan,
            tanggalPengiriman: data.order.tanggal_pengiriman || data.order.tanggalPengiriman || form.tanggalPengiriman,
            kegiatan: data.order.kegiatan || form.kegiatan,
            tamu: data.order.tamu || form.tamu,
            jumlahTamu: data.order.jumlah_tamu || data.order.jumlahTamu || form.jumlahTamu,
            bagian: data.order.bagian || form.untukBagian,
            pengaju: data.order.pengaju || form.yangMengajukan
          };
          
          setOrders(prev => [transformedOrder, ...prev]);
          showToastNotification("Order berhasil ditambahkan!", "success");
        } else {
          console.error('No order in response:', data);
          showToastNotification("Order tersimpan tapi response tidak lengkap", "info");
        }
      } catch (err) {
        console.error('Error saving order:', err);
        showToastNotification(err instanceof Error ? err.message : "Terjadi kesalahan menyimpan order", "error");
        return;
      }
    }

    setShowForm(false);
    setIsEditMode(false);
    setEditOrderId(null);
    setForm({
      kegiatan: "",
      tanggalPermintaan: selectedDate,
      tanggalPengiriman: selectedDate,
      untukBagian: "",
      yangMengajukan: "",
      approval: "",
      tamu: "",
      jumlahTamu: 0,
      lokasi: "",
      waktu: "",
      keterangan: "",
    });
    setMenuItems([{ id: 1, jenis: "", satuan: "", qty: 0 }]);
  };

  const handleEditOrder = (order: Order) => {
    // Parse menu items from order
    const parsedMenuItems = (order.menu || []).map((m, idx) => {
      const parts = m.label.split(" @ ");
      if (parts.length === 2) {
        const jenis = parts[0];
        const qtyAndSatuan = parts[1].split(" ");
        const qty = parseInt(qtyAndSatuan[0]) || 0;
        const satuan = qtyAndSatuan.slice(1).join(" ");
        return { id: idx + 1, jenis, satuan, qty };
      }
      return { id: idx + 1, jenis: "", satuan: "", qty: 0 };
    });

    // Convert date format from DD-MM-YYYY to YYYY-MM-DD
    const convertDate = (dateStr: string) => {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    };

    setForm({
      kegiatan: order.kegiatan,
      tanggalPermintaan: convertDate(order.tanggalPengajuan),
      tanggalPengiriman: convertDate(order.tanggalPengiriman),
      untukBagian: order.bagian,
      yangMengajukan: order.pengaju,
      approval: order.approval || "",
      tamu: order.tamu,
      jumlahTamu: order.jumlahTamu || 0,
      lokasi: order.lokasi || "",
      waktu: order.waktu || "",
      keterangan: order.keterangan || "",
    });
    setMenuItems(parsedMenuItems.length > 0 ? parsedMenuItems : [{ id: 1, jenis: "", satuan: "", qty: 0 }]);
    setIsEditMode(true);
    setEditOrderId(order.id);
    setShowForm(true);
  };

  // Function untuk menampilkan toast notification
  const showToastNotification = (message: string, type: "success" | "error" | "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Function untuk filter orders
  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.pengaju.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.bagian.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status (gunakan status yang sudah dinormalisasi)
    if (filterStatus !== STATUS.ALL) {
      filtered = filtered.filter(order => normalizeStatus(order.status) === filterStatus);
    }

    // Filter by date range
    if (filterDateFrom) {
      filtered = filtered.filter(order => {
        const orderDate = order.tanggalPengajuan.split("-").reverse().join("-");
        return orderDate >= filterDateFrom;
      });
    }
    if (filterDateTo) {
      filtered = filtered.filter(order => {
        const orderDate = order.tanggalPengajuan.split("-").reverse().join("-");
        return orderDate <= filterDateTo;
      });
    }

    return filtered;
  };

  // Get paginated orders
  const getPaginatedOrders = () => {
    const filtered = getFilteredOrders();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filtered.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Calculate total pages
  const totalPages = Math.ceil(getFilteredOrders().length / itemsPerPage);
  
  // Calculate display range
  const totalFilteredItems = getFilteredOrders().length;
  const startItem = totalFilteredItems === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalFilteredItems);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterDateFrom, filterDateTo]);

  // Calculate statistics (berdasarkan status yang dinormalisasi)
  const statistics = {
    total: orders.length,
    pending: orders.filter(o => normalizeStatus(o.status) === STATUS.ORDERED).length,
    approved: orders.filter(o => normalizeStatus(o.status) === STATUS.APPROVED).length,
    cancelled: orders.filter(o => normalizeStatus(o.status) === STATUS.CANCELLED).length,
  };

  const handleCancelOrder = () => {
    if (orderToCancel) {
      setOrders(orders.map(o => 
        o.id === orderToCancel 
          ? { ...o, status: STATUS.CANCELLED } 
          : o
      ));
      showToastNotification("Order berhasil dibatalkan", "info");
      setShowCancelConfirm(false);
      setOrderToCancel(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 min-h-screen transition-colors duration-300">
      <div className="p-6">
        {/* Header with gradient background */}
        <div className="relative mb-6 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 rounded-2xl p-6 shadow-2xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
          
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <Image
                  src="/logo.png"
                  alt="Ikon Konsumsi"
                  className="w-12 h-12 object-contain"
                  width={48}
                  height={48}
                  priority
                />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Konsumsi</h1>
                <p className="text-purple-100 text-base mt-1 font-medium">Kelola permintaan konsumsi dengan mudah</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="group relative flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-5 py-3 rounded-xl font-semibold text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                onClick={() => setShowCalendar(true)}
                suppressHydrationWarning
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </div>
                <Calendar className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{selectedDate.split("-").reverse().join("-")}</span>
              </button>
              <button
                className="group relative flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                onClick={() => setShowForm(true)}
                suppressHydrationWarning
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-200/50 to-transparent"></div>
                </div>
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Tambah Order</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics - Enhanced Purple Theme */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Order Card */}
          <div className="group relative bg-gradient-to-br from-purple-600 via-purple-600 to-violet-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            </div>
            <div className="relative flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Total Order</p>
                <h3 className="text-3xl font-extrabold">{statistics.total}</h3>
                <div className="flex items-center gap-1 text-xs text-purple-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  <span>Semua pesanan</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mb-12 blur-xl"></div>
          </div>

          {/* Dipesan Card */}
          <div className="group relative bg-gradient-to-br from-violet-500 via-violet-600 to-purple-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            </div>
            <div className="relative flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-violet-100 text-xs font-bold uppercase tracking-wider">Dipesan</p>
                <h3 className="text-3xl font-extrabold">{statistics.pending}</h3>
                <div className="flex items-center gap-1 text-xs text-violet-200">
                  <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Menunggu konfirmasi</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mb-12 blur-xl"></div>
          </div>

          {/* Pesanan Disetujui Card */}
          <div className="group relative bg-gradient-to-br from-purple-600 via-purple-700 to-violet-700 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            </div>
            <div className="relative flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Disetujui</p>
                <h3 className="text-3xl font-extrabold">{statistics.approved}</h3>
                <div className="flex items-center gap-1 text-xs text-purple-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Siap diproses</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mb-12 blur-xl"></div>
          </div>

          {/* Pesanan Dibatalkan Card */}
          <div className="group relative bg-gradient-to-br from-violet-600 via-violet-700 to-purple-700 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            </div>
            <div className="relative flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-violet-100 text-xs font-bold uppercase tracking-wider">Dibatalkan</p>
                <h3 className="text-3xl font-extrabold">{statistics.cancelled}</h3>
                <div className="flex items-center gap-1 text-xs text-violet-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Order dibatalkan</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mb-12 blur-xl"></div>
          </div>
        </div>

        {/* Search & Filter Bar - Enhanced Purple */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-purple-100 dark:border-purple-900 p-5 mb-6 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-purple-700 dark:text-purple-300 mb-2 uppercase tracking-wider">Cari Order</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="ID, Kegiatan, Pengaju..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm bg-purple-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-purple-300"
                  suppressHydrationWarning
                />
                <svg className="w-5 h-5 text-purple-500 absolute left-3 top-3.5 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-700 dark:text-purple-300 mb-2 uppercase tracking-wider">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm bg-purple-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 font-medium hover:border-purple-300"
                suppressHydrationWarning
              >
                <option value={STATUS.ALL}>Semua Status</option>
                <option value={STATUS.ORDERED}>Dipesan</option>
                <option value={STATUS.APPROVED}>Pesanan Disetujui</option>
                <option value={STATUS.CANCELLED}>Pesanan Dibatalkan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-700 dark:text-purple-300 mb-2 uppercase tracking-wider">Dari Tanggal</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm bg-purple-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 hover:border-purple-300"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-700 dark:text-purple-300 mb-2 uppercase tracking-wider">Sampai Tanggal</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm bg-purple-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 hover:border-purple-300"
                suppressHydrationWarning
              />
            </div>
          </div>

          {(searchQuery || filterStatus !== "Semua" || filterDateFrom || filterDateTo) && (
            <div className="mt-4 flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Menampilkan <span className="font-extrabold text-purple-700 dark:text-purple-400 text-lg">{getFilteredOrders().length}</span> dari <span className="font-bold text-purple-600 dark:text-purple-500">{orders.length}</span> order
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("Semua");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}
                className="text-sm text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Calendar Popup */}
        {showCalendar && (
          <div 
            className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 transition-all duration-300"
            onClick={() => setShowCalendar(false)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-80 animate-in zoom-in-50 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pilih Tanggal</h3>
              <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">ℹ️ Catatan:</p>
                <p className="text-xs text-violet-600 dark:text-violet-200 mt-1">Anda hanya dapat memilih tanggal hari ini atau kemudian. Tanggal yang sudah terlewat tidak dapat dipilih.</p>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              />
              <button
                onClick={() => setShowCalendar(false)}
                className="w-full mt-4 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium transform hover:scale-105"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Cancel Order Confirmation Popup */}
        {showCancelConfirm && (
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 transition-all duration-300"
            onClick={() => setShowCancelConfirm(false)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-full max-w-md animate-in zoom-in-50 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center transition-colors duration-300">
                  <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Konfirmasi Pembatalan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Apakah Anda yakin ingin membatalkan order ini?</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4 transition-colors duration-300">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Order ID:</span> {orderToCancel}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Order yang sudah dibatalkan tidak dapat dikembalikan.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                  suppressHydrationWarning
                >
                  Tidak, Kembali
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  suppressHydrationWarning
                >
                  Ya, Batalkan Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Order Modal */}
        {showDetailModal && selectedOrder && (
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 transition-all duration-300"
            onClick={() => setShowDetailModal(false)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl animate-in zoom-in-50 duration-300 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-violet-500 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Detail Order</h3>
                  <p className="text-sm text-purple-100 mt-1">{selectedOrder.id}</p>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
                  suppressHydrationWarning
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status Order:</span>
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${
                    normalizeStatus(selectedOrder.status) === STATUS.CANCELLED
                      ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white"
                      : normalizeStatus(selectedOrder.status) === STATUS.ORDERED
                      ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white"
                      : normalizeStatus(selectedOrder.status) === STATUS.APPROVED
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                  }`}>
                    {normalizeStatus(selectedOrder.status)}
                  </span>
                </div>

                {/* Tanggal */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500 dark:border-purple-400">
                    <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase mb-1">Tanggal Pengajuan</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-300">{selectedOrder.tanggalPengajuan}</p>
                  </div>
                  <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 border-l-4 border-violet-500 dark:border-violet-400">
                    <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 uppercase mb-1">Tanggal Pengiriman</p>
                    <p className="text-lg font-bold text-violet-900 dark:text-violet-300">{selectedOrder.tanggalPengiriman}</p>
                  </div>
                </div>

                {/* Informasi Kegiatan */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-5 border border-purple-200 dark:border-purple-700">
                  <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300 uppercase mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Informasi Kegiatan
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 w-32">Kegiatan:</span>
                      <span className="text-sm text-purple-900 dark:text-purple-200 font-medium flex-1">{selectedOrder.kegiatan}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 w-32">Tamu:</span>
                      <span className="text-sm text-purple-900 dark:text-purple-200">{selectedOrder.tamu}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 w-32">Bagian:</span>
                      <span className="text-sm text-purple-900 dark:text-purple-200">{selectedOrder.bagian}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 w-32">Pengaju:</span>
                      <span className="text-sm text-purple-900 dark:text-purple-200">{selectedOrder.pengaju}</span>
                    </div>
                  </div>
                </div>

                {/* Menu */}
                <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 rounded-lg p-5 border border-violet-200 dark:border-violet-700">
                  <h4 className="text-sm font-bold text-violet-900 dark:text-violet-300 uppercase mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Daftar Menu
                  </h4>
                  <div className="space-y-2">
                    {(selectedOrder.menu || []).map((m, i) => (
                      <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm" key={i}>
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 text-white text-sm font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-violet-900 dark:text-violet-200 flex-1">{m.label}</span>
                        {m.price && (
                          <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{m.price}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 transition-all shadow-md hover:shadow-lg"
                  suppressHydrationWarning
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Order Form */}
        {showForm && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForm(false)
            }}
          >
            <div className="animate-in zoom-in-50 duration-200 w-full max-w-3xl">
              <form onSubmit={handleAddOrder} className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl relative max-h-[90vh] flex flex-col">
                {/* Header - Sticky */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-violet-500 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">{isEditMode ? "Edit Order" : "Tambah Order"}</h2>
                    <p className="text-xs text-purple-100 mt-1">{isEditMode ? "Perbarui data order" : "Isi formulir di bawah ini"}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Content - Scrollable */}
                <div className="overflow-y-auto px-6 py-6 space-y-5">

                  {/* Information Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">📋 Informasi Order</h3>
                      <p className="text-xs text-purple-700 dark:text-purple-400">Order akan dieksekusi sesuai tanggal dan waktu yang dipilih. Pastikan semua data sudah benar.</p>
                    </div>
                    <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-violet-900 dark:text-violet-300 mb-2">⚠️ Informasi Transaksi</h3>
                      <p className="text-xs text-violet-700 dark:text-violet-400">Order memerlukan approval dari atasan sebelum diproses oleh tim konsumsi.</p>
                    </div>
                  </div>

                  {/* Tanggal Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-600 dark:border-purple-500 rounded-lg p-4">
                      <label className="block text-sm font-bold text-purple-900 dark:text-purple-300 uppercase mb-2">
                        Tanggal Pengajuan
                      </label>
                      <input 
                        type="date"
                        name="tanggalPermintaan" 
                        value={form.tanggalPermintaan} 
                        onChange={(e) => {
                          setForm({ ...form, tanggalPermintaan: e.target.value });
                          if (errors.tanggalPermintaan) {
                            setErrors({ ...errors, tanggalPermintaan: "" });
                          }
                        }}
                        min={minDate}
                        className={`w-full border-0 bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm font-semibold text-purple-900 dark:text-purple-300 focus:ring-2 focus:ring-purple-500 outline-none ${
                          errors.tanggalPermintaan ? "ring-2 ring-red-500" : ""
                        }`}
                        suppressHydrationWarning
                      />
                      {errors.tanggalPermintaan && (
                        <p className="text-xs text-violet-700 dark:text-violet-400 mt-2 font-medium">{errors.tanggalPermintaan}</p>
                      )}
                    </div>

                    <div className="bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-600 dark:border-violet-500 rounded-lg p-4">
                      <label className="block text-sm font-bold text-violet-900 dark:text-violet-300 uppercase mb-2">
                        Tanggal Pengiriman
                      </label>
                      <input 
                        type="date"
                        name="tanggalPengiriman" 
                        value={form.tanggalPengiriman} 
                        onChange={(e) => {
                          setForm({ ...form, tanggalPengiriman: e.target.value });
                          if (errors.tanggalPengiriman) {
                            setErrors({ ...errors, tanggalPengiriman: "" });
                          }
                        }}
                        min={minDate}
                        className={`w-full border-0 bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm font-semibold text-violet-900 dark:text-violet-300 focus:ring-2 focus:ring-purple-500 outline-none ${
                          errors.tanggalPengiriman ? "ring-2 ring-red-500" : ""
                        }`}
                        suppressHydrationWarning
                      />
                      {errors.tanggalPengiriman && (
                        <p className="text-xs text-violet-700 dark:text-violet-400 mt-2 font-medium">{errors.tanggalPengiriman}</p>
                      )}
                    </div>
                  </div>

                  {/* Informasi Kegiatan Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-lg p-5">
                    <h3 className="text-sm font-bold text-purple-900 dark:text-purple-300 uppercase mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Informasi Kegiatan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Kegiatan: <span className="text-violet-600">*</span>
                        </label>
                        <SearchableCombobox
                          name="kegiatan"
                          value={form.kegiatan}
                          options={kegiatanOptions}
                          placeholder="Pilih / cari kegiatan..."
                          variant="purple"
                          onChange={(val) => {
                            setForm({ ...form, kegiatan: val });
                            if (errors.kegiatan) setErrors({ ...errors, kegiatan: "" });
                          }}
                          className={errors.kegiatan ? "ring-2 ring-red-500" : undefined}
                        />
                        {errors.kegiatan && (
                          <p className="text-xs text-violet-700 mt-1.5 font-medium">{errors.kegiatan}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Tipe Tamu: <span className="text-violet-600">*</span>
                        </label>
                        <SearchableCombobox
                          name="tamu"
                          value={form.tamu}
                          options={guestTypeOptions}
                          placeholder="Pilih atau ketik tipe tamu..."
                          variant="purple"
                          onChange={(newTamu) => {
                            setForm({ ...form, tamu: newTamu });
                            if (errors.tamu) setErrors({ ...errors, tamu: "" });

                            // Update qty berdasarkan tipe tamu dan jumlah tamu
                            if (form.jumlahTamu > 0 && newTamu) {
                              const multiplier = tamuMultiplier[newTamu as keyof typeof tamuMultiplier] || 1;
                              const updatedMenuItems = menuItems.map(item => ({
                                ...item,
                                qty: Math.ceil(form.jumlahTamu * multiplier)
                              }));
                              setMenuItems(updatedMenuItems);
                            }

                            // Reset menu saat tipe tamu berubah (menu berbeda tiap tipe)
                            if (form.waktu) {
                              setMenuItems([{ id: 1, jenis: "", satuan: "", qty: form.jumlahTamu > 0 && newTamu ? Math.ceil(form.jumlahTamu * (tamuMultiplier[newTamu as keyof typeof tamuMultiplier] || 1)) : 0 }]);
                            }
                          }}
                          className={errors.tamu ? "ring-2 ring-red-500" : undefined}
                        />
                        {errors.tamu && (
                          <p className="text-xs text-violet-700 dark:text-violet-400 mt-1.5 font-medium">{errors.tamu}</p>
                        )}
                        {form.tamu && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1.5 font-medium">
                            {(form.tamu === "PERTA" || form.tamu === "Regular" || form.tamu === "Standar") && "💼 Menu: Standard berkualitas untuk acara internal"}
                            {form.tamu === "VIP" && "⭐ Menu: Premium dengan bahan pilihan (Porsi 1.5x)"}
                            {form.tamu === "VVIP" && "👑 Menu: Exclusive dengan bahan premium & mahal (Porsi 2x)"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Jumlah Tamu: <span className="text-violet-600">*</span>
                        </label>
                        <input 
                          type="number"
                          name="jumlahTamu" 
                          value={form.jumlahTamu || ""} 
                          onChange={(e) => {
                            const jumlah = parseInt(e.target.value) || 0;
                            setForm({ ...form, jumlahTamu: jumlah });
                            if (errors.jumlahTamu) {
                              setErrors({ ...errors, jumlahTamu: "" });
                            }
                            
                            // Auto-update qty in menu items based on jumlah tamu and tipe tamu
                            if (jumlah > 0 && form.tamu) {
                              const multiplier = tamuMultiplier[form.tamu as keyof typeof tamuMultiplier] || 1;
                              const updatedMenuItems = menuItems.map(item => ({
                                ...item,
                                qty: Math.ceil(jumlah * multiplier)
                              }));
                              setMenuItems(updatedMenuItems);
                            }
                          }}
                          placeholder="Contoh: 50"
                          min="1"
                          className={`w-full border-0 bg-white dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none ${
                            errors.jumlahTamu ? "ring-2 ring-red-500" : ""
                          }`}
                          suppressHydrationWarning
                        />
                        {errors.jumlahTamu && (
                          <p className="text-xs text-violet-700 dark:text-violet-400 mt-1.5 font-medium">{errors.jumlahTamu}</p>
                        )}
                        {form.jumlahTamu > 0 && form.tamu && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1.5 font-medium">
                            💡 Porsi otomatis: {Math.ceil(form.jumlahTamu * (tamuMultiplier[form.tamu as keyof typeof tamuMultiplier] || 1))} porsi
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Bagian: <span className="text-violet-600">*</span>
                        </label>
                        <input 
                          name="untukBagian" 
                          value={form.untukBagian} 
                          onChange={(e) => {
                            setForm({ ...form, untukBagian: e.target.value });
                            if (errors.untukBagian) {
                              setErrors({ ...errors, untukBagian: "" });
                            }
                          }}
                          placeholder="Dep. Teknologi Informasi PKC"
                          className={`w-full border-0 bg-white dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none ${
                            errors.untukBagian ? "ring-2 ring-red-500" : ""
                          }`}
                          suppressHydrationWarning
                        />
                        {errors.untukBagian && (
                          <p className="text-xs text-violet-700 dark:text-violet-400 mt-1.5 font-medium">{errors.untukBagian}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Pengaju: <span className="text-violet-600">*</span>
                        </label>
                        <input 
                          name="yangMengajukan" 
                          value={form.yangMengajukan} 
                          onChange={(e) => {
                            setForm({ ...form, yangMengajukan: e.target.value });
                            if (errors.yangMengajukan) {
                              setErrors({ ...errors, yangMengajukan: "" });
                            }
                          }}
                          placeholder="nama pengaju"
                          className={`w-full border-0 bg-white dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none ${
                            errors.yangMengajukan ? "ring-2 ring-red-500" : ""
                          }`}
                          suppressHydrationWarning
                        />
                        {errors.yangMengajukan && (
                          <p className="text-xs text-violet-700 dark:text-violet-400 mt-1.5 font-medium">{errors.yangMengajukan}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Approval: <span className="text-violet-600">*</span>
                        </label>
                        <input 
                          name="approval" 
                          value={form.approval} 
                          onChange={(e) => {
                            setForm({ ...form, approval: e.target.value });
                            if (errors.approval) {
                              setErrors({ ...errors, approval: "" });
                            }
                          }}
                          placeholder="Nama atasan yang menyetujui"
                          className={`w-full border-0 bg-white dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none ${
                            errors.approval ? "ring-2 ring-red-500" : ""
                          }`}
                          suppressHydrationWarning
                        />
                        {errors.approval && (
                          <p className="text-xs text-violet-700 dark:text-violet-400 mt-1.5 font-medium">{errors.approval}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Lokasi Pengiriman: <span className="text-violet-600">*</span>
                        </label>
                        <SearchableCombobox
                          name="lokasi"
                          value={form.lokasi}
                          options={lokasiOptions}
                          placeholder="Pilih / cari lokasi..."
                          variant="purple"
                          onChange={(val) => {
                            setForm({ ...form, lokasi: val });
                            if (errors.lokasi) setErrors({ ...errors, lokasi: "" });
                          }}
                          className={errors.lokasi ? "ring-2 ring-red-500" : undefined}
                        />
                        {errors.lokasi && (
                          <p className="text-xs text-violet-700 dark:text-violet-400 mt-1.5 font-medium">{errors.lokasi}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Waktu: <span className="text-violet-600">*</span>
                        </label>
                        <SearchableCombobox
                          name="waktu"
                          value={form.waktu}
                          options={waktuOptions}
                          placeholder="Pilih / cari waktu..."
                          variant="purple"
                          allowCustomValue={false}
                          onChange={(val) => {
                            setForm({ ...form, waktu: val });
                            if (errors.waktu) setErrors({ ...errors, waktu: "" });
                            // Reset menu items when time changes
                            setMenuItems([{ id: 1, jenis: "", satuan: "", qty: form.jumlahTamu > 0 && form.tamu ? Math.ceil(form.jumlahTamu * (tamuMultiplier[form.tamu as keyof typeof tamuMultiplier] || 1)) : 0 }]);
                          }}
                          className={errors.waktu ? "ring-2 ring-red-500" : undefined}
                        />
                        {errors.waktu && (
                          <p className="text-xs text-violet-700 dark:text-violet-400 mt-1.5 font-medium">{errors.waktu}</p>
                        )}
                        {form.waktu && !form.tamu && (
                          <p className="text-xs text-violet-600 dark:text-violet-400 mt-1.5 font-medium">
                            Pilih tipe tamu terlebih dahulu untuk melihat menu yang tersedia
                          </p>
                        )}
                        {form.waktu && form.tamu && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1.5 font-medium">
                            ℹ️ Menu <strong>{form.tamu}</strong>: {getAvailableMenu().slice(0, 4).join(", ")}
                            {getAvailableMenu().length > 4 ? `, dan ${getAvailableMenu().length - 4} lainnya` : ""}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Keterangan:
                        </label>
                        <textarea 
                          name="keterangan" 
                          value={form.keterangan} 
                          onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                          placeholder="Keterangan tambahan (opsional)"
                          rows={2}
                          className="w-full border-0 bg-white dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                          suppressHydrationWarning
                        />
                      </div>
                    </div>
                  </div>

                  {/* Menu Section */}
                  <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 border border-violet-200 dark:border-violet-700 rounded-lg p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-violet-900 dark:text-violet-300 uppercase flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Daftar Menu
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const baseQty = form.jumlahTamu > 0 && form.tamu ? Math.ceil(form.jumlahTamu * (tamuMultiplier[form.tamu as keyof typeof tamuMultiplier] || 1)) : 0;
                          setMenuItems([...menuItems, { id: Date.now(), jenis: '', satuan: '', qty: baseQty }]);
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-violet-500 text-white text-xs font-semibold rounded-lg hover:from-purple-700 hover:to-violet-600 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Menu
                      </button>
                    </div>

                    {/* Info Helper */}
                    {!form.waktu && (
                      <div className="mb-4 bg-violet-100 dark:bg-violet-900/30 border border-violet-300 dark:border-violet-700 rounded-lg p-3 flex items-start gap-2">
                        <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="text-xs text-violet-800 dark:text-violet-300">
                          <p className="font-bold mb-1">⏰ Pilih waktu terlebih dahulu!</p>
                          <p>Menu yang tersedia akan disesuaikan dengan waktu kegiatan (Pagi/Siang/Sore/Malam)</p>
                        </div>
                      </div>
                    )}
                    
                    {form.waktu && !form.tamu && (
                      <div className="mb-4 bg-violet-100 dark:bg-violet-900/30 border border-violet-300 dark:border-violet-700 rounded-lg p-3 flex items-start gap-2">
                        <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-xs text-violet-800 dark:text-violet-300">
                          <p className="font-bold mb-1">👥 Pilih tipe tamu terlebih dahulu!</p>
                          <p>Menu akan disesuaikan dengan tipe tamu:</p>
                          <ul className="mt-1 ml-4 list-disc">
                            <li><strong>Regular:</strong> Menu standard berkualitas</li>
                            <li><strong>VIP:</strong> Menu premium dengan bahan pilihan</li>
                            <li><strong>VVIP:</strong> Menu exclusive dengan bahan mahal (Wagyu, Salmon, Lobster, dll)</li>
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {form.waktu && form.tamu && !form.jumlahTamu && (
                      <div className="mb-4 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-lg p-3 flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-xs text-purple-800 dark:text-purple-300">
                          <p className="font-bold mb-1">🎯 Isi jumlah tamu untuk kalkulasi otomatis!</p>
                          <p>Qty akan otomatis dihitung: Jumlah Tamu × Multiplier ({form.tamu === "Regular" ? "1x" : form.tamu === "VIP" ? "1.5x" : "2x"})</p>
                        </div>
                      </div>
                    )}
                    
                    {form.waktu && form.tamu && form.jumlahTamu > 0 && (
                      <div className="mb-4 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-lg p-3 flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-xs text-purple-800 dark:text-purple-300">
                          <p className="font-bold mb-1">✨ Siap menambahkan menu!</p>
                          <p>Menu tersedia untuk <strong>{form.tamu}</strong> waktu <strong>{form.waktu}</strong>: {getAvailableMenu().slice(0, 3).join(", ")}
                          {getAvailableMenu().length > 3 ? `, dan ${getAvailableMenu().length - 3} menu lainnya` : ""}</p>
                        </div>
                      </div>
                    )}

                    {menuItems.length === 0 ? (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border-2 border-dashed border-violet-300 dark:border-violet-700">
                        <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">Belum ada menu ditambahkan</p>
                        <p className="text-xs text-violet-500 dark:text-violet-500 mt-1">Klik tombol &ldquo;Tambah Menu&rdquo; untuk memulai</p>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-violet-50 dark:bg-violet-900/30">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Menu</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Satuan</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                              <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {menuItems.map((item, index) => (
                              <tr key={item.id}>
                                <td className="px-2 py-2">
                                  <SearchableCombobox
                                    value={item.jenis}
                                    options={(form.waktu && form.tamu ? getAvailableMenu() : []).map(m => ({ label: m, value: m }))}
                                    placeholder={!form.waktu ? "Pilih waktu dulu" : !form.tamu ? "Pilih tipe tamu dulu" : "Pilih menu..."}
                                    disabled={!form.waktu || !form.tamu}
                                    variant="purple"
                                    onChange={(val) => {
                                      const updated = [...menuItems];
                                      updated[index].jenis = val;
                                      setMenuItems(updated);
                                    }}
                                    allowCustomValue={true}
                                    className="w-full"
                                  />
                                </td>
                                <td className="px-2 py-2">
                                  <SearchableCombobox
                                    value={item.satuan}
                                    options={["Pax","Box","Porsi","Cup","Gelas","Botol","Dus","Pack"].map(s => ({ label: s, value: s }))}
                                    placeholder="Pilih satuan..."
                                    variant="purple"
                                    onChange={(val) => {
                                      const updated = [...menuItems];
                                      updated[index].satuan = val;
                                      setMenuItems(updated);
                                    }}
                                    allowCustomValue={false}
                                    size="sm"
                                    className="w-full"
                                  />
                                </td>
                                <td className="px-2 py-2">
                                  <input
                                    type="number"
                                    value={item.qty || ""}
                                    onChange={(e) => {
                                      const updated = [...menuItems];
                                      updated[index].qty = parseInt(e.target.value) || 0;
                                      setMenuItems(updated);
                                    }}
                                    placeholder="0"
                                    min="0"
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-purple-500 rounded px-2 py-1.5 outline-none"
                                  />
                                </td>
                                <td className="px-2 py-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setMenuItems(menuItems.filter(m => m.id !== item.id))}
                                    className="text-violet-700 hover:bg-violet-50 p-1.5 rounded-lg transition-all"
                                    title="Hapus menu"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer - Sticky */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-b-xl border-t border-gray-200 dark:border-gray-700 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md ${
                      isFormValid()
                        ? "text-white bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 hover:shadow-lg cursor-pointer"
                        : "text-gray-400 bg-gray-300 dark:bg-gray-600 dark:text-gray-500 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {isEditMode ? "Update Order" : "Simpan Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        <div className="space-y-4 mb-40">
          {getFilteredOrders().length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-16 border border-gray-200 dark:border-gray-700 transition-all duration-300">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-full p-8 mb-6 transition-all duration-300">
                  <svg className="w-20 h-20 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-500 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent mb-3">
                  {searchQuery || filterStatus !== "Semua" || filterDateFrom || filterDateTo
                    ? "Tidak ada order yang sesuai filter"
                    : "Belum ada order"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                  {searchQuery || filterStatus !== "Semua" || filterDateFrom || filterDateTo
                    ? "Coba ubah kriteria pencarian atau filter Anda"
                    : "Klik tombol 'Tambah Order' untuk membuat order baru"}
                </p>
                {!(searchQuery || filterStatus !== "Semua" || filterDateFrom || filterDateTo) && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="group relative flex items-center gap-3 bg-gradient-to-r from-purple-600 to-violet-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                    suppressHydrationWarning
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                    </div>
                    <Plus className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Tambah Order Pertama</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-hidden">
                <table className="w-full table-fixed">
                  <thead className="bg-gradient-to-r from-purple-600 to-violet-500 dark:from-purple-700 dark:to-violet-600">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[20%]">Order ID</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[30%]">Kegiatan</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[15%]">Tipe Tamu</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-[20%]">Status</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-[15%]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {getPaginatedOrders().map((order) => {
                      return (
                        <tr 
                          key={order.id}
                          className={`group relative hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-300 ${openDropdownId === order.id ? 'bg-purple-50/50 dark:bg-purple-900/20' : ''}`}
                        >
                          {/* Order ID & Date */}
                          <td className="px-4 py-4 relative">
                            {/* Shimmer effect on hover - moved inside first td */}
                            <div className="absolute inset-y-0 left-0 right-[-200%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-purple-200/20 dark:via-purple-400/10 to-transparent"></div>
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate" title={order.id}>
                              {order.id}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="whitespace-nowrap">{order.tanggalPengiriman}</span>
                            </div>
                          </td>

                          {/* Kegiatan & Pengaju */}
                          <td className="px-4 py-4">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate" title={order.kegiatan}>
                              {order.kegiatan}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <span>oleh</span>
                              <span className="font-medium text-purple-600 dark:text-purple-400 truncate" title={order.pengaju}>
                                {order.pengaju}
                              </span>
                            </div>
                          </td>

                          {/* Tipe Tamu */}
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-full whitespace-nowrap">
                              {order.tamu}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            {(() => {
                              const s = normalizeStatus(order.status);
                              const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm";
                              const colorClasses = s === STATUS.CANCELLED
                                ? "bg-red-600 text-white"
                                : s === STATUS.ORDERED
                                ? "bg-amber-500 text-white"
                                : s === STATUS.APPROVED
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-500 text-white";
                              return (
                                <span className={`${baseClasses} ${colorClasses}`}>{s}</span>
                              );
                            })()}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <div className="flex justify-center">
                              <div className="relative">
                                <button 
                                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                                  onClick={(e) => {
                                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                    const MENU_WIDTH = 208; // ~w-52
                                    const PADDING = 8;
                                    const left = Math.min(rect.left, window.innerWidth - MENU_WIDTH - PADDING);
                                    const top = rect.bottom + PADDING;
                                    setMenuPos({ top, left });
                                    setOpenDropdownId(openDropdownId === order.id ? null : order.id);
                                  }}
                                  suppressHydrationWarning
                                  title="Menu Aksi"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                  </svg>
                                </button>

                            {/* Dropdown Menu (fixed to viewport to avoid clipping) */}
                            {openDropdownId === order.id && menuPos && (
                              <>
                                {/* Backdrop to close dropdown when clicking outside */}
                                <div 
                                  className="fixed inset-0 z-[100]" 
                                  onClick={() => { setOpenDropdownId(null); setMenuPos(null); }}
                                />
                                <div 
                                  className="fixed w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-[110] animate-in fade-in slide-in-from-top-2 duration-200"
                                  style={{ top: menuPos.top, left: menuPos.left }}
                                >
                                  {/* Detail */}
                                  <button
                                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 flex items-center gap-3"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowDetailModal(true);
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span className="font-medium">Detail Order</span>
                                  </button>

                                  {/* Edit - only show if status is pending */}
                                  {(normalizeStatus(order.status) === STATUS.ORDERED) && (
                                    <button
                                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/50 hover:text-violet-700 dark:hover:text-violet-300 transition-all duration-300 flex items-center gap-3"
                                      onClick={() => {
                                        handleEditOrder(order);
                                        setOpenDropdownId(null);
                                      }}
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      <span className="font-medium">Edit Order</span>
                                    </button>
                                  )}

                                  {/* Batalkan - only show if status is pending */}
                                  {(normalizeStatus(order.status) === STATUS.ORDERED) && (
                                    <button
                                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-all duration-300 flex items-center gap-3 border-t border-gray-100 dark:border-gray-700"
                                      onClick={() => {
                                        setOrderToCancel(order.id);
                                        setShowCancelConfirm(true);
                                        setOpenDropdownId(null);
                                      }}
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                      <span className="font-medium">Batalkan Order</span>
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Menampilkan <span className="font-bold text-gray-900 dark:text-white">{startItem}-{endItem}</span> dari <span className="font-bold text-gray-900 dark:text-white">{totalFilteredItems}</span> data
                </div>
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === 1 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700'
                    }`}
                    suppressHydrationWarning
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-md'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                          }`}
                          suppressHydrationWarning
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="text-gray-400 dark:text-gray-600 px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700'
                    }`}
                    suppressHydrationWarning
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toast Notification - Enhanced Purple Theme */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
            <div className={`relative flex items-center gap-4 px-6 py-5 rounded-2xl shadow-2xl min-w-[360px] overflow-hidden ${
              toastType === "success" 
                ? "bg-gradient-to-r from-purple-600 via-purple-600 to-violet-600" 
                : toastType === "error"
                ? "bg-gradient-to-r from-red-600 via-red-600 to-red-700"
                : "bg-gradient-to-r from-violet-600 via-violet-600 to-purple-600"
            } text-white backdrop-blur-lg border border-white/20`}>
              {/* Decorative blur circles */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
              
              {/* Icon with animated background */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse"></div>
                <div className="relative bg-white/30 backdrop-blur-sm p-3 rounded-full">
                  {toastType === "success" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {toastType === "error" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {toastType === "info" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Message */}
              <div className="relative flex-1">
                <p className="font-bold text-base leading-tight">{toastMessage}</p>
                <p className="text-xs text-white/80 mt-1">
                  {toastType === "success" && "Berhasil!"}
                  {toastType === "error" && "Terjadi kesalahan"}
                  {toastType === "info" && "Informasi"}
                </p>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setShowToast(false)}
                className="relative flex-shrink-0 hover:bg-white/30 p-2 rounded-lg transition-all duration-200 hover:rotate-90 transform"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
