'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onAdjacent?: (date: Date) => void
}

function Calendar({ className, classNames, showOutsideDays = true, onAdjacent, ...props }: CalendarProps) {
  // Create a ref to track the calendar container
  const calendarRef = React.useRef<HTMLDivElement>(null)

  // Handle day click to support adjacent date selection
  const handleDayClick = React.useCallback(
    (day: Date, modifiers: any, e: React.MouseEvent) => {
      // Call the original onDayClick if it exists
      if (props.onDayClick) {
        props.onDayClick(day, modifiers, e)
      }

      // If it's an outside day and onAdjacent is provided, call it
      if (modifiers.outside && onAdjacent) {
        onAdjacent(day)
      }
    },
    [props.onDayClick, onAdjacent]
  )

  // This effect ensures the calendar receives proper focus when in a popover/modal
  React.useEffect(() => {
    // Find all day buttons in the calendar
    const dayButtons = calendarRef.current?.querySelectorAll('button.rdp-day')

    if (dayButtons) {
      // Make all day buttons explicitly focusable and clickable
      dayButtons.forEach(button => {
        button.setAttribute('tabindex', '0')

        // Ensure the button has pointer-events enabled
        if (button instanceof HTMLElement) {
          button.style.pointerEvents = 'auto'
        }
      })
    }

    // Special handling for popover context
    const popoverContent = calendarRef.current?.closest('[role="dialog"]')
    if (popoverContent && popoverContent instanceof HTMLElement) {
      // Ensure the popover doesn't block pointer events
      popoverContent.style.pointerEvents = 'auto'
    }
  }, [props.month]) // Re-run when month changes

  // Stop propagation of pointer events to prevent issues with popover
  const handlePointerEvent = React.useCallback((e: React.PointerEvent) => {
    // Stop propagation but don't prevent default to allow normal button behavior
    e.stopPropagation()
  }, [])

  return (
    <div
      ref={calendarRef}
      className="relative" // Add relative positioning
      style={{
        zIndex: 50,
        isolation: 'isolate' // Create a new stacking context
      }}
      onPointerDown={handlePointerEvent}
      onPointerUp={handlePointerEvent}
      onClick={e => e.stopPropagation()}
    >
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn('p-3', className)}
        classNames={{
          months: 'flex flex-col sm:flex-row gap-2',
          month: 'flex flex-col gap-4',
          caption: 'flex justify-center pt-1 relative items-center w-full',
          caption_label: 'text-sm font-medium',
          nav: 'flex items-center gap-3',
          nav_button: cn(buttonVariants({ variant: 'outline' }), 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100'),
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-x-1',
          head_row: 'flex',
          head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          cell: cn(
            'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
            props.mode === 'range'
              ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
              : '[&:has([aria-selected])]:rounded-md'
          ),
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'size-8 p-0 font-normal aria-selected:opacity-100 hover:bg-primary hover:text-accent-foreground focus:bg-accent focus:text-white pointer-events-auto'
          ),
          day_range_start: 'day-range-start aria-selected:bg-primary aria-selected:text-white',
          day_range_end: 'day-range-end aria-selected:bg-primary aria-selected:text-white',
          day_selected: 'bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white',
          day_today: 'bg-blue-800 text-white',
          day_outside:
            'day-outside text-muted-foreground hover:bg-black/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground', // Improved styling for outside days
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          ...classNames
        }}
        components={{
          IconLeft: ({ className, ...props }) => <ChevronLeft className={cn('size-4', className)} {...props} />,
          IconRight: ({ className, ...props }) => <ChevronRight className={cn('size-4', className)} {...props} />
        }}
        onDayClick={handleDayClick}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
