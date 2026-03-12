"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserCheck, UserX, Clock, AlertCircle, CheckCircle2, Eye, FileText } from "lucide-react"

interface PendingUser {
  _id: string
  fullName: string
  phone: string
  email?: string
  aadhaar: string
  address: string
  age?: number
  voterIdNumber?: string
  role: string
  status: string
  aadhaarCardPath?: string
  voterIdCardPath?: string
  createdAt: string
}

export function AdminPendingUsers() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [mpin, setMpin] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/pending-users", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch pending users")
      }

      const data = await response.json()
      setPendingUsers(data.pendingUsers || [])
    } catch (error) {
      console.error("Fetch pending users error:", error)
      setError("Failed to load pending users")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedUser || !mpin) {
      setError("MPIN is required")
      return
    }

    if (mpin.length !== 4 || !/^\d+$/.test(mpin)) {
      setError("MPIN must be 4 digits")
      return
    }

    try {
      setActionLoading(true)
      setError("")

      const response = await fetch("/api/admin/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: selectedUser._id,
          mpin,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Verification failed")
      }

      setSuccess(`User approved! Unique ID: ${data.user.uniqueId}`)
      setShowApproveDialog(false)
      setMpin("")
      setSelectedUser(null)
      
      // Refresh the list
      await fetchPendingUsers()

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Approval failed")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedUser) return

    try {
      setActionLoading(true)
      setError("")

      const response = await fetch("/api/admin/reject-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: selectedUser._id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Rejection failed")
      }

      setSuccess("User registration rejected")
      setShowRejectDialog(false)
      setSelectedUser(null)
      
      // Refresh the list
      await fetchPendingUsers()

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Rejection failed")
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Registrations
            </CardTitle>
            <CardDescription>Review and approve user registrations</CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {pendingUsers.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {pendingUsers.length > 0 && !success && !error && (
          <Alert className="mb-4 border-blue-500 bg-blue-50">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Review each registration carefully before approving. You'll set the initial MPIN that will be sent to the user.
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && error !== "Failed to load pending users" && (
          <Alert className="mb-4 border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserCheck className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No pending registrations</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Aadhaar</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell className="font-mono text-xs">{user.aadhaar}</TableCell>
                    <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDetailsDialog(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowApproveDialog(true)
                            setError("")
                          }}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowRejectDialog(true)
                            setError("")
                          }}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* User Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Registration Details</DialogTitle>
              <DialogDescription>Review user information before approval</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Full Name</Label>
                    <p className="font-medium">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Phone</Label>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Email</Label>
                    <p className="font-medium">{selectedUser.email || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Aadhaar Number</Label>
                    <p className="font-mono">{selectedUser.aadhaar}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-600">Address</Label>
                    <p className="font-medium">{selectedUser.address}</p>
                  </div>
                  {selectedUser.age && (
                    <div>
                      <Label className="text-sm text-gray-600">Age</Label>
                      <p className="font-medium">{selectedUser.age} years</p>
                    </div>
                  )}
                  {selectedUser.voterIdNumber && (
                    <div>
                      <Label className="text-sm text-gray-600">Voter ID</Label>
                      <p className="font-mono">{selectedUser.voterIdNumber}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <Label className="text-sm text-gray-600 mb-2 block">Uploaded Documents</Label>
                  <div className="space-y-2">
                    {selectedUser.aadhaarCardPath && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Aadhaar Card</p>
                            <p className="text-xs text-blue-600">PDF Document</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            try {
                              // Extract just the filename from full path (handles both / and \)
                              let filename = selectedUser.aadhaarCardPath
                              if (filename?.includes('\\')) {
                                filename = filename.split('\\').pop()
                              } else if (filename?.includes('/')) {
                                filename = filename.split('/').pop()
                              }
                              console.log('Fetching Aadhaar document:', filename)
                              
                              // Get token from localStorage
                              const token = localStorage.getItem('token')
                              
                              // Get the file from backend
                              const response = await fetch(`http://localhost:5000/uploads/${filename}`, {
                                credentials: 'include',
                                headers: token ? {
                                  'Authorization': `Bearer ${token}`
                                } : {}
                              })
                              
                              console.log('Response status:', response.status)
                              
                              if (response.ok) {
                                const blob = await response.blob()
                                const url = window.URL.createObjectURL(blob)
                                window.open(url, '_blank')
                              } else {
                                const errorText = await response.text()
                                console.error('Error response:', errorText)
                                setError(`Failed to load document: ${response.status}`)
                              }
                            } catch (err) {
                              console.error('Exception:', err)
                              setError('Failed to load document')
                            }
                          }}
                          className="border-blue-300 hover:bg-blue-100"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    )}
                    {selectedUser.voterIdCardPath && (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-900">Voter ID Card</p>
                            <p className="text-xs text-green-600">PDF Document</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            try {
                              // Extract just the filename from full path (handles both / and \)
                              let filename = selectedUser.voterIdCardPath
                              if (filename?.includes('\\')) {
                                filename = filename.split('\\').pop()
                              } else if (filename?.includes('/')) {
                                filename = filename.split('/').pop()
                              }
                              console.log('Fetching Voter ID document:', filename)
                              
                              // Get token from localStorage
                              const token = localStorage.getItem('token')
                              
                              // Get the file from backend
                              const response = await fetch(`http://localhost:5000/uploads/${filename}`, {
                                credentials: 'include',
                                headers: token ? {
                                  'Authorization': `Bearer ${token}`
                                } : {}
                              })
                              
                              console.log('Response status:', response.status)
                              
                              if (response.ok) {
                                const blob = await response.blob()
                                const url = window.URL.createObjectURL(blob)
                                window.open(url, '_blank')
                              } else {
                                const errorText = await response.text()
                                console.error('Error response:', errorText)
                                setError(`Failed to load document: ${response.status}`)
                              }
                            } catch (err) {
                              console.error('Exception:', err)
                              setError('Failed to load document')
                            }
                          }}
                          className="border-green-300 hover:bg-green-100"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    )}
                    {!selectedUser.aadhaarCardPath && !selectedUser.voterIdCardPath && (
                      <p className="text-sm text-gray-500 italic">No documents uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approve Dialog */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve User Registration</DialogTitle>
              <DialogDescription>
                Enter the initial MPIN for {selectedUser?.fullName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {error && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="mpin">Initial MPIN (4 digits)</Label>
                <Input
                  id="mpin"
                  type="password"
                  placeholder="1234"
                  value={mpin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                    setMpin(value)
                    setError("")
                  }}
                  maxLength={4}
                  className="font-mono text-center text-lg tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This MPIN will be sent to the user via email along with their Unique ID
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={actionLoading || mpin.length !== 4}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading ? "Approving..." : "Approve & Issue Unique ID"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject User Registration</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject the registration of {selectedUser?.fullName}?
              </DialogDescription>
            </DialogHeader>
            {error && (
              <Alert className="border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
                {actionLoading ? "Rejecting..." : "Reject Registration"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
