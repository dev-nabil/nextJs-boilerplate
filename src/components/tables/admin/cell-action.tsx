'use client'

import type React from 'react'

import { checkAccess } from '@/app/(admin)/permission/permission'
import AlertModal from '@/components/custom/alert-modal'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { useUpdateUserMutation } from '@/store/features/user/userApi'
import { Ban, CheckCircle, Eye, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface CellActionProps {
  data: any
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const [updateUser] = useUpdateUserMutation()
  const [loading, setLoading] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)

  const onBlock = async () => {
    try {
      setLoading(true)
      await updateUser({
        id: data.user.id,
        data: { blocked: !data.user.blocked }
      }).unwrap()

      toast.success(`Admin ${data.user.blocked ? 'unblocked' : 'blocked'} successfully`)
      setShowBlockModal(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ============permission===============
  const view_details = checkAccess('Admins', 'view_details').status
  const block = checkAccess('Admins', 'block').status
  // ============permission===============
  return (
    <>
      <AlertModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={onBlock}
        loading={loading}
        title={`${data.user?.blocked ? 'Unblock' : 'Block'} Admin`}
        description={`Are you sure you want to ${data.user?.blocked ? 'unblock' : 'block'} this admin? ${
          !data.user?.blocked ? 'They will no longer be able to access the admin panel.' : ''
        }`}
      />
      {(view_details || block) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {view_details && (
              <DropdownMenuItem onClick={() => router.push(`/admin/admins/${data.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}
            {block && (
              <DropdownMenuItem onClick={() => setShowBlockModal(true)}>
                {data.user?.blocked ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Unblock Admin
                  </>
                ) : (
                  <>
                    <Ban className="mr-2 h-4 w-4" />
                    Block Admin
                  </>
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
