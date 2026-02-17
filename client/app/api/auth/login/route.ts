// Login with unique ID proof
import { type NextRequest, NextResponse } from "next/server"

interface LoginRequest {
  uniqueIdProof: string
  email: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    if (!body.uniqueIdProof || !body.email) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    // Mock verification (in production, verify against database)
    const mockUser = {
      id: `user-${Date.now()}`,
      uniqueIdProof: body.uniqueIdProof,
      role: body.uniqueIdProof.includes("ADMIN")
        ? "admin"
        : body.uniqueIdProof.includes("EC")
          ? "election_commission"
          : "user",
      email: body.email,
      name: "User Name",
      createdAt: new Date(),
      lastLogin: new Date(),
    }

    // Generate session token
    const token = `token-${Math.random().toString(36).substr(2, 20)}`

    const response = NextResponse.json({
      success: true,
      token,
      user: mockUser,
    })

    // Set secure cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
