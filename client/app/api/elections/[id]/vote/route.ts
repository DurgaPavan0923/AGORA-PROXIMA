// Cast a vote (recorded on blockchain)
import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const userId = `user-${token.slice(0, 20)}`

    // Mock blockchain hash
    const blockchainHash = `0x${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`

    const vote = {
      id: `vote-${Date.now()}`,
      userId,
      electionId: params.id,
      partyId: body.partyId,
      timestamp: new Date(),
      blockchainHash,
    }

    mockDb.addVote(vote)

    return NextResponse.json({
      success: true,
      vote,
      message: "Vote recorded on blockchain",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 })
  }
}
