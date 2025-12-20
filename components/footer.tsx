import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 tracking-tight">EDDIE ORIGINALS</h3>
            <p className="text-white/60 mb-6 max-w-md leading-relaxed text-balance">
              Premium luxury streetwear with identity. Born in Lagos, designed for the world. Every piece crafted with
              confidence, purpose, and style.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-white hover:bg-white/10 border border-white/20"
              >
                <Link href="https://instagram.com/eddieoriginals" target="_blank">
                  <Instagram className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-white hover:bg-white/10 border border-white/20"
              >
                <Link href="https://twitter.com/eddieoriginals" target="_blank">
                  <Twitter className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-white hover:bg-white/10 border border-white/20"
              >
                <Link href="https://facebook.com/eddieoriginals" target="_blank">
                  <Facebook className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 tracking-wider text-sm">SHOP</h4>
            <ul className="space-y-3 text-white/60">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop/new" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop/essentials" className="hover:text-white transition-colors">
                  Essentials
                </Link>
              </li>
              <li>
                <Link href="/shop/outerwear" className="hover:text-white transition-colors">
                  Outerwear
                </Link>
              </li>
              <li>
                <Link href="/shop/bottoms" className="hover:text-white transition-colors">
                  Bottoms
                </Link>
              </li>
              <li>
                <Link href="/shop/accessories" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 tracking-wider text-sm">COMPANY</h4>
            <ul className="space-y-3 text-white/60">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-white transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 tracking-wider text-sm">SUPPORT</h4>
            <ul className="space-y-3 text-white/60">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">© 2025 Eddie Originals. All rights reserved.</p>
            <div className="flex gap-6 text-white/40 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
