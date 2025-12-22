"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { Heart, Star, Truck, RotateCcw, Shield, ChevronDown, ChevronUp } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { ProductReviews } from "@/components/product-reviews"
import Image from "next/image"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showDescription, setShowDescription] = useState(true)
  const [showShipping, setShowShipping] = useState(false)
  const { addItem } = useCart()

  // Mock product data
  const product = {
    id: Number.parseInt(params.id),
    name: "Signature Oversized Tee",
    price: 45000,
    originalPrice: 65000,
    description:
      "The Signature Oversized Tee is crafted from premium 100% cotton with a heavyweight 320gsm fabric. Designed with an intentionally relaxed fit and dropped shoulders for maximum comfort and style. Features our signature Eddie Originals branding on the chest and back.",
    images: [
      "/black-oversized-tee-luxury-streetwear.jpg",
      "/black-oversized-tee-luxury-streetwear.jpg",
      "/black-oversized-tee-luxury-streetwear.jpg",
      "/black-oversized-tee-luxury-streetwear.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["#000000", "#FFFFFF", "#808080", "#404040"],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    category: "Essentials",
  }

  const relatedProducts = [
    {
      id: 2,
      name: "Premium Cargo Pants",
      price: 85000,
      image: "/black-cargo-streetwear.png",
      category: "Bottoms",
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
  ]

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      size: selectedSize,
    })
    console.log("[v0] Added to cart:", { product, size: selectedSize, quantity })
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      <div className="pt-8 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-12 mb-24">
            {/* Images */}
            <div>
              <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
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
                {product.images.map((img, idx) => (
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
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-black text-black" : "text-black/20"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{product.rating}</span>
                <span className="text-sm text-black/50">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-bold">₦{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-xl text-black/40 line-through">₦{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-bold text-sm tracking-wider">SELECT SIZE</label>
                  <button className="text-xs text-black/60 underline underline-offset-4">Size Guide</button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
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
                <label className="font-bold text-sm tracking-wider mb-3 block">SELECT COLOR</label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-black scale-110 ring-2 ring-black ring-offset-2"
                          : "border-black/10 hover:border-black"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
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
                  className="flex-1 bg-black text-white hover:bg-black/90 font-semibold tracking-wide h-14"
                >
                  ADD TO CART
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`h-14 w-14 ${isWishlisted ? "bg-black text-white" : "bg-transparent"}`}
                >
                  <Heart className={`h-6 w-6 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8 pb-8 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-black/60" />
                  <span className="text-sm">Free shipping on orders over ₦50,000</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-black/60" />
                  <span className="text-sm">30-day easy returns</span>
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
                        <li>Oversized Relaxed Fit</li>
                        <li>Dropped Shoulders</li>
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
                        <strong>Shipping:</strong> Free shipping on orders over ₦50,000. Standard delivery takes 3-5
                        business days within Lagos and 5-7 business days nationwide.
                      </p>
                      <p>
                        <strong>Returns:</strong> We offer a 30-day return policy. Items must be unworn, unwashed, and
                        in original condition with tags attached.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <ProductReviews />

          {/* Related Products */}
          <section>
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">You Might Also Like</h2>
              <p className="text-lg text-black/60">Complete your look with these pieces</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
