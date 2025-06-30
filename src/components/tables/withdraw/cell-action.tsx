'use client'

import { CheckCircle, DollarSign, MoreHorizontal, X, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { useUpdateWithdrawMutation } from '@/store/features/withdraw/withdrawApi'

import { checkAccess } from '@/app/(admin)/permission/permission'
import AlertModal from '@/components/custom/alert-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'

interface CellActionProps {
  data: any
  onUpdate?: (id: string, updatedData: { released: boolean }) => Promise<void>
}
// ============permission===approve=reject===========
const approvePermission = checkAccess('Payout', 'approve').status
const rejectPermission = checkAccess('Payout', 'reject').status
// ============permission===approve=reject===========

export default function CellAction({ data, onUpdate }: CellActionProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updateWithdraw, { isLoading }] = useUpdateWithdrawMutation()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const hasPermission = approvePermission || rejectPermission
  const isPending = data.status === 'pending'
  const isReleased = data.released
  const isRejected = data.rejected

  const handleReleaseWithdrawal = async () => {
    try {
      setLoading(true)
      await updateWithdraw({ id: data?.id, data: { released: true, status: 'completed' } })
      toast.success('Withdrawal approved and funds released successfully.')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong while releasing funds.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const handleRejectWithdrawal = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection.')
      return
    }

    try {
      setLoading(true)
      await updateWithdraw({
        id: data?.id,
        data: {
          rejected: true,
          status: 'failed',
          rejectionNote: rejectionReason.trim()
        }
      })
      toast.success('Withdrawal request rejected successfully.')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong while rejecting the request.')
    } finally {
      setLoading(false)
      setRejectOpen(false)
      setRejectionReason('')
    }
  }

  const formatCurrency = (amount: string | number) => {
    const num = Number(amount)
    return `NPR ${num.toFixed(2)}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-100 text-green-800'
      case 'pending':
        return 'border-yellow-200 bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'border-red-200 bg-red-100 text-red-800'
      default:
        return 'border-gray-200 bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      {hasPermission && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Withdrawal Actions</DropdownMenuLabel>

            {approvePermission && !isReleased && !isRejected && isPending && (
              <DropdownMenuItem onClick={() => setOpen(true)} className="cursor-pointer text-green-600 focus:bg-green-50 focus:text-black">
                <DollarSign className="mr-2 h-4 w-4" />
                Approve & Release
              </DropdownMenuItem>
            )}

            {rejectPermission && !isReleased && !isRejected && isPending && (
              <DropdownMenuItem
                onClick={() => setRejectOpen(true)}
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-black"
              >
                <X className="mr-2 h-4 w-4" />
                Reject Request
              </DropdownMenuItem>
            )}

            {isReleased && (
              <DropdownMenuItem disabled className="cursor-default">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                <span className="text-green-600">Funds Released</span>
              </DropdownMenuItem>
            )}

            {isRejected && (
              <DropdownMenuItem disabled className="cursor-default">
                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                <span className="text-red-600">Withdrawal Rejected</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleReleaseWithdrawal}
        loading={loading || isLoading}
        title="Approve Withdrawal Request"
        description={
          <Card className="border-0 shadow-none">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-lg">Withdrawal Details</CardTitle>
              <CardDescription>Please review the withdrawal details before approving and releasing funds.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-0 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Withdrawal ID:</span>
                <span className="font-mono">{data.id}</span>

                <span className="font-medium">Account Holder:</span>
                <span>{data.name}</span>

                <span className="font-medium">Account Number:</span>
                <span className="font-mono">{data.account}</span>

                <span className="font-medium">Bank:</span>
                <span>{data.bank}</span>

                <span className="font-medium">Branch:</span>
                <span>{data.branch}</span>

                <span className="font-medium">Amount:</span>
                <span className="font-semibold text-green-600">{formatCurrency(data.amount)}</span>

                <span className="font-medium">Seller:</span>
                <span>{data.seller?.user?.name || 'N/A'}</span>

                <span className="font-medium">Status:</span>
                <span>
                  <Badge variant="outline" className={getStatusBadge(data.status)}>
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                  </Badge>
                </span>

                <span className="font-medium">Created:</span>
                <span>{new Date(data.createdAt).toLocaleDateString()}</span>
              </div>

              {data.rejectionNote && (
                <div className="pt-2">
                  <span className="font-medium text-red-600">Rejection Note:</span>
                  <p className="mt-1 text-sm text-red-600">{data.rejectionNote}</p>
                </div>
              )}

              <div className="pt-4">
                <p className="font-medium text-amber-600 dark:text-amber-400">
                  Are you sure you want to approve and release {formatCurrency(data.amount)} to {data.name}?
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  This action cannot be undone. The funds will be transferred to the specified bank account.
                </p>
              </div>
            </CardContent>
          </Card>
        }
        confirmLabel="Approve & Release"
        cancelLabel="Cancel"
      />

      <AlertModal
        isOpen={rejectOpen}
        onClose={() => {
          setRejectOpen(false)
          setRejectionReason('')
        }}
        onConfirm={handleRejectWithdrawal}
        loading={loading || isLoading}
        title="Reject Withdrawal Request"
        description={
          <Card className="border-0 shadow-none">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-lg">Rejection Details</CardTitle>
              <CardDescription>Please provide a reason for rejecting this withdrawal request.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-0 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Account Holder:</span>
                <span>{data.name}</span>

                <span className="font-medium">Amount:</span>
                <span className="font-semibold text-red-600">{formatCurrency(data.amount)}</span>

                <span className="font-medium">Bank:</span>
                <span>{data.bank}</span>

                <span className="font-medium">Account:</span>
                <span className="font-mono">{data.account}</span>
              </div>

              <div className="space-y-2">
                <label htmlFor="rejection-reason" className="font-medium text-red-600">
                  Reason for Rejection *
                </label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a detailed reason for rejecting this withdrawal request..."
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={loading || isLoading}
                />
                <p className="text-muted-foreground text-xs">This reason will be sent to the seller and cannot be changed later.</p>
              </div>

              <div className="pt-2">
                <p className="font-medium text-red-600">Are you sure you want to reject this withdrawal request?</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  This action cannot be undone. The seller will be notified of the rejection.
                </p>
              </div>
            </CardContent>
          </Card>
        }
        confirmLabel="Reject Request"
        cancelLabel="Cancel"
      />
    </>
  )
}
