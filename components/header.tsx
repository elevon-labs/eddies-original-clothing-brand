"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Menu, X, User } from "lucide-react"
import { useState } from "react"
import { useCart } from "./cart-provider"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <>
      {/* Top Banner */}
      <div className="bg-black text-white py-3 px-4 text-center text-sm">
        <p className="tracking-wide">
          FREE SHIPPING ON ORDERS OVER ₦50,000 | NEW ARRIVALS NOW LIVE{" "}
          <Link href="/new" className="underline underline-offset-4 font-semibold ml-2">
            SHOP NOW
          </Link>
        </p>
      </div>

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
              <Link href="/about" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">
                ABOUT
              </Link>
              <Link href="/contact" className="text-sm font-medium tracking-wide hover:text-black/60 transition-colors">
                CONTACT
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-6">
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
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-black hover:bg-black/5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-black/10 bg-white">
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
              <div className="pt-4 border-t border-black/10 flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                  <Link href="/account/login">
                    <User className="h-4 w-4 mr-2" />
                    ACCOUNT
                  </Link>
                </Button>
                <Button size="sm" asChild className="flex-1 bg-black text-white">
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
