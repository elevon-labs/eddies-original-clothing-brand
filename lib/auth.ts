import NextAuth from "next-auth"
import type { User } from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { authConfig } from "@/auth.config"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    ...authConfig.providers.filter((provider: any) => provider.id !== "credentials"),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1)

        if (!user || !user.password) return null

        if (!user.emailVerified) {
          throw new Error("Please verify your email address before logging in.")
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (passwordsMatch) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.emailVerified,
            role: user.role as "user" | "admin",
          } as User
        }
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role = (user.role as "user" | "admin") || "user"
        token.id = user.id as string
      } else if (token.sub) {
        // If user is not passed (subsequent requests), refresh role from DB
        // This handles cases where role is updated manually in DB
        try {
          const [existingUser] = await db
            .select({ role: users.role })
            .from(users)
            .where(eq(users.id, token.sub))
            .limit(1)

          // If the user exists (even if role is null/undefined), update the token
          if (existingUser) {
             token.role = (existingUser.role as "user" | "admin") || "user"
          }
        } catch (error) {
          console.error("Database error in JWT callback:", error)
          // Keep existing role in token if DB fetch fails
        }
      }
      return token
    },
  },
  pages: {
    signIn: "/account/login", // Redirect to our login page
  },
})
