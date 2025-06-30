'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface DeleteCertificateDialogProps {
  isOpen: boolean
  onClose: () => void
  id: string
  route?: string
  title?: string
  deleteMutation: any
  heading: string
  successMassage: string
  errorMassage: string
  onSuccess?: () => void
}

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  id,
  title,
  deleteMutation,
  route,
  heading,
  successMassage,
  errorMassage,
  onSuccess
}: DeleteCertificateDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { push } = useRouter()

  const handleDelete = async () => {
    if (!id) return

    try {
      setIsDeleting(true)
      await deleteMutation(id).unwrap()
      toast.success(successMassage)
      if (route) {
        push(route || '/')
      }
      if (onSuccess) {
        onSuccess()
      } else {
        onClose()
      }
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error(errorMassage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {heading}</AlertDialogTitle>
          <AlertDialogDescription className="max-w-[15rem] break-words lg:max-w-[28rem]">
            Are you sure you want to delete the {heading} {title ? `"${title}"` : ''}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-500 text-white hover:bg-red-600">
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
