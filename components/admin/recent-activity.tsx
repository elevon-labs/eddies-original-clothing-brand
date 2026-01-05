"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

type ActivityItem = {
  action: string
  item: string
  date: string
  type: "product" | "inventory" | "newsletter" | "inbox"
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard")
        if (!res.ok) throw new Error("Failed to fetch dashboard data")
        const result = await res.json()
        setActivities(result.recentActivity)
      } catch (error) {
        console.error("Error fetching recent activity:", error)
        toast({
          title: "Error",
          description: "Failed to load recent activity",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (loading) {
    return (
      <Card className="h-full bg-white border-neutral-200 text-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-200" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full bg-white border-neutral-200 text-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest actions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">No recent activity</div>
          ) : (
            activities.map((activity, i) => (
              <div key={i} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.item}</p>
                </div>
                <div className="ml-auto font-medium">
                  <Badge variant="outline" className="text-xs font-normal">
                    {activity.date ? formatDistanceToNow(new Date(activity.date), { addSuffix: true }) : "Just now"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
