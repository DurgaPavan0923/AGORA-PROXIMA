// API route to fetch global platform statistics
export async function GET() {
  const stats = {
    totalVoters: 12543,
    totalProposals: 487,
    totalVotes: 98234,
    governmentApprovalRate: 92,
    communityEngagementRate: 76,
    transactionsPendingOnChain: 23,
    lastUpdated: new Date().toISOString(),
  }

  return Response.json(stats)
}
