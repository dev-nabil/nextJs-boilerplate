'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ImagePreviewProps {
  file: File | null
  onRemove: () => void
  className?: string
  currentURl?: string
  cover?: boolean
  previewSize?: 'sm' | 'md' | 'lg'
}

export default function ImagePreview({ file, onRemove, className = '', previewSize = 'md', cover = false, currentURl }: ImagePreviewProps) {
  if (!file) return null

  const imageUrl = URL.createObjectURL(file)

  // Size classes based on the previewSize prop
  const sizeClasses = {
    sm: 'h-32 w-32',
    md: 'h-48 w-48',
    lg: 'h-64 w-full'
  }

  return (
    <div className={`relative ${sizeClasses[previewSize]} ${className}`}>
      <div className="group relative h-full w-full overflow-hidden rounded-md">
        <img
          src={currentURl ? currentURl : imageUrl || '/placeholder.svg'}
          alt="Preview"
          className="object-contain"
          // onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e: any) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
