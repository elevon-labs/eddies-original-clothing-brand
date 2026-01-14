"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react"
import { useEffect, useState, Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-black/5 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-black/5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order ID</p>
          <p className="font-mono font-medium text-lg">{orderId || "Processing..."}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          We've sent a confirmation email with your order details and tracking information.
        </p>

        <div className="pt-4 space-y-3">
          <Link href="/shop" className="block w-full">
            <Button className="w-full h-11 bg-black text-white hover:bg-black/90">
              Continue Shopping
            </Button>
          </Link>
          
          <Link href="/account/orders" className="block w-full">
            <Button variant="outline" className="w-full h-11">
              View My Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
