import type React from "react"
import { DashboardGuard } from "@/components/dashboard-redirect-guard"

export default function ElectionCommissionLayout({ children }: { children: React.ReactNode }) {
  return <DashboardGuard requiredRole="election_commission">{children}</DashboardGuard>
}
