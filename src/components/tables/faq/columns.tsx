import { checkAccess } from '@/app/(admin)/permission/permission'
import { CellAction } from './cell-action'
// ============permission===edit=delete===========
const editPermission = checkAccess('faq', 'edit').status
const deletePermission = checkAccess('faq', 'delete').status
// ============permission===edit=delete===========

export const columns: any = [
  {
    accessorKey: 'question',
    header: 'Question',
    cell: (cell: any) => cell?.row?.original?.question ?? <span className="text-muted-foreground">N/A</span>
  },
  // {
  //   accessorKey: 'answer',
  //   header: 'Answer',
  //   cell: (cell: any) => cell?.row?.original?.answer ?? <span className="text-muted-foreground">N/A</span>
  // },
  ...(editPermission || deletePermission
    ? [
        {
          id: 'actions',
          header: () => <div className="text-end">Actions</div>,
          cell: (cell: any) => <CellAction id={cell?.row?.original?.id ?? ''} />
        }
      ]
    : [])
]
