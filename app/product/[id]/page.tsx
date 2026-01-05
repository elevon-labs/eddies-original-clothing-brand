import { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ProductDetailsClient } from "@/components/product-details-client"
import { Product } from "@/types"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  })

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  const images = product.images as string[]
  const mainImage = images && images.length > 0 ? images[0] : "/placeholder.svg"

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at Eddie Originals`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at Eddie Originals`,
      images: [
        {
          url: mainImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `Buy ${product.name} at Eddie Originals`,
      images: [mainImage],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const productData = await db.query.products.findFirst({
    where: eq(products.id, id),
  })

  if (!productData) {
    notFound()
  }

  // Transform to match Product interface
  const product: Product = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    originalPrice: productData.originalPrice,
    description: productData.description,
    image: (productData.images as string[])?.[0] || "/placeholder.svg",
    images: (productData.images as string[]) || [],
    category: productData.category,
    collection: productData.collection,
    stockCount: productData.stockCount || 0,
    isActive: productData.isActive || false,
    sizes: (productData.sizes as string[]) || [],
    colors: (productData.colors as { name: string; hex: string }[]) || [],
    reviews: productData.reviewCount || 0,
    rating: productData.averageRating ? productData.averageRating / 10 : 0, // Assuming stored as integer 0-50? API code didn't show div 10 but original page did
    createdAt: productData.createdAt || undefined,
  }

  // Double check rating logic from original page:
  // rating: data.averageRating ? data.averageRating / 10 : 0, 
  // If I look at the schema: averageRating: integer("average_rating").default(0),
  // If it's 48 (4.8 stars), then /10 is correct.

  return <ProductDetailsClient initialProduct={product} />
}
