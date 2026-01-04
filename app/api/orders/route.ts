import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, session.user.id),
      orderBy: [desc(orders.createdAt)],
      with: {
        items: true,
      },
    })

    return NextResponse.json(userOrders, { status: 200 })
  } catch (error) {
    console.error("Fetch orders error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
