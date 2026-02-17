"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, Clock, FileText } from "lucide-react"
import { api } from "@/lib/api"
import type { VotingHistoryItem } from "@/lib/types"

export function UserVotingHistory() {
  const { data, isLoading } = useSWR("/user/voting-history", async () => {
    const response = await api.user.getVotingHistory()
    return response
  })

  const history: VotingHistoryItem[] = data?.history || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Voting History</CardTitle>
        <CardDescription>All your votes are permanently recorded on blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No voting history yet</p>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div key={`${item.type}-${item.electionId || item.proposalId}-${index}`} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {item.type === 'election' ? item.electionTitle : item.proposalTitle}
                  </h3>
                  <Badge variant="secondary">
                    {item.type === 'election' ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" />Voted</>
                    ) : (
                      <><FileText className="w-3 h-3 mr-1" />{item.vote === 'for' ? 'For' : 'Against'}</>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {item.type === 'election' ? 'Election Vote' : `Proposal Vote: ${item.vote}`}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(item.votedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
