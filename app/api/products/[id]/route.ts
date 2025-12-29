import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await db.select().from(products).where(eq(products.id, parseInt(id))).limit(1);
    if (!product.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const updatedProduct = await db.update(products).set({
      name: body.name,
      description: body.description,
      category: body.category,
      collection: body.collection,
      price: parseInt(body.prices.selling),
      originalPrice: body.prices.original ? parseInt(body.prices.original) : null,
      stockCount: parseInt(body.stock),
      sizes: body.sizes,
      colors: body.colors,
      images: body.images,
      isActive: body.isActive,
      updatedAt: new Date(),
    }).where(eq(products.id, parseInt(id))).returning();

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Dynamic update object
    const updateData: any = { updatedAt: new Date() };
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.collection !== undefined) updateData.collection = body.collection;
    if (body.price !== undefined) updateData.price = parseInt(body.price); // Note: expect simple number or string here for PATCH
    if (body.stock !== undefined) updateData.stockCount = parseInt(body.stock);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updatedProduct = await db.update(products).set(updateData).where(eq(products.id, parseInt(id))).returning();

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error patching product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.delete(products).where(eq(products.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
