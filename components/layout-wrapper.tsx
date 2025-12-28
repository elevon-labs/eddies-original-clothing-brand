"use client"

import { usePathname } from "next/navigation"

interface LayoutWrapperProps {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}

export function LayoutWrapper({ children, header, footer }: LayoutWrapperProps) {
  const pathname = usePathname()

  // Paths where Header and Footer should be hidden
  const isHiddenPage =
    pathname === "/account/login" ||
    pathname === "/account/signup" ||
    pathname === "/account/forgot-password" ||
    pathname.startsWith("/account/verify") ||
    pathname === "/api-docs" ||
    pathname.startsWith("/admin")

  return (
    <>
      {!isHiddenPage && header}
      {children}
      {!isHiddenPage && footer}
    </>
  )
}
