"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal, X } from "lucide-react"
import { Product } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "ALL"
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 200000])

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?isActive=true")
        if (res.ok) {
          const data = await res.json()
          // Transform API data to match ProductCard props if needed
          // API returns: id, name, price, images[], category, etc.
          // ProductCard expects: id, name, price, image, category, etc.
          const formatted: Product[] = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            image: p.images && p.images.length > 0 ? p.images[0] : "/placeholder.svg",
            images: p.images,
            category: p.category || "General",
            collection: p.collection,
            badge: p.stockCount < 5 ? "LOW STOCK" : null, // Example logic
            rating: 5.0, // Default for now
            reviews: 0,
            description: p.description,
            stockCount: p.stockCount,
            isActive: p.isActive,
            sizes: p.sizes,
            colors: p.colors
          }))
          setProducts(formatted)
        }
      } catch (e) {
        console.error("Failed to fetch products", e)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  const collections = ["ALL", "Winter Essentials", "Street Classics", "Premium Outerwear", "Accessories"]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "ALL" || product.collection === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen bg-white text-black">
      
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
                  <h3 className="font-bold text-sm tracking-wider mb-4">COLLECTIONS</h3>
                  <div className="space-y-3">
                    {collections.map((cat) => (
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
                    <h4 className="font-bold text-sm tracking-wider mb-3">COLLECTIONS</h4>
                    <div className="flex flex-wrap gap-2">
                      {collections.map((cat) => (
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
                    <div className="flex justify-between text-sm text-black font-bold">
                      <span>₦{priceRange[0].toLocaleString()}</span>
                      <span>₦{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="h-[400px] w-full rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

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

    </div>
  )
}
