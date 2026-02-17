"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ElectionCreator } from "@/components/election-creator"
import { ElectionCommissionMonitor } from "@/components/election-commission-monitor"
import { PartyBoucherManager } from "@/components/party-boucher-manager"
import { LogOut, Plus, BarChart3, FileText } from "lucide-react"

export default function ElectionCommissionDashboard() {
  const handleLogout = () => {
    window.location.href = "/auth"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Election Commission Dashboard</h1>
            <p className="text-sm text-gray-600">Agora - Election Management</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="bouchers" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Bouchers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6 space-y-6">
            <ElectionCreator />
          </TabsContent>

          <TabsContent value="monitor" className="mt-6">
            <ElectionCommissionMonitor />
          </TabsContent>

          <TabsContent value="bouchers" className="mt-6">
            <PartyBoucherManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
