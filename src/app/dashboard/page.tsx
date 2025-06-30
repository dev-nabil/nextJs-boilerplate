import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, CreditCard, DollarSign } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "2,350",
      description: "+20.1% from last month",
      icon: Users,
    },
    {
      title: "Active Sessions",
      value: "1,234",
      description: "+15% from last hour",
      icon: Activity,
    },
    {
      title: "Total Revenue",
      value: "$45,231.89",
      description: "+12% from last month",
      icon: DollarSign,
    },
    {
      title: "Subscriptions",
      value: "573",
      description: "+8% from last month",
      icon: CreditCard,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard. Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent activity and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New user registered</p>
                  <p className="text-sm text-muted-foreground">john.doe@example.com joined 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Payment received</p>
                  <p className="text-sm text-muted-foreground">$299.00 from subscription renewal</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">System update completed</p>
                  <p className="text-sm text-muted-foreground">Version 2.1.0 deployed successfully</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="rounded-lg border p-3 text-sm">
              <div className="font-medium">Add New User</div>
              <div className="text-muted-foreground">Create a new user account</div>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <div className="font-medium">Generate Report</div>
              <div className="text-muted-foreground">Create monthly analytics report</div>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <div className="font-medium">System Settings</div>
              <div className="text-muted-foreground">Configure application settings</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
