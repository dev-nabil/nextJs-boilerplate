'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'

interface CustomSheetProps {
  children: React.ReactNode
  trigger: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export function CustomSheet({ children, trigger, side = 'right', className }: CustomSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Close sheet when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isOpen && !target.closest('[data-sheet-content]') && !target.closest('[data-sheet-trigger]')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  // Close sheet when pressing escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  // Prevent scrolling when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const sideStyles = {
    left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
    right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    top: 'inset-x-0 top-0 border-b',
    bottom: 'inset-x-0 bottom-0 border-t'
  }

  const animationStyles = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full'
  }

  return (
    <div>
      <div onClick={() => setIsOpen(true)} data-sheet-trigger className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="bg-background/80 fixed inset-0 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />

          {/* Sheet content */}
          <div
            data-sheet-content
            className={cn(
              'bg-background fixed z-50 p-6 shadow-lg transition-transform duration-300 ease-in-out',
              sideStyles[side],
              animationStyles[side],
              className
            )}
          >
            {children}
            <button
              onClick={() => setIsOpen(false)}
              className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function CustomSheetTrigger({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}

export function CustomSheetContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CustomSheetHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props}>
      {children}
    </div>
  )
}

export function CustomSheetTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-foreground text-lg font-semibold', className)} {...props}>
      {children}
    </h3>
  )
}

export function CustomSheetDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props}>
      {children}
    </p>
  )
}

export function CustomSheetFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props}>
      {children}
    </div>
  )
}

export function CustomSheetClose({ children, onClick, ...props }: React.HTMLAttributes<HTMLDivElement> & { onClick?: () => void }) {
  return (
    <div className="cursor-pointer" onClick={onClick} {...props}>
      {children}
    </div>
  )
}
