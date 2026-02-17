"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, FileText } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Party {
  id: string
  name: string
  symbol: string
  manifesto: string
  boucherUrl?: string
}

interface Election {
  _id: string
  title: string
  parties: Party[]
}

export function PartyBoucherManager() {
  const { data, isLoading } = useSWR("/api/elections", async (url) => {
    const response = await fetch(url, {
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch elections')
    }
    return response.json()
  })

  const elections: Election[] = data?.elections || []
  
  // Flatten all parties from all elections
  const allParties: (Party & { electionTitle: string })[] = elections.flatMap((election) => 
    election.parties.map((party) => ({
      ...party,
      electionTitle: election.title,
    }))
  )

  const [editingParty, setEditingParty] = useState<(Party & { electionTitle: string }) | null>(null)
  const [boucherUrl, setBoucherUrl] = useState("")

  const handleUploadBoucher = () => {
    // TODO: Implement API call to upload boucher
    // For now, just close the dialog
    alert("Boucher upload feature coming soon!")
    setEditingParty(null)
    setBoucherUrl("")
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
                    <TableCell className="text-sm text-gray-600">{party.electionTitle}</TableCell>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{party.symbol}</span>
                        <span>{party.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate">{party.manifesto}</TableCell>
                  <TableCell>
                    {party.boucherUrl ? (
                      <a
                        href={party.boucherUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">Not uploaded</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={editingParty?.id === party.id}
                      onOpenChange={(open) => !open && setEditingParty(null)}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditingParty(party)}>
                          <Upload className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Boucher - {party.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Boucher PDF URL</Label>
                            <Input
                              placeholder="https://example.com/boucher.pdf"
                              value={boucherUrl || editingParty?.boucherUrl || ""}
                              onChange={(e) => setBoucherUrl(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleUploadBoucher} className="w-full">
                            Save Boucher
                          </Button>
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
