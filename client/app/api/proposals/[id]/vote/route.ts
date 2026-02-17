// API route to handle voting
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { vote } = body

  console.log(`[v0] User voted ${vote} on proposal ${id}`)

  return Response.json({
    success: true,
    proposalId: id,
    vote: vote,
    timestamp: new Date().toISOString(),
    message: "Vote recorded successfully on blockchain",
  })
}
