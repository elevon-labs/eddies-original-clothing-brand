"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ExternalLink, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NewsletterList() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const exportCSV = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/newsletter/export")
      if (!res.ok) throw new Error("Failed to export")
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `eddie-originals-subscribers-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      toast({
        title: "CSV exported",
        description: "Subscriber list has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export CSV",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
            <Button onClick={exportCSV} className="bg-black text-white hover:bg-neutral-800 w-full sm:w-auto" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
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
          {/* Note: In a real app we might want to fetch the count here, or assume the dashboard metrics handle it */}
          <div className="text-4xl font-bold">--</div>
          <p className="text-sm text-muted-foreground mt-2">Check dashboard for live count</p>
        </CardContent>
      </Card>
    </div>
  )
}
