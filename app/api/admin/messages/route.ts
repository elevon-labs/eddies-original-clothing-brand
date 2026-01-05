import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { messages, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

export async function DELETE(request: Request) {
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

    const url = new URL(request.url)
    const type = url.searchParams.get("type")

    if (type === "all_archived") {
      await db.delete(messages).where(eq(messages.isRead, true))
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid delete type" }, { status: 400 })
  } catch (error) {
    console.error("Error deleting messages:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET() {
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

    const allMessages = await db.query.messages.findMany({
      orderBy: [desc(messages.createdAt)],
    })

    return NextResponse.json(allMessages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
