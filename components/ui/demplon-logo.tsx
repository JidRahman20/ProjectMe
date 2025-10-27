"use client"

import React, { useContext } from "react"
import Image from "next/image"
import { SidebarContext } from "@/context/sidebar-context"

type DemplonLogoProps = {
  className?: string
  size?: number // height in px
  standalone?: boolean // untuk digunakan tanpa sidebar context
}

export const DemplonLogo: React.FC<DemplonLogoProps> = ({ 
  className = "", 
  size = 28,
  standalone = false 
}) => {
  // Gunakan useContext langsung, bukan useSidebar hook
  const sidebarContext = useContext(SidebarContext)
  
  // Jika standalone atau tidak ada context, gunakan ukuran default
  const isCollapsed = standalone || !sidebarContext ? false : (sidebarContext?.isCollapsed ?? false)
  
  // Logo lebih besar ketika sidebar dibuka, mengecil ketika sidebar ditutup
  const logoSize = standalone ? size : (isCollapsed ? size * 0.6 : size * 2.2)
  
  // Jika className mengandung width (w-), gunakan className, jika tidak gunakan size prop
  const hasCustomWidth = className.includes('w-') || className.includes('max-w-')
  
  return (
    <div className={`relative select-none transition-all duration-500 ${hasCustomWidth ? className : ''}`} aria-label="demplon">
      <Image
        src="/Demplon.png"
        alt="Demplon Logo"
        width={hasCustomWidth ? 500 : logoSize * 4}
        height={hasCustomWidth ? 500 : logoSize}
        style={hasCustomWidth ? { width: '100%', height: 'auto' } : { height: logoSize, width: 'auto' }}
        className={hasCustomWidth ? className : ''}
        priority
      />
    </div>
  )
}

export default DemplonLogo
