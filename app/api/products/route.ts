import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    return NextResponse.json(allProducts);
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
