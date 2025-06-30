import type React from "react"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <span className="font-semibold">Next.js Boilerplate</span>
          </div>
          <div className="flex-1">
            <DashboardNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <DashboardHeader user={user} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
