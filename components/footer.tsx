import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Facebook } from "lucide-react"
import { TikTok } from "@/components/icons"

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 tracking-tight">EDDIE ORIGINALS</h3>
            <p className="text-white/60 mb-6 max-w-md leading-relaxed text-balance">
              Premium luxury streetwear with identity. Born in Ejigbo, Lagos Nigeria, designed for the world. Every piece crafted with
              confidence, purpose, and style.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-white hover:bg-white/10 border border-white/20"
              >
                <Link href="https://instagram.com/eddie_originals_" target="_blank">
                  <Instagram className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-white hover:bg-white/10 border border-white/20"
              >
                <Link href="https://tiktok.com/@eddie_originals" target="_blank">
                  <TikTok className="h-5 w-5" />
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
                <Link href="/new" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  Collections
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
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 tracking-wider text-sm">ACCOUNT</h4>
            <ul className="space-y-3 text-white/60">
              <li>
                <Link href="/account/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/account/signup" className="hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">© 2025 Eddie Originals. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
