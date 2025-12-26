import type { Metadata } from "next"
import { InboxList } from "@/components/admin/inbox-list"

export const metadata: Metadata = {
  title: "Inbox | Eddie Originals Admin",
  description: "View and manage contact inquiries",
}

export default function AdminInboxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Inbox</h1>
        <p className="text-muted-foreground mt-2">Review messages and reply via your email client</p>
      </div>

      <InboxList />
    </div>
  )
}
