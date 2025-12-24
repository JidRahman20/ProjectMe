"use client";

import { ProtectedRoute } from "@/components/ui/protected-route";
import { useAuth } from "@/context/auth-context";
import { ShoppingBag, UtensilsCrossed, CheckCircle2, Clock, Check, X, Package, Truck, AlertCircle, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  qty: number;
  satuan: string;
  timePeriod?: string;
}

interface Order {
  id: string;
  code: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  approval_status?: string;
  admin_status?: string;
  vendor_status?: string;
  kegiatan?: string;
  tamu?: string;
  jumlahTamu?: number;
  bagian?: string;
  pengaju?: string;
  tanggalPengajuan?: string;
  tanggalPengiriman?: string;
  lokasi?: string;
  waktu?: string;
  keterangan?: string;
  rejectionReason?: string;
  createdAt: string;
}

export default function PendorHomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMenu: 0,
    pesananBaru: 0,
    pesananDiproses: 0,
    pesananSelesai: 0,
    totalPesanan: 0
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Modal states
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersResponse = await fetch('/api/konsumsi/orders');
      const ordersData = await ordersResponse.json();
      
      if (ordersData.success) {
        // Filter: hanya tampilkan pesanan yang sudah di-approve oleh Admin
        const approvedByAdmin = ordersData.orders.filter((o: Order) => 
          o.status === 'approved' && o.admin_status === 'approved'
        );
        setOrders(approvedByAdmin);
        
        setStats({
          totalMenu: 0,
          // Pesanan baru = yang sudah approved admin tapi belum di-accept vendor
          pesananBaru: approvedByAdmin.filter((o: Order) => 
            !o.vendor_status || o.vendor_status === 'pending'
          ).length,
          // Pesanan diproses = yang sudah di-accept, processing, atau shipped
          pesananDiproses: approvedByAdmin.filter((o: Order) => 
            o.vendor_status === 'accepted' || 
            o.vendor_status === 'processing' || 
            o.vendor_status === 'shipped'
          ).length,
          // Pesanan selesai = yang sudah completed
          pesananSelesai: approvedByAdmin.filter((o: Order) => 
            o.vendor_status === 'completed'
          ).length,
          totalPesanan: approvedByAdmin.length
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAcceptModal = (orderCode: string) => {
    setSelectedOrderCode(orderCode);
    setShowAcceptModal(true);
  };

  const openRejectModal = (orderCode: string) => {
    setSelectedOrderCode(orderCode);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleAcceptOrder = async () => {
    if (processingId) return;

    setProcessingId(selectedOrderCode);
    try {
      const response = await fetch(`/api/konsumsi/orders/${selectedOrderCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'accepted',
          role: 'vendor',
          vendorName: user?.name || 'Vendor'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowAcceptModal(false);
        fetchData();
      } else {
        alert('✗ Gagal menerima pesanan.');
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('✗ Terjadi kesalahan.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectOrder = async () => {
    if (processingId) return;
    
    if (!rejectionReason.trim()) {
      alert('Alasan penolakan wajib diisi!');
      return;
    }

    setProcessingId(selectedOrderCode);
    try {
      const response = await fetch(`/api/konsumsi/orders/${selectedOrderCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          rejectionReason: rejectionReason.trim()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowRejectModal(false);
        setRejectionReason('');
        fetchData();
      } else {
        alert('✗ Gagal menolak pesanan.');
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('✗ Terjadi kesalahan.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusUpdate = async (orderCode: string, currentStatus: string) => {
    if (processingId) return;

    const statusFlow: Record<string, string> = {
      'accepted': 'processing',
      'processing': 'shipped',
      'shipped': 'completed'
    };

    const nextStatus = statusFlow[currentStatus];
    if (!nextStatus) return;

    const statusLabels: Record<string, string> = {
      'processing': 'Diproses',
      'shipped': 'Dikirim',
      'completed': 'Selesai'
    };

    const confirmed = confirm(`Update status menjadi "${statusLabels[nextStatus]}"?`);
    if (!confirmed) return;

    setProcessingId(orderCode);
    try {
      const response = await fetch(`/api/konsumsi/orders/${orderCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Status berhasil diperbarui!');
        fetchData();
      } else {
        alert('Gagal memperbarui status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Terjadi kesalahan.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string; icon: LucideIcon }> = {
      'pending': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', label: 'Menunggu Approval', icon: Clock },
      'approved': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', label: 'Perlu Tindakan', icon: AlertCircle },
      'accepted': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', label: 'Diterima', icon: Check },
      'processing': { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200', label: 'Diproses', icon: Package },
      'shipped': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200', label: 'Dikirim', icon: Truck },
      'completed': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', label: 'Selesai', icon: CheckCircle2 },
      'rejected': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', label: 'Ditolak', icon: X }
    };
    
    const badge = badges[status] || badges['pending'];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  // Hanya tampilkan pesanan yang sudah di-approve oleh Admin/Approval
  const pendingOrders = orders.filter(o => o.status === 'approved');
  const activeOrders = orders.filter(o => ['accepted', 'processing', 'shipped'].includes(o.status));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Vendor
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Selamat datang, {user?.name}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pesanan Baru</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {loading ? '...' : stats.pesananBaru}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sedang Diproses</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {loading ? '...' : stats.pesananDiproses}
                  </p>
                </div>
                <Package className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Selesai</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {loading ? '...' : stats.pesananSelesai}
                  </p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Pesanan</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {loading ? '...' : stats.totalPesanan}
                  </p>
                </div>
                <ShoppingBag className="w-12 h-12 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Pending Orders - Need Action */}
          {pendingOrders.length > 0 && (
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                    Pesanan Baru - Perlu Tindakan
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Pesanan yang sudah disetujui Admin dan menunggu konfirmasi Vendor
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {pendingOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {order.code}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.kegiatan || 'Pesanan Konsumsi'}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Pengaju</p>
                            <p className="font-medium text-gray-900 dark:text-white">{order.pengaju}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Tanggal Kirim</p>
                            <p className="font-medium text-gray-900 dark:text-white">{order.tanggalPengiriman}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Lokasi</p>
                            <p className="font-medium text-gray-900 dark:text-white">{order.lokasi || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Jumlah Tamu</p>
                            <p className="font-medium text-gray-900 dark:text-white">{order.jumlahTamu || 0} orang</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Item Pesanan:</h4>
                          <ul className="space-y-1">
                            {Array.isArray(order.items) && order.items.map((item: OrderItem, idx: number) => (
                              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                • {item.name} - {item.qty} {item.satuan} {item.timePeriod && `(${item.timePeriod})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                        <button
                          onClick={() => openAcceptModal(order.code)}
                          disabled={processingId === order.code}
                          className="flex-1 lg:flex-none bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Terima
                        </button>
                        <button
                          onClick={() => openRejectModal(order.code)}
                          disabled={processingId === order.code}
                          className="flex-1 lg:flex-none bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Tolak
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info jika tidak ada pesanan baru */}
          {!loading && pendingOrders.length === 0 && activeOrders.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center mb-8">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Belum Ada Pesanan
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pesanan yang sudah disetujui Admin akan muncul di sini
              </p>
            </div>
          )}

          {/* Active Orders - In Progress */}
          {activeOrders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-500" />
                Pesanan Aktif
              </h2>
              <div className="space-y-4">
                {activeOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {order.code}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.kegiatan || 'Pesanan Konsumsi'}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Pengaju</p>
                            <p className="font-medium text-gray-900 dark:text-white">{order.pengaju}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Tanggal Kirim</p>
                            <p className="font-medium text-gray-900 dark:text-white">{order.tanggalPengiriman}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Item Pesanan:</h4>
                          <ul className="space-y-1">
                            {Array.isArray(order.items) && order.items.map((item: OrderItem, idx: number) => (
                              <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                • {item.name} - {item.qty} {item.satuan}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {order.status !== 'completed' && (
                        <div className="lg:min-w-[180px]">
                          <button
                            onClick={() => handleStatusUpdate(order.code, order.status)}
                            disabled={processingId === order.code}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {order.status === 'accepted' && '→ Mulai Proses'}
                            {order.status === 'processing' && '→ Kirim Pesanan'}
                            {order.status === 'shipped' && '→ Tandai Selesai'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/pendor/menu"
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105"
            >
              <UtensilsCrossed className="w-12 h-12 text-white mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Manajemen Menu
              </h2>
              <p className="text-blue-100">
                Tambah, Edit, dan Hapus menu makanan
              </p>
            </Link>

            <Link
              href="/pendor/pesanan"
              className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105"
            >
              <ShoppingBag className="w-12 h-12 text-white mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Semua Pesanan
              </h2>
              <p className="text-orange-100">
                Lihat riwayat dan detail lengkap semua pesanan
              </p>
            </Link>
          </div>
        </div>

        {/* Modal Konfirmasi Terima Pesanan */}
        {showAcceptModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Konfirmasi Penerimaan</h3>
                    <p className="text-sm text-green-100">Terima pesanan ini?</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Dengan menerima pesanan ini:
                  </h4>
                  <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Anda bertanggung jawab memproses pesanan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Pesanan akan masuk ke daftar aktif Anda</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Pemesan akan menerima notifikasi konfirmasi</span>
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Pastikan Anda siap memenuhi pesanan ini
                </p>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={() => setShowAcceptModal(false)}
                  disabled={processingId !== null}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleAcceptOrder}
                  disabled={processingId !== null}
                  className="flex-1 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingId ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Ya, Terima Pesanan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Tolak Pesanan dengan Alasan */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <X className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Alasan Penolakan Pesanan</h3>
                    <p className="text-sm text-red-100">Mohon berikan alasan penolakan</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Contoh Alasan:
                  </h4>
                  <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
                    <li>• Kapasitas produksi sudah penuh</li>
                    <li>• Tidak bisa memenuhi jumlah pesanan</li>
                    <li>• Tanggal pengiriman terlalu dekat</li>
                    <li>• Bahan baku tidak tersedia</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alasan Penolakan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Masukkan alasan penolakan pesanan..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 outline-none transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Alasan ini akan dikirim ke pemesan
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  disabled={processingId !== null}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleRejectOrder}
                  disabled={processingId !== null || !rejectionReason.trim()}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingId ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      <span>Tolak Pesanan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
