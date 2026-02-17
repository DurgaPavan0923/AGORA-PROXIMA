"use client"

import { useState, useEffect } from "react"
import { api, Election } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, Plus, Trash2, Edit, Users, BarChart3, MoreVertical, Play, Square } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Party {
  name: string
  symbol: string
  manifesto: string
}

export default function ElectionCommissionDashboard() {
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingElection, setEditingElection] = useState<Election | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [type, setType] = useState<"national" | "state" | "local">("national")
  const [parties, setParties] = useState<Party[]>([])
  
  // Party form state
  const [partyName, setPartyName] = useState("")
  const [partySymbol, setPartySymbol] = useState("")
  const [partyManifesto, setPartyManifesto] = useState("")

  useEffect(() => {
    loadElections()
  }, [])

  const loadElections = async () => {
    try {
      const response = await api.elections.getAll()
      setElections(response.elections || [])
    } catch (error) {
      console.error("Failed to load elections:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddParty = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    if (!partyName || !partySymbol) {
      alert("Party name and symbol are required")
      return
    }

    setParties([
      ...parties,
      {
        name: partyName,
        symbol: partySymbol,
        manifesto: partyManifesto,
      },
    ])

    // Reset party form
    setPartyName("")
    setPartySymbol("")
    setPartyManifesto("")
  }

  const handleRemoveParty = (index: number) => {
    setParties(parties.filter((_, i) => i !== index))
  }

  const handleCreateElection = async () => {
    try {
      if (!title || !description || !startDate || !endDate) {
        alert("All fields are required")
        return
      }

      if (parties.length < 2) {
        alert("At least 2 parties are required")
        return
      }

      const electionData = {
        title,
        description,
        type,
        startDate,
        endDate,
        parties,
        status: "upcoming",
      }

      await api.elections.create(electionData)
      alert("Election created successfully")

      // Reset form
      resetForm()
      setShowCreateForm(false)
      loadElections()
    } catch (error: any) {
      alert(error.message || "Failed to create election")
    }
  }

  const handleUpdateElection = async () => {
    try {
      if (!title || !description || !startDate || !endDate) {
        alert("All fields are required")
        return
      }

      if (parties.length < 2) {
        alert("At least 2 parties are required")
        return
      }

      if (!editingElection) return

      const electionData = {
        title,
        description,
        type,
        startDate,
        endDate,
        parties,
      }

      await api.elections.update(editingElection._id, electionData)
      alert("Election updated successfully")

      // Reset form
      resetForm()
      setShowEditForm(false)
      loadElections()
    } catch (error: any) {
      alert(error.message || "Failed to update election")
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStartDate("")
    setEndDate("")
    setType("national")
    setParties([])
    setPartyName("")
    setPartySymbol("")
    setPartyManifesto("")
    setEditingElection(null)
  }

  const handleEditElection = (election: Election) => {
    // Close create form if open
    setShowCreateForm(false)
    
    // Set up edit form
    setEditingElection(election)
    setTitle(election.title)
    setDescription(election.description)
    setStartDate(election.startDate.split("T")[0])
    setEndDate(election.endDate.split("T")[0])
    setType(election.type)
    setParties(election.parties)
    setShowEditForm(true)
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdateStatus = async (electionId: string, newStatus: string) => {
    try {
      await api.elections.update(electionId, { status: newStatus })
      alert(`Election status updated to ${newStatus}`)
      loadElections()
    } catch (error: any) {
      alert(error.message || "Failed to update status")
    }
  }

  const handleDeleteElection = async (electionId: string) => {
    if (!confirm("Are you sure you want to delete this election?")) return

    try {
      await api.elections.delete(electionId)
      alert("Election deleted successfully")
      loadElections()
    } catch (error: any) {
      alert(error.message || "Failed to delete election")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "national":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "state":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "local":
        return "bg-teal-100 text-teal-800 border-teal-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading elections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Election Commission Dashboard</h1>
          <p className="text-gray-600 mt-1">Create and manage elections for the platform</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowCreateForm(!showCreateForm)
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showCreateForm ? "Cancel" : "Create New Election"}
        </Button>
      </div>

      {/* Edit Election Form - Separate Section */}
      {showEditForm && editingElection && (
        <Card className="border-2 border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Election: {editingElection.title}
            </CardTitle>
            <CardDescription>
              Update election details, parties, and dates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Election Title *</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., General Election 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-type">Election Type *</Label>
                <select
                  id="edit-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="national">National</option>
                  <option value="state">State</option>
                  <option value="local">Local</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and scope of this election..."
                rows={3}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date *</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date *</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Parties Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Political Parties ({parties.length})</Label>
                <Badge variant="outline" className="text-xs">
                  Minimum 2 parties required
                </Badge>
              </div>

              {/* Added Parties */}
              {parties.length > 0 && (
                <div className="space-y-2">
                  {parties.map((party, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{party.symbol}</span>
                          <div>
                            <p className="font-semibold text-gray-900">{party.name}</p>
                            {party.manifesto && (
                              <p className="text-sm text-gray-600 mt-1">{party.manifesto}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveParty(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Party Form */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Add Political Party</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    placeholder="Party Name *"
                  />
                  <Input
                    value={partySymbol}
                    onChange={(e) => setPartySymbol(e.target.value)}
                    placeholder="Symbol (emoji) *"
                    maxLength={2}
                  />
                  <Input
                    value={partyManifesto}
                    onChange={(e) => setPartyManifesto(e.target.value)}
                    placeholder="Brief Manifesto"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddParty}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Party
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleUpdateElection}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Election
              </Button>
              <Button
                onClick={() => {
                  resetForm()
                  setShowEditForm(false)
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Election Form */}
      {showCreateForm && (
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle>Create New Election</CardTitle>
            <CardDescription>
              Set up a new election for citizens to vote
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Election Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., General Election 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Election Type *</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="national">National</option>
                  <option value="state">State</option>
                  <option value="local">Local</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and scope of this election..."
                rows={3}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Parties Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Political Parties ({parties.length})</Label>
                <Badge variant="outline" className="text-xs">
                  Minimum 2 parties required
                </Badge>
              </div>

              {/* Added Parties */}
              {parties.length > 0 && (
                <div className="space-y-2">
                  {parties.map((party, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{party.symbol}</span>
                          <div>
                            <p className="font-semibold text-gray-900">{party.name}</p>
                            {party.manifesto && (
                              <p className="text-sm text-gray-600 mt-1">{party.manifesto}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveParty(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Party Form */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Add Political Party</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    placeholder="Party Name *"
                  />
                  <Input
                    value={partySymbol}
                    onChange={(e) => setPartySymbol(e.target.value)}
                    placeholder="Symbol (emoji) *"
                    maxLength={2}
                  />
                  <Input
                    value={partyManifesto}
                    onChange={(e) => setPartyManifesto(e.target.value)}
                    placeholder="Brief Manifesto"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddParty}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Party
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleCreateElection}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Election
              </Button>
              <Button
                onClick={() => {
                  resetForm()
                  setShowCreateForm(false)
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Elections List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">All Elections ({elections.length})</h2>

        {elections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No elections created yet</p>
              <p className="text-sm text-gray-500 mt-1">Click "Create New Election" to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {elections.map((election) => (
              <Card key={election._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{election.title}</h3>
                        <Badge className={getTypeColor(election.type)}>
                          {election.type.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(election.status)}>
                          {election.status.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4">{election.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">
                            Start: {new Date(election.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">
                            End: {new Date(election.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{election.parties.length} Parties</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BarChart3 className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{election.totalVotes || 0} Votes</span>
                        </div>
                      </div>

                      {/* Parties */}
                      <div className="flex flex-wrap gap-2">
                        {election.parties.map((party, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {party.symbol} {party.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => handleEditElection(election)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Election
                          </DropdownMenuItem>

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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
