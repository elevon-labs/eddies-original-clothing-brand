import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user
  const role = user?.role

  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = ["/", "/account/login", "/account/signup", "/account/verify"].includes(nextUrl.pathname)
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")

  // Allow API auth routes
  if (isAuthRoute) {
    return NextResponse.next()
  }

  // Redirect logged-in users away from login/signup
  if (isLoggedIn && (nextUrl.pathname === "/account/login" || nextUrl.pathname === "/account/signup")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
    }
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  // Redirect Admins to Dashboard if they visit Home
  if (isLoggedIn && nextUrl.pathname === "/" && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
  }

  // Protect Admin Routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/account/login", nextUrl))
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
