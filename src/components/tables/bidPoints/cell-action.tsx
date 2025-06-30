'use client'

import React, { useState } from 'react'

import Link from 'next/link'

import { View } from 'lucide-react'

import { checkAccess } from '@/app/(admin)/permission/permission'
import { adminRoute } from '@/routes/routes'
import { useDeleteBlogMutation } from '@/store/features/blog/blogApi'
import toast from 'react-hot-toast'

export const BlogCellAction = ({ id }: { id: string }) => {
  const [deleteBlog] = useDeleteBlogMutation({})
  const [open, setOpen] = React.useState(false)

  const [isPopoverOpen, setPopoverOpen] = useState<boolean | any>(false)
  const [isDeleteBlogLoading, setIsDeleteBlogLoading] = useState<boolean>(false)
  const handleDelete = async () => {
    setIsDeleteBlogLoading(true)
    try {
      deleteBlog(id).then(() => {
        toast.success('Blog deleted successfully')
        setIsDeleteBlogLoading(false)
      })
    } catch (error) {
      toast.error('Something went wrong')
    }
    setPopoverOpen(false)
  }
  // ============permission===============
  const view_detailsPermission = checkAccess('Boost Profile', 'view_details').status
  // ============permission===============

  return (
    <div className="flex items-center justify-end gap-3">
      {view_detailsPermission && (
        <Link href={adminRoute.bidPointView(id as string)} className="rounded-md border bg-white px-2 py-1">
          <View className="size-4 text-blue-400" />
        </Link>
      )}
    </div>
  )
}
