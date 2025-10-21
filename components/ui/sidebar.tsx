"use client"

import React from "react"
import { useSidebar } from "@/context/sidebar-context"
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

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed } = useSidebar()
  
  const generalsMenu = menuItems.filter(item => item.section === "generals")
  const mainMenu = menuItems.filter(item => item.section === "main")
  
  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen pt-20 bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-[-12px] top-24 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50"
        suppressHydrationWarning
      >
        {isCollapsed ? (
          <Menu className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <div className={`h-full pb-4 overflow-y-auto bg-white ${isCollapsed ? "px-1" : "px-3"}`}>
        {/* Profile Section */}
        <div className={`flex items-center gap-4 p-4 ${isCollapsed ? "justify-center px-0" : ""}`}>
          <div className={`${isCollapsed ? "flex justify-center w-full" : ""}`}>
            <Image
              className="w-8 h-8 rounded-full flex-shrink-0"
              src="/kujang.jpg"
              alt="User"
              width={32}
              height={32}
              priority
            />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="text-base font-semibold truncate">humaniora</h2>
              <p className="text-sm text-gray-500 truncate">000000</p>
            </div>
          )}
        </div>

        {/* Generals Navigation */}
        <div className="mt-2">
          {!isCollapsed && (
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
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
                    className={`flex items-center text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      isActive ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""
                    } ${isCollapsed ? "justify-center p-2" : "p-3"}`}
                    title={isCollapsed ? item.title : ""}
                  >
                    <item.icon className={`flex-shrink-0 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"} ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"}`} />
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
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
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
                    className={`flex items-center text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      isActive ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""
                    } ${isCollapsed ? "justify-center p-2" : "p-3"}`}
                    title={isCollapsed ? item.title : ""}
                  >
                    <item.icon className={`flex-shrink-0 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"} ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"}`} />
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
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
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
                    className={`flex items-center text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      isActive ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""
                    } ${isCollapsed ? "justify-center p-2" : "p-3"}`}
                    title={isCollapsed ? item.title : ""}
                  >
                    <item.icon className={`flex-shrink-0 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"} ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"}`} />
                    {!isCollapsed && <span className="ml-3 text-sm">{item.title}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
