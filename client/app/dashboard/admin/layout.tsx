import type React from "react"
import { DashboardGuard } from "@/components/dashboard-redirect-guard"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardGuard requiredRole="admin">{children}</DashboardGuard>
}
