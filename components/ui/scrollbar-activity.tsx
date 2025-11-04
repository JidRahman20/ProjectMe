"use client"

import { useEffect } from "react"

export function ScrollbarActivity() {
  useEffect(() => {
    let timeout: number | undefined

    const onScroll = () => {
      const el = document.documentElement
      el.classList.add("is-scrolling")
      if (timeout) window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        el.classList.remove("is-scrolling")
      }, 1000) as unknown as number
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (timeout) window.clearTimeout(timeout)
    }
  }, [])

  return null
}
