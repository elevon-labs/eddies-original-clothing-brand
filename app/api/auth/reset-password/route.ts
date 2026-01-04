import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/mail"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Rate Limiting (IP + Email) - reusing similar limits as signup/resend
    const forwardedFor = req.headers.get("x-forwarded-for")
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1"

    if (!rateLimit(`reset_password_ip_${ip}`, 5, 60 * 60 * 1000)) {
       return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      )
    }

    if (!rateLimit(`reset_password_email_${email}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many attempts for this email. Please try again later." },
        { status: 429 }
      )
    }

    // 1. Check if user exists
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    // 2. Security: Always return 200 to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: "If an account exists, a reset email has been sent." })
    }

    // 3. Generate token
    const passwordResetToken = await generatePasswordResetToken(email)

    // 4. Send email
    await sendPasswordResetEmail(
      passwordResetToken.identifier,
      passwordResetToken.token
    )

    return NextResponse.json({ success: "If an account exists, a reset email has been sent." })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
