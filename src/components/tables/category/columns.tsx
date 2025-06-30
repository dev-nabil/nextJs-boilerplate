'use client'

import React from 'react'

import { Switch } from '@/components/ui/switch'
// This is your actual import. The mock below is for preview purposes in environments without your RTK store.
import { checkAccess } from '@/app/(admin)/permission/permission'
import { useUpdateCategoryMutation } from '@/store/features/category/categoryApi'
import type { ICategory } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import { ViewSubcategoriesDialog } from './view-subcategories-dialog'

// --- Mock for useUpdateCategoryMutation ---
// This mock is used for previewing in Next.js where the actual RTK store might not be available.
// In your application, the actual `useActualUpdateCategoryMutation` will be used.
const useMockUpdateCategoryMutation = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const mockMutation = async (params: { id: string; data: Partial<ICategory> }) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoading(false)
    // Simulate RTK Query's unwrap behavior
    return { unwrap: async () => Promise.resolve({ ...params.data, id: params.id }) }
  }
  return [mockMutation, { isLoading }] as const
}

// Determine whether to use the actual or mock mutation
// In a real build, you might use environment variables or other checks.
// For this example, we'll assume a global flag or simply use the mock if the actual one isn't fully available in preview.

const FeaturedCategorySwitch = ({ category }: { category: ICategory }) => {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation()
  // console.log(category, 'category') // User's original console.log
  const handleToggle = async (checked: boolean) => {
    try {
      await updateCategory({
        id: category.id,
        data: { featured: checked }
      }).unwrap()
      // Optionally show toast success
    } catch (error) {
      console.error('Error updating category featured status:', error)
      // Optionally show toast error
    }
  }

  return <Switch checked={category.featured} onCheckedChange={handleToggle} disabled={isLoading} aria-label="Toggle featured" />
}

const VisibleCategorySwitch = ({ category }: { category: ICategory }) => {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation()

  const handleToggle = async (checked: boolean) => {
    try {
      await updateCategory({
        id: category.id,
        data: { visible: checked }
      }).unwrap()
    } catch (error) {
      console.error('Error updating category visibility:', error)
    }
  }

  return <Switch checked={!!category.visible} onCheckedChange={handleToggle} disabled={isLoading} aria-label="Toggle visible" />
}

// ============permission===edit=delete===========
const editPermission = checkAccess('Category', 'edit').status
const deletePermission = checkAccess('Category', 'delete').status
// ============permission===edit=delete===========

export const columns: ColumnDef<ICategory>[] = [
  {
    accessorKey: 'name',
    header: 'Category',
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>
  },
  {
    header: 'Subcategories',
    cell: ({ row }) => {
      const category = row.original
      // Ensure subCategories and items exist, default to empty array if not
      // Ensure subCategories is an array of ISubCategory
      const subCategoryItems = Array.isArray(category?.subCategories)
        ? category.subCategories.filter(
            (sc): sc is { id?: string; name: string } => typeof sc === 'object' && sc !== null && typeof (sc as any).name === 'string'
          )
        : []
      const subCategoryCount = subCategoryItems.length

      return (
        <div className="flex items-center space-x-2">
          <span>
            {subCategoryCount} Item{subCategoryCount !== 1 ? 's' : ''}
          </span>
          {subCategoryCount > 0 &&
            subCategoryItems.length > 0 && ( // Only show button if there are items to display
              <ViewSubcategoriesDialog categoryName={category.name} subcategories={subCategoryItems} />
            )}
        </div>
      )
    }
  },
  {
    accessorKey: 'featured',
    header: 'Featured',
    cell: ({ row }) => <FeaturedCategorySwitch category={row.original} />
  },
  {
    accessorKey: 'visible',
    header: 'Visible',
    cell: ({ row }) => <VisibleCategorySwitch category={row.original} />
  },
  ...(editPermission || deletePermission
    ? [
        {
          id: 'actions',
          header: () => <div className="text-end">Actions</div>,
          cell: ({ row }: any) => <CellAction id={row.original.id} />
        }
      ]
    : [])
]
