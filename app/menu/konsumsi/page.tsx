"use client";
import React, { useState, useRef } from "react";
import { Calendar, Plus, Eye } from "lucide-react";

interface Order {
  id: string;
  tanggalPengajuan: string;
  tanggalPengiriman: string;
  kegiatan: string;
  tamu: string;
  bagian: string;
  pengaju: string;
  menu: { label: string }[];
  status: string;
}

export default function KonsumsiPage() {
  const [showDateInput, setShowDateInput] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-10-17");
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  // State untuk order
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD/20250716339/0038",
      tanggalPengajuan: "16-07-2025",
      tanggalPengiriman: "16-07-2025",
      kegiatan: "Shutdown Pabrik",
      tamu: "Regular",
      bagian: "Dep. Teknologi Informasi PKC",
      pengaju: "Riza Ilhamsyah",
      menu: [
        { label: "Makan Pagi @ 10 Box" },
        { label: "Air mineral @ 1 Dus" },
      ],
      status: "Pesanan dibatalkan",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    kegiatan: "",
    tamu: "",
    bagian: "",
    pengaju: "",
    menu1: "",
    menu2: "",
    tanggalPengajuan: selectedDate,
    tanggalPengiriman: selectedDate,
  });

  const handleCalendarClick = () => {
    setShowDateInput(true);
    setTimeout(() => {
      if (dateInputRef.current) {
        dateInputRef.current.focus();
      }
    }, 100);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setShowDateInput(false);
    setForm((f) => ({ ...f, tanggalPengajuan: e.target.value, tanggalPengiriman: e.target.value }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrders([
      ...orders,
      {
        id: `ORD/${Date.now()}`,
        tanggalPengajuan: form.tanggalPengajuan,
        tanggalPengiriman: form.tanggalPengiriman,
        kegiatan: form.kegiatan,
        tamu: form.tamu,
        bagian: form.bagian,
        pengaju: form.pengaju,
        menu: [
          { label: form.menu1 },
          ...(form.menu2 ? [{ label: form.menu2 }] : []),
        ],
        status: "Menunggu konfirmasi",
      },
    ]);
    setShowForm(false);
    setForm({
      kegiatan: "",
      tamu: "",
      bagian: "",
      pengaju: "",
      menu1: "",
      menu2: "",
      tanggalPengajuan: selectedDate,
      tanggalPengiriman: selectedDate,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">Konsumsi</h1>
      <p className="text-gray-500 mb-6">Pengajuan Konsumsi Karyawan</p>
      <div className="flex gap-4 mb-6">
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold"
            onClick={handleCalendarClick}
          >
            <Calendar className="w-5 h-5" />
            {selectedDate.split("-").reverse().join("-")}
          </button>
          {showDateInput && (
            <input
              type="date"
              ref={dateInputRef}
              value={selectedDate}
              onChange={handleDateChange}
              onBlur={() => setShowDateInput(false)}
              className="absolute left-0 top-12 bg-white border rounded px-2 py-1 shadow z-10"
              style={{ minWidth: 150 }}
            />
          )}
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-5 h-5" />
          NEW ORDER
        </button>
      </div>
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false)
          }}
        >
          <div className="animate-in zoom-in-50 duration-200">
            <form onSubmit={handleAddOrder} className="bg-white rounded-lg p-5 w-full max-w-sm shadow-xl space-y-4 relative">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-bold">Tambah Order Baru</h2>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kegiatan</label>
                  <input 
                    name="kegiatan" 
                    value={form.kegiatan} 
                    onChange={handleFormChange} 
                    required 
                    placeholder="Masukkan nama kegiatan" 
                    className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tamu</label>
                  <input 
                    name="tamu" 
                    value={form.tamu} 
                    onChange={handleFormChange} 
                    required 
                    placeholder="Regular/VIP" 
                    className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Untuk Bagian</label>
                  <input 
                    name="bagian" 
                    value={form.bagian} 
                    onChange={handleFormChange} 
                    required 
                    placeholder="Nama departemen/bagian" 
                    className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Yang Mengajukan</label>
                  <input 
                    name="pengaju" 
                    value={form.pengaju} 
                    onChange={handleFormChange} 
                    required 
                    placeholder="Nama pengaju" 
                    className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all" 
                  />
                </div>

                <div className="border-t pt-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Menu</label>
                  <div className="space-y-2">
                    <input 
                      name="menu1" 
                      value={form.menu1} 
                      onChange={handleFormChange} 
                      required 
                      placeholder="Menu 1 (contoh: Makan Pagi @ 10 Box)" 
                      className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all" 
                    />
                    <input 
                      name="menu2" 
                      value={form.menu2} 
                      onChange={handleFormChange} 
                      placeholder="Menu 2 (opsional)" 
                      className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button 
                  type="submit" 
                  className="flex-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all"
                >
                  Simpan Order
                </button>
                <button 
                  type="button" 
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Kegiatan</th>
              <th className="px-4 py-3">Menu</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 align-top">
                  <span className="bg-gray-100 rounded px-2 py-1 text-xs font-semibold">{order.id}</span>
                  <div className="text-xs mt-2">Tanggal Pengajuan</div>
                  <div className="text-xs font-semibold">{order.tanggalPengajuan}</div>
                  <div className="text-xs mt-2">Tanggal Pengiriman</div>
                  <div className="text-xs font-semibold">{order.tanggalPengiriman}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="bg-gray-100 rounded px-2 py-1 text-xs font-semibold">{order.kegiatan}</span>
                  <div className="text-xs mt-2">Tamu</div>
                  <span className="bg-gray-100 rounded px-2 py-1 text-xs font-semibold">{order.tamu}</span>
                  <div className="text-xs mt-2">Untuk Bagian</div>
                  <span className="bg-gray-100 rounded px-2 py-1 text-xs font-semibold">{order.bagian}</span>
                  <div className="text-xs mt-2">Yang Mengajukan</div>
                  <span className="bg-gray-100 rounded px-2 py-1 text-xs font-semibold">{order.pengaju}</span>
                </td>
                <td className="px-4 py-3 align-top">
                  {order.menu.map((m, i) => (
                    <div className="flex items-center gap-2 mb-2" key={i}>
                      <span className="bg-indigo-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 align-top">
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${order.status === "Pesanan dibatalkan" ? "bg-red-500 text-white" : "bg-yellow-500 text-white"}`}>{order.status}</span>
                </td>
                <td className="px-4 py-3 align-top">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2">
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}