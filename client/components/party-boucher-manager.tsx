"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle2, AlertCircle, ExternalLink, XCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

interface Party {
  id: string
  name: string
  symbol: string
  manifesto?: string
  boucherUrl?: string
}

interface Election {
  _id: string
  title: string
  parties: Party[]
}

export function PartyBoucherManager() {
  const { data, isLoading, mutate } = useSWR("/api/elections", async (url) => {
    const response = await fetch(url, { credentials: 'include' })
    if (!response.ok) throw new Error('Failed to fetch elections')
    return response.json()
  })

  const elections: Election[] = data?.elections || []

  // Flatten all parties with their parent election ID
  const allParties: (Party & { electionId: string; electionTitle: string })[] = elections.flatMap(
    (election) =>
      election.parties.map((party) => ({
        ...party,
        electionId: election._id,
        electionTitle: election.title,
      }))
  )

  const [editingParty, setEditingParty] = useState<
    (Party & { electionId: string; electionTitle: string }) | null
  >(null)
  const [boucherUrl, setBoucherUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)

  const openManage = (party: Party & { electionId: string; electionTitle: string }) => {
    setEditingParty(party)
    setBoucherUrl(party.boucherUrl || "")
    setSaveError("")
    setSaveSuccess(false)
  }

  const closeManage = () => {
    setEditingParty(null)
    setBoucherUrl("")
    setSaveError("")
    setSaveSuccess(false)
  }

  const handleSaveBoucher = async () => {
    if (!editingParty) return

    if (!boucherUrl.trim()) {
      setSaveError("Please enter a valid URL")
      return
    }

    // Basic URL validation
    try {
      new URL(boucherUrl.trim())
    } catch {
      setSaveError("Please enter a valid URL (e.g. https://example.com/boucher.pdf)")
      return
    }

    setSaving(true)
    setSaveError("")

    try {
      // Get the full election to update the party within it
      const election = elections.find((e) => e._id === editingParty.electionId)
      if (!election) throw new Error("Election not found")

      // Build updated parties array with the new boucherUrl for this party
      const updatedParties = election.parties.map((p) =>
        p.id === editingParty.id ? { ...p, boucherUrl: boucherUrl.trim() } : p
      )

      const response = await fetch(`${API_URL}/elections/${editingParty.electionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({ parties: updatedParties }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to save boucher")

      setSaveSuccess(true)

      // Optimistically update the SWR cache immediately so the table
      // reflects the change without waiting for a server round-trip
      await mutate(
        (currentData: any) => {
          if (!currentData?.elections) return currentData
          return {
            ...currentData,
            elections: currentData.elections.map((e: Election) =>
              e._id === editingParty.electionId
                ? {
                    ...e,
                    parties: e.parties.map((p: Party) =>
                      p.id === editingParty.id
                        ? { ...p, boucherUrl: boucherUrl.trim() }
                        : p
                    ),
                  }
                : e
            ),
          }
        },
        { revalidate: true } // also re-fetch from server in the background
      )

      // Auto-close after 1.5s
      setTimeout(() => closeManage(), 1500)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save boucher")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Party Manifesto & Boucher Management
        </CardTitle>
        <CardDescription>Upload and manage party manifestos and electoral bouchers</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : allParties.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No parties found. Create an election first.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Election</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Manifesto</TableHead>
                  <TableHead>Boucher</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allParties.map((party, index) => (
                  <TableRow key={`${party.electionTitle}-${party.id || index}`}>
                    <TableCell className="text-sm text-gray-600 uppercase">{party.electionTitle}</TableCell>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{party.symbol}</span>
                        <span>{party.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate text-gray-600">
                      {party.manifesto || <span className="text-gray-400 italic">No manifesto</span>}
                    </TableCell>
                    <TableCell>
                      {party.boucherUrl ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 border border-green-200 gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Uploaded
                          </Badge>
                          <a
                            href={party.boucherUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View
                          </a>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-gray-400 border-gray-200 gap-1">
                          <XCircle className="w-3 h-3" />
                          Not uploaded
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={editingParty?.id === party.id && editingParty?.electionId === party.electionId}
                        onOpenChange={(open) => { if (!open) closeManage() }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => openManage(party)}>
                            <Upload className="w-4 h-4 mr-1" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <span className="text-xl">{party.symbol}</span>
                              {party.name} — Boucher
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-2">
                            {saveSuccess && (
                              <Alert className="border-green-500 bg-green-50">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                  Boucher URL saved successfully!
                                </AlertDescription>
                              </Alert>
                            )}
                            {saveError && (
                              <Alert className="border-red-500 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">{saveError}</AlertDescription>
                              </Alert>
                            )}
                            <div className="space-y-2">
                              <Label htmlFor="boucher-url">Boucher PDF URL</Label>
                              <Input
                                id="boucher-url"
                                placeholder="https://example.com/boucher.pdf"
                                value={boucherUrl}
                                onChange={(e) => {
                                  setBoucherUrl(e.target.value)
                                  setSaveError("")
                                }}
                              />
                              <p className="text-xs text-gray-500">
                                Enter the public URL of the party's boucher PDF document.
                              </p>
                            </div>
                            {party.boucherUrl && (
                              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-blue-900">Current boucher</p>
                                  <p className="text-xs text-blue-600 truncate">{party.boucherUrl}</p>
                                </div>
                                <a
                                  href={party.boucherUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="shrink-0"
                                >
                                  <Button size="sm" variant="outline" className="border-blue-300 hover:bg-blue-100 text-xs">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Open
                                  </Button>
                                </a>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button
                                onClick={handleSaveBoucher}
                                disabled={saving}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                              >
                                {saving ? "Saving..." : "Save Boucher"}
                              </Button>
                              <Button variant="outline" onClick={closeManage} disabled={saving}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
