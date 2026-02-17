"use client"
import { Card, CardContent } from "@/components/ui/card"
import useSWR from "swr"
import { Users, FileText, Vote, TrendingUp } from "lucide-react"

interface GlobalStats {
  totalVoters: number
  totalProposals: number
  totalVotes: number
  governmentApprovalRate: number
  lastUpdated: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function GlobalStatsBanner() {
  const { data: stats, isLoading } = useSWR<GlobalStats>("/api/statistics/global", fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })

  const statItems = [
    {
      icon: Users,
      label: "Total Voters",
      value: stats?.totalVoters ?? 0,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: FileText,
      label: "Active Proposals",
      value: stats?.totalProposals ?? 0,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      icon: Vote,
      label: "Total Votes",
      value: stats?.totalVotes ?? 0,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      icon: TrendingUp,
      label: "Approval Rate",
      value: `${stats?.governmentApprovalRate ?? 0}%`,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {statItems.map((stat, i) => {
        const Icon = stat.icon
        return (
          <Card key={i} className={`${stat.bgColor} border-0`}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{isLoading ? "..." : stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
