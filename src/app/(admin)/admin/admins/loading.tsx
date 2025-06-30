import { Skeleton } from "@/components/ui/skeleton"
import { Heading } from "@/components/shared/Heading"
import BreadCrumb from "@/components/shared/Breadcrumb"

export default function Loading() {
  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin" },
    { title: "Admins", link: "/admin/admins" },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <Heading title="Admins" description="Manage admin users and their access levels" />

      <div className="space-y-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="rounded-md border">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    </div>
  )
}
