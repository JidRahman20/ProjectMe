"use client"

import React from "react"
import { useSidebar } from "@/context/sidebar-context"
import { useAuth } from "@/context/auth-context"
import { 
  Home, 
  UserCircle2, 
  Building2, 
  Clock,
  Package,
  Library,
  Link2,
  Sparkles,
  ChevronLeft,
  Menu,
  Scissors,
  Users,
  FileText,
  Circle,
  Layers,
  FileBox,
  FileSpreadsheet,
  Briefcase,
  ScrollText
} from "lucide-react"
import Image from "next/image"
import DemplonLogo from "./demplon-logo"
import Link from "next/link"
import { usePathname } from "next/navigation"

type MenuItem = {
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  href: string
  section?: "generals" | "main" | "apps"
}

const menuItems: MenuItem[] = [
  { title: "Home", icon: Home, href: "/", section: "generals" },
  { title: "Profile", icon: UserCircle2, href: "/menu/profile", section: "generals" },
  { title: "Employment", icon: Building2, href: "/menu/employment", section: "generals" },
  {
    title: "Kehadiran, Koreksi, Cuti, dan Dinas",
    icon: Clock,
    href: "/menu/absen",
    section: "generals"
  },
  { title: "Portal Aplikasi", icon: Package, href: "/menu/portal", section: "main" },
  { title: "Kujang AI", icon: Sparkles, href: "/menu/kujangai", section: "main" },
  { title: "Library", icon: Library, href: "/menu/library", section: "main" },
  { title: "Shortlink", icon: Link2, href: "/menu/shortlink", section: "main" },

  // Apps & Features
  { title: "E-Prosedur", icon: Scissors, href: "/menu/e-prosedur", section: "apps" },
  { title: "Employee Directory", icon: Users, href: "/menu/employee", section: "apps" },
  { title: "SIADIL", icon: FileText, href: "/menu/siadil", section: "apps" },
  { title: "SYSTIK", icon: Circle, href: "/menu/systik", section: "apps" },
  { title: "Konsumsi", icon: Layers, href: "/menu/konsumsi", section: "apps" },
  { title: "Dokumenku", icon: FileBox, href: "/menu/dokumenku", section: "apps" },
  { title: "MyStatement", icon: FileSpreadsheet, href: "/menu/statement", section: "apps" },
  { title: "Work Area", icon: Briefcase, href: "/menu/work-area", section: "apps" },
  { title: "Peraturan Perundangan", icon: ScrollText, href: "/menu/peraturan", section: "apps" }
]

type SidebarProps = {
  userName?: string
  userId?: string
  avatarSrc?: string
  showMobile?: boolean
  onClose?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  userName = "User Name",
  userId = "00000000",
  avatarSrc = "/avatar.svg",
  showMobile = false,
  onClose
}) => {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
  const { user } = useAuth()
  
  const generalsMenu = menuItems.filter(item => item.section === "generals")
  const mainMenu = menuItems.filter(item => item.section === "main")
  
  // Use logged in user data if available
  const displayName = user?.name || userName
  const displayId = user?.id || userId
  const displayEmail = user?.email || ""
  
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out 
        ${isCollapsed ? "w-16" : "w-64"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
      {/* Logo/Brand Section at the top */}
      <div className={`h-16 flex items-center ${isCollapsed ? "justify-center px-2" : "px-4"}`}>
        {/* Custom wordmark to match requested minimalist brand style */}
        <DemplonLogo className={isCollapsed ? "scale-90" : ""} size={28} />
      </div>
      
      {/* Toggle button - hanya tampil di desktop (lg:block), hidden di mobile */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`hidden lg:block fixed top-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-1.5 transition-all duration-500 z-50 ${
          isCollapsed ? "left-[52px]" : "left-[240px]"
        }`}
        suppressHydrationWarning
        aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
      >
        {isCollapsed ? (
          <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Scrollable menu content */}
  <div className={`h-[calc(100%-4rem)] pb-4 overflow-y-auto bg-white dark:bg-gray-900 ${isCollapsed ? "px-1" : "px-3"}`}>
        {/* Profile Section */}
        <Link 
          href="/menu/profile"
          className={`flex items-center gap-4 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${isCollapsed ? "justify-center px-0" : ""}`}
        >
          <div className={`${isCollapsed ? "flex justify-center w-full" : ""}`}>
            <Image
              className="w-9 h-9 rounded-full flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700"
              src={avatarSrc}
              alt="User avatar"
              width={36}
              height={36}
              priority
            />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">{displayName}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{displayEmail || displayId}</p>
            </div>
          )}
        </Link>

        {/* Generals Navigation */}
        <div className="mt-2">
          {!isCollapsed && (
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Generals
            </h3>
          )}
          <ul className="space-y-2 font-medium">
            {generalsMenu.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center text-gray-900 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700" : ""
                    } ${isCollapsed ? "justify-center p-2" : "p-3"}`}
                    title={isCollapsed ? item.title : ""}
                  >
                    <item.icon className={`flex-shrink-0 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"} ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`} />
                    {!isCollapsed && <span className="ml-3 text-sm">{item.title}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Main Menu Navigation */}
        <div className="mt-6">
          {!isCollapsed && (
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              MAIN MENU
            </h3>
          )}
          <ul className="space-y-2 font-medium">
            {mainMenu.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center text-gray-900 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group transition-all duration-300 ease-in-out transform hover:translate-x-1 ${
                      isActive ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700" : ""
                    } ${isCollapsed ? "justify-center p-2" : "p-3"}`}
                    title={isCollapsed ? item.title : ""}
                  >
                    <item.icon className={`flex-shrink-0 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"} ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"} transition-colors duration-300`} />
                    {!isCollapsed && <span className="ml-3 text-sm">{item.title}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Apps & Features Navigation */}
        <div className="mt-6">
          {!isCollapsed && (
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              APPS & FEATURES
            </h3>
          )}
          <ul className="space-y-2 font-medium">
            {menuItems.filter(item => item.section === "apps").map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center text-gray-900 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group transition-all duration-300 ease-in-out transform hover:translate-x-1 ${
                      isActive ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700" : ""
                    } ${isCollapsed ? "justify-center p-2" : "p-3"}`}
                    title={isCollapsed ? item.title : ""}
                  >
                    <item.icon className={`flex-shrink-0 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"} ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"} transition-colors duration-300`} />
                    {!isCollapsed && <span className="ml-3 text-sm">{item.title}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </aside>
    </>
  )
}

export default Sidebar
