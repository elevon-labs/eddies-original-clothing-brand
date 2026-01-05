import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { addresses } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure address belongs to user before deleting
    const deletedAddress = await db
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, session.user.id)))
      .returning()

    if (deletedAddress.length === 0) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Address deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete address error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
