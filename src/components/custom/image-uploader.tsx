'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { useRef, useState } from 'react'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  className?: string
  supportedFormats?: string
  buttonText?: string
  dragDropText?: string
  name?: string
  disabled?: boolean
}

export default function ImageUploader({
  onImageSelect,
  className = '',
  supportedFormats = 'Supported formats: JPEG, PNG, GIF',
  buttonText = 'Select Image',
  dragDropText = 'Drag and drop your image here',
  name = 'image',
  disabled = false
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files.length > 0 && files[0].type.startsWith('image/')) {
      onImageSelect(files[0])
    }
  }

  const triggerFileInput = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelect(e.target.files[0])
    }
  }

  return (
    <div
      className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-10 w-10 text-gray-400" />
        <p className="text-sm font-medium">{dragDropText}</p>
        <p className="text-xs text-gray-500">or</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          disabled={disabled}
          onClick={(e: any) => {
            e.stopPropagation()
            triggerFileInput()
          }}
        >
          {buttonText}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          name={name}
          disabled={disabled}
        />
        <p className="mt-2 text-xs text-gray-500">{supportedFormats}</p>
      </div>
    </div>
  )
}
