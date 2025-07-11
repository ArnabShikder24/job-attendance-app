import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard")

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return null
    }

    if (isDashboard && !isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url))
    }

    // Role-based access control
    if (req.nextUrl.pathname.startsWith("/dashboard/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (req.nextUrl.pathname.startsWith("/dashboard/staff") && token?.role !== "staff") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
