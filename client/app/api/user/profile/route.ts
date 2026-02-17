// Get and update user profile
import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock: get user from token (in production, verify JWT)
    const userId = `user-${token.slice(0, 20)}`
    const user = mockDb.getUser(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        role: user.role,
        uniqueIdProof: user.uniqueIdProof,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const userId = `user-${token.slice(0, 20)}`

    const allowedUpdates = {
      photoUrl: body.photoUrl,
      // password would be handled separately in production
    }

    const updated = mockDb.updateUser(userId, {
      ...allowedUpdates,
      lastLogin: new Date(),
    })

    if (!updated) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: updated,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
