import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const token = request.cookies.get("auth-token")?.value || request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch the file from backend
    const response = await fetch(`${BACKEND_URL}/uploads/${filename}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: response.status }
      )
    }

    // Get the file content
    const fileBuffer = await response.arrayBuffer()
    
    // Return the PDF with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Document fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 })
  }
}
