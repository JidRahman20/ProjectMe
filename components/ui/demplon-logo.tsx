"use client"

import React from "react"
import Image from "next/image"
import { useSidebar } from "@/context/sidebar-context"

type DemplonLogoProps = {
  className?: string
  size?: number // height in px
}

export const DemplonLogo: React.FC<DemplonLogoProps> = ({ className = "", size = 28 }) => {
  const { isCollapsed } = useSidebar()
  
  // Logo lebih besar ketika sidebar dibuka, mengecil ketika sidebar ditutup
  const logoSize = isCollapsed ? size * 0.6 : size * 2.2
  
  return (
    <div className={`relative select-none transition-all duration-500 ${className}`} aria-label="demplon">
      <Image
        src="/Demplon.png"
        alt="Demplon Logo"
        width={logoSize * 4}
        height={logoSize}
        style={{ height: logoSize, width: 'auto' }}
        priority
      />
    </div>
  )
}

export default DemplonLogo
