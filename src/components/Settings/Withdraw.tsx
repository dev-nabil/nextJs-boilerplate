'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { useGetWithdrawsQuery } from '@/store/features/withdraw/withdrawApi'
import { Eye, Search } from 'lucide-react'
import { useState } from 'react'
import CustomModal from '../custom/CustomModal'
import CustomTable from '../tables/CustomTable'
import WithdrawDetailsModal from './WithdrawDetailsModal'
import WithdrawMoney from './WithdrawMoney'

type WithdrawStatus = 'all' | 'pending' | 'completed' | 'failed'

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

export default function Withdraw() {
  const [openModal, setOpenModal] = useState(false)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawData | null>(null)
  const [statusFilter, setStatusFilter] = useState<WithdrawStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { user } = useAuth()

  const {
    data: withdrawData,
    isLoading,
    isFetching
  } = useGetWithdrawsQuery(
    {
      page: currentPage,
      status: statusFilter !== 'all' ? statusFilter : '',
      search: searchQuery || ''
    },
    {
      refetchOnMountOrArgChange: true
    }
  )

  const handleViewDetails = (withdraw: WithdrawData) => {
    setSelectedWithdraw(withdraw)
    setOpenDetailsModal(true)
  }

  const getStatusBadge = (status: string, rejected: boolean, released: boolean) => {
    if (status === 'pending') {
      return (
        <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
          Pending
        </Badge>
      )
    }
    if (status === 'completed' || released) {
      return (
        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
          Completed
        </Badge>
      )
    }
    if (status === 'failed' || rejected) {
      return (
        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
          Failed
        </Badge>
      )
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const columns = [
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }: any) => <div className="font-medium">{formatDate(row.getValue('createdAt'))}</div>
    },
    {
      accessorKey: 'name',
      header: 'Recipient',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-muted-foreground text-sm">{row.original.seller?.user?.email}</div>
        </div>
      )
    },
    {
      accessorKey: 'bank',
      header: 'Bank Details',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.original.bank}</div>
          <div className="text-muted-foreground text-sm">
            {row.original.account} • {row.original.branch}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }: any) => <div className="font-semibold">NPR {Number(row.getValue('amount')).toLocaleString()}</div>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => getStatusBadge(row.original.status, row.original.rejected, row.original.released)
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(row.original)} className="hover:bg-blue-50">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]
  return (
    <div className="max-w-container_reaper mx-auto space-y-6 p-1">
      {/* Balance Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Available Balance</p>
              <h2 className="text-3xl font-bold">NPR {Number(user?.availableAmount || 0).toLocaleString()}</h2>
            </div>
            {user?.user?.role?.name === 'seller' && (
              <Button disabled={user.availableAmount < 1000} onClick={() => setOpenModal(true)} className="mt-4 sm:mt-0" size="lg">
                Withdraw Payments
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Withdrawal History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            customFilter={
              <div className="flex w-full flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    placeholder="Search by name, bank, account, or amount..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={(value: WithdrawStatus) => setStatusFilter(value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            }
            filter="customFilter"
            data={withdrawData?.docs || []}
            columns={columns}
            isLoading={isFetching || isLoading}
          />

          {/* Pagination */}
          {withdrawData && withdrawData.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Showing {(currentPage - 1) * withdrawData.limit + 1} to {Math.min(currentPage * withdrawData.limit, withdrawData.totalDocs)}{' '}
                of {withdrawData.totalDocs} results
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!withdrawData.hasPrevPage}
                >
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => prev + 1)} disabled={!withdrawData.hasNextPage}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Money Modal */}
      <CustomModal open={openModal} title="Withdraw Money" setOpen={setOpenModal}>
        <WithdrawMoney setOpenModal={setOpenModal} />
      </CustomModal>

      {/* Withdraw Details Modal */}
      <WithdrawDetailsModal open={openDetailsModal} setOpen={setOpenDetailsModal} withdrawData={selectedWithdraw} />
    </div>
  )
}

// Enhanced date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
