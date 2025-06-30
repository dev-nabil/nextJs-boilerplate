'use client'

import { checkAccess } from '@/app/(admin)/permission/permission'
import AlertModal from '@/components/custom/alert-modal'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDeleteBannerMutation } from '@/store/features/banner/bannerApi'
import type { IBanner } from '@/types'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface CellActionProps {
  data: IBanner
}

export function CellAction({ data }: CellActionProps) {
  const [open, setOpen] = useState(false)
  const [deleteBanner, { isLoading }] = useDeleteBannerMutation()

  const onDelete = async () => {
    try {
      await deleteBanner(data.id).unwrap()
      toast.success('Banner deleted successfully')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ============permission===============
  const bannerEdit = checkAccess('Banners', 'edit').status
  const bannerDelete = checkAccess('Banners', 'delete').status
  // ============permission===============
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
        title="Delete Banner"
        description="Are you sure you want to delete this banner? This action cannot be undone."
      />
      {(bannerEdit || bannerDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {bannerEdit && (
              <Link href={`/admin/banners/${data.id}`}>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              </Link>
            )}
            {bannerDelete && (
              <DropdownMenuItem onClick={() => setOpen(true)} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
