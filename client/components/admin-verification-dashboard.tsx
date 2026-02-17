"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Hash,
  Eye,
  Loader2,
  Download
} from "lucide-react"
import { AnimatedCard } from "./animated-card"

interface PendingUser {
  _id: string
  name: string
  email: string
  phoneNumber: string
  age: number
  address: string
  aadhaarNumber: string
  voterIdNumber: string
  aadhaarCardUrl: string
  voterIdCardUrl: string
  createdAt: string
  status: "pending" | "verified" | "rejected"
}

interface AdminVerificationDashboardProps {
  pendingUsers: PendingUser[]
  onVerify: (userId: string) => void
  onReject: (userId: string, reason: string) => void
}

export function AdminVerificationDashboard({ 
  pendingUsers, 
  onVerify, 
  onReject 
}: AdminVerificationDashboardProps) {
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<"aadhaar" | "voterId" | null>(null)

  const handleVerify = async () => {
    if (!selectedUser) return
    setIsProcessing(true)
    try {
      await onVerify(selectedUser._id)
      setSelectedUser(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedUser || !rejectReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }
    setIsProcessing(true)
    try {
      await onReject(selectedUser._id, rejectReason)
      setSelectedUser(null)
      setRejectReason("")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pending Users List */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Pending Verifications ({pendingUsers.length})
        </h3>
        
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {pendingUsers.length === 0 ? (
            <Card className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">No pending verifications</p>
            </Card>
          ) : (
            pendingUsers.map((user, index) => (
              <AnimatedCard 
                key={user._id} 
                delay={index * 0.05}
                hover={true}
              >
                <Card
                  className={`p-4 cursor-pointer transition ${
                    selectedUser?._id === user._id
                      ? "ring-2 ring-orange-500 bg-orange-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {user.phoneNumber}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Age: {user.age}
                    </div>
                  </div>
                </Card>
              </AnimatedCard>
            ))
          )}
        </div>
      </div>

      {/* User Details & Actions */}
      <div className="lg:col-span-2">
        {!selectedUser ? (
          <Card className="p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Select a user to review their details</p>
          </Card>
        ) : (
          <motion.div
            key={selectedUser._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* User Information Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                <Badge className="bg-orange-500">Awaiting Verification</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{selectedUser.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Age</p>
                    <p className="font-medium text-gray-900">{selectedUser.age} years</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{selectedUser.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Aadhaar Number</p>
                    <p className="font-medium text-gray-900 font-mono">{selectedUser.aadhaarNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Voter ID Number</p>
                    <p className="font-medium text-gray-900 font-mono">{selectedUser.voterIdNumber}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Documents Card */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Uploaded Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aadhaar Card */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Aadhaar Card</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setViewingDocument("aadhaar")}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(selectedUser.aadhaarCardUrl, "_blank")}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Voter ID Card */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Voter ID Card</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setViewingDocument("voterId")}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(selectedUser.voterIdCardUrl, "_blank")}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* PDF Viewer Modal */}
            {viewingDocument && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setViewingDocument(null)}
              >
                <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">
                      {viewingDocument === "aadhaar" ? "Aadhaar Card" : "Voter ID Card"}
                    </h3>
                    <button
                      onClick={() => setViewingDocument(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <iframe
                      src={viewingDocument === "aadhaar" ? selectedUser.aadhaarCardUrl : selectedUser.voterIdCardUrl}
                      className="w-full h-full"
                      title={viewingDocument === "aadhaar" ? "Aadhaar Card" : "Voter ID Card"}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Verification Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Verification Action</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection (optional if approving)"
                    rows={3}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleVerify}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve & Generate 12-Digit ID
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleReject}
                    disabled={isProcessing}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Application
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Upon approval, a unique 12-digit Voter ID will be automatically generated 
                    and stored on the blockchain. The user will be notified via email and SMS.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
