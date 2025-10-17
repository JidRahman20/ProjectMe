"use client"

import React from "react"
import { Bell, LogOut } from "lucide-react"

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-semibold">DEMPLON</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button
              type="button"
              className="relative p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Logout */}
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
