"use client"

import React, { useState } from "react"
import { Bell, LogOut, User, Menu } from "lucide-react"
import Image from "next/image"
import { useSidebar } from "@/context/sidebar-context"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
  const router = useRouter()
  const { user, logout } = useAuth()

  return (
    <nav className={`fixed top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 
    ${isCollapsed ? "lg:left-16" : "lg:left-64"} 
    left-0 right-0`}>
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between lg:justify-end">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar & Icons - Kanan */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="relative w-40 sm:w-48 lg:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search command..."
                className="w-full pl-10 pr-14 py-2 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
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
                  src="/avatar.svg"
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
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* User Info */}
                    {user && (
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                          {user.role}
                        </span>
                      </div>
                    )}
                    
                    {/* Profile */}
                    <button
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/50 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 flex items-center gap-3"
                      onClick={() => {
                        router.push('/menu/profile')
                        setShowProfileMenu(false)
                      }}
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Profile</span>
                    </button>

                    {/* Settings */}
                    <button
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/50 hover:text-yellow-700 dark:hover:text-yellow-300 transition-all duration-300 flex items-center gap-3"
                      onClick={() => {
                        // Navigate to settings page (you can change this route)
                        router.push('/settings')
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
                        logout()
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

            {/* Animated Theme Toggler - Paling Kanan */}
            <AnimatedThemeToggler />
          </div>
        </div>
      </div>
    </nav>
  )
}
