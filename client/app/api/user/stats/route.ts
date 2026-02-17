// API route to fetch user statistics
export async function GET() {
  // Simulating live user data - updates based on activity
  const timestamp = new Date()
  const hour = timestamp.getHours()

  // Simulate data that changes throughout the day
  const baseVotes = 23
  const baseProposals = 2
  const baseScore = 847

  const userStats = {
    votesCount: baseVotes + Math.floor(Math.random() * 5),
    proposalsCreated: baseProposals + Math.floor(Math.random() * 2),
    impactScore: baseScore + Math.floor(Math.random() * 50 - 25),
    communityRank: 42,
    lastUpdated: timestamp.toISOString(),
    participationRate: 87,
    locality: "North District",
  }

  return Response.json(userStats)
}
