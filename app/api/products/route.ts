import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq, and, ne } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const collection = searchParams.get("collection");
    const excludeId = searchParams.get("excludeId");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const view = searchParams.get("view"); // "list" for slimmer listing payload

    const conditions = [];

    if (isActive === "true") {
      conditions.push(eq(products.isActive, true));
    }
    
    if (collection) {
      conditions.push(eq(products.collection, collection));
    }

    if (excludeId) {
      conditions.push(ne(products.id, excludeId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const baseSelect = view === "list"
      ? db
          .select({
            id: products.id,
            name: products.name,
            price: products.price,
            originalPrice: products.originalPrice,
            images: products.images,
            category: products.category,
            collection: products.collection,
            stockCount: products.stockCount,
            reviewCount: products.reviewCount,
            averageRating: products.averageRating,
            createdAt: products.createdAt,
            isActive: products.isActive,
          })
          .from(products)
      : db.select().from(products);

    let query = baseSelect.where(whereClause).orderBy(desc(products.createdAt));

    if (limit) {
      // Drizzle's query builder typing does not expose .limit on this chain
      // even though it is supported at runtime.
      // @ts-expect-error: limit is available at runtime on this query
      query = query.limit(limit);
    }

    const result = await query;
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const newProduct = await db.insert(products).values({
      name: body.name,
      description: body.description,
      category: body.category,
      collection: body.collection,
      price: parseInt(body.prices.selling),
      originalPrice: body.prices.original ? parseInt(body.prices.original) : null,
      stockCount: parseInt(body.stock),
      sizes: body.sizes,
      colors: body.colors,
      images: body.images, // Expecting string[] of URLs
      isActive: body.isActive !== undefined ? body.isActive : true,
    }).returning();

    return NextResponse.json(newProduct[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
