// Admin endpoint to issue unique ID proofs
import { type NextRequest, NextResponse } from "next/server"

interface IdProofRequest {
  email: string
  name: string
  role: "user" | "admin" | "election_commission"
}

// Mock database for ID proofs
const issuedProofs = new Map<string, { uniqueIdProof: string; email: string; name: string; role: string }>()

export async function POST(request: NextRequest) {
  try {
    // In production, verify admin authorization here
    const body: IdProofRequest = await request.json()

    if (!body.email || !body.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique ID proof
    const uniqueIdProof = `AGORA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    issuedProofs.set(uniqueIdProof, {
      uniqueIdProof,
      email: body.email,
      name: body.name,
      role: body.role,
    })

    return NextResponse.json({
      success: true,
      uniqueIdProof,
      message: `ID Proof issued for ${body.name}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to issue ID proof" }, { status: 500 })
  }
}
