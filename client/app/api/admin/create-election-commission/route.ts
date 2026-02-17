import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function POST(request: NextRequest) {
  try {
    const { fullName, phone, email, department } = await request.json()
    const sessionToken = request.cookies.get("auth-token")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = mockDb.getSession(sessionToken)
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Only admins can create Election Commission users" }, { status: 403 })
    }

    // Generate Election Commission unique ID
    const uniqueId = `IND-EC-${Math.random().toString(36).substr(2, 12).toUpperCase()}`

    // Create election commission user
    const ecUser = {
      id: `user-${Date.now()}`,
      uniqueId,
      name: fullName,
      phone,
      email,
      role: "election_commission" as const,
      photo: "",
      createdAt: new Date(),
      lastLogin: null,
      aadhaar: "",
      address: department,
    }

    mockDb.createUser(ecUser)

    // Set temporary MPIN (election commission will change on first login)
    mockDb.setMPIN(uniqueId, "0000") // Default MPIN

    return NextResponse.json({
      success: true,
      message: "Election Commission user created successfully",
      user: ecUser,
      credentials: {
        uniqueId,
        tempMPIN: "0000",
        instructions: "Share these credentials via secure email. User must change MPIN on first login.",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create Election Commission user" }, { status: 500 })
  }
}
