"use client"

import Image from "next/image"
import { Product } from "@/types"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { ProductCard } from "@/components/product-card"
import { ProductReviews } from "@/components/product-reviews"
import { Star, Truck, RotateCcw, Shield, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface ProductDetailsClientProps {
  initialProduct: Product
}

export function ProductDetailsClient({ initialProduct }: ProductDetailsClientProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [showShipping, setShowShipping] = useState(false)
  const [showDescription, setShowDescription] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoadingRelated, setIsLoadingRelated] = useState(true)
  
  // Use initialProduct directly
  const product = initialProduct

  useEffect(() => {
    async function fetchRelated() {
      if (!product) return
      setIsLoadingRelated(true)
      try {
        let url = `/api/products?excludeId=${product.id}&limit=4`
        if (product.collection) {
          url += `&collection=${encodeURIComponent(product.collection)}`
        }
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setRelatedProducts(
            data.map((p: any) => ({
              ...p,
              images: p.images && p.images.length > 0 ? p.images : ["/placeholder.svg"],
              rating: p.averageRating ? p.averageRating / 10 : 0,
              reviews: p.reviewCount || 0,
              inStock: p.stockCount > 0,
            }))
          )
        }
      } catch (e) {
        console.error("Failed to fetch related products", e)
      } finally {
        setIsLoadingRelated(false)
      }
    }
    if (product) {
      fetchRelated()
    }
  }, [product])

  const handleAddToCart = () => {
    const selectedColorObj = product.colors?.find(c => c.name === selectedColor)
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images ? product.images[0] : "",
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      colorHex: selectedColorObj?.hex,
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const isSizeRequired = product.sizes && product.sizes.length > 0
  const isColorRequired = product.colors && product.colors.length > 0
  
  const isAddToCartDisabled = 
    (isSizeRequired && !selectedSize) || 
    (isColorRequired && !selectedColor)

  return (
    <div className="min-h-screen bg-white text-black">
      
      <div className="pt-8 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-24">
            {/* Images */}
            <div>
              <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={product.images?.[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{discountPercent}% OFF
                    </span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images?.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square bg-neutral-100 rounded-lg overflow-hidden ${
                      selectedImage === idx ? "ring-2 ring-black" : ""
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="mb-2">
                <span className="text-xs tracking-wider text-black/50 uppercase">{product.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? "fill-black text-black" : "text-black/20"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{product.rating}</span>
                <span className="text-sm text-black/50">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-bold">₦{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-black/40 line-through">₦{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-bold text-sm tracking-wider">
                    SELECT SIZE <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes?.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm font-semibold border-2 rounded-lg transition-colors ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-black/20 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <label className="font-bold text-sm tracking-wider mb-3 block">
                  SELECT COLOR <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {product.colors?.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-black scale-110 ring-2 ring-black ring-offset-2"
                          : "border-black/10 hover:border-black"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Select color ${color.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="font-bold text-sm tracking-wider mb-3 block">QUANTITY</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-transparent"
                  >
                    -
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-transparent"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isAddToCartDisabled}
                  className="w-full bg-black text-white hover:bg-black/90 font-semibold tracking-wide h-14 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddToCartDisabled ? "SELECT OPTIONS" : "ADD TO CART"}
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8 pb-8 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-black/60" />
                  <span className="text-sm">Fast nationwide delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-black/60" />
                  <span className="text-sm">No refund policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-black/60" />
                  <span className="text-sm">Authentic Eddie Originals guarantee</span>
                </div>
              </div>

              {/* Accordion Sections */}
              <div className="space-y-4">
                <div className="border-b border-black/10">
                  <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="w-full py-4 flex justify-between items-center font-bold text-sm tracking-wider"
                  >
                    DESCRIPTION
                    {showDescription ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  {showDescription && (
                    <div className="pb-4 text-black/70 leading-relaxed">
                      <p className="mb-4">{product.description}</p>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>100% Premium Cotton</li>
                        <li>320gsm Heavyweight Fabric</li>
                        <li>Signature Eddie Originals Branding</li>
                        <li>Pre-shrunk for Perfect Fit</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="border-b border-black/10">
                  <button
                    onClick={() => setShowShipping(!showShipping)}
                    className="w-full py-4 flex justify-between items-center font-bold text-sm tracking-wider"
                  >
                    SHIPPING & RETURNS
                    {showShipping ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  {showShipping && (
                    <div className="pb-4 text-black/70 leading-relaxed text-sm space-y-2">
                      <p>
                        <strong>Shipping:</strong> Standard delivery takes 3-5 business days within Lagos and 5-7 business days nationwide.
                      </p>
                      <p>
                        <strong>Returns:</strong> All sales are final. No refunds or exchanges.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <ProductReviews productId={product.id} />

          {/* Related Products */}
          <section>
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">You Might Also Like</h2>
              <p className="text-lg text-black/60">Complete your look with these pieces</p>
            </div>
            
            {isLoadingRelated ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="space-y-4">
                     <Skeleton className="aspect-square w-full rounded-xl" />
                     <div className="space-y-2">
                       <Skeleton className="h-4 w-2/3" />
                       <Skeleton className="h-4 w-1/3" />
                     </div>
                   </div>
                 ))}
               </div>
            ) : relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Empty className="border-none bg-neutral-50/50 py-16">
                <EmptyMedia variant="icon" className="mx-auto bg-neutral-100">
                   <ShoppingBag className="h-6 w-6 text-neutral-500" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle className="text-xl">No Similar Products Found</EmptyTitle>
                  <EmptyDescription className="max-w-md mx-auto">
                    We couldn't find any other products that match this one exactly at the moment.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button asChild variant="outline" className="mt-4 border-black text-black hover:bg-black hover:text-white transition-colors">
                      <Link href="/shop">Browse All Products</Link>
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </section>
        </div>
      </div>

    </div>
  )
}
