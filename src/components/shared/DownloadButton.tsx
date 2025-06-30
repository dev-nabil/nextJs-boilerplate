'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const DownloadButton = ({
  url,
  name,
  children,
  onLoadingChange,
  className
}: {
  url: string
  name: string
  children: React.ReactNode
  onLoadingChange?: (isLoading: boolean) => void
  className?: string
}) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    onLoadingChange?.(loading) // Call parent function when loading changes
  }, [loading, onLoadingChange])

  const handleDownload = async () => {
    setLoading(true)
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${name}${getFileExtension(url)}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      toast.error('Failed to download. Please try again later.')
      console.error('Download failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFileExtension = (url: string) => {
    return '.' + url.split('.').pop()?.split('?')[0]
  }

  return (
    <div onClick={handleDownload} className={`${className} inline-block cursor-pointer`}>
      {children}
    </div>
  )
}

export default DownloadButton

{
  /* <DownloadButton
onLoadingChange={setIsLoading}
url={imageUrl}
name={certificate.title}
className={` ${
  isLoading ? 'cursor-not-allowed opacity-70' : ''
}`}
>
<Download className={`mr-2 h-4 w-4 ${isLoading && 'animate-bounce'}`} />
Download
</DownloadButton> */
}
