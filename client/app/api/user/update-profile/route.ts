import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function POST(request: NextRequest) {
  try {
    const { photoUrl } = await request.json()
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

    // Only allow updating photo
    const updatedUser = mockDb.updateUser(user.id, { photo: photoUrl })

    return NextResponse.json({
      success: true,
      message: "Profile photo updated",
      user: updatedUser,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
