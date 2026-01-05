"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, Users, Inbox, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type DashboardData = {
  metrics: {
    totalProducts: number
    activeProducts: number
    lowStockProducts: number
    totalSubscribers: number
    unreadMessages: number
  }
}

export function DashboardMetrics() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard")
        if (!res.ok) throw new Error("Failed to fetch dashboard data")
        const result = await res.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard metrics",
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
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-200" />
          </Card>
        ))}
      </div>
    )
  }

  const metrics = [
    {
      title: "Total Products",
      value: data?.metrics.totalProducts.toString() || "0",
      subtitle: `${data?.metrics.activeProducts || 0} Active`,
      icon: Package,
      trend: "Current inventory",
    },
    {
      title: "Low Stock Alerts",
      value: data?.metrics.lowStockProducts.toString() || "0",
      subtitle: "Items < 5 qty",
      icon: AlertTriangle,
      trend: "Requires attention",
      alert: true,
    },
    {
      title: "Newsletter List",
      value: data?.metrics.totalSubscribers.toString() || "0",
      subtitle: "Subscribers",
      icon: Users,
      trend: "Total audience",
    },
    {
      title: "Inbox",
      value: data?.metrics.unreadMessages.toString() || "0",
      subtitle: "Unread Messages",
      icon: Inbox,
      trend: "Needs response",
    },
  ]

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className={cn(
            metric.alert ? "border-yellow-500/50 bg-yellow-50/50 text-black" : "bg-white border-neutral-200 text-black",
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            <metric.icon className={cn("h-5 w-5", metric.alert ? "text-yellow-600" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
            <p className={cn("text-xs mt-2", metric.alert ? "text-yellow-700 font-medium" : "text-muted-foreground")}>
              {metric.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
