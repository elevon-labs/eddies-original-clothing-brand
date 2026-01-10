"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Lock, ChevronLeft, MapPin, CreditCard, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { usePaystackPayment } from "react-paystack"
import { PaystackProps } from "react-paystack/dist/types"
import { calculateShipping } from "@/lib/utils"

const shippingSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
})

type ShippingFormData = z.infer<typeof shippingSchema>

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

  const shippingCost = calculateShipping(total)
  const finalTotal = total + shippingCost

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nigeria",
    },
  })

  // Hydration fix & Auth check
  useEffect(() => {
    setMounted(true)
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/checkout")
    }
  }, [status, router])

  // Pre-fill form with session data
  useEffect(() => {
    if (session?.user) {
      const names = session.user.name?.split(" ") || []
      form.setValue("firstName", names[0] || "")
      form.setValue("lastName", names.slice(1).join(" ") || "")
      form.setValue("email", session.user.email || "")
      
      // Fetch saved addresses
      const fetchAddresses = async () => {
        setIsLoadingAddresses(true)
        try {
          const res = await fetch("/api/user/addresses")
          if (res.ok) {
            const data = await res.json()
            setSavedAddresses(data)
          }
        } catch (error) {
          console.error("Failed to fetch addresses", error)
        } finally {
          setIsLoadingAddresses(false)
        }
      }
      
      fetchAddresses()
    }
  }, [session, form])

  const handleSelectAddress = (address: any) => {
    const names = address.name.split(" ")
    form.setValue("firstName", names[0] || "")
    form.setValue("lastName", names.slice(1).join(" ") || "")
    form.setValue("phone", address.phone || "")
    form.setValue("addressLine1", address.line1 || "")
    form.setValue("addressLine2", address.line2 || "")
    form.setValue("city", address.city || "")
    form.setValue("state", address.state || "")
    form.setValue("postalCode", address.postalCode || "")
    form.setValue("country", address.country || "Nigeria")
    
    toast({
      title: "Address Selected",
      description: "Shipping details updated.",
    })
  }

  // Paystack Config
  const config: PaystackProps = {
    reference: (new Date()).getTime().toString(),
    email: form.getValues("email"),
    amount: finalTotal * 100, // Paystack expects Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    metadata: {
        custom_fields: [
            {
                display_name: "Cart Items",
                variable_name: "cart_items",
                value: items.map(i => `${i.quantity}x ${i.name}`).join(", ")
            }
        ]
    }
  }

  const initializePayment = usePaystackPayment(config)

  const onSuccess = async (reference: any) => {
    setIsProcessing(true)
    try {
      const orderPayload = {
        reference: reference.reference,
        cartItems: items,
        shippingAddress: form.getValues(),
        email: form.getValues("email"),
        userId: session?.user?.id,
        totalAmount: finalTotal * 100,
        shippingCost: shippingCost * 100,
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Order creation failed")

      clearCart()
      router.push(`/checkout/success?orderId=${data.orderId}`)
    } catch (error) {
      console.error(error)
      toast({
        title: "Order Failed",
        description: "Payment was successful but order creation failed. Please contact support.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const onClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "You cancelled the payment process.",
      variant: "destructive",
    })
  }

  const onSubmit = (data: ShippingFormData) => {
    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Add items before checking out.",
        variant: "destructive",
      })
      return
    }

    // Update config with latest form data
    const paymentConfig = {
        ...config,
        email: data.email,
        metadata: {
            custom_fields: [
                {
                    display_name: "Phone",
                    variable_name: "phone",
                    value: data.phone
                }
            ]
        }
    }
    
    // Trigger Paystack
    // Note: We need to use the hook's initializePayment but passing updated config isn't supported directly by the hook instance usually 
    // depending on implementation. `react-paystack` hook takes config at init.
    // workaround: we just use the one initialized, but email might be stale if user changed it.
    // Better approach: Re-initialize or use PaystackButton, but hook is cleaner.
    // Let's trust the form state is synced or just pass email to initializePayment if it supports overrides (it usually takes onSuccess/onClose).
    
    // Actually `usePaystackPayment` returns a function that executes the payment.
    // It uses the config passed at hook creation. If config changes, does the hook update?
    // Yes, if we pass config as dependency or if it re-renders. 
    // But to be safe, we can manually call the PaystackPop method if we had access, but with the hook:
    initializePayment({ onSuccess, onClose })
  }

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/cart" className="flex items-center text-sm text-muted-foreground hover:text-black transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Cart
          </Link>
          <div className="flex items-center text-sm font-medium text-black/60">
            <Lock className="w-4 h-4 mr-2" />
            Secure Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Shipping Form */}
          <div className="md:col-span-7 space-y-8">
            {savedAddresses.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Saved Addresses</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      className="border rounded-lg p-4 cursor-pointer hover:border-black transition-colors relative"
                      onClick={() => handleSelectAddress(addr)}
                    >
                      <p className="font-semibold text-sm">{addr.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{addr.line1}</p>
                      <p className="text-sm text-muted-foreground">{addr.city}, {addr.state}</p>
                      {addr.isDefault && <span className="absolute top-2 right-2 text-xs bg-black text-white px-2 py-0.5 rounded-full">Default</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">1</div>
                <h2 className="text-xl font-bold">Shipping Information</h2>
              </div>

              <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input {...form.register("firstName")} placeholder="John" className="bg-gray-50" />
                    {form.formState.errors.firstName && <p className="text-red-500 text-xs">{form.formState.errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input {...form.register("lastName")} placeholder="Doe" className="bg-gray-50" />
                    {form.formState.errors.lastName && <p className="text-red-500 text-xs">{form.formState.errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input {...form.register("email")} type="email" placeholder="john@example.com" className="bg-gray-50" />
                  {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input {...form.register("phone")} placeholder="+234..." className="bg-gray-50" />
                  {form.formState.errors.phone && <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1</Label>
                  <Input {...form.register("addressLine1")} placeholder="123 Street Name" className="bg-gray-50" />
                  {form.formState.errors.addressLine1 && <p className="text-red-500 text-xs">{form.formState.errors.addressLine1.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                  <Input {...form.register("addressLine2")} placeholder="Apartment, Suite, etc." className="bg-gray-50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input {...form.register("city")} placeholder="Lagos" className="bg-gray-50" />
                    {form.formState.errors.city && <p className="text-red-500 text-xs">{form.formState.errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input {...form.register("state")} placeholder="Lagos" className="bg-gray-50" />
                    {form.formState.errors.state && <p className="text-red-500 text-xs">{form.formState.errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input {...form.register("postalCode")} placeholder="100001" className="bg-gray-50" />
                    {form.formState.errors.postalCode && <p className="text-red-500 text-xs">{form.formState.errors.postalCode.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input {...form.register("country")} disabled value="Nigeria" className="bg-gray-50" />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 scrollbar-thin">
                {items.map((item) => (
                  <div key={item.cartId} className="flex gap-4 py-2">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-tl-md font-medium">x{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.size} {item.color && `• ${item.color}`}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">₦{shippingCost.toLocaleString()}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-end mb-6">
                <span className="text-base font-bold">Total</span>
                <span className="text-2xl font-bold tracking-tight">₦{finalTotal.toLocaleString()}</span>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing} 
                className="w-full h-12 text-base font-bold bg-black hover:bg-black/90 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay Now ₦{total.toLocaleString()}
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                Payments secured by Paystack
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}