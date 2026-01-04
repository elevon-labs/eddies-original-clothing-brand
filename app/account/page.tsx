"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { Loader2, LogOut, User, Mail, ShieldCheck, Package, ShoppingBag, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

type OrderItem = {
  id: string
  productName: string
  quantity: number
  price: number
  selectedSize?: string
  selectedColor?: string
}

type Order = {
  id: string
  status: string
  total: number
  currency: string
  createdAt: string
  items: OrderItem[]
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders()
    }
  }, [status])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders", error)
    } finally {
      setIsOrdersLoading(false)
    }
  }

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
            <Button variant="ghost" className="w-full justify-start h-10 font-medium bg-black/5 text-black hover:bg-black/10 transition-colors" asChild>
              <Link href="/account">
                <User className="mr-3 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start h-10 font-medium text-neutral-500 hover:text-black hover:bg-black/5 transition-colors" asChild>
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
        <main className="flex-1 min-w-0 space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-black mb-2">My Profile</h1>
            <p className="text-neutral-500">Manage your personal information and account preferences.</p>
          </div>

          <Card className="bg-white border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 bg-black/[0.02]">
              <h2 className="text-lg font-semibold text-black">Personal Information</h2>
              <p className="text-sm text-neutral-500 mt-1">Update your basic profile details.</p>
            </div>
            <CardContent className="p-6 space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2.5">
                  <label className="text-sm font-medium leading-none text-black">
                    Full Name
                  </label>
                  <div className="flex h-11 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black shadow-sm items-center">
                    {session.user?.name}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-medium leading-none text-black">
                    Email Address
                  </label>
                  <div className="flex h-11 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black shadow-sm items-center">
                    {session.user?.email}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full shrink-0">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">Authentication Method</p>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      You are currently signed in via <span className="font-medium text-black">{session.user?.image?.includes("google") ? "Google" : "Email & Password"}</span>.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History Section */}
          <Card className="bg-white border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 bg-black/[0.02]">
              <h2 className="text-lg font-semibold text-black">Order History</h2>
              <p className="text-sm text-neutral-500 mt-1">View and track your past orders.</p>
            </div>
            <CardContent className="p-6">
              {isOrdersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-neutral-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-medium text-black">No orders yet</h3>
                  <p className="text-neutral-500 mt-1 max-w-sm mx-auto">
                    Looks like you haven&apos;t placed any orders yet. Start shopping to fill up your wardrobe!
                  </p>
                  <Button asChild className="mt-6">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-black/10 rounded-lg overflow-hidden">
                      <div className="bg-neutral-50/50 p-4 border-b border-black/5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <p className="text-neutral-500 mb-0.5">Order Placed</p>
                            <p className="font-medium text-black">
                              {format(new Date(order.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div>
                            <p className="text-neutral-500 mb-0.5">Total Amount</p>
                            <p className="font-medium text-black">
                              {(order.total / 100).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                            </p>
                          </div>
                          <div>
                            <p className="text-neutral-500 mb-0.5">Status</p>
                            <Badge variant={
                              order.status === "paid" ? "default" : 
                              order.status === "shipped" ? "secondary" : 
                              order.status === "delivered" ? "outline" : 
                              "destructive"
                            } className="capitalize">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2" asChild>
                          <Link href={`/account/orders/${order.id}`}>
                            View Details <ChevronRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                      <div className="p-4 space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-neutral-100 rounded-md flex items-center justify-center text-neutral-300">
                              <Package className="h-8 w-8" />
                              {/* TODO: Add product image here when available in OrderItem */}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-black truncate">{item.productName}</p>
                              <p className="text-sm text-neutral-500">
                                Qty: {item.quantity} 
                                {item.selectedSize && ` • Size: ${item.selectedSize}`}
                                {item.selectedColor && ` • Color: ${item.selectedColor}`}
                              </p>
                            </div>
                            <p className="font-medium text-black text-sm">
                              {(item.price / 100).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
