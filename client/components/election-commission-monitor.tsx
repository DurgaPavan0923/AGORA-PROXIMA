"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, Users, Clock, MoreVertical, Edit, Trash2, Play, Square, Trophy, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Party {
  id: string
  name: string
  symbol: string
  manifesto?: string
}

interface Election {
  _id: string
  title: string
  description: string
  type: string
  status: string
  startDate: string
  endDate: string
  parties: Party[]
  totalVotes: number
  voteCounts?: Record<string, number>
}

export function ElectionCommissionMonitor() {
  const [editingTime, setEditingTime] = useState<string | null>(null)
  const [newStartDate, setNewStartDate] = useState("")
  const [newEndDate, setNewEndDate] = useState("")

  const { data, isLoading, error, mutate } = useSWR("/api/elections", async (url) => {
    const response = await fetch(url, {
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch elections')
    }
    return response.json()
  }, {
    refreshInterval: 30000 // Auto-refresh every 30 seconds
  })

  const elections: Election[] = data?.elections || []

  // Auto-end elections when time is over
  useEffect(() => {
    const checkAndEndElections = async () => {
      const now = new Date()
      for (const election of elections) {
        if (election.status === "active" && new Date(election.endDate) < now) {
          try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
            await fetch(`${API_URL}/elections/${election._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: 'include',
              body: JSON.stringify({ status: "completed" }),
            })
            mutate() // Refresh to show updated status
          } catch (error) {
            console.error("Failed to auto-end election:", error)
          }
        }
      }
    }

    checkAndEndElections()
    const interval = setInterval(checkAndEndElections, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [elections, mutate])

  const handleDeleteElection = async (electionId: string) => {
    if (!electionId || electionId === 'undefined') {
      alert("Invalid election ID")
      console.error("Election ID is undefined")
      return
    }

    if (!confirm("Are you sure you want to delete this election? This action cannot be undone.")) {
      return
    }

    try {
      console.log("Deleting election with ID:", electionId)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/elections/${electionId}`, {
        method: "DELETE",
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete election")
      }

      alert("Election deleted successfully")
      mutate() // Refresh the list
    } catch (error) {
      console.error("Delete election error:", error)
      alert(error instanceof Error ? error.message : "Failed to delete election")
    }
  }

  const handleUpdateStatus = async (electionId: string, newStatus: string) => {
    if (!electionId || electionId === 'undefined') {
      alert("Invalid election ID")
      console.error("Election ID is undefined")
      return
    }

    if (!confirm(`Are you sure you want to change the election status to "${newStatus}"?`)) {
      return
    }

    try {
      console.log("Updating election status:", electionId, "to", newStatus)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/elections/${electionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        console.error("Backend error response:", responseData)
        throw new Error(responseData.error || responseData.message || "Failed to update election status")
      }

      console.log("Update successful:", responseData)
      alert(`Election status updated to "${newStatus}" successfully`)
      mutate() // Refresh the list
    } catch (error) {
      console.error("Update status error:", error)
      alert(error instanceof Error ? error.message : "Failed to update status")
    }
  }

  const handleEditTime = (election: Election) => {
    setEditingTime(election._id)
    
    // Format dates for datetime-local input (YYYY-MM-DDTHH:MM)
    const formatDateForInput = (dateString: string) => {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    }
    
    setNewStartDate(formatDateForInput(election.startDate))
    setNewEndDate(formatDateForInput(election.endDate))
    
    console.log("Edit time dialog opened for:", election.title)
    console.log("Start:", formatDateForInput(election.startDate))
    console.log("End:", formatDateForInput(election.endDate))
  }

  const handleUpdateTime = async () => {
    if (!editingTime) {
      alert("No election selected")
      return
    }

    if (!newStartDate || !newEndDate) {
      alert("Please select both start and end dates")
      return
    }

    const start = new Date(newStartDate)
    const end = new Date(newEndDate)

    if (end <= start) {
      alert("End date must be after start date")
      return
    }

    try {
      console.log("📅 Updating election time:")
      console.log("  - Election ID:", editingTime)
      console.log("  - New start:", start.toISOString())
      console.log("  - New end:", end.toISOString())

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/elections/${editingTime}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ 
          startDate: start.toISOString(),
          endDate: end.toISOString()
        }),
      })

      const responseData = await response.json()
      console.log("Update time response:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || "Failed to update election time")
      }

      alert("Election time updated successfully!")
      setEditingTime(null)
      mutate() // Refresh the list
    } catch (error) {
      console.error("Update time error:", error)
      alert(error instanceof Error ? error.message : "Failed to update time")
    }
  }

  const getWinner = (election: Election) => {
    if (election.status !== "completed" || !election.voteCounts) {
      return null
    }

    let maxVotes = 0
    let winningParty: Party | null = null

    election.parties.forEach((party) => {
      const votes = election.voteCounts?.[party.id] || 0
      if (votes > maxVotes) {
        maxVotes = votes
        winningParty = party
      }
    })

    return winningParty
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Election Monitoring
            </CardTitle>
            <CardDescription>Real-time voting statistics and election progress</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log("=== ELECTIONS DATA ===")
              console.log("Raw data:", data)
              console.log("Elections array:", elections)
              elections.forEach((e, i) => {
                console.log(`Election ${i}:`, {
                  _id: e._id,
                  title: e.title,
                  status: e.status
                })
              })
            }}
          >
            Debug Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : elections.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No elections yet</p>
        ) : error ? (
          <p className="text-red-500 py-8 text-center">Failed to load elections</p>
        ) : (
          <div className="space-y-6">
            {elections.map((election) => {
              const totalVotes = election.totalVotes || 1
              const voteCounts = election.voteCounts || {}
              
              // Debug logging
              if (!election._id) {
                console.error("Election missing _id:", election)
              }
              
              return (
                <div key={election._id || Math.random()} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{election.title}</h3>
                      <p className="text-sm text-gray-600">{election.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{election.type.toUpperCase()}</Badge>
                        <Badge variant={election.status === "active" ? "default" : "secondary"}>
                          {election.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {election.status === "upcoming" && (
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(election._id, "active")}
                            className="text-green-600"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Election
                          </DropdownMenuItem>
                        )}

                        {election.status === "active" && (
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(election._id, "completed")}
                            className="text-gray-600"
                          >
                            <Square className="w-4 h-4 mr-2" />
                            End Election
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem 
                          onClick={() => handleEditTime(election)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Edit Time
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={() => handleDeleteElection(election._id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Election
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Winner Display for Completed Elections */}
                  {election.status === "completed" && (() => {
                    const winner = getWinner(election)
                    const voteCounts = election.voteCounts || {}
                    const totalVotes = election.totalVotes || 0
                    
                    // Find runner-up
                    let runnerUp: Party | null = null
                    let runnerUpVotes = 0
                    election.parties.forEach((party) => {
                      const votes = voteCounts[party.id] || 0
                      if (party.id !== winner?.id && votes > runnerUpVotes) {
                        runnerUpVotes = votes
                        runnerUp = party
                      }
                    })
                    
                    if (!winner && totalVotes === 0) {
                      return (
                        <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-lg">
                          <p className="text-gray-600 text-center">No votes were cast in this election</p>
                        </div>
                      )
                    }
                    
                    return winner ? (
                      <div className="space-y-3">
                        {/* Winner Card */}
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 p-4 rounded-lg shadow-md">
                          <div className="flex items-start gap-3">
                            <Trophy className="w-10 h-10 text-yellow-600 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-yellow-800 uppercase tracking-wide">🎉 Election Winner</p>
                                <Badge className="bg-yellow-600 text-white">Winner</Badge>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-4xl">{winner.symbol}</span>
                                <div>
                                  <p className="font-bold text-2xl text-gray-900">{winner.name}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <p className="text-lg font-semibold text-gray-700">
                                      {voteCounts[winner.id] || 0} votes
                                    </p>
                                    <Badge variant="outline" className="text-sm font-bold">
                                      {totalVotes > 0 ? Math.round(((voteCounts[winner.id] || 0) / totalVotes) * 100) : 0}%
                                    </Badge>
                                  </div>
                                  {winner.manifesto && (
                                    <p className="text-xs text-gray-600 mt-1 italic">"{winner.manifesto}"</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Runner-up Card */}
                        {runnerUp && runnerUpVotes > 0 && (
                          <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-300 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-2xl">{runnerUp.symbol}</span>
                                <div>
                                  <p className="text-xs text-gray-500 font-semibold">Runner-up</p>
                                  <p className="font-semibold text-gray-800">{runnerUp.name}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-700">{runnerUpVotes} votes</p>
                                <p className="text-xs text-gray-500">
                                  {totalVotes > 0 ? Math.round((runnerUpVotes / totalVotes) * 100) : 0}%
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null
                  })()}

                  {/* Voting Progress */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Total Votes
                      </span>
                      <span className="font-bold">{election.totalVotes}</span>
                    </div>

                    {/* Party Results */}
                    <div className="space-y-2 mt-3">
                      {election.parties.map((party) => {
                        const voteCount = voteCounts[party.id] || 0
                        const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0
                        return (
                          <div key={party.id} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <span className="text-lg">{party.symbol}</span>
                                <span>{party.name}</span>
                              </span>
                              <span className="font-semibold">
                                {voteCount} ({percentage}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(election.startDate).toLocaleDateString()}</span>
                    <span>→</span>
                    <span>{new Date(election.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>

      {/* Edit Time Dialog */}
      <Dialog open={!!editingTime} onOpenChange={() => setEditingTime(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Election Time</DialogTitle>
            <DialogDescription>
              Update the start and end dates/times for this election
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-start">Start Date & Time</Label>
              <Input
                id="edit-start"
                type="datetime-local"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-end">End Date & Time</Label>
              <Input
                id="edit-end"
                type="datetime-local"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateTime} className="flex-1">
                Update Time
              </Button>
              <Button variant="outline" onClick={() => setEditingTime(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
