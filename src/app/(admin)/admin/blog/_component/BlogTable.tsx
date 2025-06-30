'use client'

import { checkAccess } from '@/app/(admin)/permission/permission'
import { Icons } from '@/components/custom/icons'
import { Heading } from '@/components/shared/Heading'
import { columns } from '@/components/tables/blog/columns'
import DataTable from '@/components/tables/data-table'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGetBlogsQuery } from '@/store/features/blog/blogApi'
import Link from 'next/link'
import { useState } from 'react'

export default function BlogTable() {
  const [currentPage, setCurrentPage] = useState(1)

  const { data: blogData, isLoading } = useGetBlogsQuery({
    page: 1,
    limit: 10
  })

  // ============permission===============
  const createPermission = checkAccess('Blog', 'create').status
  // ============permission===============
  return (
    <div className="flex-1 space-y-4 rounded-2xl bg-[#F7F7F7] p-4 md:p-8 md:pt-0">
      <div className="flex items-start justify-between">
        <Heading title={`Blog`} description="Manage Blog" />

        {createPermission && (
          <Link href={'/admin/blog/create'} className={cn(buttonVariants({ variant: 'default' }))}>
            <Icons.add className="mr-2 h-4 w-4" /> Add New
          </Link>
        )}
      </div>

      <DataTable
        searchKey="title"
        loading={isLoading}
        showSearch={false}
        pageNo={currentPage}
        pageLimit={10}
        // @ts-ignore
        columns={columns}
        totalItems={blogData?.totalDocs}
        data={blogData?.docs || []}
        pageCount={blogData?.totalPages}
      />
    </div>
  )
}
