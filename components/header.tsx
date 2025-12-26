"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Menu, X, User, LogOut, Settings, UserCircle } from "lucide-react"
import { useState } from "react"
import { useCart } from "./cart-provider"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { itemCount } = useCart()
  const { data: session } = useSession()

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center gap-3 md:gap-4 text-base md:text-xl font-bold tracking-tight">
              <img src="/logo.jpg" alt="Eddie Originals Logo" className="h-9 w-auto md:h-11 rounded-full object-contain" />
              <span>EDDIE ORIGINALS</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10 xl:gap-14">
              <Link href="/shop" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">
                SHOP ALL
              </Link>
              <Link
                href="/collections"
                className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors"
              >
                COLLECTIONS
              </Link>
              <Link href="/new" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">
                NEW ARRIVALS
              </Link>
              {!session && (
                <>
                  <Link href="/about" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">
                    ABOUT
                  </Link>
                  <Link href="/contact" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">
                    CONTACT
                  </Link>
                </>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-6">
              <Button
                size="sm"
                asChild
                className="bg-black text-white hover:bg-black/90 text-sm font-medium tracking-wide px-6"
              >
                <Link href="/cart" className="relative">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  CART
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </Button>

              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent">
                      <Avatar className="h-10 w-10 border border-black/10">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback className="bg-white text-black border border-black/10">{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white text-black border-neutral-100 shadow-lg" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                        <p className="text-xs leading-none text-neutral-500">
                          {session.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-neutral-100" />
                    <DropdownMenuItem asChild className="focus:bg-neutral-50 focus:text-black">
                      <Link href="/account" className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-neutral-50 focus:text-black">
                      <Link href="/contact" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Contact Us</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-neutral-100" />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  asChild 
                  size="sm"
                  className="bg-transparent border border-black text-black hover:bg-black hover:text-white transition-colors text-sm font-medium tracking-wide px-6"
                >
                  <Link href="/account/login">
                    <User className="h-4 w-4 mr-2" />
                    ACCOUNT
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                size="icon"
                variant="ghost"
                asChild
                className="text-black hover:bg-black/5 relative"
              >
                <Link href="/cart">
                  <ShoppingBag className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-black hover:bg-black/5"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-black/10 bg-white text-black">
            <div className="px-6 py-6 space-y-4">
              <Link
                href="/shop"
                className="block text-sm font-medium tracking-wide py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                SHOP ALL
              </Link>
              <Link
                href="/collections"
                className="block text-sm font-medium tracking-wide py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                COLLECTIONS
              </Link>
              <Link
                href="/new"
                className="block text-sm font-medium tracking-wide py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                NEW ARRIVALS
              </Link>
              {!session && (
                <>
                  <Link
                    href="/about"
                    className="block text-sm font-medium tracking-wide py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ABOUT
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-sm font-medium tracking-wide py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    CONTACT
                  </Link>
                </>
              )}
              <div className="pt-4 border-t border-black/10 flex flex-col gap-2">
                {session ? (
                   <div className="space-y-2">
                      <div className="flex items-center gap-3 py-2">
                        <Avatar className="h-8 w-8 border border-black/10">
                          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                          <AvatarFallback className="bg-black text-white text-xs">{userInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{session.user?.name}</span>
                          <span className="text-xs text-black/60">{session.user?.email}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent text-black border-black/10">
                        <Link href="/account">
                          <UserCircle className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </Button>
                   </div>
                ) : (
                  <Button variant="outline" size="sm" asChild className="w-full bg-transparent text-black border-black/10">
                    <Link href="/account/login">
                      <User className="h-4 w-4 mr-2" />
                      ACCOUNT
                    </Link>
                  </Button>
                )}
                
                <Button size="sm" asChild className="w-full bg-black text-white mt-2">
                  <Link href="/cart" className="relative">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    CART ({itemCount})
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
