"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CollectionsPage() {
  const collections = [
    {
      id: "winter",
      title: "WINTER ESSENTIALS",
      description: "Premium hoodies, jackets, and layering pieces engineered for the cold season. Stay warm without compromising on style.",
      image: "/winter-streetwear-collection-black.jpg",
      link: "/shop?category=Outerwear", // Linking to filtered shop view
      featured: true
    },
    {
      id: "classics",
      title: "STREET CLASSICS",
      description: "Timeless streetwear staples that never go out of style. The foundation of every modern wardrobe.",
      image: "/classic-streetwear-black-white.jpg",
      link: "/shop?category=Essentials",
      featured: false
    },
    {
      id: "outerwear",
      title: "PREMIUM OUTERWEAR",
      description: "Luxury jackets and coats crafted for maximum style, comfort, and durability in any condition.",
      image: "/luxury-outerwear-black-streetwear.jpg",
      link: "/shop?category=Outerwear",
      featured: false
    },
     {
      id: "accessories",
      title: "ACCESSORIES",
      description: "The finishing touches. Hats, bags, and gear to complete your look.",
      image: "/black-utility-vest-streetwear.jpg", 
      link: "/shop?category=Accessories",
      featured: false
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-neutral-900 text-white">
         <div className="absolute inset-0 opacity-50">
           <img 
            src="/luxury-streetwear-fashion-editorial-black-and-whit.jpg" 
            alt="Collections Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Collections
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Curated edits of our finest pieces. Explore the stories behind the style.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {collections.map((collection, index) => (
            <div 
              key={collection.id} 
              className={`flex flex-col lg:flex-row gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2 relative group overflow-hidden rounded-2xl aspect-[4/5] lg:aspect-square">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <div className="inline-block mb-4 px-3 py-1 bg-neutral-100 text-black/60 text-xs tracking-[0.2em] font-semibold rounded-full">
                  COLLECTION 0{index + 1}
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                  {collection.title}
                </h2>
                <p className="text-lg text-black/60 leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                  {collection.description}
                </p>
                <Button 
                  size="lg" 
                  asChild
                  className="bg-black text-white hover:bg-black/70 px-8"
                >
                  <Link href={collection.link}>
                    EXPLORE COLLECTION <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Archive / Previous Collections (Visual Filler) */}
      <section className="py-24 bg-neutral-950 text-white px-6">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-12">From The Archive</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
                 <div className="aspect-square bg-neutral-800 flex items-center justify-center border border-white/10 rounded-lg">
                    <span className="text-sm tracking-widest">SUMMER '24</span>
                 </div>
                 <div className="aspect-square bg-neutral-800 flex items-center justify-center border border-white/10 rounded-lg">
                    <span className="text-sm tracking-widest">SPRING '24</span>
                 </div>
                 <div className="aspect-square bg-neutral-800 flex items-center justify-center border border-white/10 rounded-lg">
                    <span className="text-sm tracking-widest">FALL '23</span>
                 </div>
                 <div className="aspect-square bg-neutral-800 flex items-center justify-center border border-white/10 rounded-lg">
                    <span className="text-sm tracking-widest">CORE</span>
                 </div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
