// Get user voting history
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const mockVotes = [
      {
        id: "vote-1",
        electionId: "election-1",
        electionTitle: "City Council 2025",
        partyId: "party-1",
        partyName: "Democratic Alliance",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        blockchainHash: "0xf3c5e8a2b9d4f1e6c3a8b5d2f9e4c1a8b5d2f9e4",
      },
      {
        id: "vote-2",
        electionId: "election-2",
        electionTitle: "Local Budget Vote",
        partyId: "party-3",
        partyName: "Environmental Initiative",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        blockchainHash: "0xa2c8f1d4e9b6c3f8a5d2e9c4b1f6e3a8d5b2f9e4",
      },
    ]

    return NextResponse.json({
      success: true,
      votes: mockVotes,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
