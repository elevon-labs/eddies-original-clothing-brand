"use server"

import { db } from "@/db"
import { users, verificationTokens } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getVerificationTokenByToken, generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const verifyEmail = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return { error: "Token does not exist!" }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: "Token has expired!" }
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.identifier),
  })

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  await db.update(users)
    .set({ 
      emailVerified: new Date(), 
      email: existingToken.identifier 
    })
    .where(eq(users.id, existingUser.id))

  await db.delete(verificationTokens)
    .where(eq(verificationTokens.identifier, existingToken.identifier))

  return { success: "Email verified!" }
}

import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

export const resendVerificationEmail = async (email: string) => {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1"

  // 3 requests per 10 minutes for resend
  if (!rateLimit(`resend_${ip}`, 3, 10 * 60 * 1000)) {
    return { error: "Too many requests. Please try again later." }
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!existingUser) {
    return { error: "Email not found!" }
  }

  if (existingUser.emailVerified) {
    return { error: "Email already verified!" }
  }

  const verificationToken = await generateVerificationToken(email)
  await sendVerificationEmail(verificationToken.identifier, verificationToken.token)

  return { success: "Verification email sent!" }
}
