"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { useState } from "react"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  badge?: string
  rating?: number
  reviews?: number
}

export function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("[v0] Adding to cart:", product.id)
    // Add to cart logic here
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    console.log("[v0] Wishlist toggled:", product.id, !isWishlisted)
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4 rounded-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badge && (
              <span
                className={`text-xs font-bold tracking-wider px-3 py-1 rounded-full ${
                  product.badge === "SALE"
                    ? "bg-red-600 text-white"
                    : product.badge === "NEW"
                      ? "bg-black text-white"
                      : product.badge === "TRENDING"
                        ? "bg-blue-600 text-white"
                        : "bg-purple-600 text-white"
                }`}
              >
                {product.badge}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold tracking-wider bg-red-600 text-white px-3 py-1 rounded-full">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              onClick={handleWishlist}
              className={`bg-white hover:bg-white/90 ${
                isWishlisted ? "text-red-600" : "text-black"
              } shadow-lg transition-colors`}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
            <Button size="icon" onClick={handleAddToCart} className="bg-black text-white hover:bg-black/90 shadow-lg">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick View on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              className="w-full bg-white text-black hover:bg-white/90 font-semibold"
              onClick={(e) => {
                e.preventDefault()
                console.log("[v0] Quick view:", product.id)
              }}
            >
              QUICK VIEW
            </Button>
          </div>
        </div>
      </Link>

      <div>
        <div className="text-xs text-black/50 mb-1 tracking-wider uppercase">{product.category}</div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-base mb-2 tracking-tight group-hover:text-black/70 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && product.reviews && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-black text-black" />
              <span className="text-sm font-semibold">{product.rating}</span>
            </div>
            <span className="text-xs text-black/50">({product.reviews} reviews)</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <p className="font-bold text-lg">₦{product.price.toLocaleString()}</p>
          {product.originalPrice && (
            <p className="text-sm text-black/40 line-through">₦{product.originalPrice.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  )
}
