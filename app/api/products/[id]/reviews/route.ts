import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { productReviews, products, users } from "@/db/schema"
import { eq, desc, sql } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Fetch reviews with user details
    const reviews = await db
      .select({
        id: productReviews.id,
        rating: productReviews.rating,
        title: productReviews.title,
        content: productReviews.content,
        createdAt: productReviews.createdAt,
        user: {
          name: users.name,
          image: users.image,
        },
      })
      .from(productReviews)
      .leftJoin(users, eq(productReviews.userId, users.id))
      .where(eq(productReviews.productId, id))
      .orderBy(desc(productReviews.createdAt))

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: productId } = await params
    const body = await request.json()
    const { rating, title, content } = body

    if (!rating || !content) {
      return NextResponse.json(
        { error: "Rating and content are required" },
        { status: 400 }
      )
    }

    // Insert the new review
    const newReview = await db
      .insert(productReviews)
      .values({
        userId: session.user.id,
        productId,
        rating,
        title,
        content,
      })
      .returning()

    // Update Product Average Rating & Count
    // We calculate this efficiently in the DB or fetch-calc-update. 
    // For simplicity and correctness with concurrency, let's just recalculate from the table.
    
    const stats = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`,
        avg: sql<number>`avg(${productReviews.rating})`
      })
      .from(productReviews)
      .where(eq(productReviews.productId, productId))

    const reviewCount = stats[0]?.count || 0
    const rawAvg = stats[0]?.avg || 0
    
    // Store actual average
    const averageRating = rawAvg

    await db
      .update(products)
      .set({
        reviewCount,
        averageRating,
      })
      .where(eq(products.id, productId))

    return NextResponse.json(newReview[0])
  } catch (error) {
    console.error("Error submitting review:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
