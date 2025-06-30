'use client'

import { checkAccess } from '@/app/(admin)/permission/permission'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { useDeleteCategoryMutation } from '@/store/features/category/categoryApi'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface CellActionProps {
  id: string
}

export default function CellAction({ id }: CellActionProps) {
  const [deleteCategory] = useDeleteCategoryMutation()
  const onDelete = async () => {
    try {
      await deleteCategory(id).unwrap()
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    }
  }

  // ============permission===edit=delete===========
  const editPermission = checkAccess('Category', 'edit').status
  const deletePermission = checkAccess('Category', 'delete').status
  // ============permission===edit=delete===========

  return editPermission || deletePermission ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {editPermission && (
          <Link href={`/admin/categories/update/${id}`}>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </Link>
        )}

        {deletePermission && (
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <small className="text-muted-foreground w-7 text-xs">You do not have permission</small>
  )
}
