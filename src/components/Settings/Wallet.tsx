'use client'

import CustomTable from '@/components/tables/CustomTable'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { useDebounce } from '@/hooks/useDebounce'
import { availableMonths, availableYears, cn, currentMonth, currentYear } from '@/lib/utils'
import { useGetTransactionsQuery } from '@/store/features/transaction/transactionApi'
import { useState } from 'react'
import CustomModal from '../custom/CustomModal'
import { Input } from '../ui/input'
import WithdrawMoney from './WithdrawMoney'

export default function Wallet() {
  const [soon, setSoon] = useState(false)

  const { user } = useAuth()
  const [query, setQuery] = useState<{ search: string; month: string; year: string }>({
    search: '',
    month: String(currentMonth),
    year: String(currentYear)
  }) // Query state (global)
  const debouncedSearch = useDebounce(query, 300)
  const [selectedTab, setSelectedTab] = useState('All')

  const {
    data: transaction,
    isLoading,
    isFetching
  } = useGetTransactionsQuery({
    month: `${debouncedSearch.year}-${debouncedSearch.month}`,
    filter: selectedTab
    // amount: debouncedSearch.search
  })

  // Handle month change
  const handleMonthChange = (value: string) => {
    setQuery({
      ...query,
      month: value
    })
  }

  // Handle year change
  const handleYearChange = (value: string) => {
    setQuery({
      ...query,
      year: value
    })
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value)
  }

  return (
    <div className="max-w-container_reaper mx-auto p-1">
      <div className="flex flex-col justify-between px-4 sm:flex-row sm:items-center sm:px-0">
        <div>
          <p className="text-xs font-bold">Current balance</p>
          <h2 className="text-2xl font-bold">
            <span className="text-xs">NPR</span> {user?.availableAmount || 0}
          </h2>
        </div>
      </div>

      <div className="my-3 flex items-center gap-4">
        <Select value={query.month} onValueChange={handleMonthChange}>
          <SelectTrigger className="border-primary-150 max-w-[120px] border p-5">
            <SelectValue placeholder="January" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Month</SelectLabel>
              {availableMonths(Number(query.year)).map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={query.year} onValueChange={handleYearChange}>
          <SelectTrigger className="border-primary-150 max-w-[120px] border p-5">
            <SelectValue placeholder="2024" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              {availableYears.map(year => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="All" className="mx-auto w-full max-w-7xl" onValueChange={handleTabChange}>
        <TabsList className="w-full justify-around bg-gray-300 sm:w-[538px]">
          <TabsTrigger className="w-full" value="All">
            All
          </TabsTrigger>
          <TabsTrigger className="w-full" value="Debit">
            Debit
          </TabsTrigger>
          <TabsTrigger className="w-full" value="Credit">
            Credit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="All">
          <CustomTable
            // filter="customFilter"
            // customFilter={<SearchOption placeholder="Search Amount..." setQuery={setQuery} query={query} />}
            data={transaction?.docs || []}
            columns={columns}
            isLoading={isFetching || isLoading}
          />
        </TabsContent>

        <TabsContent value="Debit">
          <CustomTable
            // filter="customFilter"
            // customFilter={<SearchOption placeholder="Search Amount..." setQuery={setQuery} query={query} />}
            data={transaction?.docs.filter((t: any) => t.type === 'debit') || []}
            columns={columns}
            isLoading={isFetching || isLoading}
          />
        </TabsContent>

        <TabsContent value="Credit">
          <CustomTable
            // filter="customFilter"
            // customFilter={<SearchOption placeholder="Search Amount..." setQuery={setQuery} query={query} />}
            data={transaction?.docs.filter((t: any) => t.type === 'credit') || []}
            columns={columns}
            isLoading={isFetching || isLoading}
          />
        </TabsContent>
      </Tabs>
      <CustomModal
        open={soon}
        title="Withdraw Money
"
        setOpen={setSoon}
      >
        <WithdrawMoney setOpenModal={setSoon} />
      </CustomModal>
    </div>
  )
}
// Table columns
const columns = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }: any) => <div className="capitalize">{formatDate(row.getValue('createdAt'))}</div>
  },
  {
    accessorKey: 'type',
    header: 'Status',
    cell: ({ row }: any) => <div className="capitalize">{row.getValue('type')}</div>
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }: any) => <div className="capitalize">{row.getValue('amount')}</div>
  }
]

// date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0')

  const formattedDate = `${year}-${month}-${day}`
  return formattedDate
}

interface SearchOptionProps {
  className?: string // optional className for additional styling
  placeholder?: string
  setQuery: (query: { search: string; month: string; year: string }) => void // Function to set query state (parent/global state)
  query: { search: string; month: string; year: string } // Query object containing the search value
}

export const SearchOption = ({ className, placeholder = 'Search', setQuery, query }: SearchOptionProps) => {
  return (
    <Input
      placeholder={placeholder}
      value={query.search} // Use the query.search for the input value
      onChange={event => {
        const value = event.target.value
        setQuery({
          ...query,
          search: value
        })
      }}
      className={cn(`max-w-sm`, className)}
    />
  )
}
