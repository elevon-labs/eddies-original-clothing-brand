import { MetadataRoute } from "next"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eddieoriginals-department.com"

  // Static routes
  const routes = [
    "",
    "/shop",
    "/new",
    "/collections",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // Dynamic product routes
  const allProducts = await db.query.products.findMany({
    where: eq(products.isActive, true),
    columns: {
      id: true,
      updatedAt: true,
    },
  })

  const productRoutes = allProducts.map((product: { id: string; updatedAt: Date | null }) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  return [...routes, ...productRoutes]
}
