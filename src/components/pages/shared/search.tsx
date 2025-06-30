'use client'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
interface FilterOption {
  id: string
  label: string
}
export default function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterOption | null>(null)
  const router = useRouter()
  const { user } = useAuth()
  const filterOptions: FilterOption[] = useMemo(
    () =>
      user?.user?.role?.name === 'seller'
        ? [
            { id: 'job', label: 'Job' },
            { id: 'talent', label: 'Talent' }
          ]
        : [
            { id: 'job-post', label: 'Job Post' },
            { id: 'talent', label: 'Talent' }
          ],
    [user?.user?.role?.name]
  )
  // Set initial filter based on userType
  useEffect(() => {
    if (!filter && user?.user?.role?.name) {
      setFilter(filterOptions[0]) // Default to first option
    }
  }, [user?.user?.role?.name, filterOptions, filter])
  const showSearchIcon = searchQuery?.trim().length >= 3
  const handleIconSearch = () => {
    if (!filter) return
    const encoded = encodeURIComponent(searchQuery?.trim())
    if (!encoded) return
    const target =
      filter.id === 'talent'
        ? `/${user?.user?.role?.name}/talent?q=${encoded}`
        : filter.id === 'job-post'
          ? `/buyer/job-post?q=${encoded}`
          : `/seller/find-work?q=${encoded}`
    setSearchQuery('')
    router.push(target)
  }
  return (
    <div className="hidden w-[308px] items-center md:flex">
      <div className="relative flex w-full items-center">
        {/* Search Input */}
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="max-w-52 rounded-l-lg rounded-r-none pr-20"
        />
        {/* Overlay area for select and icon */}
        <div className="absolute top-0 right-0 h-full w-[100px]">
          {/* Search Icon */}
          <button
            onClick={handleIconSearch}
            type="button"
            className={cn(
              'bg-muted absolute inset-0 flex items-center justify-center rounded-r-lg text-white transition-all duration-300 ease-in-out',
              showSearchIcon
                ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none translate-y-1 scale-95 opacity-0'
            )}
          >
            <SearchIcon size={18} />
          </button>
          {/* Filter Dropdown */}
          {filter && (
            <select
              value={filter.id}
              onChange={e => {
                const selected = filterOptions.find(opt => opt.id === e.target.value)
                if (selected) setFilter(selected)
              }}
              className={cn(
                'bg-background absolute inset-0 h-full w-full appearance-none rounded-r-lg border border-l px-3 py-2 text-sm transition-all duration-300 ease-in-out focus:outline-none',
                !showSearchIcon
                  ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none translate-y-1 scale-95 opacity-0'
              )}
            >
              {filterOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  )
}
