import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/features/users/components/users-table"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage your application users and their permissions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all users in your application including their name, email, role, and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  )
}
