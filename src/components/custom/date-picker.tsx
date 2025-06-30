'use client'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  onChange?: (date: Date | undefined) => void
  className?: string
  disabled?: boolean
  disabledDate?: (date: Date) => boolean
  dateFormat?: string
}

export function DatePicker({ date, setDate, onChange, className, disabled = false, disabledDate, dateFormat = 'PPP' }: DatePickerProps) {
  // Handle adjacent month date selection
  const handleAdjacentDate = (selectedDate: Date) => {
    const normalizedDate = normalizeDate(selectedDate)
    setDate(normalizedDate)
    if (onChange) {
      onChange(normalizedDate)
    }
  }

  // Handle date selection with timezone normalization
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setDate(undefined)
      if (onChange) {
        onChange(undefined)
      }
      return
    }

    // Normalize the date to avoid timezone issues
    const normalizedDate = normalizeDate(newDate)
    setDate(normalizedDate)
    if (onChange) {
      onChange(normalizedDate)
    }
  }

  // Function to normalize a date to avoid timezone issues
  const normalizeDate = (date: Date): Date => {
    // Create a new date with just the year, month, and day components
    // This ensures we get exactly the date that was selected regardless of timezone
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground', className)}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          onAdjacent={handleAdjacentDate}
          initialFocus
          disabled={disabledDate}
          defaultMonth={date}
          fromYear={1900}
          toYear={2100}
          fixedWeeks
        />
      </PopoverContent>
    </Popover>
  )
}
