// 'use client'

// import { AppSidebar } from '@/components/app-sidebar'
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
// import { useAuth } from '@/hooks/use-auth'
// import { useRouter } from 'next/navigation'
// import type React from 'react'
// import { useEffect } from 'react'
// import AppHeader from '@/components/app-header'

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const { user, isAuthenticated } = useAuth()
//   const router = useRouter()
//   useEffect(() => {
//     // Check if user is authenticated and has admin role
//     if (!isAuthenticated || (user?.user?.role?.name !== 'admin' && user?.role?.name !== 'admin')) {
//       router.push('/auth/login')
//     }
//   }, [isAuthenticated, user, router])

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <AppHeader />
//         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

"use client";

import AdminSidebar from "@/components/layout/admin/admin-nav";
import { SiteHeader } from "@/components/layout/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import type React from "react";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  // useEffect(() => {
  //   // Check if user is authenticated and has admin role
  //   if (!isAuthenticated || (user?.user?.role?.name !== 'admin' && user?.role?.name !== 'admin')) {
  //     router.push('/auth/login')
  //   }
  // }, [isAuthenticated, user, router])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarProvider className="gap-5">
        <div className="left-sidebar">
          <AdminSidebar variant="inset" />
        </div>
        <SidebarInset
          className="admin_shadow right-sidebar shadow-none"
          style={{ width: "calc(100% - 279px)" }}
        >
          <SiteHeader
            //@ts-ignore
            user={user?.user}
          />
          <div className="mt-6 h-full w-full rounded-md bg-[#F7F7F7]">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
