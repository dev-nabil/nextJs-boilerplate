'use client'

import BreadCrumb from '@/components/shared/Breadcrumb'
import { Heading } from '@/components/shared/Heading'
import { Button } from '@/components/ui/button'
import { saveOrGetLimit } from '@/lib/utils'
import { useGetUsersQuery } from '@/store/features/user/userApi'
import { useEffect, useState } from 'react'
import UserTable from './UserTable'

const breadcrumbItems = [{ title: 'Users', link: '/admin/users' }]

export default function Users({ searchParams }: any) {
  const page = Number(searchParams?.page) || 1
  const query = searchParams?.search || null
  const role = searchParams?.role || ''
  const limit = saveOrGetLimit({
    method: 'GET',
    key: 'users'
  })
  const [pageLimit, setPageLimit] = useState(limit)

  const [verificationFilter, setVerificationFilter] = useState<string>('')

  // Fetch users data with filters
  const {
    data: usersData,
    isLoading,
    isError,
    refetch
  } = useGetUsersQuery(
    {
      page,
      limit: pageLimit,
      ...(query && { email: query }),
      ...(role && { role: role }),
      ...(role === 'seller' && verificationFilter && { where: JSON.stringify({ verified: verificationFilter === 'verified' }) })
    },
    {
      refetchOnMountOrArgChange: true
    }
  )

  useEffect(() => {
    if (searchParams?.limit) {
      saveOrGetLimit({
        method: 'SET',
        key: 'users',
        limit: Number(searchParams.limit),
        setter: setPageLimit
      })
    }
  }, [searchParams?.limit])

  // Handle role filter change

  // Handle verification filter change
  const handleVerificationFilter = (status: string) => {
    setVerificationFilter(status)
  }

  const data = usersData || { docs: [], totalDocs: 0, totalPages: 0 }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading title="Users" description="Manage user accounts" />
      </div>

      {/* Role filter buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Verification status filter buttons (only for sellers) */}
        {role === 'seller' && (
          <div className="ml-auto flex gap-2">
            <Button variant={verificationFilter === '' ? 'default' : 'outline'} onClick={() => handleVerificationFilter('')} size="sm">
              All
            </Button>
            <Button
              variant={verificationFilter === 'verified' ? 'default' : 'outline'}
              onClick={() => handleVerificationFilter('verified')}
              size="sm"
            >
              Verified
            </Button>
            <Button
              variant={verificationFilter == 'pending' ? 'default' : 'outline'}
              onClick={() => handleVerificationFilter('pending')}
              size="sm"
            >
              Pending Verified
            </Button>
            <Button
              variant={verificationFilter === 'non-verified' ? 'default' : 'outline'}
              onClick={() => handleVerificationFilter('non-verified')}
              size="sm"
            >
              Non-Verified
            </Button>
          </div>
        )}
      </div>

      <UserTable
        data={data.docs}
        loading={isLoading}
        refetch={refetch}
        totalItems={data.totalDocs}
        pageNo={page}
        pageLimit={pageLimit}
        pageCount={data.totalPages}
      />
    </div>
  )
}
