"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, MapPin, Clock, Users } from "lucide-react"

export function DashboardPreview() {
  const proposals = [
    {
      id: 1,
      title: "Improve Public Transportation",
      area: "North District",
      votes: { yes: 782, no: 156, total: 938 },
      status: "active",
      daysLeft: 5,
    },
    {
      id: 2,
      title: "Allocate Budget for Parks",
      area: "Central Zone",
      votes: { yes: 645, no: 89, total: 734 },
      status: "active",
      daysLeft: 3,
    },
    {
      id: 3,
      title: "Community Education Program",
      area: "South Region",
      votes: { yes: 1203, no: 234, total: 1437 },
      status: "closed",
      daysLeft: 0,
    },
  ]

  return (
    <section id="dashboard" className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Live Governance Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Real-time visibility into all proposals, votes, and community participation
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Proposals", value: "24", icon: TrendingUp },
            { label: "Total Voters", value: "12,847", icon: Users },
            { label: "Community Areas", value: "8", icon: MapPin },
            { label: "Avg Response", value: "78%", icon: TrendingUp },
          ].map((stat, i) => (
            <Card key={i} className="border border-border">
              <CardHeader className="pb-3">
                <stat.icon className="w-5 h-5 text-primary mb-2" />
                <CardDescription className="text-sm">{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="border border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      {proposal.area}
                    </CardDescription>
                  </div>
                  <Badge variant={proposal.status === "active" ? "default" : "secondary"}>
                    {proposal.status === "active" ? "Active" : "Closed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Vote Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-accent font-medium">Yes: {proposal.votes.yes}</span>
                    <span className="text-muted-foreground">{proposal.votes.total} total votes</span>
                  </div>
                  <Progress value={(proposal.votes.yes / proposal.votes.total) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round((proposal.votes.yes / proposal.votes.total) * 100)}% in favor
                  </p>
                </div>

                {/* Time Left */}
                {proposal.status === "active" && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                    <Clock className="w-4 h-4" />
                    <span>{proposal.daysLeft} days remaining</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
