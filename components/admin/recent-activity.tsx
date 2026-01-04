import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

const activities = [
  {
    action: "Product added",
    item: "Black Bomber Jacket",
    time: "2 hours ago",
    type: "product",
  },
  {
    action: "Stock updated",
    item: "Classic Tee - XL",
    time: "5 hours ago",
    type: "inventory",
  },
  {
    action: "New subscriber",
    item: "john@example.com",
    time: "1 day ago",
    type: "newsletter",
  },
  {
    action: "Message received",
    item: "Order inquiry #1234",
    time: "1 day ago",
    type: "inbox",
  },
]

export function RecentActivity() {
  return (
    <Card className="bg-white border-neutral-200 text-black h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] overflow-y-auto pr-2">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
              <Activity className="h-8 w-8 opacity-20" />
              <p className="text-sm font-medium">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{activity.item}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant="outline" className="mb-1 block w-fit ml-auto">
                      {activity.type}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
