"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { Loader2, LogOut, User, Mail, ShieldCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userInitials = session.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <div className="container max-w-5xl py-12 md:py-16 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
        {/* Sidebar / Navigation */}
        <aside className="w-full md:w-64 space-y-6 shrink-0">
          <div className="flex items-center gap-4 p-4 border border-black/5 rounded-xl bg-white shadow-sm">
            <Avatar className="h-12 w-12 border border-black/10 shrink-0">
              <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
              <AvatarFallback className="bg-white text-black font-medium">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate text-black">{session.user?.name}</p>
              <p className="text-xs text-neutral-500 truncate">{session.user?.email}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start h-10 font-medium text-neutral-500 hover:text-black hover:bg-black/5 transition-colors" asChild>
              <Link href="/account">
                <User className="mr-3 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start h-10 font-medium bg-black/5 text-black hover:bg-black/10 transition-colors" asChild>
              <Link href="/account/settings">
                <ShieldCheck className="mr-3 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <div className="pt-4 mt-4 border-t border-black/5">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-10 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Log out
              </Button>
            </div>
          </nav>
        </aside>

        {/* Divider - Only visible on desktop */}
        <div className="hidden md:block w-px bg-black/5 self-stretch" aria-hidden="true" />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Settings</h1>
            <p className="text-neutral-500">Manage your preferences and security.</p>
          </div>

          <Card className="bg-white border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 bg-black/[0.02]">
              <h2 className="text-lg font-semibold text-black">Security Settings</h2>
              <p className="text-sm text-neutral-500 mt-1">Password and authentication preferences.</p>
            </div>
            <CardContent className="p-6">
              <div className="text-sm text-neutral-500 italic">
                Settings features will be available soon.
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
