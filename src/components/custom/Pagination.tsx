'use client'

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPageChange: (page: number) => void
}

export default function PaginationControl({ currentPage, totalPages, hasNextPage, hasPrevPage, onPageChange }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max to show
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range around current page
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 4)
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3)
      }

      // Add ellipsis if needed before middle pages
      if (start > 2) {
        pages.push('ellipsis1')
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed after middle pages
      if (end < totalPages - 1) {
        pages.push('ellipsis2')
      }

      // Always show last page if not already included
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'tween',
        stiffness: 400,
        damping: 25,
        duration: 0.3
      }}
    >
      <Pagination className="w-full py-6">
        <PaginationContent className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          <PaginationItem>
            <button
              onClick={() => {
                if (hasPrevPage) onPageChange(currentPage - 1)
              }}
              disabled={!hasPrevPage}
              className={cn(
                'border-input bg-background focus-visible:ring-ring flex h-6 items-center justify-center rounded-md border px-2.5 text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none sm:px-3 lg:h-9',
                !hasPrevPage ? 'cursor-not-allowed opacity-50' : 'hover:border-primary/50 hover:bg-primary hover:text-white'
              )}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Previous</span>
            </button>
          </PaginationItem>

          <div className="mx-1 flex items-center gap-1 sm:mx-2 sm:gap-1.5">
            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <PaginationItem key={index}>
                  <button
                    onClick={() => onPageChange(page)}
                    className={cn(
                      'focus-visible:ring-ring flex h-6 min-w-6 items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none lg:h-9 lg:min-w-8',
                      currentPage === page
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'border-input bg-background hover:bg-accent hover:border-primary/50 border hover:text-white'
                    )}
                    aria-current={currentPage === page ? 'page' : undefined}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                </PaginationItem>
              ) : (
                <PaginationItem key={index} className="flex items-center justify-center">
                  <PaginationEllipsis className="text-muted-foreground flex h-6 min-w-5 items-center justify-center text-sm sm:min-w-7 lg:h-9" />
                </PaginationItem>
              )
            )}
          </div>

          <PaginationItem>
            <button
              onClick={() => {
                if (hasNextPage) onPageChange(currentPage + 1)
              }}
              disabled={!hasNextPage}
              className={cn(
                'border-input bg-background focus-visible:ring-ring flex h-6 items-center justify-center rounded-md border px-2.5 text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none sm:px-3 lg:h-9',
                !hasNextPage ? 'cursor-not-allowed opacity-50' : 'hover:border-primary/50 hover:bg-primary hover:text-white'
              )}
              aria-label="Go to next page"
            >
              <span className="mr-1 hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </motion.div>
  )
}
