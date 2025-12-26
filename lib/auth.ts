import NextAuth from "next-auth"
import type { User } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
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
          // Return a user object that satisfies the NextAuth User type
          // The role field is already handled by our type augmentation in types/next-auth.d.ts
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as "user" | "admin"
        token.id = user.id as string
      } else if (token.sub) {
        // If user is not passed (subsequent requests), refresh role from DB
        // This handles cases where role is updated manually in DB
        try {
          const existingUser = await db.query.users.findFirst({
            where: eq(users.id, token.sub),
            columns: {
              role: true,
            },
          })

          if (existingUser?.role) {
            token.role = existingUser.role as "user" | "admin"
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
          // Keep existing role in token if DB fetch fails
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: "/account/login", // Redirect to our login page
  },
})
