import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function POST(request: NextRequest) {
  try {
    const { fullName, phone, aadhaar, address, role } = await request.json()
    const sessionToken = request.cookies.get("auth-token")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = mockDb.getSession(sessionToken)
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Only admins can create users" }, { status: 403 })
    }

    if (!fullName || !phone || !aadhaar || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create pending user
    const pendingUserId = `pending-${Date.now()}`
    const pendingUser = mockDb.createPendingUser({
      id: pendingUserId,
      fullName,
      phone,
      aadhaar,
      address,
      role: role as any,
      status: "pending",
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "User request created. Pending admin verification.",
      pendingUser,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
