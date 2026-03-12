// Proxy API route for individual election operations
import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await fetch(`${API_URL}/elections/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Elections API GET by ID error:', error)
    return NextResponse.json({ error: "Failed to fetch election" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const cookies = request.headers.get('cookie') || ''

    const response = await fetch(`${API_URL}/elections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log('PUT /api/elections/[id] - Response status:', response.status)
    console.log('PUT /api/elections/[id] - Response data:', data)
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Elections API PUT error:', error)
    return NextResponse.json({ error: "Failed to update election", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookies = request.headers.get('cookie') || ''

    const response = await fetch(`${API_URL}/elections/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
    })

    const data = await response.json()
    console.log('DELETE /api/elections/[id] - Response:', response.status, data)
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Elections API DELETE error:', error)
    return NextResponse.json({ error: "Failed to delete election", details: String(error) }, { status: 500 })
  }
}
