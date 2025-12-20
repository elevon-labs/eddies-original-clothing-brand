"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal, X } from "lucide-react"

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 200000])

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
      id: 2,
      name: "Premium Cargo Pants",
      price: 85000,
      image: "/black-cargo-streetwear.png",
      category: "Bottoms",
      badge: "TRENDING",
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 3,
      name: "Statement Hoodie",
      price: 95000,
      originalPrice: 120000,
      image: "/black-hoodie-luxury-street-fashion.jpg",
      category: "Tops",
      badge: "SALE",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 4,
      name: "Essential Track Jacket",
      price: 120000,
      image: "/black-track-jacket-modern-streetwear.jpg",
      category: "Outerwear",
      rating: 4.6,
      reviews: 73,
    },
    {
      id: 5,
      name: "Urban Bomber Jacket",
      price: 145000,
      image: "/black-bomber-streetwear.png",
      category: "Outerwear",
      badge: "EXCLUSIVE",
      rating: 4.9,
      reviews: 45,
    },
    {
      id: 6,
      name: "Classic Joggers",
      price: 65000,
      image: "/black-joggers-streetwear.jpg",
      category: "Bottoms",
      rating: 4.5,
      reviews: 198,
    },
    {
      id: 7,
      name: "Graphic Crewneck",
      price: 55000,
      originalPrice: 75000,
      image: "/black-crewneck-graphic-streetwear.jpg",
      category: "Essentials",
      badge: "SALE",
      rating: 4.8,
      reviews: 142,
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
      id: 9,
      name: "Relaxed Fit Tee",
      price: 38000,
      image: "/black-relaxed-tee-streetwear.jpg",
      category: "Essentials",
      rating: 4.6,
      reviews: 203,
    },
    {
      id: 10,
      name: "Wide Leg Pants",
      price: 92000,
      image: "/black-wide-leg-pants-luxury.jpg",
      category: "Bottoms",
      badge: "TRENDING",
      rating: 4.8,
      reviews: 112,
    },
    {
      id: 11,
      name: "Oversized Hoodie",
      price: 105000,
      originalPrice: 130000,
      image: "/black-oversized-hoodie-premium.jpg",
      category: "Tops",
      badge: "SALE",
      rating: 4.9,
      reviews: 176,
    },
    {
      id: 12,
      name: "Puffer Jacket",
      price: 165000,
      image: "/black-puffer-jacket-luxury-streetwear.jpg",
      category: "Outerwear",
      badge: "NEW",
      rating: 4.8,
      reviews: 58,
    },
  ]

  const categories = ["ALL", "Essentials", "Tops", "Bottoms", "Outerwear"]

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "ALL" || product.category === selectedCategory
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    return categoryMatch && priceMatch
  })

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      <div className="pt-8 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">Shop All</h1>
            <p className="text-lg text-black/60">Explore our complete collection of premium streetwear</p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-32">
                <div className="mb-8">
                  <h3 className="font-bold text-sm tracking-wider mb-4">CATEGORIES</h3>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left text-sm transition-colors ${
                          selectedCategory === cat ? "font-bold text-black" : "text-black/60 hover:text-black"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-sm tracking-wider mb-4">PRICE RANGE</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={200000}
                    step={5000}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-black/60">
                    <span>₦{priceRange[0].toLocaleString()}</span>
                    <span>₦{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-sm tracking-wider mb-4">SIZE</h3>
                  <div className="space-y-3">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <label key={size} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-sm tracking-wider mb-4">COLOR</h3>
                  <div className="flex gap-2">
                    {["#000000", "#FFFFFF", "#808080", "#404040"].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-full border-2 border-black/10 hover:border-black transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-6 flex justify-between items-center">
                <p className="text-sm text-black/60">{filteredProducts.length} products</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-transparent"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mb-8 p-6 bg-neutral-50 rounded-lg border border-black/10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-sm tracking-wider mb-3">CATEGORIES</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          variant={selectedCategory === cat ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(cat)}
                          className={selectedCategory === cat ? "bg-black text-white" : "bg-transparent"}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-sm tracking-wider mb-3">PRICE RANGE</h4>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={200000}
                      step={5000}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-black/60">
                      <span>₦{priceRange[0].toLocaleString()}</span>
                      <span>₦{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* No Results */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-xl text-black/60 mb-4">No products found</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("ALL")
                      setPriceRange([0, 200000])
                    }}
                    className="bg-transparent"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
