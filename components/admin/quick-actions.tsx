import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download, ExternalLink } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="bg-white border-neutral-200 text-black">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full justify-start bg-black text-white hover:bg-neutral-800">
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start bg-transparent">
          <Link href="/admin/newsletter">
            <Download className="mr-2 h-4 w-4" />
            Export Subscribers CSV
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start bg-transparent">
          <a href="https://dashboard.paystack.com" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Payments (Paystack)
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
