"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { calculateShipping } from "@/lib/utils"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()
  const { data: session } = useSession()
  const router = useRouter()

  const shippingCost = useMemo(() => calculateShipping(total), [total])
  const finalTotal = useMemo(() => total + shippingCost, [total, shippingCost])

  const handleCheckout = () => {
    if (!session) {
      router.push("/account/login?callbackUrl=/cart")
      return
    }
    // Proceed to checkout logic here
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black">
        
        <div className="pt-20 pb-32 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-neutral-100 rounded-full">
              <ShoppingBag className="h-12 w-12 text-black/40" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Your Cart is Empty</h1>
            <p className="text-lg text-black/60 mb-8">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Button
              size="lg"
              asChild
              className="bg-black text-white hover:bg-black/90 font-semibold tracking-wide px-10"
            >
              <Link href="/shop">
                CONTINUE SHOPPING
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      
      <div className="pt-8 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tracking-tight">Shopping Cart</h1>
          <p className="text-base sm:text-lg text-black/60 mb-8 md:mb-12">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {items.map((item) => (
                <div key={item.cartId} className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-neutral-50 rounded-lg border border-black/5">
                  <div className="relative w-full sm:w-32 h-48 sm:h-40 flex-shrink-0 bg-neutral-200 rounded-lg overflow-hidden">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        {item.size && <p className="text-sm text-black/60">Size: {item.size}</p>}
                        {item.color && (
                          <div className="flex items-center gap-2 text-sm text-black/60 mt-1">
                            <span>Color:</span>
                            <div
                              className="w-4 h-4 rounded-full border border-black/10"
                              style={{ backgroundColor: item.colorHex || item.color }}
                            />
                            <span>{item.color}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.cartId)}
                        className="text-black/60 hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2 sm:mt-0 sm:mr-0"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-end mt-4 sm:mt-0">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="h-8 w-8 bg-white"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="h-8 w-8 bg-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg sm:text-xl">₦{(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-sm text-black/50">₦{item.price.toLocaleString()} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-4 lg:mt-0">
              <div className="bg-black text-white p-6 sm:p-8 rounded-lg sticky top-32">
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-white/20">
                  <div className="flex justify-between">
                    <span className="text-white/70">Subtotal</span>
                    <span className="font-semibold">₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Shipping</span>
                    <span className="font-semibold">₦{shippingCost.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">₦{finalTotal.toLocaleString()}</span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-white text-black hover:bg-white/90 font-semibold tracking-wide h-14 mb-4"
                  onClick={handleCheckout}
                >
                  {session ? "PROCEED TO CHECKOUT" : "SIGN IN TO CHECKOUT"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full border-white/20 text-white hover:bg-white/10 font-semibold tracking-wide h-14 bg-transparent"
                >
                  <Link href="/shop">CONTINUE SHOPPING</Link>
                </Button>

                <div className="mt-6 pt-6 border-t border-white/20 space-y-3 text-sm text-white/70">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-white/10 rounded-full border border-white/10">
                       <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-white/10 rounded-full border border-white/10">
                       <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>No refund policy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-white/10 rounded-full border border-white/10">
                       <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Authentic products guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
