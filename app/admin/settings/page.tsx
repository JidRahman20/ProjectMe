"use client"

import ProtectedRoute from "@/components/ui/protected-route"
import { Settings as SettingsIcon, Bell, Shield, Palette, Database } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengaturan</h1>
              <p className="text-gray-600 dark:text-gray-400">Kelola pengaturan sistem</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 max-w-4xl">
          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifikasi</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Pengaturan notifikasi sistem akan tersedia di sini
            </p>
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Keamanan</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Pengaturan keamanan dan autentikasi
            </p>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tampilan</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Kustomisasi tampilan aplikasi
            </p>
          </div>

          {/* Database Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Database</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Pengaturan dan maintenance database
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
