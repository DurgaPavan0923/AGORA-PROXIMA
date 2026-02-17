// API route to fetch live proposals data
export async function GET() {
  // Simulating live data - in production this would query a database
  const proposals = [
    {
      id: 1,
      title: "Improve Public Transportation Routes",
      description: "Proposed expansion of bus routes in North District",
      area: "North District",
      category: "Infrastructure",
      status: "voting",
      votes: { yes: 782, no: 156, abstain: 45 },
      totalVoters: 983,
      userVote: null,
      daysLeft: 5,
      participation: 87,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      title: "Community Education Fund Allocation",
      description: "Budget for new after-school programs",
      area: "Central Zone",
      category: "Education",
      status: "voting",
      votes: { yes: 645, no: 89, abstain: 23 },
      totalVoters: 757,
      userVote: "yes",
      daysLeft: 3,
      participation: 92,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      title: "Green Park Initiative",
      description: "Create new community gardens and green spaces",
      area: "South Ward",
      category: "Environment",
      status: "voting",
      votes: { yes: 512, no: 234, abstain: 67 },
      totalVoters: 813,
      userVote: null,
      daysLeft: 8,
      participation: 79,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return Response.json(proposals)
}

export async function POST(request: Request) {
  const data = await request.json()
  console.log("[v0] New proposal created:", data)

  return Response.json({
    success: true,
    id: Math.floor(Math.random() * 10000),
    message: "Proposal created successfully",
  })
}
