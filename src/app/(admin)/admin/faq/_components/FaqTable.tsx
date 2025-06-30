'use client'

import { checkAccess } from '@/app/(admin)/permission/permission'
import { Icons } from '@/components/custom/icons'
import { Heading } from '@/components/shared/Heading'
import DataTable from '@/components/tables/data-table'
import { columns } from '@/components/tables/faq/columns'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGetFaqsQuery } from '@/store/features/faq/faqApi'
import Link from 'next/link'

export default function FaqTable() {
  const { data: getFaqs, isLoading, refetch } = useGetFaqsQuery({})
  // ============permission===create============
  const createPermission = checkAccess('faq', 'create').status
  // ============permission===============

  return (
    <div className="flex-1 space-y-4 rounded-2xl bg-[#F7F7F7] p-4 pt-6 md:p-8">
      <div className="flex items-start justify-between">
        <Heading title={`FAQ`} description="Manage FAQ" />

        {createPermission && (
          <Link href={'/admin/faq/create'} className={cn(buttonVariants({ variant: 'default' }))}>
            <Icons.add className="mr-2 h-4 w-4" /> Add New
          </Link>
        )}
      </div>
      <DataTable
        searchKey="title"
        loading={isLoading}
        showSearch={false}
        // @ts-ignore
        columns={columns}
        totalItems={getFaqs?.length}
        data={getFaqs || []}
        refetch={refetch}
        showPagination={false}
      />
    </div>
  )
}
