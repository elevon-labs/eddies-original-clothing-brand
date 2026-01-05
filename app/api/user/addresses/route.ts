import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { addresses } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

const addressSchema = z.object({
  name: z.string().min(2),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  phone: z.string().min(10),
  isDefault: z.boolean().default(false),
})

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, session.user.id))

    return NextResponse.json(userAddresses, { status: 200 })
  } catch (error) {
    console.error("Fetch addresses error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const result = addressSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      )
    }

    // If new address is default, unset other defaults
    if (result.data.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, session.user.id))
    }

    const newAddress = await db
      .insert(addresses)
      .values({
        ...result.data,
        userId: session.user.id,
      })
      .returning()

    return NextResponse.json(newAddress[0], { status: 201 })
  } catch (error) {
    console.error("Create address error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
