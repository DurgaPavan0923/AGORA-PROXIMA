import type React from "react"
import { DashboardGuard } from "@/components/dashboard-redirect-guard"

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardGuard requiredRole="user">{children}</DashboardGuard>
}
