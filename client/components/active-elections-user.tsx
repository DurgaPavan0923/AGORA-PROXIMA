"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { CheckCircle2, TrendingUp, Users, Calendar, Sparkles, BookOpen, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Party {
  id: string
  name: string
  symbol?: string
  manifesto?: string
  boucherUrl?: string
}

interface Election {
  _id: string
  title: string
  description: string
  status: string
  parties: Party[]
  totalVotes: number
  voteCounts: Record<string, number>
  endDate: Date
}

export function ActiveElectionsUser() {
  const { data, isLoading, mutate } = useSWR("/elections", async () => {
    const response = await api.elections.getAll()
    return response
  })

  const [votedElections, setVotedElections] = useState<Set<string>>(new Set())
  const [selectedParty, setSelectedParty] = useState<string | null>(null)
  const [votingLoading, setVotingLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [manifestoParty, setManifestoParty] = useState<Party | null>(null)

  const elections: Election[] = data?.elections?.filter((e: Election) => e.status === "active") || []

  // Check which elections user has voted in
  useEffect(() => {
    const checkVotedStatus = async () => {
      const voted = new Set<string>()
      for (const election of elections) {
        try {
          const result = await api.elections.checkVoted(election._id)
          if (result.hasVoted) {
            voted.add(election._id)
          }
        } catch (err) {
          console.error('Error checking voted status:', err)
        }
      }
      setVotedElections(voted)
    }

    if (elections.length > 0) {
      checkVotedStatus()
    }
  }, [elections.length])

  const handleVote = async (electionId: string, partyId: string) => {
    setVotingLoading(partyId)
    setError(null)
    try {
      await api.elections.vote(electionId, partyId)
      setVotedElections(new Set([...votedElections, electionId]))
      setSelectedParty(null)
      // Refresh elections data
      mutate()
    } catch (error) {
      console.error("Voting failed:", error)
      setError(error instanceof Error ? error.message : "Failed to vote")
    } finally {
      setVotingLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-[#0C2340] flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-[#FF9933]" />
            Active Elections
          </h2>
          <p className="text-gray-500 mt-1">Cast your vote and make your voice heard</p>
        </div>
        <Badge className="bg-[#0C2340] text-white border-0">
          <Users className="w-3 h-3 mr-1" />
          {elections.length} Active
        </Badge>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-64 bg-white/5" />
          ))}
        </div>
      ) : elections.length === 0 ? (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-[#FF9933]/10 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-[#FF9933]" />
              </div>
              <p className="text-gray-600 text-lg">No active elections at the moment</p>
              <p className="text-gray-400 text-sm">Check back soon for upcoming votes</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence>
            {elections.map((election, index) => {
              const totalVoteCount = election.totalVotes || 1
              const hasVoted = votedElections.has(election._id)

              return (
                <motion.div
                  key={election._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="overflow-hidden bg-white border border-gray-200 hover:border-[#0C2340]/30 transition-all duration-300 hover:shadow-lg h-full">
                    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#0C2340]/5 to-[#FF9933]/5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-[#0C2340] text-xl flex items-center gap-2">
                            {election.title}
                            <TrendingUp className="w-5 h-5 text-[#FF9933] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </CardTitle>
                          <CardDescription className="text-gray-500 mt-1">
                            {election.description}
                          </CardDescription>
                        </div>
                        {hasVoted && (
                          <Badge className="bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Voted
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Ends {new Date(election.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-4">
                        {election.parties.map((party) => {
                          const voteCount = election.voteCounts[party.id] || 0
                          const percentage = totalVoteCount > 0 ? Math.round((voteCount / totalVoteCount) * 100) : 0
                          const isSelected = selectedParty === party.id
                          const isVoting = votingLoading === party.id
                          
                          return (
                            <motion.div 
                              key={party.id} 
                              className="space-y-2"
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {party.symbol && (
                                    <span className="text-xl">{party.symbol}</span>
                                  )}
                                  <span className="font-semibold text-[#0C2340]">{party.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {party.manifesto && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-[#0C2340] hover:text-[#FF9933] gap-1 px-2"
                                      onClick={() => setManifestoParty(party)}
                                    >
                                      <BookOpen className="w-4 h-4" />
                                      <span className="text-xs">Manifesto</span>
                                    </Button>
                                  )}
                                  {party.boucherUrl && (
                                    <a
                                      href={party.boucherUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-[#0C2340] hover:text-[#FF9933] gap-1 px-2"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                        <span className="text-xs">Boucher</span>
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </div>
                              {!hasVoted && (
                                <Button
                                  size="sm"
                                  variant={isSelected ? "default" : "outline"}
                                  onClick={() => handleVote(election._id, party.id)}
                                  disabled={isVoting || !!votingLoading}
                                  className={`
                                    w-full mt-2 transition-all duration-300
                                    ${isSelected 
                                      ? 'bg-[#FF9933] hover:bg-[#e88a2d] text-white shadow-md' 
                                      : 'border-gray-300 hover:border-[#FF9933] hover:bg-[#FF9933]/5 text-[#0C2340]'
                                    }
                                  `}
                                  onMouseEnter={() => setSelectedParty(party.id)}
                                  onMouseLeave={() => setSelectedParty(null)}
                                >
                                  {isVoting ? 'Voting...' : `Vote for ${party.name}`}
                                </Button>
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
      {/* Manifesto Dialog */}
      <Dialog open={!!manifestoParty} onOpenChange={(open) => { if (!open) setManifestoParty(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0C2340]">
              {manifestoParty?.symbol && <span className="text-2xl">{manifestoParty.symbol}</span>}
              {manifestoParty?.name} — Manifesto
            </DialogTitle>
            <DialogDescription>Official party manifesto and policy commitments</DialogDescription>
          </DialogHeader>
          <div className="mt-2 max-h-[60vh] overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
              {manifestoParty?.manifesto}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
