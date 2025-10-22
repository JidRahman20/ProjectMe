"use client";
import React, { useState } from "react";
import { Calendar, Plus, Eye, Building2 } from "lucide-react";

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-10-22");

  // State untuk order
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD/20250716339/0038",
      tanggalPengajuan: "16-07-2025",
      tanggalPengiriman: "16-07-2025",
      kegiatan: "Shutdown Pabrik",
      tamu: "Regular",
      jumlahTamu: 10,
      bagian: "Dep. Teknologi Informasi PKC",
      pengaju: "you",
      menu: [
        { label: "Makan Pagi @ 10 Box" },
        { label: "Air mineral @ 1 Dus" },
      ],
      status: "Pesanan dibatalkan",
    },
    {
      id: "ORD/20250717001/0039",
      tanggalPengajuan: "17-07-2025",
      tanggalPengiriman: "18-07-2025",
      kegiatan: "Rapat Direksi",
      tamu: "VVIP",
      jumlahTamu: 8,
      bagian: "Direksi",
      pengaju: "Sekretaris Direksi",
      menu: [
        { label: "Nasi Box Wagyu Teriyaki @ 16 Box" },
        { label: "Fresh Fruit Juice @ 16 Gelas" },
        { label: "Dessert Tiramisu @ 16 Cup" },
      ],
      status: "Menunggu konfirmasi",
    },
    {
      id: "ORD/20250718002/0040",
      tanggalPengajuan: "18-07-2025",
      tanggalPengiriman: "19-07-2025",
      kegiatan: "Training Karyawan Baru",
      tamu: "VIP",
      jumlahTamu: 25,
      bagian: "HRD",
      pengaju: "Manager HRD",
      menu: [
        { label: "Nasi Box Rendang Sapi @ 38 Box" },
        { label: "Soft Drink @ 38 Botol" },
        { label: "Kopi Latte @ 38 Cup" },
      ],
      status: "Disetujui",
    },
    {
      id: "ORD/20250719003/0041",
      tanggalPengajuan: "19-07-2025",
      tanggalPengiriman: "20-07-2025",
      kegiatan: "Meeting Bulanan",
      tamu: "Regular",
      jumlahTamu: 15,
      bagian: "Dep. Marketing",
      pengaju: "Team Leader Marketing",
      menu: [
        { label: "Nasi Box Ayam Goreng @ 15 Box" },
        { label: "Air Mineral @ 2 Dus" },
        { label: "Teh Manis @ 15 Gelas" },
      ],
      status: "Menunggu Persetujuan",
    },
    {
      id: "ORD/20250720004/0042",
      tanggalPengajuan: "20-07-2025",
      tanggalPengiriman: "21-07-2025",
      kegiatan: "Workshop Quality Control",
      tamu: "VIP",
      jumlahTamu: 20,
      bagian: "Quality Control",
      pengaju: "Supervisor QC",
      menu: [
        { label: "Nasi Box Ikan Bakar @ 30 Box" },
        { label: "Jus Buah Segar @ 30 Gelas" },
        { label: "Kue Lapis Legit @ 30 Potong" },
      ],
      status: "Disetujui",
    },
    {
      id: "ORD/20250721005/0043",
      tanggalPengajuan: "21-07-2025",
      tanggalPengiriman: "22-07-2025",
      kegiatan: "Audit Internal",
      tamu: "VVIP",
      jumlahTamu: 5,
      bagian: "Internal Audit",
      pengaju: "Kepala Audit",
      menu: [
        { label: "Beef Wellington @ 10 Porsi" },
        { label: "Wine Selection @ 10 Gelas" },
        { label: "Premium Dessert @ 10 Porsi" },
      ],
      status: "Menunggu konfirmasi",
    },
    {
      id: "ORD/20250722006/0044",
      tanggalPengajuan: "22-07-2025",
      tanggalPengiriman: "23-07-2025",
      kegiatan: "Gathering Team IT",
      tamu: "Regular",
      jumlahTamu: 30,
      bagian: "Dep. IT",
      pengaju: "Manager IT",
      menu: [
        { label: "Nasi Goreng @ 30 Porsi" },
        { label: "Ayam Geprek @ 30 Porsi" },
        { label: "Es Teh @ 30 Gelas" },
      ],
      status: "Menunggu Persetujuan",
    },
    {
      id: "ORD/20250723007/0045",
      tanggalPengajuan: "23-07-2025",
      tanggalPengiriman: "24-07-2025",
      kegiatan: "Peluncuran Produk Baru",
      tamu: "VVIP",
      jumlahTamu: 12,
      bagian: "Dep. Marketing",
      pengaju: "Director Marketing",
      menu: [
        { label: "Sushi & Sashimi Set @ 24 Set" },
        { label: "Champagne @ 24 Gelas" },
        { label: "French Macaron @ 24 Box" },
      ],
      status: "Disetujui",
    },
    {
      id: "ORD/20250724008/0046",
      tanggalPengajuan: "24-07-2025",
      tanggalPengiriman: "25-07-2025",
      kegiatan: "Sosialisasi K3",
      tamu: "Regular",
      jumlahTamu: 50,
      bagian: "HSE Department",
      pengaju: "HSE Manager",
      menu: [
        { label: "Nasi Box Ayam Bakar @ 50 Box" },
        { label: "Air Mineral @ 5 Dus" },
        { label: "Pisang Goreng @ 50 Potong" },
      ],
      status: "Menunggu konfirmasi",
    },
    {
      id: "ORD/20250725009/0047",
      tanggalPengajuan: "25-07-2025",
      tanggalPengiriman: "26-07-2025",
      kegiatan: "Board Meeting",
      tamu: "VVIP",
      jumlahTamu: 10,
      bagian: "Board of Directors",
      pengaju: "Corporate Secretary",
      menu: [
        { label: "Lamb Chop @ 20 Porsi" },
        { label: "Grilled Salmon Premium @ 20 Porsi" },
        { label: "Wine Selection @ 20 Gelas" },
      ],
      status: "Disetujui",
    },
    {
      id: "ORD/20250726010/0048",
      tanggalPengajuan: "26-07-2025",
      tanggalPengiriman: "27-07-2025",
      kegiatan: "Pelatihan Safety",
      tamu: "VIP",
      jumlahTamu: 18,
      bagian: "Safety Department",
      pengaju: "Safety Officer",
      menu: [
        { label: "Nasi Box Premium Ayam Bakar @ 27 Box" },
        { label: "Jus Alpukat @ 27 Gelas" },
        { label: "Martabak Mini @ 27 Potong" },
      ],
      status: "Menunggu Persetujuan",
    },
    {
      id: "ORD/20250727011/0049",
      tanggalPengajuan: "27-07-2025",
      tanggalPengiriman: "28-07-2025",
      kegiatan: "Town Hall Meeting",
      tamu: "Regular",
      jumlahTamu: 100,
      bagian: "Corporate Communication",
      pengaju: "GM Corporate",
      menu: [
        { label: "Nasi Box Ayam @ 100 Box" },
        { label: "Air Mineral @ 10 Dus" },
        { label: "Kopi @ 100 Cup" },
      ],
      status: "Disetujui",
    },
  ]);
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
  
  // State untuk Toast Notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
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
    }
    if (!form.tanggalPengiriman) {
      newErrors.tanggalPengiriman = "Tanggal pengiriman wajib diisi";
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

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Build menu labels from menuItems
    const menuLabels = menuItems
      .filter(item => item.jenis && item.satuan && item.qty > 0)
      .map(item => ({ label: `${item.jenis} @ ${item.qty} ${item.satuan}` }));

    if (menuLabels.length === 0) {
      alert("Harap tambahkan minimal 1 menu konsumsi!");
      return;
    }

    if (isEditMode && editOrderId) {
      // Edit existing order
      setOrders(orders.map(order => 
        order.id === editOrderId
          ? {
              ...order,
              tanggalPengajuan: form.tanggalPermintaan.split("-").reverse().join("-"),
              tanggalPengiriman: form.tanggalPengiriman.split("-").reverse().join("-"),
              kegiatan: form.kegiatan,
              tamu: form.tamu,
              jumlahTamu: form.jumlahTamu,
              bagian: form.untukBagian,
              pengaju: form.yangMengajukan,
              menu: menuLabels,
              approval: form.approval,
              lokasi: form.lokasi,
              waktu: form.waktu,
              keterangan: form.keterangan,
            }
          : order
      ));
      showToastNotification("Order berhasil diupdate!", "success");
    } else {
      // Add new order
      setOrders([
        ...orders,
        {
          id: `ORD/${Date.now()}`,
          tanggalPengajuan: form.tanggalPermintaan.split("-").reverse().join("-"),
          tanggalPengiriman: form.tanggalPengiriman.split("-").reverse().join("-"),
          kegiatan: form.kegiatan,
          tamu: form.tamu,
          jumlahTamu: form.jumlahTamu,
          bagian: form.untukBagian,
          pengaju: form.yangMengajukan,
          menu: menuLabels,
          status: "Menunggu konfirmasi",
          approval: form.approval,
          lokasi: form.lokasi,
          waktu: form.waktu,
          keterangan: form.keterangan,
        },
      ]);
      showToastNotification("Order berhasil ditambahkan!", "success");
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
    const parsedMenuItems = order.menu.map((m, idx) => {
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

    // Filter by status
    if (filterStatus !== "Semua") {
      filtered = filtered.filter(order => order.status === filterStatus);
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

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterDateFrom, filterDateTo]);

  // Calculate statistics
  const statistics = {
    total: orders.length,
    pending: orders.filter(o => o.status === "Menunggu konfirmasi" || o.status === "Menunggu Persetujuan").length,
    approved: orders.filter(o => o.status === "Disetujui").length,
    cancelled: orders.filter(o => o.status === "Pesanan dibatalkan").length,
  };

  const handleCancelOrder = () => {
    if (orderToCancel) {
      setOrders(orders.map(o => 
        o.id === orderToCancel 
          ? { ...o, status: "Pesanan dibatalkan" } 
          : o
      ));
      showToastNotification("Order berhasil dibatalkan", "info");
      setShowCancelConfirm(false);
      setOrderToCancel(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Konsumsi</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Kelola permintaan konsumsi</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-5 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm transform hover:scale-105"
              onClick={() => setShowCalendar(true)}
              suppressHydrationWarning
            >
              <Calendar className="w-4 h-4" />
              <span>{selectedDate.split("-").reverse().join("-")}</span>
            </button>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => setShowForm(true)}
              suppressHydrationWarning
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Order</span>
            </button>
          </div>
        </div>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Order</p>
                <h3 className="text-3xl font-bold mt-1">{statistics.total}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Pending</p>
                <h3 className="text-3xl font-bold mt-1">{statistics.pending}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Disetujui</p>
                <h3 className="text-3xl font-bold mt-1">{statistics.approved}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm font-medium">Dibatalkan</p>
                <h3 className="text-3xl font-bold mt-1">{statistics.cancelled}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Cari Order</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ID, Kegiatan, Pengaju..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  suppressHydrationWarning
                />
                <svg className="w-5 h-5 text-indigo-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                suppressHydrationWarning
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu konfirmasi">Menunggu Konfirmasi</option>
                <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Pesanan dibatalkan">Dibatalkan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Dari Tanggal</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Sampai Tanggal</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                suppressHydrationWarning
              />
            </div>
          </div>

          {(searchQuery || filterStatus !== "Semua" || filterDateFrom || filterDateTo) && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan <span className="font-bold text-indigo-600 dark:text-indigo-400">{getFilteredOrders().length}</span> dari {orders.length} order
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("Semua");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}
                className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium flex items-center gap-1 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              />
              <button
                onClick={() => setShowCalendar(false)}
                className="w-full mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium transform hover:scale-105"
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
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center transition-colors duration-300">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
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
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Detail Order</h3>
                  <p className="text-sm text-indigo-100 mt-1">{selectedOrder.id}</p>
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
                    selectedOrder.status === "Pesanan dibatalkan" 
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white" 
                      : selectedOrder.status === "Menunggu Persetujuan" || selectedOrder.status === "Menunggu konfirmasi"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                      : selectedOrder.status === "Disetujui"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                      : selectedOrder.status === "Dipesan"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      : selectedOrder.status === "Selesai"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                      : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Tanggal */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-400">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase mb-1">Tanggal Pengajuan</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-300">{selectedOrder.tanggalPengajuan}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500 dark:border-purple-400">
                    <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase mb-1">Tanggal Pengiriman</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-300">{selectedOrder.tanggalPengiriman}</p>
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
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-5 border border-orange-200 dark:border-orange-700">
                  <h4 className="text-sm font-bold text-orange-900 dark:text-orange-300 uppercase mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Daftar Menu
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.menu.map((m, i) => (
                      <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm" key={i}>
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-orange-900 dark:text-orange-200 flex-1">{m.label}</span>
                        {m.price && (
                          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{m.price}</span>
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
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
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
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">{isEditMode ? "Edit Order" : "Tambah Order"}</h2>
                    <p className="text-xs text-indigo-100 mt-1">{isEditMode ? "Perbarui data order" : "Isi formulir di bawah ini"}</p>
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
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">📋 Informasi Order</h3>
                      <p className="text-xs text-blue-700 dark:text-blue-400">Order akan dieksekusi sesuai tanggal dan waktu yang dipilih. Pastikan semua data sudah benar.</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-2">⚠️ Informasi Transaksi</h3>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">Order memerlukan approval dari atasan sebelum diproses oleh tim konsumsi.</p>
                    </div>
                  </div>

                  {/* Tanggal Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500 rounded-lg p-4">
                      <label className="block text-sm font-bold text-blue-900 dark:text-blue-300 uppercase mb-2">
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
                        className={`w-full border-0 bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm font-semibold text-blue-900 dark:text-blue-300 focus:ring-2 focus:ring-blue-500 outline-none ${
                          errors.tanggalPermintaan ? "ring-2 ring-red-500" : ""
                        }`}
                        suppressHydrationWarning
                      />
                      {errors.tanggalPermintaan && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">{errors.tanggalPermintaan}</p>
                      )}
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-600 dark:border-purple-500 rounded-lg p-4">
                      <label className="block text-sm font-bold text-purple-900 dark:text-purple-300 uppercase mb-2">
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
                        className={`w-full border-0 bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm font-semibold text-purple-900 dark:text-purple-300 focus:ring-2 focus:ring-purple-500 outline-none ${
                          errors.tanggalPengiriman ? "ring-2 ring-red-500" : ""
                        }`}
                        suppressHydrationWarning
                      />
                      {errors.tanggalPengiriman && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">{errors.tanggalPengiriman}</p>
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
                          Kegiatan: <span className="text-red-500">*</span>
                        </label>
                        <select 
                          name="kegiatan" 
                          value={form.kegiatan} 
                          onChange={(e) => {
                            setForm({ ...form, kegiatan: e.target.value });
                            if (errors.kegiatan) {
                              setErrors({ ...errors, kegiatan: "" });
                            }
                          }}
                          className={`w-full border-0 bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer ${
                            errors.kegiatan ? "ring-2 ring-red-500" : ""
                          }`}
                          suppressHydrationWarning
                        >
                          <option value="">Pilih Kegiatan...</option>
                          <option value="Bahan Minum Karyawan">Bahan Minum Karyawan</option>
                          <option value="Baporkes">Baporkes</option>
                          <option value="BK3N">BK3N</option>
                          <option value="Extra Fooding">Extra Fooding</option>
                          <option value="Extra Fooding Shift">Extra Fooding Shift</option>
                          <option value="Extra Fooding SKJ">Extra Fooding SKJ</option>
                          <option value="Festival Inovasi">Festival Inovasi</option>
                          <option value="Halal bil Halal">Halal bil Halal</option>
                          <option value="Hari Guru">Hari Guru</option>
                          <option value="Hari Raya Idul Adha">Hari Raya Idul Adha</option>
                          <option value="Hari Raya Idul Fitri">Hari Raya Idul Fitri</option>
                          <option value="HUT PKC">HUT PKC</option>
                          <option value="HUT RI">HUT RI</option>
                          <option value="Jamuan di Luar Kawasan">Jamuan di Luar Kawasan</option>
                          <option value="Jamuan Tamu Perusahaan">Jamuan Tamu Perusahaan</option>
                          <option value="Jum'at Bersih">Jum&apos;at Bersih</option>
                          <option value="Ketupat Lebaran">Ketupat Lebaran</option>
                          <option value="Konsumsi Buka Puasa">Konsumsi Buka Puasa</option>
                          <option value="Konsumsi Makan Sahur">Konsumsi Makan Sahur</option>
                          <option value="Konsumsi TA">Konsumsi TA</option>
                          <option value="Lain-lain Jamuan Tamu">Lain-lain Jamuan Tamu</option>
                          <option value="Lain-lain Perayaan">Lain-lain Perayaan</option>
                          <option value="Lain-lain Rapat Kantor">Lain-lain Rapat Kantor</option>
                          <option value="Lembur Perta">Lembur Perta</option>
                          <option value="Lembur Rutin">Lembur Rutin</option>
                          <option value="Lembur Shutdown">Lembur Shutdown</option>
                          <option value="Not Defined">Not Defined</option>
                          <option value="Nuzulul Quran">Nuzulul Quran</option>
                          <option value="Open Storage">Open Storage</option>
                          <option value="Pengajian Keliling">Pengajian Keliling</option>
                          <option value="Pengantongan Akhir Tahun">Pengantongan Akhir Tahun</option>
                          <option value="Pengembangan SDM">Pengembangan SDM</option>
                          <option value="PKM Masjid Nahrul Hayat">PKM Masjid Nahrul Hayat</option>
                          <option value="Program AKHLAK">Program AKHLAK</option>
                          <option value="Program Makmur">Program Makmur</option>
                          <option value="Program WMS">Program WMS</option>
                          <option value="Proper Emas">Proper Emas</option>
                          <option value="Proyek Replacement K1A & NZE">Proyek Replacement K1A &amp; NZE</option>
                          <option value="Rakor Direksi Anper PI Grup">Rakor Direksi Anper PI Grup</option>
                          <option value="Rapat Direksi">Rapat Direksi</option>
                          <option value="Rapat Distribusi B">Rapat Distribusi B</option>
                          <option value="Rapat Distribusi D">Rapat Distribusi D</option>
                          <option value="Rapat Gabungan Dekom, Direksi, SVP">Rapat Gabungan Dekom, Direksi, SVP</option>
                          <option value="Rapat Internal">Rapat Internal</option>
                          <option value="Rapat Komite Audit">Rapat Komite Audit</option>
                          <option value="Rapat LKS Bipartit">Rapat LKS Bipartit</option>
                          <option value="Rapat Monitoring Anper PKC">Rapat Monitoring Anper PKC</option>
                          <option value="Rapat Pra RUPS">Rapat Pra RUPS</option>
                          <option value="Rapat Tamu">Rapat Tamu</option>
                          <option value="Rumah Tahfidz">Rumah Tahfidz</option>
                          <option value="Safari Malam Takbiran">Safari Malam Takbiran</option>
                          <option value="Safari Ramadhan">Safari Ramadhan</option>
                          <option value="Shutdown Pabrik">Shutdown Pabrik</option>
                          <option value="SP2K">SP2K</option>
                          <option value="Srikandi PKC">Srikandi PKC</option>
                          <option value="Tabligh Akbar">Tabligh Akbar</option>
                          <option value="Washing Pabrik">Washing Pabrik</option>
                        </select>
                        {errors.kegiatan && (
                          <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.kegiatan}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Tipe Tamu: <span className="text-red-500">*</span>
                        </label>
                        <select 
                          name="tamu" 
                          value={form.tamu} 
                          onChange={(e) => {
                            const newTamu = e.target.value;
                            setForm({ ...form, tamu: newTamu });
                            if (errors.tamu) {
                              setErrors({ ...errors, tamu: "" });
                            }
                            
                            // Update qty based on tamu type and jumlah tamu
                            if (form.jumlahTamu > 0) {
                              const multiplier = tamuMultiplier[newTamu as keyof typeof tamuMultiplier] || 1;
                              const updatedMenuItems = menuItems.map(item => ({
                                ...item,
                                qty: Math.ceil(form.jumlahTamu * multiplier)
                              }));
                              setMenuItems(updatedMenuItems);
                            }
                            
                            // Reset menu items when guest type changes (karena menu berbeda)
                            if (form.waktu) {
                              setMenuItems([{ 
                                id: 1, 
                                jenis: "", 
                                satuan: "", 
                                qty: form.jumlahTamu > 0 ? Math.ceil(form.jumlahTamu * (tamuMultiplier[newTamu as keyof typeof tamuMultiplier] || 1)) : 0 
                              }]);
                            }
                          }}
                          className={`w-full border-0 bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer ${
                            errors.tamu ? "ring-2 ring-red-500" : ""
                          }`}
                          suppressHydrationWarning
                        >
                          <option value="">Pilih Tipe Tamu...</option>
                          <option value="PERTA">PERTA</option>
                          <option value="Regular">Regular</option>
                          <option value="Standar">Standar</option>
                          <option value="VIP">VIP</option>
                          <option value="VVIP">VVIP</option>
                        </select>
                        {errors.tamu && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">{errors.tamu}</p>
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
                          Jumlah Tamu: <span className="text-red-500">*</span>
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
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">{errors.jumlahTamu}</p>
                        )}
                        {form.jumlahTamu > 0 && form.tamu && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1.5 font-medium">
                            💡 Porsi otomatis: {Math.ceil(form.jumlahTamu * (tamuMultiplier[form.tamu as keyof typeof tamuMultiplier] || 1))} porsi
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Bagian: <span className="text-red-500">*</span>
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
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">{errors.untukBagian}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Pengaju: <span className="text-red-500">*</span>
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
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">{errors.yangMengajukan}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Approval: <span className="text-red-500">*</span>
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
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">{errors.approval}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Lokasi Pengiriman: <span className="text-red-500">*</span>
                        </label>
                        <select 
                          name="lokasi" 
                          value={form.lokasi} 
                          onChange={(e) => {
                            setForm({ ...form, lokasi: e.target.value });
                            if (errors.lokasi) {
                              setErrors({ ...errors, lokasi: "" });
                            }
                          }}
                          className={`w-full border-0 bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer ${
                            errors.lokasi ? "ring-2 ring-red-500" : ""
                          }`}
                          suppressHydrationWarning
                        >
                          <option value="">Pilih Lokasi...</option>
                          <option value="Bagging">Bagging</option>
                          <option value="CCB Club House">CCB Club House</option>
                          <option value="Departemen Riset">Departemen Riset</option>
                          <option value="Gedung 101-K">Gedung 101-K</option>
                          <option value="Gedung Anggrek">Gedung Anggrek</option>
                          <option value="Gedung Bidding Center">Gedung Bidding Center</option>
                          <option value="Gedung Contraction Office">Gedung Contraction Office</option>
                          <option value="Gedung K3">Gedung K3</option>
                          <option value="Gedung LC">Gedung LC</option>
                          <option value="Gedung Maintenance Office">Gedung Maintenance Office</option>
                          <option value="Gedung Mawar">Gedung Mawar</option>
                          <option value="Gedung Melati">Gedung Melati</option>
                          <option value="Gedung Purna Bhakti">Gedung Purna Bhakti</option>
                          <option value="Gedung Pusat Administrasi">Gedung Pusat Administrasi</option>
                          <option value="Gedung RPK">Gedung RPK</option>
                          <option value="Gedung Saorga">Gedung Saorga</option>
                          <option value="GH-B">GH-B</option>
                          <option value="GH-C">GH-C</option>
                          <option value="GPA Lt-3">GPA Lt-3</option>
                          <option value="Gudang Bahan Baku">Gudang Bahan Baku</option>
                          <option value="Gudang Bulk Material">Gudang Bulk Material</option>
                          <option value="Gudang Suku Cadang Jakarta">Gudang Suku Cadang Jakarta</option>
                          <option value="Kantor SP2K">Kantor SP2K</option>
                          <option value="Kebon Bibit">Kebon Bibit</option>
                          <option value="Klinik PT HPH">Klinik PT HPH</option>
                          <option value="Kolam Pancing Type B">Kolam Pancing Type B</option>
                          <option value="Kolam Renang">Kolam Renang</option>
                          <option value="Kujang Kampioen Riset">Kujang Kampioen Riset</option>
                          <option value="Laboraturium / Main Lab">Laboraturium / Main Lab</option>
                          <option value="Lapang Basket Type B">Lapang Basket Type B</option>
                          <option value="Lapang Futsal">Lapang Futsal</option>
                          <option value="Lapang Sepak Bola Type E">Lapang Sepak Bola Type E</option>
                          <option value="Lapang Tenis Type B">Lapang Tenis Type B</option>
                          <option value="Lapang Volly Type E">Lapang Volly Type E</option>
                          <option value="Lapangan Helipad">Lapangan Helipad</option>
                          <option value="Lapangan Panahan">Lapangan Panahan</option>
                          <option value="Lapangan Volley">Lapangan Volley</option>
                          <option value="Mekanik K1A">Mekanik K1A</option>
                          <option value="Mekanik K1B">Mekanik K1B</option>
                          <option value="Not Defined">Not Defined</option>
                          <option value="NPK-2">NPK-2</option>
                          <option value="Pos Selatan 01">Pos Selatan 01</option>
                          <option value="Posko Pengamanan Bawah">Posko Pengamanan Bawah</option>
                          <option value="Ruang Rapat NPK-1">Ruang Rapat NPK-1</option>
                          <option value="Ruang Rapat NPK-2">Ruang Rapat NPK-2</option>
                          <option value="Utility K-1A">Utility K-1A</option>
                        </select>
                        {errors.lokasi && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">{errors.lokasi}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1.5">
                          Waktu: <span className="text-red-500">*</span>
                        </label>
                        <select 
                          name="waktu" 
                          value={form.waktu} 
                          onChange={(e) => {
                            setForm({ ...form, waktu: e.target.value });
                            if (errors.waktu) {
                              setErrors({ ...errors, waktu: "" });
                            }
                            // Reset menu items when time changes
                            setMenuItems([{ id: 1, jenis: "", satuan: "", qty: form.jumlahTamu > 0 && form.tamu ? Math.ceil(form.jumlahTamu * (tamuMultiplier[form.tamu as keyof typeof tamuMultiplier] || 1)) : 0 }]);
                          }}
                          className={`w-full border-0 bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer ${
                            errors.waktu ? "ring-2 ring-red-500" : ""
                          }`}
                          suppressHydrationWarning
                        >
                          <option value="">Pilih Waktu...</option>
                          <option value="Sahur">Sahur</option>
                          <option value="Pagi">Pagi</option>
                          <option value="Siang">Siang</option>
                          <option value="Sore">Sore</option>
                          <option value="Buka puasa">Buka puasa</option>
                          <option value="Malam">Malam</option>
                          <option value="Snack malam">Snack malam</option>
                          <option value="Tengah Malam">Tengah Malam</option>
                        </select>
                        {errors.waktu && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">{errors.waktu}</p>
                        )}
                        {form.waktu && !form.tamu && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 font-medium">
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
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 rounded-lg p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-orange-900 dark:text-orange-300 uppercase flex items-center gap-2">
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
                        className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Menu
                      </button>
                    </div>

                    {/* Info Helper */}
                    {!form.waktu && (
                      <div className="mb-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg p-3 flex items-start gap-2">
                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="text-xs text-amber-800 dark:text-amber-300">
                          <p className="font-bold mb-1">⏰ Pilih waktu terlebih dahulu!</p>
                          <p>Menu yang tersedia akan disesuaikan dengan waktu kegiatan (Pagi/Siang/Sore/Malam)</p>
                        </div>
                      </div>
                    )}
                    
                    {form.waktu && !form.tamu && (
                      <div className="mb-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-3 flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-xs text-blue-800 dark:text-blue-300">
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
                      <div className="mb-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-3 flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-xs text-green-800 dark:text-green-300">
                          <p className="font-bold mb-1">🎯 Isi jumlah tamu untuk kalkulasi otomatis!</p>
                          <p>Qty akan otomatis dihitung: Jumlah Tamu × Multiplier ({form.tamu === "Regular" ? "1x" : form.tamu === "VIP" ? "1.5x" : "2x"})</p>
                        </div>
                      </div>
                    )}
                    
                    {form.waktu && form.tamu && form.jumlahTamu > 0 && (
                      <div className="mb-4 bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700 rounded-lg p-3 flex items-start gap-2">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-xs text-indigo-800 dark:text-indigo-300">
                          <p className="font-bold mb-1">✨ Siap menambahkan menu!</p>
                          <p>Menu tersedia untuk <strong>{form.tamu}</strong> waktu <strong>{form.waktu.split(" - ")[1]}</strong>: {getAvailableMenu().slice(0, 3).join(", ")}
                          {getAvailableMenu().length > 3 ? `, dan ${getAvailableMenu().length - 3} menu lainnya` : ""}</p>
                        </div>
                      </div>
                    )}

                    {menuItems.length === 0 ? (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-orange-300 dark:border-orange-700">
                        <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Belum ada menu ditambahkan</p>
                        <p className="text-xs text-orange-500 dark:text-orange-500 mt-1">Klik tombol &ldquo;Tambah Menu&rdquo; untuk memulai</p>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-orange-200 dark:border-orange-700">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs uppercase">
                              <th className="px-3 py-2.5 text-left font-bold w-12">#</th>
                              <th className="px-3 py-2.5 text-left font-bold">Jenis Konsumsi</th>
                              <th className="px-3 py-2.5 text-left font-bold w-32">Satuan</th>
                              <th className="px-3 py-2.5 text-left font-bold w-24">Qty</th>
                              <th className="px-3 py-2.5 text-center font-bold w-20">Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {menuItems.map((item, index) => (
                              <tr key={item.id} className="border-b border-orange-100 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-3 py-2.5">
                                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold">
                                    {index + 1}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5">
                                  <select
                                    value={item.jenis}
                                    onChange={(e) => {
                                      const updated = [...menuItems];
                                      updated[index].jenis = e.target.value;
                                      setMenuItems(updated);
                                    }}
                                    disabled={!form.waktu || !form.tamu}
                                    className="w-full border-0 bg-transparent dark:text-gray-200 text-sm focus:ring-2 focus:ring-orange-500 rounded px-2 py-1 outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    <option value="">Pilih menu...</option>
                                    {!form.waktu && <option value="" disabled>Pilih waktu dulu</option>}
                                    {!form.tamu && form.waktu && <option value="" disabled>Pilih tipe tamu dulu</option>}
                                    {form.waktu && form.tamu && getAvailableMenu().map((menu: string, idx: number) => (
                                      <option key={idx} value={menu}>{menu}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-3 py-2.5">
                                  <select
                                    value={item.satuan}
                                    onChange={(e) => {
                                      const updated = [...menuItems];
                                      updated[index].satuan = e.target.value;
                                      setMenuItems(updated);
                                    }}
                                    className="w-full border-0 bg-transparent dark:text-gray-200 text-sm focus:ring-2 focus:ring-orange-500 rounded px-2 py-1 outline-none cursor-pointer"
                                  >
                                    <option value="">Pilih...</option>
                                    <option value="Pax">Pax</option>
                                    <option value="Box">Box</option>
                                    <option value="Porsi">Porsi</option>
                                    <option value="Cup">Cup</option>
                                    <option value="Gelas">Gelas</option>
                                    <option value="Botol">Botol</option>
                                    <option value="Dus">Dus</option>
                                    <option value="Pack">Pack</option>
                                  </select>
                                </td>
                                <td className="px-3 py-2.5">
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
                                    className="w-full border-0 bg-transparent dark:text-gray-200 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-orange-500 rounded px-2 py-1 outline-none"
                                  />
                                </td>
                                <td className="px-3 py-2.5 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setMenuItems(menuItems.filter(m => m.id !== item.id))}
                                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
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
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
                  >
                    {isEditMode ? "Update Order" : "Simpan Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        <div className="space-y-4">
          {getFilteredOrders().length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-16 border border-gray-200 dark:border-gray-700 transition-all duration-300">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-full p-8 mb-6 transition-all duration-300">
                  <svg className="w-20 h-20 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mb-3">
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
                    className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Tambah Order Pertama</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Header Row */}
              <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 dark:from-violet-700 dark:via-indigo-700 dark:to-violet-700 rounded-xl shadow-lg p-4 transition-all duration-300">
                <div className="grid grid-cols-12 gap-4 text-white font-bold text-sm uppercase tracking-wide">
                  <div className="col-span-3">Order</div>
                  <div className="col-span-4">Kegiatan</div>
                  <div className="col-span-2">Tipe Tamu</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-center">Aksi</div>
                </div>
              </div>

              {/* Order Cards */}
              {getPaginatedOrders().map((order) => (
                <div 
                  key={order.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] border border-gray-200 dark:border-gray-700 ${openDropdownId === order.id ? 'relative z-50' : 'relative z-0'}`}
                >
                  <div className="grid grid-cols-12 gap-4 p-5 items-center relative">
                    {/* Order ID & Date */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-sky-100 dark:bg-sky-900/50 rounded-lg p-2 transition-colors duration-300">
                          <svg className="w-4 h-4 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{order.id}</div>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600 dark:text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{order.tanggalPengiriman}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Kegiatan & Pengaju */}
                    <div className="col-span-4">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-violet-100 dark:bg-violet-900/50 rounded-lg p-2 transition-colors duration-300">
                          <Building2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{order.kegiatan}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">oleh</span>
                            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 truncate">{order.pengaju}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tipe Tamu & Menu Count */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm font-bold text-amber-900 dark:text-amber-100 bg-amber-50 dark:bg-amber-900/50 px-3 py-1.5 rounded-lg transition-colors duration-300">
                        {order.tamu}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium shadow-sm whitespace-nowrap ${
                          order.status === "Pesanan dibatalkan" 
                            ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white" 
                            : order.status === "Menunggu Persetujuan" || order.status === "Menunggu konfirmasi"
                            ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white"
                            : order.status === "Disetujui"
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                            : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="relative">
                        <button 
                          className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg group transform hover:scale-110"
                          onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)}
                          suppressHydrationWarning
                          title="Menu Aksi"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdownId === order.id && (
                          <>
                            {/* Backdrop to close dropdown when clicking outside */}
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setOpenDropdownId(null)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Detail */}
                            <button
                              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-300 flex items-center gap-3"
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
                            {(order.status === "Menunggu Persetujuan" || order.status === "Menunggu konfirmasi") && (
                              <button
                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/50 hover:text-sky-700 dark:hover:text-sky-300 transition-all duration-300 flex items-center gap-3"
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
                            {(order.status === "Menunggu Persetujuan" || order.status === "Menunggu konfirmasi") && (
                              <button
                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-900/50 hover:text-rose-700 dark:hover:text-rose-300 transition-all duration-300 flex items-center gap-3 border-t border-gray-100 dark:border-gray-700"
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
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {getFilteredOrders().length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 mt-4 transition-all duration-300">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 dark:from-violet-700 dark:via-indigo-700 dark:to-violet-700">
              <div className="text-sm text-white font-medium">
                Menampilkan <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getFilteredOrders().length)}</span> dari <span className="font-bold">{getFilteredOrders().length}</span> data
              </div>
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3.5 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                    currentPage === 1 
                      ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                      : 'bg-white/20 hover:bg-white/30 text-white transform hover:scale-105'
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
                            ? 'bg-white text-violet-600 shadow-md hover:shadow-lg'
                            : 'bg-white/20 hover:bg-white/30 text-white'
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
                      <span key={pageNum} className="text-white px-2">
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
                  className={`px-3.5 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                    currentPage === totalPages
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-white/20 hover:bg-white/30 text-white transform hover:scale-105'
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

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl min-w-[320px] ${
              toastType === "success" 
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
                : toastType === "error"
                ? "bg-gradient-to-r from-rose-500 to-rose-600"
                : "bg-gradient-to-r from-indigo-500 to-indigo-600"
            } text-white`}>
              <div className="flex-shrink-0">
                {toastType === "success" && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {toastType === "error" && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {toastType === "info" && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className="font-semibold text-sm flex-1">{toastMessage}</p>
              <button
                onClick={() => setShowToast(false)}
                className="flex-shrink-0 hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
