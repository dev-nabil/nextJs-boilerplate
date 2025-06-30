'use client'

import Loader from '@/components/custom/loader'
import BreadCrumb from '@/components/shared/Breadcrumb'
import { useGetAdminByIdQuery, useUpdateAdminAccessLevelsMutation } from '@/store/features/admin/adminApi'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import MarketplacePermissionComponent from './component/marketplace-permission-component'

export default function AdminDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: admin, isLoading } = useGetAdminByIdQuery(id, { skip: !id })
  const [updateAccessLevels, { isLoading: isUpdating }] = useUpdateAdminAccessLevelsMutation()

  const [accessLevels, setAccessLevels] = useState<any[]>([])
  const [newService, setNewService] = useState<string>('')

  // Initialize access levels when data is loaded
  useEffect(() => {
    if (admin?.accessLevels) {
      setAccessLevels(admin.accessLevels)
    }
  }, [admin])

  const handleAddService = () => {
    if (!newService) return

    // Check if service already exists
    if (accessLevels.some(level => level.service === newService)) {
      toast.error('This service is already added')
      return
    }

    setAccessLevels([
      {
        service: newService,
        create: false,
        read: true,
        update: false,
        delete: false
      },
      ...accessLevels
    ])
    setNewService('')
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Admin not found</p>
      </div>
    )
  }

  const breadcrumbItems = [
    { title: 'Admins', link: '/admin/admins' },
    { title: 'Admin Details', link: `/admin/admins/${id}` }
  ]

  return (
    <div className="flex-1 space-y-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      {/* access */}
      <MarketplacePermissionComponent adminInfo={admin} id={id} />
    </div>
  )
}
