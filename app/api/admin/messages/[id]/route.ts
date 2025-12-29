import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { messages, users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { role: true },
    })

    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { isRead } = body

    if (typeof isRead !== "boolean") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const { id } = await params
    const messageId = parseInt(id)
    if (isNaN(messageId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    await db
      .update(messages)
      .set({ isRead })
      .where(eq(messages.id, messageId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { role: true },
    })

    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const messageId = parseInt(id)
    if (isNaN(messageId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    await db.delete(messages).where(eq(messages.id, messageId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
