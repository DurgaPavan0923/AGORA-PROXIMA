"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AdminIdIssuer } from "./admin-id-issuer"
import { Users, Plus } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  uniqueIdProof: string
  role: string
  createdAt: string
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Alice Voter",
      email: "alice@example.com",
      uniqueIdProof: "AGORA-1732123456-ABC123",
      role: "user",
      createdAt: "2024-11-20",
    },
    {
      id: "2",
      name: "Bob Election",
      email: "bob@example.com",
      uniqueIdProof: "AGORA-1732123457-DEF456-EC",
      role: "election_commission",
      createdAt: "2024-11-15",
    },
  ])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage users and issue ID proofs</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Issue New ID Proof
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Issue New ID Proof</DialogTitle>
                <DialogDescription>Create a unique ID proof for a new user</DialogDescription>
              </DialogHeader>
              <AdminIdIssuer />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>ID Proof</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{user.uniqueIdProof.slice(0, 20)}...</TableCell>
                  <TableCell className="text-sm">{user.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
