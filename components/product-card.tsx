"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/types"

export function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted 
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    })
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group h-full">
      <Link href={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4 rounded-lg flex-shrink-0">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badge && product.badge !== "TRENDING" && product.badge !== "EXCLUSIVE" && (
              <span
                className={`text-xs font-bold tracking-wider px-3 py-1 rounded-full ${
                  product.badge === "SALE" ? "bg-red-600 text-white" : "bg-black text-white"
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
            <Button size="icon" onClick={handleAddToCart} className="bg-black text-white hover:bg-black/70 shadow-lg">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick View on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
            <Button
              size="sm"
              className="w-full bg-black text-white hover:bg-black/90 font-semibold shadow-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              size="sm"
              className="w-full bg-white text-black hover:bg-white/90 font-semibold shadow-sm"
            >
              View Details
            </Button>
          </div>
        </div>

        <div className="flex flex-col flex-grow">
          <h3 className="font-medium text-base mb-1 group-hover:underline decoration-1 underline-offset-4">
            {product.name}
          </h3>
          <div className="mt-auto">
            <div className="flex items-center gap-2">
              <span className="font-semibold">₦{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-black/40 line-through">₦{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {product.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-black/60">
                  {product.rating} ({product.reviews})
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
