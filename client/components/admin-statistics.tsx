"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Vote, CheckCircle2, TrendingUp } from "lucide-react"

export function AdminStatistics() {
  const { data, isLoading } = useSWR("/api/statistics/admin", async (url) => {
    const response = await fetch(url, {
      credentials: 'include'
    })
    return response.json()
  })

  const stats = data?.stats || {
    totalUsers: 0,
    pendingUsers: 0,
    totalElections: 0,
    activeElections: 0,
    totalVotes: 0,
    totalProposals: 0,
  }

  const StatCard = ({ icon: Icon, title, value, description }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{isLoading ? "..." : value}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          <Icon className="w-8 h-8 text-teal-600 opacity-50" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Users} 
          title="Total Users" 
          value={stats.totalUsers} 
          description="Verified users"
        />
        <StatCard 
          icon={Users} 
          title="Pending Users" 
          value={stats.pendingUsers} 
          description="Awaiting approval"
        />
        <StatCard 
          icon={Vote} 
          title="Total Elections" 
          value={stats.totalElections} 
          description={`${stats.activeElections || 0} active`}
        />
        <StatCard 
          icon={CheckCircle2} 
          title="Total Votes" 
          value={stats.totalVotes} 
          description="All-time votes cast"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
          icon={TrendingUp} 
          title="Active Elections" 
          value={stats.activeElections} 
          description="Currently running"
        />
        <StatCard 
          icon={Vote} 
          title="Proposals" 
          value={stats.totalProposals} 
          description="Community proposals"
        />
      </div>
    </div>
  )
}
