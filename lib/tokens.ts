import { db } from "@/db"
import { verificationTokens, passwordResetTokens } from "@/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 24 hours

  // Check if a token already exists for this email
  const existingToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.identifier, email),
  })

  if (existingToken) {
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email))
  }

  const verificationToken = await db
    .insert(verificationTokens)
    .values({
      identifier: email,
      token,
      expires,
    })
    .returning()

  return verificationToken[0]
}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    })
    return verificationToken
  } catch {
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.identifier, email),
    })
    return verificationToken
  } catch {
    return null
  }
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour

  const existingToken = await db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.identifier, email),
  })

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.identifier, email))
  }

  const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({
      identifier: email,
      token,
      expires,
    })
    .returning()

  return passwordResetToken[0]
}

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    })
    return passwordResetToken
  } catch {
    return null
  }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.identifier, email),
    })
    return passwordResetToken
  } catch {
    return null
  }
}
