import { cn, getDateDifference } from '@/lib/utils'
import type { TJobCardProps } from '@/types'
import { BadgeCheck, Briefcase, MapPin, Star } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

export default function JobCard({
  title,
  paymentVerified,
  location,
  rating = 0,
  budget,
  isApplicant,
  details = '',
  category = [],
  createdAt
}: TJobCardProps) {
  return (
    <div className="shadow-opacity-15 h-full w-full cursor-pointer rounded-lg border bg-white p-4 transition-shadow duration-300 hover:shadow-md hover:shadow-[#189f6050]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#A1A1AA]">Posted {getDateDifference(new Date(createdAt), new Date())} ago</p>
        {isApplicant && (
          <div className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium">
            <Briefcase size={12} />
            <span>Applied</span>
          </div>
        )}
      </div>

      <div className="mt-2 mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Rating & Location */}
      <div className="mb-4 flex items-center gap-1 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          {paymentVerified && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <BadgeCheck className="fill-primary" size={20} fill="#22c55e" stroke="white" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Payment verified</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={14}
              fill={index < rating ? 'currentColor' : 'none'}
              className={index < rating ? 'text-[#EFCD18]' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="mx-2">•</span>
        <MapPin size={14} />
        <span>{location}</span>
      </div>

      <div className="">
        {/* Budget */}
        <div className="mb-2 text-base font-medium text-gray-900">
          <span className="font-bold">{budget} NPR</span>
        </div>

        {/* Description */}
        <div>
          {details && (
            <p className="mb-4 text-base break-words text-gray-700">{details.length > 70 ? `${details.slice(0, 70)}...` : details}</p>
          )}
        </div>

        <div className={cn('', !details && 'mt-6')}>
          {/* Tags */}
          {category && (
            <div className="flex flex-wrap gap-2">
              {category
                .flat()
                .filter(Boolean)
                ?.map((item: any, index: number) => {
                  return (
                    <span key={index} className="text-primary rounded-full bg-[#F7F7F7] px-2 py-1 text-xs font-semibold capitalize">
                      {item}
                    </span>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
