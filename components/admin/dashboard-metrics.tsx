"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, Users, Inbox } from "lucide-react"

const metrics = [
  {
    title: "Total Products",
    value: "12",
    subtitle: "Active",
    icon: Package,
    trend: "+2 this week",
  },
  {
    title: "Low Stock Alerts",
    value: "2",
    subtitle: "Items < 5 qty",
    icon: AlertTriangle,
    trend: "Requires attention",
    alert: true,
  },
  {
    title: "Newsletter List",
    value: "1,205",
    subtitle: "Subscribers",
    icon: Users,
    trend: "+48 this month",
  },
  {
    title: "Inbox",
    value: "3",
    subtitle: "Unread Messages",
    icon: Inbox,
    trend: "2 today",
  },
]

export function DashboardMetrics() {
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
