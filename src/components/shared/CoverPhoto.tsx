'use client'
import { cn } from '@/lib/utils'
import { useUpdateSellerMutation } from '@/store/features/seller/sellerApi'
import Image from 'next/image'
import { useState } from 'react'
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
  const [updateSeller] = useUpdateSellerMutation()
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
      updateSeller(formData)
        .unwrap()
        .then(() => {
          toast.success('Cover photo uploaded successfully!', { id: toastId })
        })
        .catch(error => {
          toast.error(`Upload failed: ${(error as Error).message}`, { id: toastId })
        })
    } catch (error) {
      toast.error(`Upload failed: ${(error as Error).message}`, { id: toastId })
    }
  }

  return (
    <section className="banner max-w-container_reaper relative mx-auto mt-[72px] w-full select-none">
      <Image
        width={1320}
        height={500}
        src={coverPhotoPreview || src || '/cover-photo-default.jpg'}
        alt="banner"
        className={cn(
          `h-40 w-full object-cover md:h-[315px] ${coverPhotoPreview || src ? 'object-cover' : 'object-contain'}`,
          coverPhotoPreviewClass
        )}
      />

      {ownProfile && (
        <div className="absolute top-1/2 left-1/2 m-0 h-fit w-fit -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-black px-6 py-2 text-white opacity-50">
          <div className="relative h-full w-full cursor-pointer">
            {/* Upload input field */}
            <input
              accept="image/*"
              type="file"
              onChange={handleCoverPhotoChange}
              name="cover_photo"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0"
            />
            <span className="w-full cursor-pointer">Cover photo</span>
          </div>
        </div>
      )}
    </section>
  )
}
