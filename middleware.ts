import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = ["/", "/account/login", "/account/signup", "/account/verify"].includes(nextUrl.pathname)
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")

  // Allow API auth routes
  if (isAuthRoute) {
    return NextResponse.next()
  }

  // Redirect logged-in users away from login/signup
  if (isPublicRoute && isLoggedIn && (nextUrl.pathname === "/account/login" || nextUrl.pathname === "/account/signup")) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  // Protect Admin Routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/account/login", nextUrl))
    }
    
    // Check for admin role
    // @ts-ignore
    if (req.auth?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
