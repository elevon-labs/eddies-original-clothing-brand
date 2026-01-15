import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// Notice this is only an object, not a full NextAuth() initialization
export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
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
      async authorize() {
        return null
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user.role as "user" | "admin") || "user"
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "user" | "admin"
      }
      return session
    },
  },
} satisfies NextAuthConfig
