"use client"

import { ProductForm, ProductData } from "@/components/admin/product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function EditProductPage() {
  const params = useParams()
  const { toast } = useToast()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error("Product not found")
          throw new Error("Failed to fetch product")
        }
        const data = await res.json()

        // Transform API data to ProductData format
        const formattedProduct: ProductData = {
          id: data.id.toString(),
          name: data.name,
          description: data.description || "",
          category: data.category || "",
          collection: data.collection || "",
          prices: {
            original: data.originalPrice ? data.originalPrice.toString() : "",
            selling: data.price.toString(),
          },
          stock: data.stockCount.toString(),
          sizes: data.sizes || [],
          colors: data.colors || [],
          images: (data.images || []).map((url: string, index: number) => ({
            id: index.toString(),
            preview: url,
          })),
        }

        setProduct(formattedProduct)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Button asChild variant="outline">
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
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
          <h1 className="text-2xl font-bold tracking-tight text-black">Edit Product</h1>
          <p className="text-muted-foreground">Update product information and inventory.</p>
        </div>
      </div>

      <ProductForm initialData={product} />
    </div>
  )
}
