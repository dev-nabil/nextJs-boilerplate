'use client'
import { checkAccess } from '@/app/(admin)/permission/permission'
import Loader from '@/components/custom/loader'
import BreadCrumb from '@/components/shared/Breadcrumb'
import { Heading } from '@/components/shared/Heading'
import { columns } from '@/components/tables/admin/columns'
import DataTable from '@/components/tables/data-table'
import { Button } from '@/components/ui/button'
import { saveOrGetLimit } from '@/lib/utils'
import { useGetAllAdminsQuery } from '@/store/features/admin/adminApi'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import CreateAdminModal from './CreateAdminModal'

const breadcrumbItems = [{ title: 'Admins', link: '/admin/admins' }]

export default function AdminTable({ searchParams }: any) {
  const page = Number(searchParams.page) || 1
  const query = searchParams.search || null
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const limit = saveOrGetLimit({
    method: 'GET',
    key: 'admin'
  })
  const [pageLimit, setPageLimit] = useState(limit)

  const {
    data: adminData,
    isLoading,
    refetch
  } = useGetAllAdminsQuery({
    page,
    limit: pageLimit,
    ...(query && { search: query })
  })

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
  }

  useEffect(() => {
    if (searchParams.limit) {
      saveOrGetLimit({
        method: 'SET',
        key: 'admin',
        limit: Number(searchParams.limit),
        setter: setPageLimit
      })
    }
  }, [searchParams.limit])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  // ============permission===============
  const createAccess = checkAccess('Admins', 'create').status
  // ============permission===============
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title="Admins" description="Manage system administrators" />
          {createAccess && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          )}
        </div>

        <DataTable
          columns={columns}
          data={adminData?.docs || []}
          totalItems={adminData?.totalDocs || 0}
          totalPages={adminData?.totalPages || 1}
          limit={pageLimit}
          loading={isLoading}
          refetch={refetch}
          searchKey="email"
          showSearch={false}
        />
      </div>
      <CreateAdminModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={handleCreateSuccess} />
    </>
  )
}
