import type { Metadata } from "next"
import { NewsletterList } from "@/components/admin/newsletter-list"
import { db } from "@/db"
import { newsletterSubscribers } from "@/db/schema"
import { count } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Newsletter | Eddie Originals Admin",
  description: "Manage newsletter subscribers",
}

export default async function AdminNewsletterPage() {
  const [subscriberCountData] = await db.select({ value: count() }).from(newsletterSubscribers)
  const subscriberCount = subscriberCountData.value

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
        <p className="text-muted-foreground mt-2">Export subscribers and manage your email list</p>
      </div>

      <NewsletterList subscriberCount={subscriberCount} />
    </div>
  )
}
