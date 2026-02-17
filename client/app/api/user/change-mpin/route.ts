import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function POST(request: NextRequest) {
  try {
    const { currentMPIN, newMPIN } = await request.json()
    const sessionToken = request.cookies.get("auth-token")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = mockDb.getSession(sessionToken)
    if (!session) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    const user = mockDb.getUserByUniqueId(session.uniqueId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current MPIN
    const mpinValid = mockDb.verifyMPIN(user.uniqueId, currentMPIN)
    if (!mpinValid) {
      return NextResponse.json({ error: "Invalid current MPIN" }, { status: 401 })
    }

    // Validate new MPIN
    if (!newMPIN || newMPIN.length !== 4 || !/^\d+$/.test(newMPIN)) {
      return NextResponse.json({ error: "New MPIN must be 4 digits" }, { status: 400 })
    }

    // Update MPIN
    mockDb.setMPIN(user.uniqueId, newMPIN)

    return NextResponse.json({
      success: true,
      message: "MPIN changed successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to change MPIN" }, { status: 500 })
  }
}
