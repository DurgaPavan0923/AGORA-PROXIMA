"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Plus, Search, MapPin, ThumbsUp, ThumbsDown, MessageSquare, Zap, AlertCircle } from "lucide-react"
import useSWR from "swr"
import { cn } from "@/lib/utils"

interface Proposal {
  id: number
  title: string
  description: string
  area: string
  category: string
  status: string
  votes: { yes: number; no: number; abstain: number }
  totalVoters: number
  userVote: string | null
  daysLeft: number
  participation: number
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function LiveProposalsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [votingProposal, setVotingProposal] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: proposals = [],
    isLoading,
    error,
    mutate: refreshProposals,
  } = useSWR<Proposal[]>("/api/proposals", fetcher, {
    refreshInterval: 15000, // Auto-refresh every 15 seconds
    revalidateOnFocus: true,
  })

  const filteredProposals = proposals.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleVote = async (proposalId: number, vote: "yes" | "no" | "abstain") => {
    setIsSubmitting(true)
    setVotingProposal(proposalId)

    try {
      const response = await fetch(`/api/proposals/${proposalId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Vote submitted successfully:", result)

        await refreshProposals()
        setVotingProposal(null)
      }
    } catch (error) {
      console.error("[v0] Vote submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculatePercentage = (voteCount: number, proposal: Proposal) => {
    const total = proposal.votes.yes + proposal.votes.no + proposal.votes.abstain
    return total > 0 ? Math.round((voteCount / total) * 100) : 0
  }

  const activeProposals = filteredProposals.filter((p) => p.status === "voting")
  const closedProposals = filteredProposals.filter((p) => p.status === "closed")

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-2 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search proposals..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Proposal
        </Button>
        <Button variant="outline" onClick={() => refreshProposals()} disabled={isLoading} className="w-full sm:w-auto">
          <Zap className="w-4 h-4 mr-2" />
          {isLoading ? "Updating..." : "Refresh"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="active" className="relative">
            Active Voting
            {activeProposals.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {activeProposals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {error && (
            <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20">
              <CardContent className="pt-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">Failed to load proposals. Please try refreshing.</p>
              </CardContent>
            </Card>
          )}

          {isLoading && activeProposals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading proposals...</p>
              </CardContent>
            </Card>
          ) : activeProposals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No active proposals match your search</p>
              </CardContent>
            </Card>
          ) : (
            activeProposals.map((proposal) => (
              <Card
                key={proposal.id}
                className={cn(
                  "border transition-all duration-300 hover:shadow-md",
                  votingProposal === proposal.id ? "ring-2 ring-primary" : "hover:border-primary/50",
                )}
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge>{proposal.category}</Badge>
                        <Badge variant="outline" className="gap-1">
                          <MapPin className="w-3 h-3" />
                          {proposal.area}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {proposal.participation}% participation
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <CardDescription className="mt-1">{proposal.description}</CardDescription>
                    </div>
                      <div className="text-right flex-shrink-0">
                      <div
                        className={cn("text-2xl font-bold", proposal.daysLeft <= 2 ? "text-red-600" : "text-primary")}
                      >
                        {proposal.daysLeft}d
                      </div>
                      <p className="text-xs text-muted-foreground">left to vote</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">

                  {/* Voting Buttons */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                    <Button
                      variant={proposal.userVote === "yes" ? "default" : "outline"}
                      onClick={() => handleVote(proposal.id, "yes")}
                      disabled={isSubmitting && votingProposal === proposal.id}
                      className={cn(
                        "transition-all",
                        proposal.userVote === "yes" && "bg-accent text-accent-foreground hover:bg-accent/90",
                      )}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Yes
                    </Button>
                    <Button
                      variant={proposal.userVote === "no" ? "default" : "outline"}
                      onClick={() => handleVote(proposal.id, "no")}
                      disabled={isSubmitting && votingProposal === proposal.id}
                      className={cn(
                        "transition-all",
                        proposal.userVote === "no" && "bg-red-500 text-white hover:bg-red-600",
                      )}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      No
                    </Button>
                    <Button variant="outline" disabled={isSubmitting && votingProposal === proposal.id}>
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Discuss
                    </Button>
                  </div>

                  {/* User Vote Indicator */}
                  {proposal.userVote && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-2 animate-pulse">
                      <span className="text-sm text-primary font-medium">
                        ✓ You voted {proposal.userVote.toUpperCase()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="closed">
          {closedProposals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No closed proposals yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {closedProposals.map((proposal) => (
                <Card key={proposal.id} className="opacity-75 hover:opacity-100 transition-opacity">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{proposal.title}</CardTitle>
                        <Badge variant="outline" className="mt-2">
                          Closed
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No saved proposals yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
