'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounce } from '@/hooks/useDebounce'
import { availableMonths, availableYears, currentMonth, currentYear, formatCurrency } from '@/lib/utils'
import { useGetContractsQuery } from '@/store/features/contract/contractApi'
import { MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import PaginationControl from '../custom/Pagination'
import Loader from '../custom/loader'
import { SearchOption } from './Wallet'

export default function ProjectHistory() {
  const date = new Date()

  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState<{ search: string; month: string; year: string }>({
    search: '',
    month: String(currentMonth),
    year: String(currentYear)
  }) // Query state (global)
  const debouncedSearch = useDebounce(query, 300)

  const {
    data: getContractData,
    isLoading: contractLoading,
    isFetching
  } = useGetContractsQuery({
    where: JSON.stringify({ status: 'ended' }),
    page: currentPage,
    limit: 10,
    month: `${debouncedSearch.year}-${debouncedSearch.month}`,
    search: debouncedSearch.search
  })
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Optionally scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

  return (
    <div className="mx-auto w-full space-y-6 p-1 md:p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
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

      <SearchOption className="w-full" placeholder="Search Title..." setQuery={setQuery} query={query} />

      {contractLoading || isFetching ? (
        <div className="my-2 rounded-md border py-10 shadow">
          <Loader className="h-auto" />
        </div>
      ) : getContractData?.docs?.length > 0 ? (
        <>
          {/* Project Cards */}
          <div className="space-y-4">
            {getContractData?.docs.map((data: any) => {
              const category = data?.project?.category?.name
              const subCategory = data?.project?.subCategories.map((i: any) => i.name)
              const sellerId = data?.seller?.userId
              const rating = data?.project?.reviews?.find((i: any) => {
                return i.toId === sellerId
              })
              return (
                <ProjectCard
                  key={data.id}
                  title={data?.project?.title || ''}
                  rating={rating?.rating ? rating?.rating : 0}
                  date={formatDate(data.createdAt)}
                  location={data?.project?.city || ''}
                  payment={data?.amount || 0.0}
                  tags={[category, ...subCategory]}
                />
              )
            })}
          </div>
          {/* pagination content start */}

          <PaginationControl
            currentPage={getContractData.page}
            totalPages={getContractData.totalPages}
            hasNextPage={getContractData.hasNextPage}
            hasPrevPage={getContractData.hasPrevPage}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-gray-300 py-10">
          <Image src="/images/no-job-post.png" alt="No Data Found" width={300} height={300} className="object-cover" />
          <p className="text-lg font-medium text-gray-400">No Pending Project found</p>
        </div>
      )}
    </div>
  )
}

interface ProjectCardProps {
  title: string
  rating: number
  date: string
  location: string
  payment: string
  tags: string[]
}

function ProjectCard({ title, rating, date, location, payment, tags }: ProjectCardProps) {
  return (
    <div className="mt-0 border-b-2 py-4">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">{title}</h3>

        <div className="grid items-center gap-6 sm:flex">
          <div className="flex">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="text-muted-foreground grid items-center gap-2 sm:flex">
            <span>Event Date: {date}</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.52 16.2951H16.5285H16.52ZM16.52 16.2951C15.9595 16.8509 14.9439 16.7124 14.2316 16.7124C13.3574 16.7124 12.9363 16.8834 12.3124 17.5074C11.7811 18.0388 11.0688 18.9951 10.2285 18.9951C9.38819 18.9951 8.67593 18.0388 8.14463 17.5074C7.52067 16.8834 7.09966 16.7124 6.22537 16.7124C5.51313 16.7124 4.49748 16.8509 3.93706 16.2951C3.37214 15.735 3.51117 14.7151 3.51117 13.9982C3.51117 13.0924 3.31306 12.6759 2.66796 12.0307C1.70834 11.0712 1.22853 10.5913 1.22852 9.99512C1.22852 9.39887 1.70832 8.91908 2.66793 7.95947C3.2438 7.3836 3.51117 6.81297 3.51117 5.99197C3.51117 5.2797 3.37276 4.26404 3.92852 3.70361C4.4887 3.13872 5.50856 3.27775 6.22539 3.27775C7.04636 3.27775 7.617 3.0104 8.19285 2.43455C9.15247 1.47493 9.63227 0.995117 10.2285 0.995117C10.8248 0.995117 11.3046 1.47493 12.2641 2.43455C12.8399 3.01028 13.4105 3.27775 14.2316 3.27775C14.9439 3.27775 15.9596 3.13934 16.5201 3.69512C17.0849 4.2553 16.9458 5.27515 16.9458 5.99197C16.9458 6.89784 17.144 7.31435 17.7891 7.95947C18.7487 8.91908 19.2285 9.39887 19.2285 9.99512C19.2285 10.5913 18.7487 11.0712 17.7891 12.0307C17.1439 12.6759 16.9458 13.0924 16.9458 13.9982C16.9458 14.7151 17.0849 15.735 16.52 16.2951Z"
              fill="#189F60"
            />
            <path
              d="M7.22852 10.7094L9.02852 11.9951L13.2285 7.99512"
              stroke="#FEFEFE"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="font-medium">Total Payment - {formatCurrency(Number(payment))}</span>
        </div>

        <div className="hide-scrollbar flex w-full items-center justify-start gap-2 overflow-x-auto">
          {tags.map(
            tag =>
              tag != undefined && (
                <div key={tag} className="rounded-xl bg-[#F7F7F7] px-2 py-1 text-emerald-500 hover:bg-emerald-100">
                  {tag}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  )
}

function formatDate(isoString: string) {
  const date = new Date(isoString)

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const year = String(date.getUTCFullYear()).slice(-2) // Get last two digits of the year

  return `${day}-${month}-${year}`
}
