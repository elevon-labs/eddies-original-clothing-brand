import type { Metadata } from "next"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardMetrics } from "@/components/admin/dashboard-metrics"
import { RecentActivity } from "@/components/admin/recent-activity"
import { QuickActions } from "@/components/admin/quick-actions"

export const metadata: Metadata = {
  title: "Dashboard | Eddie Originals Admin",
  description: "Admin dashboard overview",
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back to Eddie Originals command center</p>
        </div>

        <DashboardMetrics />

        <div className="grid gap-6 lg:grid-cols-2">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </AdminLayout>
  )
}
