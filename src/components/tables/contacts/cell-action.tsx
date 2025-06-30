'use client'

import { checkAccess } from '@/app/(admin)/permission/permission'
import AlertModal from '@/components/custom/alert-modal'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDeleteContactMutation, useUpdateContactMutation } from '@/store/features/contact/contactApi'
import { MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface CellActionProps {
  data: any
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation()
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation()

  const onDelete = async () => {
    try {
      await deleteContact(data.id).unwrap()
      toast.success('Contact deleted successfully')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setOpen(false)
    }
  }

  const onMarkAsResolved = async () => {
    try {
      await updateContact({
        id: data.id,
        data: {
          status: 'resolved'
        }
      }).unwrap()
      toast.success('Contact marked as resolved')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }
  // ============permission===edit=delete===========
  const respondPermission = checkAccess('Contacts', 'respond').status
  const deletePermission = checkAccess('Contacts', 'delete').status
  // ============permission===edit=delete===========

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={isDeleting} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {respondPermission && <DropdownMenuItem onClick={() => router.push(`/admin/contacts/${data.id}`)}>View Details</DropdownMenuItem>}
          {respondPermission && data.status === 'pending' && (
            <DropdownMenuItem onClick={onMarkAsResolved} disabled={isUpdating}>
              Mark as Resolved
            </DropdownMenuItem>
          )}
          {deletePermission && (
            <DropdownMenuItem onClick={() => setOpen(true)} disabled={isDeleting}>
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
