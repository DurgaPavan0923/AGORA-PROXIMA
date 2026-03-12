"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Edit2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Election {
  _id: string
  id?: string
  title: string
  description: string
  status: string
  parties: Array<{ id?: string; _id?: string; name: string }>
}

export function AdminElectionEditor() {
  const { data, mutate } = useSWR("/api/elections", async (url) => {
    const response = await fetch(url)
    return response.json()
  })

  const [editingElection, setEditingElection] = useState<Partial<Election> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const elections: Election[] = data?.elections || []

  const handleEdit = (election: Election) => {
    setEditingElection(election)
    setError("")
    setSuccess(false)
  }

  const handleSave = async () => {
    if (!editingElection || !editingElection._id) return

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch(`/api/elections/${editingElection._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingElection),
      })

      if (!response.ok) throw new Error("Failed to update")

      setSuccess(true)
      setEditingElection(null)
      mutate()
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit2 className="w-5 h-5" />
          Edit Elections
        </CardTitle>
        <CardDescription>Modify election details (metadata only, not blockchain data)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Election Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Parties</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elections.map((election) => (
                <TableRow key={election._id}>
                  <TableCell className="font-medium">{election.title}</TableCell>
                  <TableCell>
                    <Badge variant={election.status === "active" ? "default" : "secondary"}>{election.status}</Badge>
                  </TableCell>
                  <TableCell>{election.parties.length} parties</TableCell>
                  <TableCell>
                    <Dialog
                      open={editingElection?._id === election._id}
                      onOpenChange={(open) => !open && setEditingElection(null)}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(election)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Election</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={editingElection?.title || ""}
                              onChange={(e) => setEditingElection({ ...editingElection, title: e.target.value })}
                              disabled={loading}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={editingElection?.description || ""}
                              onChange={(e) => setEditingElection({ ...editingElection, description: e.target.value })}
                              disabled={loading}
                              rows={4}
                            />
                          </div>

                          <Alert className="border-blue-200 bg-blue-50">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800 text-sm">
                              Blockchain data (votes, parties) cannot be edited for security and transparency.
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
                              <AlertDescription className="text-green-800 text-sm">Election updated!</AlertDescription>
                            </Alert>
                          )}

                          <Button onClick={handleSave} disabled={loading} className="w-full">
                            {loading ? "Saving..." : "Save Changes"}
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
      </CardContent>
    </Card>
  )
}
