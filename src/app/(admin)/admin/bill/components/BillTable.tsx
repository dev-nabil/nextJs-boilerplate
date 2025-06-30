'use client'

import { columns } from '@/components/tables/bill/columns'
import DataTable from '@/components/tables/data-table'
interface UserTableProps {
  data: any[]
  loading?: boolean
  refetch: () => void
  totalItems: number
  pageNo: number
  pageLimit: number
  pageCount: number
}

export default function BillTable({ data, loading = false, refetch, totalItems, pageLimit, pageCount }: UserTableProps) {
  return (
    <DataTable
      showSearch={false}
      columns={columns}
      data={data}
      loading={loading}
      totalItems={totalItems}
      refetch={refetch}
      limit={pageLimit}
      totalPages={pageCount}
    />
  )
}
