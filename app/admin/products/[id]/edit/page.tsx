"use client"

import { ProductForm, ProductData } from "@/components/admin/product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Mock data fetching function
const getProductById = (id: string): ProductData | null => {
  // Simulate database lookup with mock data matching products-list.tsx
  const products: Record<string, ProductData> = {
    "1": {
      id: "1",
      name: "Classic Black Bomber",
      description: "A timeless classic bomber jacket made from premium materials. Perfect for any street style outfit.",
      category: "Outerwear",
      collection: "Winter 2024",
      prices: { original: "120000", selling: "89000" },
      stock: "15",
      sizes: ["M", "L", "XL"],
      colors: [{ name: "Black", hex: "#000000" }],
      images: [
        { id: "1", preview: "/black-bomber-streetwear.png" }
      ]
    },
    "2": {
      id: "2",
      name: "Oversized Graphic Tee",
      description: "Heavyweight cotton tee with unique graphic print. Oversized fit for maximum comfort.",
      category: "Tees",
      collection: "Streetwear",
      prices: { original: "45000", selling: "35000" },
      stock: "3",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" }],
      images: [
        { id: "1", preview: "/black-oversized-tee-luxury-streetwear.jpg" }
      ]
    },
    "3": {
      id: "3",
      name: "Premium Joggers",
      description: "Comfortable and stylish joggers perfect for everyday wear. Made from high-quality fabric.",
      category: "Bottoms",
      collection: "Essentials",
      prices: { original: "80000", selling: "65000" },
      stock: "8",
      sizes: ["S", "M", "L"],
      colors: [{ name: "Black", hex: "#000000" }],
      images: [
        { id: "1", preview: "/black-joggers-streetwear.jpg" }
      ]
    },
    "4": {
      id: "4",
      name: "Crewneck Sweatshirt",
      description: "Classic crewneck sweatshirt with a modern fit. Soft and cozy interior.",
      category: "Hoodies",
      collection: "Winter 2024",
      prices: { original: "70000", selling: "55000" },
      stock: "0",
      sizes: ["M", "L", "XL"],
      colors: [{ name: "Black", hex: "#000000" }, { name: "Grey", hex: "#808080" }],
      images: [
        { id: "1", preview: "/black-crewneck-graphic-streetwear.jpg" }
      ]
    },
    "5": {
      id: "5",
      name: "Vintage Wash Hoodie",
      description: "Vintage inspired wash hoodie with a relaxed fit. Each piece is unique.",
      category: "Hoodies",
      collection: "Essentials",
      prices: { original: "95000", selling: "75000" },
      stock: "12",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ name: "Charcoal", hex: "#36454F" }],
      images: [
        { id: "1", preview: "/placeholder.svg" }
      ]
    },
    "6": {
      id: "6",
      name: "Cargo Pants",
      description: "Functional cargo pants with multiple pockets. Durable and stylish.",
      category: "Bottoms",
      collection: "Streetwear",
      prices: { original: "75000", selling: "58000" },
      stock: "6",
      sizes: ["30", "32", "34", "36"],
      colors: [{ name: "Khaki", hex: "#C3B091" }, { name: "Black", hex: "#000000" }],
      images: [
        { id: "1", preview: "/placeholder.svg" }
      ]
    }
  }
  
  return products[id] || null
}

export default function EditProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      // Simulate API delay
      const timer = setTimeout(() => {
        const foundProduct = getProductById(params.id as string)
        setProduct(foundProduct)
        setLoading(false)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-6">The product you are looking for does not exist.</p>
        <Link href="/admin/products" className="text-sm font-medium underline underline-offset-4">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Update product details and manage inventory.
          </p>
        </div>
      </div>
      
      <ProductForm initialData={product} />
    </div>
  )
}
