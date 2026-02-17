"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Party {
  id?: string
  name: string
  symbol: string
  manifesto: string
}

export function ElectionCreator() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [type, setType] = useState<"national" | "state" | "local">("local")
  const [parties, setParties] = useState<Party[]>([])
  const [newPartyName, setNewPartyName] = useState("")
  const [newPartySymbol, setNewPartySymbol] = useState("")
  const [newPartyManifesto, setNewPartyManifesto] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const addParty = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    if (newPartyName.trim() && newPartySymbol.trim()) {
      setParties([...parties, { 
        name: newPartyName,
        symbol: newPartySymbol,
        manifesto: newPartyManifesto || `Manifesto for ${newPartyName}`
      }])
      setNewPartyName("")
      setNewPartySymbol("")
      setNewPartyManifesto("")
    }
  }

  const removeParty = (index: number) => {
    setParties(parties.filter((_, i) => i !== index))
  }

  const handleCreateElection = async () => {
    if (!title || !description || !startDate || !endDate || parties.length < 2) {
      setError("Please fill all fields and add at least 2 parties")
      return
    }

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/elections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          startDate,
          endDate,
          parties,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create election")
      }

      setSuccess(true)
      // Reset form
      setTitle("")
      setDescription("")
      setStartDate("")
      setEndDate("")
      setType("local")
      setParties([])
      setTimeout(() => {
        setSuccess(false)
        window.location.reload() // Refresh to show new election
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create election")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Election
        </CardTitle>
        <CardDescription>Organize a new election with parties and governance options</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Election</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Election</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-2">
                <Label>Election Title</Label>
                <Input
                  placeholder="e.g., City Council 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the election purpose and voting options"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={3}
                />
              </div>

              {/* Election Type */}
              <div className="space-y-2">
                <Label>Election Type</Label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  disabled={loading}
                >
                  <option value="local">Local</option>
                  <option value="state">State</option>
                  <option value="national">National</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Parties */}
              <div className="space-y-3">
                <Label>Political Parties (Minimum 2 required)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Party name *"
                    value={newPartyName}
                    onChange={(e) => setNewPartyName(e.target.value)}
                    disabled={loading}
                  />
                  <Input
                    placeholder="Symbol (emoji) *"
                    value={newPartySymbol}
                    onChange={(e) => setNewPartySymbol(e.target.value)}
                    maxLength={4}
                    disabled={loading}
                  />
                  <Input
                    placeholder="Brief manifesto"
                    value={newPartyManifesto}
                    onChange={(e) => setNewPartyManifesto(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addParty} 
                  variant="outline" 
                  disabled={loading || !newPartyName.trim() || !newPartySymbol.trim()}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Party
                </Button>

                {parties.length > 0 && (
                  <div className="space-y-2">
                    {parties.map((party, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{party.symbol}</span>
                          <div>
                            <p className="font-medium">{party.name}</p>
                            <p className="text-xs text-gray-600">{party.manifesto}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeParty(index)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Once created, all votes will be recorded on blockchain. Party and vote data cannot be modified after
                  election goes live.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 text-sm">Election created successfully!</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleCreateElection} disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Election"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
