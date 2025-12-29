"use client";

import { ProtectedRoute } from "@/components/ui/protected-route";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Search, UtensilsCrossed } from "lucide-react";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  category?: string;
  is_available: boolean;
  created_at: string;
}

export default function MenuManagementPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
    category: "",
    is_available: true
  });
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    filterMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus, searchTerm]);

  const fetchMenus = async () => {
    try {
      // TODO: Replace with actual API endpoint when ready
      // const response = await fetch('/api/menus');
      // const data = await response.json();
      // if (data.success) {
      //   setMenus(data.menus);
      // }
      
      // Temporary dummy data
      setMenus([]);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMenus = () => {
    if (searchTerm) {
      const filtered = menus.filter(menu =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenus(filtered);
    } else {
      setFilteredMenus(menus);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingMenu 
        ? `/api/menus/${editingMenu.id}`
        : '/api/menus';
      
      const method = editingMenu ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          show: true,
          message: `Menu berhasil ${editingMenu ? 'diupdate' : 'ditambahkan'}!`,
          type: 'success'
        });
        fetchMenus();
        handleCloseModal();
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
      } else {
        throw new Error(data.error);
      }
    } catch (_error) {
      setNotification({
        show: true,
        message: 'Gagal menyimpan menu',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus menu ini?')) return;

    try {
      const response = await fetch(`/api/menus/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          show: true,
          message: 'Menu berhasil dihapus!',
          type: 'success'
        });
        fetchMenus();
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
      }
    } catch (_error) {
      setNotification({
        show: true,
        message: 'Gagal menghapus menu',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      price: menu.price.toString(),
      description: menu.description,
      image_url: menu.image_url || "",
      category: menu.category || "",
      is_available: menu.is_available
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMenu(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      image_url: "",
      category: "",
      is_available: true
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Notification */}
          {notification.show && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {notification.message}
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Manajemen Menu
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Kelola menu makanan Anda
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tambah Menu
            </button>
          </div>

          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari menu berdasarkan nama atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Belum ada menu. Klik &quot;Tambah Menu&quot; untuk mulai menambahkan.
                </p>
              </div>
            ) : (
              filteredMenus.map((menu) => (
                <div key={menu.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    {menu.image_url ? (
                      <Image
                        src={menu.image_url}
                        alt={menu.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UtensilsCrossed className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {menu.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        menu.is_available
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {menu.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                      </span>
                    </div>

                    {menu.category && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {menu.category}
                      </p>
                    )}

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {menu.description}
                    </p>

                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                      Rp {menu.price.toLocaleString('id-ID')}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(menu)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(menu.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {editingMenu ? 'Edit Menu' : 'Tambah Menu'}
                    </h2>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nama Menu *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Harga *
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Kategori
                        </label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Contoh: Nasi, Snack, Minuman"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Deskripsi *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        URL Foto
                      </label>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_available"
                        checked={formData.is_available}
                        onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="is_available" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Menu tersedia untuk dipesan
                      </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        {editingMenu ? 'Update' : 'Simpan'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
