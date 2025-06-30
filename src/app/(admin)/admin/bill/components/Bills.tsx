'use client'

import BreadCrumb from '@/components/shared/Breadcrumb'
import { Heading } from '@/components/shared/Heading'
import { Label } from '@/components/ui/label'
import { saveOrGetLimit } from '@/lib/utils'
import { useGetBillsQuery } from '@/store/features/bill/billApi'
import { useSearchParams as useNextSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, XCircleIcon } from 'lucide-react'
import BillTable from './BillTable'

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Breadcrumb items
const breadcrumbItems = [
  { title: 'Payment Management', link: '/admin' },
  { title: 'Payment', link: '/admin/bills' }
]

export default function Bills() {
  const router = useRouter()
  const currentUrlSearchParams = useNextSearchParams()

  // UI States
  const [pageLimit, setPageLimit] = useState(() => saveOrGetLimit({ method: 'GET', key: 'bill' }))
  const [uiSearchTerm, setUiSearchTerm] = useState('')
  const [uiIsAdminReleased, setUiIsAdminReleased] = useState(false)
  const [uiIsBuyerApproved, setUiIsBuyerApproved] = useState(true)
  const [uiPaymentStatus, setUiPaymentStatus] = useState('all')
  const [uiStatusInAdmin, setUiStatusInAdmin] = useState('all')

  const debouncedSearchTerm = useDebounce(uiSearchTerm, 500)

  // Sync UI filters → URL
  useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
    if (uiIsAdminReleased) params.set('released', 'true')
    if (uiIsBuyerApproved) params.set('buyerApproved', uiIsBuyerApproved ? 'true' : 'false')
    if (uiPaymentStatus !== 'all') params.set('paymentStatus', uiPaymentStatus)
    if (uiStatusInAdmin !== 'all') params.set('statusInAdmin', uiStatusInAdmin)

    params.set('page', '1') // Reset page on filter change

    const newQueryString = params.toString()
    if (newQueryString !== currentUrlSearchParams.toString()) {
      router.push(`?${newQueryString}`, { scroll: false })
    }
  }, [debouncedSearchTerm, uiIsAdminReleased, uiIsBuyerApproved, uiPaymentStatus, uiStatusInAdmin, router])

  // Read filters from URL (used for query input)
  const queryPage = Number(currentUrlSearchParams.get('page')) || 1
  const querySearch = currentUrlSearchParams.get('search') || undefined
  const queryAdminReleased =
    currentUrlSearchParams.get('released') === 'true' ? true : currentUrlSearchParams.get('released') === 'false' ? false : undefined
  const queryBuyerApproved =
    currentUrlSearchParams.get('buyerApproved') === 'true'
      ? true
      : currentUrlSearchParams.get('buyerApproved') === 'false'
        ? false
        : undefined
  const queryPaymentStatus =
    currentUrlSearchParams.get('paymentStatus') && currentUrlSearchParams.get('paymentStatus') !== 'all'
      ? currentUrlSearchParams.get('paymentStatus')
      : undefined
  const queryStatusInAdmin =
    currentUrlSearchParams.get('statusInAdmin') && currentUrlSearchParams.get('statusInAdmin') !== 'all'
      ? currentUrlSearchParams.get('statusInAdmin')
      : undefined

  const {
    data: BillsData,
    isLoading,
    isError,
    refetch
  } = useGetBillsQuery(
    {
      page: queryPage,
      limit: pageLimit,
      ...(querySearch && { search: querySearch }),
      ...(queryAdminReleased !== undefined && { released: queryAdminReleased }),
      ...(queryBuyerApproved !== undefined && { apprByBuyer: queryBuyerApproved }),
      ...(queryPaymentStatus && { paymentStatus: queryPaymentStatus }),
      ...(queryStatusInAdmin && { statusInAdmin: queryStatusInAdmin })
    },
    {
      refetchOnMountOrArgChange: true
    }
  )

  // Handle limit updates
  useEffect(() => {
    const limitFromUrl = currentUrlSearchParams.get('limit')
    if (limitFromUrl) {
      saveOrGetLimit({
        method: 'SET',
        key: 'bill',
        limit: Number(limitFromUrl),
        setter: setPageLimit
      })
    }
  }, [currentUrlSearchParams])

  // Active filter count
  const getActiveFilterCount = useCallback(() => {
    let count = 0
    if (debouncedSearchTerm) count++
    if (uiIsAdminReleased) count++
    if (!uiIsBuyerApproved) count++
    if (uiPaymentStatus !== 'all') count++
    if (uiStatusInAdmin !== 'all') count++
    return count
  }, [debouncedSearchTerm, uiIsAdminReleased, uiIsBuyerApproved, uiPaymentStatus, uiStatusInAdmin])

  const activeFilterCount = getActiveFilterCount()

  // Reset all filters
  const resetFilters = () => {
    setUiSearchTerm('')
    setUiIsAdminReleased(false)
    setUiIsBuyerApproved(true)
    setUiPaymentStatus('all')
    setUiStatusInAdmin('all')
  }

  const data = BillsData || { docs: [], totalDocs: 0, totalPages: 0 }
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <Heading title="Payment" description="Manage payments" />

      {/* Filter UI */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full md:w-1/3">
          <Input
            type="search"
            placeholder="Search by Project, Name, Mail"
            value={uiSearchTerm}
            onChange={e => setUiSearchTerm(e.target.value)}
            className="rounded-lg border py-2 pr-4 pl-10"
          />
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Admin Released */}
          <motion.div layout className="flex items-center space-x-2 rounded-md border border-dashed bg-white p-2">
            <Label htmlFor="admin-released-filter" className="text-muted-foreground text-sm font-medium">
              Admin Released
            </Label>
            <Switch id="admin-released-filter" checked={uiIsAdminReleased} onCheckedChange={setUiIsAdminReleased} />
          </motion.div>

          {/* Buyer Approved */}
          <motion.div layout className="flex items-center space-x-2 rounded-md border border-dashed bg-white p-2">
            <Label htmlFor="buyer-approved-filter" className="text-muted-foreground text-sm font-medium">
              Buyer Approved
            </Label>
            <Switch id="buyer-approved-filter" checked={uiIsBuyerApproved} onCheckedChange={setUiIsBuyerApproved} />
          </motion.div>

          {/* Payment Status */}
          <motion.div layout className="rounded-md border border-dashed bg-white p-1">
            <Select value={uiPaymentStatus} onValueChange={setUiPaymentStatus}>
              <SelectTrigger className="text-muted-foreground w-[180px] border-none text-sm focus:ring-0">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Payment Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Status in admin */}
          <motion.div layout className="rounded-md border border-dashed bg-white p-1">
            <Select value={uiStatusInAdmin} onValueChange={setUiStatusInAdmin}>
              <SelectTrigger className="text-muted-foreground w-[180px] border-none text-sm focus:ring-0">
                <SelectValue placeholder="Seller Request" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Admin Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="recieved">Received</SelectItem>
                <SelectItem value="released">Released</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Clear Filters Button */}
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                  <XCircleIcon size={14} className="mr-1" />
                  Clear filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BillTable
        data={data.docs}
        loading={isLoading}
        refetch={refetch}
        totalItems={data.totalDocs}
        pageNo={queryPage}
        pageLimit={pageLimit}
        pageCount={data.totalPages}
      />
    </div>
  )
}
