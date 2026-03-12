import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uniqueId, otp, mpin } = body

    if (!uniqueId || !otp || !mpin) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }

    // Get phone number from request-otp response (stored temporarily)
    // For now, we'll use the backend to verify OTP and MPIN together
    const response = await fetch(`${BACKEND_URL}/auth/verify-otp-mpin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uniqueId, otp, mpin }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Authentication failed" }, { status: response.status })
    }

    // Set cookie with token
    const nextResponse = NextResponse.json({
      success: true,
      message: "Login successful",
      token: data.token,
      user: data.user,
      role: data.user?.role,
    })

    if (data.token) {
      nextResponse.cookies.set("auth-token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60,
      })
    }

    return nextResponse
  } catch (error) {
    console.error("Verify OTP/MPIN error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
