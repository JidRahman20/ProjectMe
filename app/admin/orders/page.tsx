"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { ShoppingCart, Calendar, User, Package, DollarSign, CheckCircle, XCircle, Clock, Search, Filter, Download, Eye } from "lucide-react"

type Order = {
  id: string
  code: string
  user_id: string
  items: any
  total_amount: number
  status: string
  kegiatan: string
  tamu: string
  tanggal_kegiatan: string
  waktu_kegiatan: string
  created_at: string
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
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderCode: string, newStatus: string) => {
    setUpdatingStatus(orderCode)
    try {
      const response = await fetch(`/api/konsumsi/orders/${orderCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setNotification({ 
          type: 'success', 
          message: `Status order berhasil diubah menjadi ${newStatus}` 
        })
        fetchOrders() // Refresh data
        setTimeout(() => setNotification(null), 3000)
      } else {
        setNotification({ 
          type: 'error', 
          message: 'Gagal mengubah status order' 
        })
        setTimeout(() => setNotification(null), 3000)
      }
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: 'Terjadi kesalahan saat mengubah status' 
      })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setUpdatingStatus(null)
    }
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
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
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
            <button
              onClick={() => alert('Export feature coming soon')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Semua', count: stats.total },
                { key: 'pending', label: 'Menunggu', count: stats.pending },
                { key: 'approved', label: 'Disetujui', count: stats.approved },
                { key: 'rejected', label: 'Dibatalkan', count: stats.rejected },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
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
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" style={{minWidth: '220px'}}>
                    Status & Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          #{order.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {users[order.user_id]?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {order.kegiatan || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {(order.tanggal_kegiatan || order.created_at) ? (
                            new Date(order.tanggal_kegiatan || order.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          ) : '-'}
                        </span>
                      </div>
                      {order.waktu_kegiatan && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 ml-6">
                          {order.waktu_kegiatan}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Rp {order.total_amount?.toLocaleString('id-ID') || '0'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-center">
                        <div className="flex items-center gap-2 w-full justify-center">
                          {getStatusBadge(order.status)}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.code, e.target.value)}
                          disabled={updatingStatus === order.code}
                          className="w-full text-xs px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 disabled:opacity-50 cursor-pointer"
                        >
                          <option value="pending">🕐 Menunggu Persetujuan</option>
                          <option value="approved">✅ Pesanan Disetujui</option>
                          <option value="rejected">❌ Pesanan Dibatalkan</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tanggal Kegiatan</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedOrder.tanggal_kegiatan || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Waktu Kegiatan</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedOrder.waktu_kegiatan || '-'}
                      </p>
                    </div>
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

                  {selectedOrder.items && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Items</p>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <pre className="text-xs text-gray-900 dark:text-white overflow-x-auto">
                          {JSON.stringify(selectedOrder.items, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ubah Status</p>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.code, 'approved')
                        setSelectedOrder(null)
                      }}
                      disabled={selectedOrder.status === 'approved' || updatingStatus === selectedOrder.code}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Setujui Pesanan
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.code, 'rejected')
                        setSelectedOrder(null)
                      }}
                      disabled={selectedOrder.status === 'rejected' || updatingStatus === selectedOrder.code}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="w-4 h-4 inline mr-2" />
                      Batalkan Pesanan
                    </button>
                  </div>
                </div>

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
      </div>
    </ProtectedRoute>
  )
}
