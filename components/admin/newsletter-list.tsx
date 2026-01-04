"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const subscribers = [
  { email: "john.doe@example.com", date: "2024-01-15" },
  { email: "sarah.smith@example.com", date: "2024-01-14" },
  { email: "michael.jones@example.com", date: "2024-01-13" },
  { email: "emma.wilson@example.com", date: "2024-01-12" },
  { email: "david.brown@example.com", date: "2024-01-11" },
]

export function NewsletterList() {
  const { toast } = useToast()

  const exportCSV = () => {
    // Create CSV content
    const csvContent = [["Email", "Signup Date"], ...subscribers.map((sub) => [sub.email, sub.date])]
      .map((row) => row.join(","))
      .join("\n")

    // Create download
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `eddie-originals-subscribers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()

    toast({
      title: "CSV exported",
      description: "Subscriber list has been downloaded",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-neutral-50 border-neutral-200 text-black">
        <CardHeader>
          <CardTitle>Off-Platform Workflow</CardTitle>
          <CardDescription>How to send newsletter campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Export CSV" below to download your subscriber list</li>
            <li>Log into Mailchimp, Brevo, or your preferred email platform</li>
            <li>Import the CSV to your "Eddie Originals Audience"</li>
            <li>Create and send your professional HTML email campaign</li>
          </ol>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button onClick={exportCSV} className="bg-black text-white hover:bg-neutral-800 w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href="https://mailchimp.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Mailchimp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-neutral-200 text-black">
        <CardHeader>
          <CardTitle>Total Subscribers</CardTitle>
          <CardDescription>Current audience size</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{subscribers.length}</div>
        </CardContent>
      </Card>
    </div>
  )
}
