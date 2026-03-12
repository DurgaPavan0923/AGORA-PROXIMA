// Role-based access control middleware
import { type NextRequest, NextResponse } from "next/server"

const roleRoutes: Record<string, string[]> = {
  user: ["/dashboard/user"],
  voter: ["/dashboard/user"],
  admin: ["/dashboard/admin"],
  election_commission: ["/dashboard/election-commission"],
}

const publicRoutes = ["/auth", "/", "/api"]

/** Decode JWT payload without verification (verification happens server-side) */
function decodeJWTPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get("auth-token")?.value

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || (route !== "/" && pathname.startsWith(route)))) {
    return NextResponse.next()
  }

  if (!authToken) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  // Decode token to extract role
  const payload = decodeJWTPayload(authToken)
  if (!payload || !payload.role) {
    const response = NextResponse.redirect(new URL("/auth", request.url))
    response.cookies.delete("auth-token")
    return response
  }

  // Enforce role-based access for dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const userRole = payload.role as string
    const allowedPaths = roleRoutes[userRole] || []
    const hasAccess = allowedPaths.some(path => pathname.startsWith(path))

    if (!hasAccess) {
      const correctPath = roleRoutes[userRole]?.[0] || "/auth"
      return NextResponse.redirect(new URL(correctPath, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|public).*)"],
}
