import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const age = formData.get("age") as string
    const address = formData.get("address") as string
    const aadhaarNumber = formData.get("aadhaarNumber") as string
    const voterIdNumber = formData.get("voterIdNumber") as string
    const aadhaarCard = formData.get("aadhaarCard") as File | null
    const voterIdCard = formData.get("voterIdCard") as File | null

    // Validate required fields
    if (!name || !email || !phoneNumber || !age || !address || !aadhaarNumber || !voterIdNumber) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    if (!aadhaarCard || !voterIdCard) {
      return NextResponse.json(
        { message: "Both Aadhaar and Voter ID documents are required" },
        { status: 400 }
      )
    }

    // Create FormData to send to backend
    const backendFormData = new FormData()
    backendFormData.append("fullName", name)
    backendFormData.append("email", email)
    backendFormData.append("phone", phoneNumber)
    backendFormData.append("age", age)
    backendFormData.append("address", address)
    backendFormData.append("aadhaar", aadhaarNumber)
    backendFormData.append("voterId", voterIdNumber)
    backendFormData.append("aadhaarCard", aadhaarCard)
    backendFormData.append("voterIdCard", voterIdCard)

    // Forward to backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const response = await fetch(`${backendUrl}/auth/register`, {
      method: "POST",
      body: backendFormData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || data.message || "Registration failed" },
        { status: response.status }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: data.message || "Registration submitted successfully",
        userId: data.userId,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Registration API error:", error)
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
