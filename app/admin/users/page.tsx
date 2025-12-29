"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { UserPlus, Mail, Lock, User, Shield, Eye, EyeOff, CheckCircle, XCircle, Users, Edit2, Trash2 } from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string, details?: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [users, setUsers] = useState<UserData[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (response.ok && data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setShowNotification(false)

    try {
      if (isEditMode && editingUserId) {
        // Update existing user
        const response = await fetch(`/api/users/${editingUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            ...(formData.password && { password: formData.password })
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setMessage({ 
            type: 'success', 
            text: 'Akun berhasil diupdate!',
            details: `User ${formData.name} telah diperbarui`
          })
          setShowNotification(true)
          setFormData({ name: "", email: "", password: "", role: "user" })
          setIsEditMode(false)
          setEditingUserId(null)
          fetchUsers()
          
          setTimeout(() => {
            setShowNotification(false)
          }, 5000)
        } else {
          setMessage({ 
            type: 'error', 
            text: data.error || 'Gagal update akun',
            details: 'Silakan cek kembali data yang diinput'
          })
          setShowNotification(true)
        }
      } else {
        // Create new user
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok) {
          setMessage({ 
            type: 'success', 
            text: 'Akun berhasil ditambahkan!',
            details: `User ${formData.name} (${formData.email}) telah dibuat sebagai ${formData.role}`
          })
          setShowNotification(true)
          setFormData({ name: "", email: "", password: "", role: "user" })
          fetchUsers()
          
          setTimeout(() => {
            setShowNotification(false)
          }, 5000)
        } else {
          setMessage({ 
            type: 'error', 
            text: data.error || 'Gagal menambah akun',
            details: 'Silakan cek kembali data yang diinput'
          })
          setShowNotification(true)
        }
      }
    } catch (_error) {
      setMessage({ 
        type: 'error', 
        text: 'Terjadi kesalahan saat menyimpan akun',
        details: 'Silakan coba lagi nanti'
      })
      setShowNotification(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleEdit = (user: UserData) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role
    })
    setIsEditMode(true)
    setEditingUserId(user.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setFormData({ name: "", email: "", password: "", role: "user" })
    setIsEditMode(false)
    setEditingUserId(null)
  }

  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Akun berhasil dihapus!',
          details: `User ${userToDelete.name} telah dihapus`
        })
        setShowNotification(true)
        fetchUsers()
        
        setTimeout(() => {
          setShowNotification(false)
        }, 5000)
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Gagal menghapus akun',
          details: 'Silakan coba lagi nanti'
        })
        setShowNotification(true)
      }
    } catch (_error) {
      setMessage({ 
        type: 'error', 
        text: 'Terjadi kesalahan',
        details: 'Silakan coba lagi nanti'
      })
      setShowNotification(true)
    } finally {
      setShowDeleteModal(false)
      setUserToDelete(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'approval':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'pendor':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin'
      case 'approval':
        return 'Approval Manager'
      case 'pendor':
        return 'Pendor Staff'
      default:
        return 'User'
    }
  }

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    user: users.filter(u => u.role === 'user').length,
    approval: users.filter(u => u.role === 'approval').length,
    pendor: users.filter(u => u.role === 'pendor').length,
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Floating Notification */}
        {showNotification && message && (
          <div className={`fixed top-4 right-4 z-50 max-w-md transform transition-all duration-500 ${
            showNotification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
            <div className={`rounded-lg shadow-lg p-4 ${
              message.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{message.text}</h3>
                  {message.details && (
                    <p className="text-sm opacity-90">{message.details}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="flex-shrink-0 text-white hover:opacity-80"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admin</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{roleStats.admin}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approval</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{roleStats.approval}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pendor</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{roleStats.pendor}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">User</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{roleStats.user}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Akun' : 'Tambah Akun'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isEditMode ? 'Perbarui informasi akun pengguna' : 'Buat akun pengguna baru'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nama Lengkap
              </div>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </div>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="nama@email.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </div>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formData.password && (
              <p className={`text-xs mt-1 ${
                formData.password.length >= 6 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formData.password.length >= 6 
                  ? '✓ Password sudah memenuhi syarat' 
                  : `✗ Minimal 6 karakter (saat ini: ${formData.password.length})`
                }
              </p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Role
              </div>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="approval">Approval Manager</option>
              <option value="pendor">Pendor Staff</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (isEditMode ? 'Mengupdate...' : 'Menambahkan...') : (isEditMode ? 'Update Akun' : 'Tambah Akun')}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        {/* Users Table */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Akun</h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">({users.length} total)</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Nama</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal Dibuat</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Belum ada data akun
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {getRoleDisplayName(user.role)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(user.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Akun</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Konfirmasi penghapusan</p>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Apakah Anda yakin ingin menghapus akun <span className="font-semibold">{userToDelete.name}</span> ({userToDelete.email})?
                <br />
                <span className="text-red-600 dark:text-red-400 text-sm">Tindakan ini tidak dapat dibatalkan.</span>
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setUserToDelete(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
