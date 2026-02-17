import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function POST(request: NextRequest) {
  try {
    const { uniqueId } = await request.json()

    if (!uniqueId) {
      return NextResponse.json({ error: "Unique ID required" }, { status: 400 })
    }

    // Call backend API
    const response = await fetch(`${BACKEND_URL}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uniqueId }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to request OTP" }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to registered phone number",
      phone: data.phone ? data.phone.replace(/.(?=.{4})/g, "*") : "****",
    })
  } catch (error) {
    console.error("Request OTP error:", error)
    return NextResponse.json({ error: "Failed to request OTP" }, { status: 500 })
  }
}
