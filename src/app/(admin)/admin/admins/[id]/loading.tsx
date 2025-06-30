import { Skeleton } from "@/components/ui/skeleton"
import { Heading } from "@/components/shared/Heading"
import BreadCrumb from "@/components/shared/Breadcrumb"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin" },
    { title: "Admins", link: "/admin/admins" },
    { title: "Admin Details", link: "#" },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading title="Admin Details" description="View and manage admin access levels" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="text-center w-full">
                <Skeleton className="mx-auto h-6 w-32" />
                <Skeleton className="mx-auto mt-2 h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-20" />
              <div className="w-full space-y-2 pt-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-20" />
              </div>
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
