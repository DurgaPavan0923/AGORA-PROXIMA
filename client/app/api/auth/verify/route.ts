// Verify authentication token and return user info
import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "") ||
                  request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // Call backend to verify token
    const response = await fetch(`${BACKEND_URL}/auth/verify`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Verification failed" }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    })
  } catch (error) {
    console.error("Verify token error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
