import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/db"
import { products } from "@/db/schema"
import { and, desc, eq, gt } from "drizzle-orm"
import { Product } from "@/types"
import { Newsletter } from "@/components/newsletter"

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

export default async function NewArrivalsPage() {
  // Calculate date 3 weeks ago
  const threeWeeksAgo = new Date()
  threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21)

  // Fetch products created in the last 3 weeks
  const recentProductsData = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        gt(products.createdAt, threeWeeksAgo)
      )
    )
    .orderBy(desc(products.createdAt))

  // Map database results to Product interface
  const recentProducts: Product[] = recentProductsData.map((p: typeof products.$inferSelect) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.images && p.images.length > 0 ? p.images[0] : "/placeholder.svg",
    images: p.images || [],
    category: p.category,
    description: p.description,
    badge: "NEW",
    rating: 5.0, // Default rating for new items
    reviews: 0,
    stockCount: p.stockCount || 0,
    isActive: p.isActive || false,
    sizes: p.sizes || [],
    colors: p.colors || [],
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
  }))

  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0 opacity-40">
           <Image 
            src="/black-hoodie-luxury-street-fashion.jpg" 
            alt="New Arrivals Background" 
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-6">
          <div className="inline-block mb-6 px-4 py-1 border border-white/30 backdrop-blur-sm rounded-full text-xs tracking-[0.25em] font-semibold">
            JUST DROPPED
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            New Arrivals
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Discover the latest additions to the Eddie Originals collection. Fresh fits, premium materials, and bold designs defining the season.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-2">Latest Drops</h2>
              <p className="text-black/60">Be the first to wear our newest releases.</p>
            </div>
             <Button asChild className="hidden sm:flex bg-black text-white hover:bg-black/80">
                <Link href="/shop">
                  View All Products <ArrowRight className="ml-2 h-4 w-4"/>
                </Link>
             </Button>
          </div>

          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-4">No new arrivals in the last 3 weeks.</h3>
              <p className="text-neutral-500 mb-8">Check back soon for fresh drops!</p>
              <Button asChild className="bg-black text-white hover:bg-black/80">
                <Link href="/shop">
                  Browse All Products
                </Link>
              </Button>
            </div>
          )}
          
          <div className="mt-12 flex justify-center sm:hidden">
             <Button asChild className="bg-black text-white hover:bg-black/80 w-full">
                <Link href="/shop">
                  View All Products <ArrowRight className="ml-2 h-4 w-4"/>
                </Link>
             </Button>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  )
}
