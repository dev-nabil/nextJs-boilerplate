'use client'

import { cn } from '@/lib/utils'
import { useUpdateSellerMutation } from '@/store/features/seller/sellerApi'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function CoverPhoto({
  src,
  coverPhotoPreviewClass,
  ownProfile
}: {
  src?: string
  coverPhotoPreviewClass?: string
  ownProfile?: boolean
}) {
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(src || null)
  const [updateSeller, { isLoading }] = useUpdateSellerMutation()

  useEffect(() => {
    setCoverPhotoPreview(src || null)
  }, [src])

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Create a preview of the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result as string) // Set the preview to state
      }
      reader.readAsDataURL(file)
      handleUploadCoverPhoto(file)
    }
  }

  const handleUploadCoverPhoto = async (file: File) => {
    const toastId = toast.loading('Uploading cover photo...')
    try {
      const formData = new FormData()
      formData.append('cover', file)
      const res = await updateSeller(formData).unwrap()
      setCoverPhotoPreview(res.cover)
      toast.success('Cover photo has been updated successfully', { id: toastId })
      // }
    } catch (error) {
      toast.error(`Upload failed: ${(error as Error).message}`, { id: toastId })
    }
  }

  return (
    <section className="banner relative mx-auto w-full max-w-7xl select-none">
      <div className="relative w-full">
        {/* Desktop aspect ratio (roughly 2.7:1) */}
        <div className="relative hidden sm:block" style={{ paddingTop: '27%' }}>
          <img
            src={coverPhotoPreview || src || '/cover-photo-default.jpg'}
            alt="Cover Photo"
            className={cn('absolute inset-0 h-full w-full object-cover', coverPhotoPreviewClass)}
            sizes="100vw"
          />
        </div>

        {/* Mobile aspect ratio (closer to 1.5:1) */}
        <div className="relative block sm:hidden" style={{ paddingTop: '36.67%' }}>
          <img
            src={coverPhotoPreview || src || '/cover-photo-default.jpg'}
            alt="Cover Photo"
            className={cn('absolute inset-0 h-full w-full object-cover', coverPhotoPreviewClass)}
            sizes="100vw"
          />
        </div>

        {/* Optional overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50"></div>
      </div>

      {ownProfile && (
        <div className="absolute top-1/2 left-1/2 m-0 h-fit w-fit -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded-lg bg-black px-6 py-1 text-white opacity-50 lg:py-2">
          <div className="relative h-full w-full">
            {/* Upload input field */}
            <input
              accept="image/*"
              type="file"
              disabled={isLoading}
              onChange={handleCoverPhotoChange}
              name="cover_photo"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer opacity-0"
            />
            <span className={`w-full text-sm ${isLoading && 'text-muted-foreground'}`}> {isLoading ? 'Uploading' : `Cover photo`}</span>
          </div>
        </div>
      )}
    </section>
  )
}
