"use client"
import { Card, CardContent } from "@/components/ui/card"
import useSWR from "swr"
import { TrendingUp } from "lucide-react"

interface UserStats {
  votesCount: number
  proposalsCreated: number
  impactScore: number
  communityRank: number
  participationRate: number
  locality: string
  lastUpdated: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function DashboardStats() {
  const {
    data: stats,
    isLoading,
    error,
  } = useSWR<UserStats>("/api/user/stats", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  const statItems = [
    { label: "Your Votes", value: stats?.votesCount ?? 0, icon: "🗳️", color: "from-blue-500 to-blue-600" },
    {
      label: "Proposals Created",
      value: stats?.proposalsCreated ?? 0,
      icon: "📝",
      color: "from-purple-500 to-purple-600",
    },
    { label: "Impact Score", value: stats?.impactScore ?? 0, icon: "⭐", color: "from-amber-500 to-amber-600" },
    {
      label: "Community Rank",
      value: `#${stats?.communityRank ?? 0}`,
      icon: "🏆",
      color: "from-green-500 to-green-600",
    },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat, i) => (
        <Card key={i} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <TrendingUp className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent text-3xl font-bold mb-1`}>
              {isLoading ? "..." : stat.value}
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            {stats?.lastUpdated && (
              <p className="text-xs text-muted-foreground/60 mt-2">
                Updated {new Date(stats.lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
