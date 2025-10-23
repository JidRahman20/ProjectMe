"use client"

import React, { useState } from "react"
import { Bell, LogOut, Sun, Moon } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/context/theme-context"
import { useSidebar } from "@/context/sidebar-context"

export function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { isCollapsed } = useSidebar()

  return (
    <nav className={`fixed top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isCollapsed ? "left-16" : "left-64"
    } right-0`}>
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-end">
          {/* Search Bar & Icons - Kanan */}
          <div className="flex items-center space-x-3">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search command..."
                className="w-full pl-10 pr-14 py-2 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                suppressHydrationWarning
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded shadow-sm">
                  ⌘ K
                </kbd>
              </div>
            </div>
            
            {/* Notifications */}
            <button
              type="button"
              className="relative p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-110"
              suppressHydrationWarning
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Picture with Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center rounded-full focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                suppressHydrationWarning
              >
                <Image
                  src="/kujang.jpg"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  
                  {/* Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Profile */}
                    <button
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-300 flex items-center gap-3"
                      onClick={() => {
                        // Add profile navigation here
                        setShowProfileMenu(false)
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">Profile</span>
                    </button>

                    {/* Settings */}
                    <button
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/50 hover:text-sky-700 dark:hover:text-sky-300 transition-all duration-300 flex items-center gap-3"
                      onClick={() => {
                        // Add settings navigation here
                        setShowProfileMenu(false)
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">Settings</span>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                    {/* Logout */}
                    <button
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-900/50 hover:text-rose-700 dark:hover:text-rose-300 transition-all duration-300 flex items-center gap-3"
                      onClick={() => {
                        // Add logout logic here
                        setShowProfileMenu(false)
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggle - Paling Kanan */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              suppressHydrationWarning
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
