"use client"

import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NewArrivalsPage() {
  const products = [
    {
      id: 1,
      name: "Signature Oversized Tee",
      price: 45000,
      originalPrice: 65000,
      image: "/black-oversized-tee-luxury-streetwear.jpg",
      category: "Essentials",
      badge: "NEW",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 8,
      name: "Premium Windbreaker",
      price: 135000,
      image: "/black-windbreaker-premium-streetwear.jpg",
      category: "Outerwear",
      badge: "NEW",
      rating: 4.7,
      reviews: 67,
    },
    {
      id: 12,
      name: "Puffer Jacket",
      price: 165000,
      image: "/black-bomber-jacket-luxury-fashion.jpg",
      category: "Outerwear",
      badge: "NEW",
      rating: 4.8,
      reviews: 58,
    },
     {
      id: 2,
      name: "Premium Cargo Pants",
      price: 85000,
      image: "/black-cargo-streetwear.png",
      category: "Bottoms",
      badge: "TRENDING", // Including trending as "new" for volume
      rating: 4.9,
      reviews: 89,
    },
     {
      id: 5,
      name: "Urban Bomber Jacket",
      price: 145000,
      image: "/black-bomber-streetwear.png",
      category: "Outerwear",
      badge: "EXCLUSIVE", // Including exclusive
      rating: 4.9,
      reviews: 45,
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="/black-hoodie-luxury-street-fashion.jpg" 
            alt="New Arrivals Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-6">
          <div className="inline-block mb-6 px-4 py-1 border border-white/30 backdrop-blur-sm rounded-full text-xs tracking-[0.25em] font-semibold">
            JUST DROPPED
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            New Arrivals
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Discover the latest additions to the Eddie Originals collection. Fresh fits, premium materials, and bold designs defining the season.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-2">Latest Drops</h2>
              <p className="text-black/60">Be the first to wear our newest releases.</p>
            </div>
             <Button asChild className="hidden sm:flex bg-black text-white hover:bg-black/80">
                <Link href="/shop">
                  View All Products <ArrowRight className="ml-2 h-4 w-4"/>
                </Link>
             </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
           <div className="mt-16 text-center sm:hidden">
             <Button size="lg" asChild className="w-full bg-black text-white hover:bg-black/70">
                <Link href="/shop">
                  View All Products
                </Link>
             </Button>
          </div>
        </div>
      </div>
      
      {/* Newsletter / Drop Alert */}
      <section className="py-24 bg-neutral-50 border-t border-black/5">
        <div className="max-w-xl mx-auto px-6 text-center">
             <h2 className="text-3xl font-bold tracking-tighter mb-4">Never Miss a Drop</h2>
             <p className="text-black/60 mb-8">
               Subscribe to our newsletter to get early access to new arrivals, exclusive releases, and limited edition drops.
             </p>
             <form className="flex flex-col sm:flex-row gap-4 sm:gap-3 w-full max-w-md mx-auto items-stretch">
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="flex-1 h-12 px-4 bg-white border border-black/10 rounded-lg focus:outline-none focus:border-black transition-colors w-full"
               />
               <Button size="lg" className="h-12 bg-black text-white hover:bg-black/80 px-8 w-full sm:w-auto">
                 Subscribe
               </Button>
             </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
