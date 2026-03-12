import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function POST(request: NextRequest) {
  try {
    const { userId, mpin } = await request.json()
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!userId || !mpin) {
      return NextResponse.json({ error: "User ID and MPIN are required" }, { status: 400 })
    }

    const response = await fetch(`${BACKEND_URL}/admin/verify-user`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, mpin }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Verification failed" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Verify user error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
