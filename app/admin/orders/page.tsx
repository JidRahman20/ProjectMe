"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { ShoppingCart, Calendar, User, Package, CheckCircle, XCircle, Clock, Search, Eye } from "lucide-react"

type Order = {
  id: string
  code: string
  user_id: string
  items: Record<string, unknown>
  total_amount: number
  status: string
  approval_status?: string
  admin_status?: string
  approved_by_approval?: string
  approved_by_admin?: string
  approval_rejection_reason?: string
  admin_rejection_reason?: string
  kegiatan: string
  tamu: string
  tanggal_kegiatan: string
  waktu_kegiatan: string
  created_at: string
}

type OrderItem = {
  name: string
  qty: number
  satuan: string
  timePeriod: string
}

type User = {
  id: string
  name: string
  email: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<Record<string, User>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean
    title: string
    message: string
    orderCode: string
    newStatus: string
    type: 'approve' | 'reject'
  } | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/konsumsi/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
        
        // Fetch user details for each order
        const userIds = [...new Set(data.orders.map((order: Order) => order.user_id))]
        const userPromises = userIds.map(id => 
          fetch(`/api/users/${id}`).then(res => res.ok ? res.json() : null)
        )
        const userResults = await Promise.all(userPromises)
        const userMap = userResults.reduce((acc, user) => {
          if (user) acc[user.id] = user
          return acc
        }, {} as Record<string, User>)
        setUsers(userMap)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderCode: string, newStatus: string, rejectionReason?: string) => {
    setUpdatingStatus(orderCode)
    try {
      const response = await fetch(`/api/konsumsi/orders/${orderCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          role: 'admin', // Admin approval (second tier)
          approverName: 'Admin',
          rejectionReason: rejectionReason || undefined
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const statusText = newStatus === 'approved' ? 'disetujui' : 'dibatalkan'
        setNotification({ 
          type: 'success', 
          message: `Pesanan berhasil ${statusText} oleh Admin!` 
        })
        fetchOrders() // Refresh data
        setTimeout(() => setNotification(null), 3000)
      } else {
        setNotification({ 
          type: 'error', 
          message: data.error || 'Gagal mengubah status order' 
        })
        setTimeout(() => setNotification(null), 3000)
      }
    } catch (err) {
      console.error('Error updating status:', err)
      setNotification({ 
        type: 'error', 
        message: 'Terjadi kesalahan saat mengubah status' 
      })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const showConfirmDialog = (orderCode: string, newStatus: string, orderInfo: string, type: 'approve' | 'reject') => {
    const titles = {
      approve: 'Setujui Pesanan',
      reject: 'Batalkan Pesanan'
    }
    setConfirmDialog({
      show: true,
      title: titles[type],
      message: orderInfo,
      orderCode,
      newStatus,
      type
    })
  }

  const handleConfirm = async () => {
    if (confirmDialog) {
      await handleStatusChange(confirmDialog.orderCode, confirmDialog.newStatus)
      setConfirmDialog(null)
      setSelectedOrder(null)
    }
  }

  const handleCancel = () => {
    setConfirmDialog(null)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    }
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    }
    const labels = {
      pending: 'Menunggu Persetujuan',
      approved: 'Pesanan Disetujui',
      rejected: 'Pesanan Dibatalkan',
    }
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending} w-[160px] justify-center`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') {
      if (!searchQuery) return true
      return (
        order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.kegiatan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        users[order.user_id]?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    const matchesFilter = order.status === filter
    if (!searchQuery) return matchesFilter
    return matchesFilter && (
      order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.kegiatan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      users[order.user_id]?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }).sort((a, b) => {
    // Sort by created_at descending (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    approved: orders.filter(o => o.status === 'approved').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
    totalAmount: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  }

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-600 dark:text-gray-400">Memuat data...</div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Floating Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 max-w-md transform transition-all duration-500`}>
            <div className={`rounded-lg shadow-lg p-4 ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </div>
                <p className="font-medium">{notification.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Orderan</h1>
                <p className="text-gray-600 dark:text-gray-400">Kelola semua orderan konsumsi</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Menunggu</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Disetujui</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Dibatalkan</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                Rp {(stats.totalAmount / 1000000).toFixed(1)}Jt
              </p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari order, kegiatan, atau nama user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'Semua', count: stats.total },
                { key: 'pending', label: 'Menunggu', count: stats.pending },
                { key: 'approved', label: 'Disetujui', count: stats.approved },
                { key: 'rejected', label: 'Dibatalkan', count: stats.rejected },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as typeof filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    filter === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? 'Tidak ada orderan yang cocok dengan pencarian'
                : `Tidak ada orderan ${filter !== 'all' ? `dengan status ${filter}` : ''}`
              }
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                      Order Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                      Kegiatan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                      Total
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                      Status & Aksi
                    </th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span className="font-medium text-gray-900 dark:text-white text-xs truncate max-w-[120px]" title={`#${order.code}`}>
                          #{order.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs text-gray-900 dark:text-white truncate max-w-[100px] inline-block" title={users[order.user_id]?.name}>
                        {users[order.user_id]?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[150px]" title={order.kegiatan || '-'}>
                        {order.kegiatan || '-'}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {(order.tanggal_kegiatan || order.created_at) ? (
                        new Date(order.tanggal_kegiatan || order.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit'
                        })
                      ) : '-'}
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <span className="font-semibold text-xs text-gray-900 dark:text-white">
                        {(order.total_amount / 1000).toFixed(0)}k
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        {getStatusBadge(order.status)}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-shrink-0 p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Detail Order #{selectedOrder.code}
                    </h2>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {users[selectedOrder.user_id]?.name || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                      <p className="font-bold text-purple-600 dark:text-purple-400">
                        Rp {selectedOrder.total_amount?.toLocaleString('id-ID') || '0'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kegiatan</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.kegiatan || '-'}
                    </p>
                  </div>

                  {selectedOrder.tamu && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tamu</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedOrder.tamu}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dibuat pada</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedOrder.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>

                  {selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Daftar Pesanan</p>
                      <div className="space-y-3">
                        {(selectedOrder.items as OrderItem[]).map((item, idx) => (
                          <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Satuan: <span className="font-medium">{item.satuan}</span>
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Waktu: <span className="font-medium capitalize">{item.timePeriod}</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                  {item.qty} {item.satuan}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Approval Info */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">Status Persetujuan:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800 dark:text-blue-300">1. Approval Team:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.approval_status === 'approved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : selectedOrder.approval_status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {selectedOrder.approval_status === 'approved' ? '✓ Disetujui' : 
                         selectedOrder.approval_status === 'rejected' ? '✗ Ditolak' : '⏳ Menunggu'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800 dark:text-blue-300">2. Admin:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.admin_status === 'approved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : selectedOrder.admin_status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {selectedOrder.admin_status === 'approved' ? '✓ Disetujui' : 
                         selectedOrder.admin_status === 'rejected' ? '✗ Ditolak' : '⏳ Menunggu'}
                      </span>
                    </div>
                  </div>

                  {/* Rejection Reason from Approval */}
                  {selectedOrder.approval_status === 'rejected' && selectedOrder.approval_rejection_reason && (
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                      <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Alasan Penolakan dari Approval:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/10 p-2 rounded">
                        {selectedOrder.approval_rejection_reason}
                      </p>
                    </div>
                  )}
                </div>

                {selectedOrder.status === 'pending' && selectedOrder.approval_status === 'approved' && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Admin Approval (Persetujuan Final)</p>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => {
                          const orderInfo = `Order: #${selectedOrder.code}\nKegiatan: ${selectedOrder.kegiatan || '-'}\nTotal: Rp ${selectedOrder.total_amount?.toLocaleString('id-ID') || '0'}`
                          showConfirmDialog(selectedOrder.code, 'approved', orderInfo, 'approve')
                        }}
                        disabled={updatingStatus === selectedOrder.code}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Setujui Pesanan (Final)
                      </button>
                      <button
                        onClick={() => {
                          const orderInfo = `Order: #${selectedOrder.code}\nKegiatan: ${selectedOrder.kegiatan || '-'}\nTotal: Rp ${selectedOrder.total_amount?.toLocaleString('id-ID') || '0'}`
                          showConfirmDialog(selectedOrder.code, 'rejected', orderInfo, 'reject')
                        }}
                        disabled={updatingStatus === selectedOrder.code}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircle className="w-4 h-4 inline mr-2" />
                        Batalkan Pesanan
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedOrder.status === 'pending' && selectedOrder.approval_status !== 'approved' && (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      ⚠️ Pesanan ini belum disetujui oleh Approval Team. Admin hanya dapat menyetujui pesanan setelah Approval Team menyetujuinya terlebih dahulu.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Confirmation Dialog */}
        {confirmDialog && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm" onClick={handleCancel}>
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 rounded-t-2xl ${
                confirmDialog.type === 'approve' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-red-500 to-rose-600'
              }`}>
                <div className="flex items-center gap-3">
                  {confirmDialog.type === 'approve' ? (
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <XCircle className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">{confirmDialog.title}</h3>
                    <p className="text-white/90 text-sm">Konfirmasi tindakan Anda</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                  Apakah Anda yakin ingin {confirmDialog.type === 'approve' ? 'menyetujui' : 'membatalkan'} pesanan ini?
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                  {confirmDialog.message.split('\n').map((line, idx) => (
                    <p key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">{line}</span>
                    </p>
                  ))}
                </div>

                <div className={`p-3 rounded-lg ${
                  confirmDialog.type === 'approve'
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  <p className={`text-xs ${
                    confirmDialog.type === 'approve'
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    ⚠️ {confirmDialog.type === 'approve' 
                      ? 'Pesanan yang sudah disetujui tidak dapat dibatalkan.'
                      : 'Pesanan yang sudah dibatalkan tidak dapat diubah kembali.'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={updatingStatus !== null}
                  className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    confirmDialog.type === 'approve'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
                  }`}
                >
                  {updatingStatus ? 'Memproses...' : 'Ya, Lanjutkan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
