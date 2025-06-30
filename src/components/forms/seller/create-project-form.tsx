'use client'

import ProjectViewModal from '@/app/(seller)/seller/profile/_components/ProjectViewModal'
import ProjectContentItem from '@/app/(seller)/seller/profile/create-project/components/ProjectContentItem'
import { ContentType } from '@/app/(seller)/seller/profile/create-project/components/ProjectContentSection'
import FileModal from '@/app/(seller)/seller/profile/create-project/components/projectCreateModals/file-modal'
import ImageModal from '@/app/(seller)/seller/profile/create-project/components/projectCreateModals/image-modal'
import TextModal from '@/app/(seller)/seller/profile/create-project/components/projectCreateModals/text-modal'
import VideoModal from '@/app/(seller)/seller/profile/create-project/components/projectCreateModals/video-modal'
import WebLinkModal from '@/app/(seller)/seller/profile/create-project/components/projectCreateModals/web-link-modal'
import ImageUploader from '@/components/custom/image-uploader'
import InputField from '@/components/custom/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { ProjectFormValues, projectSchema } from '@/schemas'
import { useGetCategoriesQuery } from '@/store/features/category/categoryApi'
import { useDeleteFileMutation, useUploadFileMutation } from '@/store/features/FileUpload/uploadApi'
import {
  useCreatePortfolioMutation,
  useGetSinglePortfoliosQuery,
  useUpdatePortfolioMutation
} from '@/store/features/portfolio/portfolioApi'
import { ContentItem, ShareProjectFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, ImageIcon, Link, Type, Video, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function ShareProjectForm({ onSubmit: externalSubmit }: ShareProjectFormProps) {
  const searchParams = useSearchParams()
  const { push, replace } = useRouter()
  const id = searchParams.get('id')
  const { data: projectData } = useGetSinglePortfoliosQuery(id, { skip: !id })
  const [updateProject] = useUpdatePortfolioMutation()
  const [deleteFile] = useDeleteFileMutation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [singleProjectData, setSingleProjectData] = useState<any>({})
  const { user } = useAuth()
  const handleOpen = (data: any) => {
    setIsOpen(true)
    setSingleProjectData(data)
  }
  const handleClose = () => setIsOpen(false)
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null)
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null)
  const [error, setError] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  // State for project contents
  const [projectContents, setProjectContents] = useState<ContentItem[]>([])
  // Modal states
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [textModalOpen, setTextModalOpen] = useState(false)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [fileModalOpen, setFileModalOpen] = useState(false)
  const [deleteImgUrl, setDeleteImgUrl] = useState<string[]>([])
  const { data: category, isLoading } = useGetCategoriesQuery({ where: JSON.stringify({ parentCategoryId: { not: { equals: null } } }) })
  const [createProject] = useCreatePortfolioMutation()
  const [uploadFile, { isLoading: fileUploadLoading }] = useUploadFileMutation()
  const methods = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      categories: []
    }
  })

  const {
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { isSubmitting, errors }
  } = methods

  // Initialize form with project data if available
  useEffect(() => {
    if (projectData) {
      // Reset form with project data
      reset({
        title: projectData.title || '',
        description: projectData.description || '',
        categories:
          projectData?.categories?.map((cat: any) => ({
            value: cat.id,
            label: cat.parentCategory ? `${cat.parentCategory.name} - ${cat.name}` : cat.name
          })) || []
      })

      // Set cover photo URL if available
      if (projectData?.cover) {
        setCoverPhotoUrl(projectData?.cover)
      }

      // Initialize project contents from project data
      const contents: ContentItem[] = []

      // Add images
      if (projectData.images && projectData.images.length > 0) {
        projectData.images.forEach((imageUrl: any, index: number) => {
          contents.push({
            id: `image-${Date.now()}-${index}`,
            type: 'image',
            content: imageUrl,
            preview: imageUrl
          })
        })
      }

      // Add video if available
      if (projectData.video) {
        contents.push({
          id: `video-${Date.now()}`,
          type: 'video',
          content: projectData.video
        })
      }

      // Add link if available
      if (projectData.link) {
        contents.push({
          id: `link-${Date.now()}`,
          type: 'link',
          content: projectData.link
        })
      }

      // Add file if available
      if (projectData.file) {
        contents.push({
          id: `file-${Date.now()}`,
          type: 'file',
          content: projectData.file
        })
      }

      // Add text if available
      if (projectData.text) {
        contents.push({
          id: `text-${Date.now()}`,
          type: 'text',
          content: projectData.text
        })
      }

      setProjectContents(contents)
    }
  }, [projectData, reset])

  const onFormSubmit = async (data: ProjectFormValues) => {
    if (!coverPhoto && !coverPhotoUrl) {
      return toast.error('Cover photo is required')
    }
    try {
      setIsUploading(true)

      // Convert category values
      // @ts-ignore
      data.categories = data.categories.map(category => category.value)

      // Handle cover photo
      if (coverPhoto) {
        const formData = new FormData()
        formData.append('file', coverPhoto)
        const coverRes = await uploadFile(formData).unwrap()
        data.cover = coverRes.url
      }
      if (projectData?.cover && !coverPhoto) {
        data.cover = projectData?.cover
      }

      // Process project contents
      const images: string[] = []
      let video: string | null = null
      let file: string | null = null
      let textContent: any = ''
      let linkContent = ''

      const uploadPromises = projectContents.map(async item => {
        if (item.type === 'image') {
          if (item.content instanceof File) {
            const formData = new FormData()
            formData.append('file', item.content)
            const res = await uploadFile(formData).unwrap()
            images.push(res.url)
          } else if (typeof item.content === 'string') {
            images.push(item.content)
          }
        } else if (item.type === 'video') {
          if (item.content instanceof File) {
            const formData = new FormData()
            formData.append('file', item.content)
            const res = await uploadFile(formData).unwrap()
            video = res.url
          } else if (typeof item.content === 'string') {
            video = item.content
          }
        } else if (item.type === 'file') {
          if (item.content instanceof File) {
            const formData = new FormData()
            formData.append('file', item.content)
            const res = await uploadFile(formData).unwrap()
            file = res.url
          } else if (typeof item.content === 'string') {
            file = item.content
          }
        } else if (item.type === 'text') {
          if (typeof item.content === 'string') {
            textContent = item.content
          } else if (typeof item.content === 'object' && 'content' in item.content) {
            textContent = item.content
          }
        } else if (item.type === 'link') {
          if (typeof item.content === 'string') {
            linkContent = item.content
          }
        }
      })

      // Wait for all uploads to complete
      await Promise.all(uploadPromises)

      // Add uploaded file URLs to the data
      data.images = images
      if (video) data.video = video
      if (file) data.file = file
      if (textContent) data.text = textContent
      if (linkContent) data.link = linkContent

      if (externalSubmit) {
        await externalSubmit(data)
      } else {
        if (projectData) {
          const field = ['categories', 'cover', 'description', 'file', 'images', 'link', 'text', 'title', 'video']
          field.forEach(key => {
            if (!(key in data)) {
              ;(data as any)[key] = null
            }
          })
          const res = await updateProject({ id: projectData.id, data }).unwrap()
          deleteFile({ url: deleteImgUrl })
          setDeleteImgUrl([])
          if (res.id) {
            toast.success('Project has been updated successfully')
            replace(`/seller/profile?tab=Portfolio`)
          }
        } else {
          const res = await createProject(data).unwrap()
          if (res.id) {
            toast.success('Project created successfully')
            push('/seller/profile')
          }
        }
      }
      setIsUploading(false)
    } catch (error: any) {
      if (error?.data?.message) {
        toast.error(error.data.message)
      } else if (error?.data?.errors) {
        error.data.errors.forEach((err: any) => {
          toast.error(err.message)
        })
      } else {
        toast.error('An error occurred while uploading the file. Please try again.')
      }
      setError(error)
      setIsUploading(false)
    }
  }

  const handleCoverPhotoSelect = (file: File) => {
    setCoverPhoto(file)
    setCoverPhotoUrl(null)
  }

  // Content handlers
  const handleAddImage = (file: File) => {
    const newItem: ContentItem = {
      id: `image-${Date.now()}`,
      type: 'image',
      content: file,
      preview: URL.createObjectURL(file)
    }
    setProjectContents([...projectContents, newItem])
  }

  const handleAddVideo = (data: { type: 'link' | 'file'; content: string | File }) => {
    const newItem: ContentItem = {
      id: `video-${Date.now()}`,
      type: 'video',
      content: data.content
    }
    setProjectContents([...projectContents, newItem])
  }

  const handleAddText = (data: { heading: string; content: string; format: 'plain' | 'markdown'; plainTextContent: string }) => {
    const newItem: ContentItem = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: data
    }
    setProjectContents([...projectContents, newItem])
  }

  const handleAddLink = (url: string) => {
    const newItem: ContentItem = {
      id: `link-${Date.now()}`,
      type: 'link',
      content: url
    }
    setProjectContents([...projectContents, newItem])
  }

  const handleAddFile = (file: File) => {
    const newItem: ContentItem = {
      id: `file-${Date.now()}`,
      type: 'file',
      content: file
    }
    setProjectContents([...projectContents, newItem])
  }

  const handleRemoveContent = (file: { id: string; content: any; preview: string }) => {
    if (!file?.content?.size && typeof file.content === 'string' && !file.content.includes('youtube')) {
      setDeleteImgUrl([...deleteImgUrl, file.content])
    }

    setProjectContents(projectContents?.filter(item => item.id !== file?.id))
  }

  // Check if a content type already exists
  const hasContentType = (type: ContentType): boolean => {
    if (type === 'image') return false // Images can be added multiple times
    return projectContents.some(item => item.type === type)
  }
  const imageUrl = coverPhoto ? URL.createObjectURL(coverPhoto) : null

  // Size classes based on the previewSize prop
  const sizeClasses = {
    sm: 'h-32 w-32',
    md: 'h-48 w-48',
    lg: 'h-64 w-full'
  }

  const categoryOptions =
    category?.map((cat: any) => ({
      value: cat.id,
      label: cat.parentCategory ? `${cat.parentCategory.name} - ${cat.name}` : cat.name
    })) || []

  const mediaData = {
    imageUrl,
    coverPhotoUrl,
    projectContents
  }

  const handleRemove = (url?: any) => {
    if (url) {
      setDeleteImgUrl([...deleteImgUrl, url])
    }
    setCoverPhoto(null)
    setCoverPhotoUrl(null)
  }
  return (
    <div className="mt-10 flex items-center justify-center bg-white/80 p-4 py-10 shadow-md backdrop-blur-sm md:rounded-lg md:p-8 lg:p-10">
      <div className="relative w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{projectData ? 'Edit Project' : 'Share a New Project'}</h2>
        </div>

        <p className="mb-6 text-sm text-gray-500">All Fields are required otherwise indicated. Start building your project:</p>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium">
                  Project Title
                </label>
                <InputField
                  name="title"
                  type="text"
                  placeholder="Enter a Brief but"
                  className="w-full"
                  required
                  errorMessage={errors.title?.message}
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <InputField
                  name="description"
                  textAreaRows={6}
                  type="textarea"
                  placeholder="Type here..."
                  className="min-h-[120px] w-full"
                />
              </div>

              <div>
                <label htmlFor="skills" className="mb-2 block text-sm font-medium">
                  Skills and Deliverable
                </label>
                <div className="relative">
                  <InputField
                    name="categories"
                    className=""
                    type="react-select-multi"
                    placeholder="Select Skills"
                    options={categoryOptions}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Project Cover Photo</label>
                <div className="rounded-md border border-gray-200">
                  {coverPhotoUrl || coverPhoto ? (
                    <div className="flex flex-col items-center">
                      <div className={`relative ${sizeClasses['lg']} `}>
                        <div className="group relative h-full w-full overflow-hidden rounded-md">
                          <img
                            src={coverPhotoUrl ? coverPhotoUrl : imageUrl || '/placeholder.svg'}
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
                                handleRemove(coverPhotoUrl && coverPhotoUrl)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-sm">{coverPhoto?.name}</p>
                    </div>
                  ) : coverPhotoUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="relative h-64 w-64 overflow-hidden rounded-md">
                        <img src={coverPhotoUrl || '/placeholder.svg'} alt="Cover Photo" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                          <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={() => setCoverPhotoUrl(null)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">Current cover photo</p>
                    </div>
                  ) : (
                    <ImageUploader
                      onImageSelect={handleCoverPhotoSelect}
                      name="cover_photo"
                      dragDropText="Drag and drop your cover photo here"
                      disabled={isUploading}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Project contents</label>
                <div className="rounded-md border border-gray-200 p-4">
                  {projectContents.length > 0 ? (
                    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {projectContents.map(item => (
                        <ProjectContentItem key={item.id} item={item} onRemove={handleRemoveContent} />
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap justify-center gap-4 py-4">
                    <button type="button" className="rounded-full bg-gray-50 p-2 hover:bg-gray-100" onClick={() => setImageModalOpen(true)}>
                      <ImageIcon className="h-5 w-5 text-teal-600" />
                    </button>
                    <button
                      type="button"
                      className={`rounded-full p-2 ${
                        hasContentType('video') ? 'cursor-not-allowed bg-gray-100 opacity-50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => !hasContentType('video') && setVideoModalOpen(true)}
                      disabled={hasContentType('video')}
                      title={hasContentType('video') ? 'Only one video can be added' : 'Add video'}
                    >
                      <Video className="h-5 w-5 text-teal-600" />
                    </button>
                    <button
                      type="button"
                      className={`rounded-full p-2 ${
                        hasContentType('text') ? 'cursor-not-allowed bg-gray-100 opacity-50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => !hasContentType('text') && setTextModalOpen(true)}
                      disabled={hasContentType('text')}
                      title={hasContentType('text') ? 'Only one text block can be added' : 'Add text'}
                    >
                      <Type className="h-5 w-5 text-teal-600" />
                    </button>
                    <button
                      type="button"
                      className={`rounded-full p-2 ${
                        hasContentType('link') ? 'cursor-not-allowed bg-gray-100 opacity-50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => !hasContentType('link') && setLinkModalOpen(true)}
                      disabled={hasContentType('link')}
                      title={hasContentType('link') ? 'Only one link can be added' : 'Add link'}
                    >
                      <Link className="h-5 w-5 text-teal-600" />
                    </button>
                    <button
                      type="button"
                      className={`rounded-full p-2 ${
                        hasContentType('file') ? 'cursor-not-allowed bg-gray-100 opacity-50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => !hasContentType('file') && setFileModalOpen(true)}
                      disabled={hasContentType('file')}
                      title={hasContentType('file') ? 'Only one file can be added' : 'Add file'}
                    >
                      <FileText className="h-5 w-5 text-teal-600" />
                    </button>
                  </div>

                  {projectContents.length === 0 && <p className="text-center text-sm text-gray-500">Add Content</p>}
                  {projectContents.length > 0 && projectContents.some(item => item.type !== 'image') && (
                    <p className="mt-2 text-center text-xs text-gray-500">Note: Only images can be added multiple times</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3 md:col-span-2">
              <Button onClick={() => push('/seller/profile')} type="button" variant="outline">
                Cancel
              </Button>
              <Button onClick={() => handleOpen(getValues())} type="button" variant="outline" className="border-teal-600 text-teal-600">
                Preview
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting || isUploading}>
                {isSubmitting || isUploading ? 'Publishing...' : projectData ? 'Update' : 'Publish'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Modals */}

      <ImageModal isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} onAdd={handleAddImage} />

      <VideoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} onAdd={handleAddVideo} />

      <TextModal isOpen={textModalOpen} onClose={() => setTextModalOpen(false)} onAdd={handleAddText} />

      <WebLinkModal isOpen={linkModalOpen} onClose={() => setLinkModalOpen(false)} onAdd={handleAddLink} />

      <FileModal isOpen={fileModalOpen} onClose={() => setFileModalOpen(false)} onAdd={handleAddFile} />
      <ProjectViewModal isOpen={isOpen} onClose={handleClose} singleProjectData={singleProjectData} user={user} mediaData={mediaData} />
    </div>
  )
}
