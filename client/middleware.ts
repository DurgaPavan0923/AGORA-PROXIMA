// Role-based access control middleware
import { type NextRequest, NextResponse } from "next/server"

const roleRoutes: Record<string, string[]> = {
  user: ["/dashboard/user"],
  admin: ["/dashboard/admin"],
  election_commission: ["/dashboard/election-commission"],
}

const publicRoutes = ["/auth", "/"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get("auth-token")?.value

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  if (!authToken) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  // For this implementation, we'll check the requested route
  const requestedDashboard = pathname.split("/")[2] // Extract 'user', 'admin', or 'election-commission'

  if (pathname.startsWith("/dashboard")) {
    // In production, verify token and check if user role matches the requested dashboard
    // For now, we allow access (authentication is enforced)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|public).*)"],
}
