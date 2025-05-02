'use client'

import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import { shouldShowNavbar } from "@/lib/utils"

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      {shouldShowNavbar(pathname) && <Navbar />}
      <main className={shouldShowNavbar(pathname) ? "pt-16" : ""}>
        {children}
      </main>
    </>
  )
}