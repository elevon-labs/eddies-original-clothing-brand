"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { Loader2, LogOut, User, ShieldCheck, Plus, Trash2, MapPin, Check, Eye, EyeOff, Info } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// --- Types & Schemas ---

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
})

const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  line1: z.string().min(5, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "Phone number is required"),
  isDefault: z.boolean().default(false),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type AddressFormValues = z.infer<typeof addressSchema>

type Address = AddressFormValues & { id: string; userId: string }

export default function SettingsPage() {
  const { data: session, status, update: updateSession } = useSession()
  const router = useRouter()
  
  // Profile State
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Address State
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddressesLoading, setIsAddressesLoading] = useState(true)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)

  // Profile Form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      password: "",
    },
  })

  // Address Form
  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nigeria", // Default
      phone: "",
      isDefault: false,
    },
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.name) {
      profileForm.setValue("name", session.user.name)
    }
  }, [session, profileForm])

  useEffect(() => {
    if (status === "authenticated") {
      fetchAddresses()
    }
  }, [status])

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses")
      if (res.ok) {
        const data = await res.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error)
      toast.error("Failed to load addresses")
    } finally {
      setIsAddressesLoading(false)
    }
  }

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsProfileLoading(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to update profile")

      toast.success("Profile updated successfully")
      // Update session to reflect new name
      await updateSession({ name: data.name })
      profileForm.reset({ ...data, password: "" })
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsProfileLoading(false)
    }
  }

  const onAddressSubmit = async (data: AddressFormValues) => {
    setIsAddingAddress(true)
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to add address")

      const newAddress = await res.json()
      setAddresses((prev) => {
        // If new address is default, unmark others
        if (newAddress.isDefault) {
          return [...prev.map(a => ({ ...a, isDefault: false })), newAddress]
        }
        return [...prev, newAddress]
      })
      
      toast.success("Address added successfully")
      setIsAddressDialogOpen(false)
      addressForm.reset()
    } catch (error) {
      toast.error("Failed to add address")
    } finally {
      setIsAddingAddress(false)
    }
  }

  const onDeleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete address")

      setAddresses((prev) => prev.filter((a) => a.id !== id))
      toast.success("Address deleted")
    } catch (error) {
      toast.error("Failed to delete address")
    }
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (!session) return null

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

        {/* Divider */}
        <div className="hidden md:block w-px bg-black/5 self-stretch" aria-hidden="true" />

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Settings</h1>
            <p className="text-neutral-500">Manage your profile details and address book.</p>
          </div>

          {/* Profile Section */}
          <Card className="bg-white border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 bg-black/[0.02]">
              <h2 className="text-lg font-semibold text-black">Profile & Security</h2>
              <p className="text-sm text-neutral-500 mt-1">Update your name and password.</p>
            </div>
            <CardContent className="p-6">
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...profileForm.register("name")} />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Leave blank to keep current" 
                        {...profileForm.register("password")}
                        className="pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {profileForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{profileForm.formState.errors.password.message}</p>
                    )}
                    <div className="flex gap-3 pt-2">
                      <Info className="h-4 w-4 text-black/40 mt-0.5 shrink-0" />
                      <p className="text-xs text-black/60 leading-relaxed">
                        Updating this field will permanently change your login credentials. Please ensure you have securely recorded your new password.
                      </p>
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={isProfileLoading}>
                  {isProfileLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Address Book Section */}
          <Card className="bg-white border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 bg-black/[0.02] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-black">Address Book</h2>
                <p className="text-sm text-neutral-500 mt-1">Manage your shipping addresses.</p>
              </div>
              <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                    <DialogDescription>
                      Enter your shipping details below.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="address-name">Recipient Name</Label>
                      <Input id="address-name" {...addressForm.register("name")} placeholder="e.g. John Doe" />
                      {addressForm.formState.errors.name && <p className="text-sm text-red-500">{addressForm.formState.errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address-line1">Address Line 1</Label>
                      <Input id="address-line1" {...addressForm.register("line1")} placeholder="Street address" />
                      {addressForm.formState.errors.line1 && <p className="text-sm text-red-500">{addressForm.formState.errors.line1.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address-line2">Address Line 2 (Optional)</Label>
                      <Input id="address-line2" {...addressForm.register("line2")} placeholder="Apartment, suite, etc." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address-city">City</Label>
                        <Input id="address-city" {...addressForm.register("city")} />
                        {addressForm.formState.errors.city && <p className="text-sm text-red-500">{addressForm.formState.errors.city.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address-state">State</Label>
                        <Input id="address-state" {...addressForm.register("state")} />
                        {addressForm.formState.errors.state && <p className="text-sm text-red-500">{addressForm.formState.errors.state.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address-postal">Postal Code</Label>
                        <Input id="address-postal" {...addressForm.register("postalCode")} />
                        {addressForm.formState.errors.postalCode && <p className="text-sm text-red-500">{addressForm.formState.errors.postalCode.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address-country">Country</Label>
                        <Input id="address-country" {...addressForm.register("country")} />
                        {addressForm.formState.errors.country && <p className="text-sm text-red-500">{addressForm.formState.errors.country.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address-phone">Phone Number</Label>
                      <Input id="address-phone" {...addressForm.register("phone")} />
                      {addressForm.formState.errors.phone && <p className="text-sm text-red-500">{addressForm.formState.errors.phone.message}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isDefault" 
                        checked={addressForm.watch("isDefault")}
                        onCheckedChange={(checked) => addressForm.setValue("isDefault", checked as boolean)}
                      />
                      <Label htmlFor="isDefault">Set as default address</Label>
                    </div>

                    <DialogFooter>
                      <Button type="submit" disabled={isAddingAddress}>
                        {isAddingAddress ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Address"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <CardContent className="p-6">
              {isAddressesLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <MapPin className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>No addresses saved yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="relative p-4 rounded-lg border border-black/10 bg-white hover:border-black/20 transition-colors group">
                      {addr.isDefault && (
                        <div className="absolute top-4 right-4 text-xs font-medium bg-black text-white px-2 py-1 rounded">
                          Default
                        </div>
                      )}
                      <div className="pr-12">
                        <p className="font-semibold text-black">{addr.name}</p>
                        <p className="text-sm text-neutral-600 mt-1">{addr.line1}</p>
                        {addr.line2 && <p className="text-sm text-neutral-600">{addr.line2}</p>}
                        <p className="text-sm text-neutral-600">
                          {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p className="text-sm text-neutral-600">{addr.country}</p>
                        <p className="text-sm text-neutral-600 mt-2">{addr.phone}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-4 right-4 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onDeleteAddress(addr.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
