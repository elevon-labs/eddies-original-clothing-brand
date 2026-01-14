import { NextResponse } from "next/server"
import { db } from "@/db"
import { users, passwordResetTokens } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getPasswordResetTokenByToken } from "@/lib/tokens"
import bcrypt from "bcryptjs"
import { z } from "zod"

const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9!@#$%^&*]/, "Password must contain at least one number or special character"),
  token: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = newPasswordSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      )
    }

    const { token, password } = result.data

    // 1. Validate token
    const existingToken = await getPasswordResetTokenByToken(token)

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid token!" }, { status: 400 })
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired!" }, { status: 400 })
    }

    // 2. Find user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.identifier),
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Email does not exist!" }, { status: 400 })
    }

    // 3. Check if new password is same as old password
    if (existingUser.password) {
      const isSamePassword = await bcrypt.compare(password, existingUser.password)
      if (isSamePassword) {
        return NextResponse.json(
          { error: "New password cannot be the same as the old password." },
          { status: 400 }
        )
      }
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 5. Update user and delete token
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, existingUser.id))

    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.identifier, existingToken.identifier))

    return NextResponse.json({ success: "Password updated!" })
  } catch (error) {
    console.error("New password error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
