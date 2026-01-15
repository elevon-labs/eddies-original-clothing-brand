import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { checkBotId } from "botid/server"

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9!@#$%^&*]/, "Password must contain at least one number or special character"),
})

import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    // BotID Check
    const verification = await checkBotId()
    if (verification.isBot) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const body = await req.json()
    const result = signupSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      )
    }

    const { name, email, password } = result.data

    // Rate Limiting
    const forwardedFor = req.headers.get("x-forwarded-for")
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1"
    
    // 1. Limit by IP: 5 requests per hour per IP (Prevent mass account creation)
    if (!rateLimit(`signup_ip_${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many attempts from this IP. Please try again later." },
        { status: 429 }
      )
    }

    // 2. Limit by Email: 3 requests per hour per Email (Prevent spamming a victim)
    if (!rateLimit(`signup_email_${email}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many attempts for this email. Please try again later." },
        { status: 429 }
      )
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "user", // Default role
      })
      .returning({ id: users.id, email: users.email })

    try {
      // Generate verification token
      const verificationToken = await generateVerificationToken(email)
      
      // Send verification email with retry logic
      let emailSent = false
      let attempts = 0
      const maxAttempts = 3 // Initial + 2 retries

      while (attempts < maxAttempts && !emailSent) {
        try {
          attempts++
          await sendVerificationEmail(verificationToken.identifier, verificationToken.token)
          emailSent = true
        } catch (emailError) {
          console.error(`Email sending attempt ${attempts} failed:`, emailError)
          if (attempts === maxAttempts) {
             throw emailError // Trigger rollback in outer catch
          }
          // Wait 500ms before retrying
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    } catch (error) {
      console.error("Signup process failed after user creation. Rolling back:", error)
      // Rollback: Delete the user
      await db.delete(users).where(eq(users.id, newUser[0].id))
      
      return NextResponse.json(
        { error: "We are unable to create your account at this moment. Please try again later." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "User created successfully", user: newUser[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

