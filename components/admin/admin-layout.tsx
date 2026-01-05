"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { type ReactNode, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, Mail, MessageSquare, LogOut, ChevronRight, Menu } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Inbox", href: "/admin/inbox", icon: MessageSquare },
]

import { signOut } from "next-auth/react"

export function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/account/login" })
  }

  const NavContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-neutral-800 px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="text-xl font-bold tracking-tight text-white">EDDIE ORIGINALS</div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-6">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive ? "bg-white text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white",
                )}
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="border-t border-neutral-800 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-400 hover:bg-neutral-900 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-50 admin-theme text-foreground">
      {/* Mobile Header */}
      <div className="flex h-16 items-center border-b border-neutral-200 bg-black px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-neutral-800">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-r border-neutral-800 bg-black p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
        <div className="ml-4 text-lg font-bold text-white">Admin</div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-neutral-800 lg:block">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="container max-w-7xl py-4 lg:py-8 px-4 sm:px-6">{children}</div>
      </main>
    </div>
  )
}
