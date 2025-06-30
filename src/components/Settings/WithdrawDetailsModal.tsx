'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, Building2, Calendar, CreditCard, User, UserCheck } from 'lucide-react'

interface WithdrawData {
  id: string
  trxId: string | null
  account: string
  name: string
  branch: string
  bank: string
  released: boolean
  rejected: boolean
  rejectionNote: string | null
  amount: string
  status: string
  visible: boolean
  createdAt: string
  adminId: string | null
  sellerId: string
  seller: {
    id: string
    user: {
      id: string
      name: string
      email: string
      avatar: string | null
    }
  }
  admin: {
    id: string
    user: {
      id: string
      name: string
      avatar: string
    }
  } | null
}

interface WithdrawDetailsModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  withdrawData: WithdrawData | null
}

export default function WithdrawDetailsModal({ open, setOpen, withdrawData }: WithdrawDetailsModalProps) {
  if (!withdrawData) return null

  const getStatusBadge = (status: string, rejected: boolean, released: boolean) => {
    if (status === 'pending') {
      return (
        <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
          <Calendar className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    }
    if (status === 'completed' || released) {
      return (
        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
          <UserCheck className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      )
    }
    if (status === 'failed' || rejected) {
      return (
        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      )
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-3 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Withdrawal Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Amount */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Transaction Overview</CardTitle>
                {getStatusBadge(withdrawData.status, withdrawData.rejected, withdrawData.released)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-muted-foreground text-sm">Withdrawal Amount</p>
                  <p className="text-2xl font-bold">NPR {Number(withdrawData.amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-muted-foreground text-sm">Request Date</p>
                  <p className="font-medium">{formatDate(withdrawData.createdAt)}</p>
                </div>
              </div>

              {withdrawData.trxId && (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-muted-foreground text-sm">Transaction ID</p>
                    <p className="font-mono font-medium">{withdrawData.trxId}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rejection Note - Show prominently if exists */}
          {withdrawData.rejectionNote && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-red-200 bg-white p-4">
                  <p className="font-medium text-red-800">{withdrawData.rejectionNote}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recipient Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Recipient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Full Name</p>
                  <p className="font-medium">{withdrawData.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="font-medium">{withdrawData.seller.user.email}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-muted-foreground text-sm">Seller ID</p>
                <p className="font-mono text-sm">{withdrawData.sellerId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bank Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Bank Name</p>
                  <p className="text-lg font-medium">{withdrawData.bank}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Account Number</p>
                    <p className="font-mono font-medium">{withdrawData.account}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Branch</p>
                    <p className="font-medium">{withdrawData.branch}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Information */}
          {withdrawData.admin && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Processed By
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {withdrawData.admin.user.avatar ? (
                    <img
                      src={withdrawData.admin.user.avatar || '/placeholder.svg'}
                      alt={withdrawData.admin.user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{withdrawData.admin.user.name}</p>
                    <p className="text-muted-foreground text-sm">Administrator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Details */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Withdrawal ID</p>
                  <p className="font-mono">{withdrawData.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Released</p>
                  <p className={withdrawData.released ? 'text-green-600' : 'text-red-600'}>{withdrawData.released ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
