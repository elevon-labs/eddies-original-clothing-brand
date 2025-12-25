import type { Metadata } from "next"
import { AdminLayout } from "@/components/admin/admin-layout"
import { NewsletterList } from "@/components/admin/newsletter-list"

export const metadata: Metadata = {
  title: "Newsletter | Eddie Originals Admin",
  description: "Manage newsletter subscribers",
}

export default function AdminNewsletterPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
          <p className="text-muted-foreground mt-2">Export subscribers and manage your email list</p>
        </div>

        <NewsletterList />
      </div>
    </AdminLayout>
  )
}
