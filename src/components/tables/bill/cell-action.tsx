'use client'

import { checkAccess } from '@/app/(admin)/permission/permission'
import AlertModal from '@/components/custom/alert-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useUpdateBillMutation } from '@/store/features/bill/billApi'
import { DollarSign, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface CellActionProps {
  data: any
  onUpdate?: (id: string, updatedData: { released: boolean }) => Promise<void>
}

export default function CellAction({ data, onUpdate }: CellActionProps) {
  const router = useRouter()
  const [updateBill, { isLoading }] = useUpdateBillMutation()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReleaseEscrow = async () => {
    try {
      setLoading(true)

      // Option 1: Use the passed onUpdate callback if provided

      await updateBill({ id: data?.id, data: { released: true } })

      toast.success('Escrow funds released successfully.')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong while releasing funds.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const formatCurrency = (amount: string | number) => {
    const numAmount = Number(amount)
    return `NPR ${numAmount.toFixed(2)}`
  }
  // ============permission===edit=delete===========
  const releasePermission = checkAccess('Payment (Bill)', 'release').status
  // ============permission===edit=delete===========

  return (
    <>
      {releasePermission && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Escrow Actions</DropdownMenuLabel>

            {!data.released && !data.apprByBuyer ? (
              <div>
                <DropdownMenuItem onClick={() => setOpen(true)} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Force Release Funds
                </DropdownMenuItem>
                {/* <Link href={`/chat/${data.buyerId || ''}`}>
                  <DropdownMenuItem className="text-primary cursor-pointer focus:bg-red-50 focus:text-red-600">
                    <MessageSquareText className="mr-2 h-4 w-4" />
                    Send massage to Buyer
                  </DropdownMenuItem>
                </Link> */}
              </div>
            ) : (
              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="cursor-pointer text-green-600 focus:bg-green-50 focus:text-green-600"
                disabled={data.released}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Release Funds
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleReleaseEscrow}
        loading={loading || isLoading}
        title="Release Escrow Funds"
        description={
          <Card className="border-0 shadow-none">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-lg">Transaction Details</CardTitle>
              <CardDescription>Please review the transaction details before releasing funds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-0">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Transaction ID:</div>
                <div className="font-mono">{data.trxId}</div>

                <div className="font-medium">Project:</div>
                <div className="truncate">{data.milestone?.contract?.project?.title || data.contract?.project?.title || 'N/A'}</div>

                <div className="font-medium">Amount:</div>
                <div className="font-semibold text-green-600">{formatCurrency(data.amount)}</div>

                <div className="font-medium">Buyer:</div>
                <div>{data.buyer?.user?.name || 'N/A'}</div>

                <div className="font-medium">Seller:</div>
                <div>{data.seller?.user?.name || 'N/A'}</div>

                <div className="font-medium">Payment Status:</div>
                <div>
                  <Badge
                    variant="outline"
                    className={
                      data.paymentStatus === 'completed'
                        ? 'border-green-200 bg-green-100 text-green-800'
                        : 'border-yellow-200 bg-yellow-100 text-yellow-800'
                    }
                  >
                    {data.paymentStatus.charAt(0).toUpperCase() + data.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="pt-4">
                <div className="font-medium text-amber-600 dark:text-amber-400">
                  Are you sure you want to release {formatCurrency(data.amount)} to {data.seller?.user?.name || 'the seller'}?
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  This action cannot be undone. The funds will be transferred to the seller's account.
                </p>
              </div>
            </CardContent>
          </Card>
        }
        confirmLabel="Confirm Release"
        cancelLabel="destructive"
      />
    </>
  )
}
