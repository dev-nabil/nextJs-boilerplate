import { checkAccess } from '@/app/(admin)/permission/permission'
import { Badge } from '@/components/ui/badge'
import { CellAction } from './cell-action'

// ============permission===edit=delete===========
const editPermission = checkAccess('Subscription', 'edit').status
const deletePermission = checkAccess('Subscription', 'delete').status
// ============permission===edit=delete===========
export const columns: any = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: (cell: any) => {
      return <div className="font-medium">{cell?.row.original.title?.trim() || 'Untitled Plan'}</div>
    }
  },
  {
    accessorKey: 'connectsGranted',
    header: 'Bid points',
    cell: (cell: any) => {
      return <div className="font-medium">{cell?.row.original.connectsGranted}</div>
    }
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: (cell: any) => {
      try {
        const currency = cell?.row?.original?.currency || 'USD'
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency
        })
        return formatter.format(cell?.row?.original?.price ?? 0)
      } catch {
        return <span className="text-muted-foreground">Invalid</span>
      }
    }
  },
  {
    accessorKey: 'salePrice',
    header: 'Sale Price',
    cell: (cell: any) => {
      try {
        const currency = cell?.row?.original?.currency || 'NPR'
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency
        })
        return formatter.format(cell?.row?.original?.salePrice ?? 0)
      } catch {
        return <span className="text-muted-foreground">Invalid</span>
      }
    }
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
    cell: (cell: any) => {
      const discount = cell?.row?.original?.discount ?? 0
      const discountType = cell?.row?.original?.discountType

      if (discountType === 'null' || discount === 0) {
        return <span className="text-muted-foreground">No discount</span>
      }

      if (discountType === 'percentage') {
        return <span>{discount}%</span>
      }

      if (discountType === 'flat') {
        try {
          const currency = cell?.row.original.currency || 'USD'
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency
          })
          return formatter.format(discount)
        } catch {
          return <span className="text-muted-foreground">Invalid</span>
        }
      }

      return discount
    }
  },
  {
    accessorKey: 'discountType',
    header: 'Discount Type',
    cell: (cell: any) => {
      const type = cell?.row?.original?.discountType

      switch (type) {
        case 'percentage':
          return <Badge variant="outline">Percentage</Badge>
        case 'flat':
          return <Badge variant="outline">Flat Amount</Badge>
        case 'null':
        default:
          return <span className="text-muted-foreground">None</span>
      }
    }
  },
  {
    accessorKey: 'proBadge',
    header: 'Pro Badge',
    cell: (cell: any) =>
      cell?.row?.original?.proBadge ? (
        <Badge className="bg-primary text-foreground">PRO</Badge>
      ) : (
        <Badge className="bg-red-500 text-white">No</Badge>
      )
  },
  {
    accessorKey: 'serviceLimit',
    header: 'Service Limit',
    cell: (cell: any) => cell?.row?.original?.serviceLimit ?? 'N/A'
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: (cell: any) => {
      const duration = cell?.row?.original?.duration ?? 0
      const durationType = cell?.row?.original?.durationType ?? ''

      const pluralize = (unit: string) => (duration === 1 ? unit : `${unit}s`)

      switch (durationType) {
        case 'daily':
          return `${duration} ${pluralize('day')}`
        case 'weekly':
          return `${duration} ${pluralize('week')}`
        case 'monthly':
          return `${duration} ${pluralize('month')}`
        case 'yearly':
          return `${duration} ${pluralize('year')}`
        case 'offer':
          return `${duration} days (special offer)`
        default:
          return `${duration} ${durationType}`
      }
    }
  },
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
