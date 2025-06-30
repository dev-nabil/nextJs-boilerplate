// 'use client'

// import InputField from '@/components/custom/input'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { blogFormSchema, BlogFormValues } from '@/schemas'
// import { useAddBlogMutation, useGetSingleBlogQuery, useUpdateBlogMutation } from '@/store/features/blog/blogApi'
// import { zodResolver } from '@hookform/resolvers/zod'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { FormProvider, useForm } from 'react-hook-form'
// import { toast } from 'react-hot-toast'

// export function BlogCreateAndUpdate({ id }: { id?: string }) {
//   const router = useRouter()
//   const { data: singleBlog, isLoading: isLoadingSingleBlog } = useGetSingleBlogQuery(id ?? '', { skip: !id })

//   const [image, setImage] = useState<string | null>(null)

//   const [addBlog, { isLoading: isLoadingAdd }] = useAddBlogMutation()
//   const [updateBlog, { isLoading: isLoadingUpdate }] = useUpdateBlogMutation()

//   const isLoading = isLoadingAdd || isLoadingUpdate

//   const form = useForm<BlogFormValues>({
//     resolver: zodResolver(blogFormSchema),
//     defaultValues: {
//       title: singleBlog?.title || '',
//       image: singleBlog?.image || '',
//       content: singleBlog?.content || ''
//     }
//   })

//   useEffect(() => {
//     form.reset({
//       title: singleBlog?.title || '',
//       image: singleBlog?.image || '',
//       content: singleBlog?.content || ''
//     })
//     setImage(singleBlog?.image || null)
//   }, [singleBlog])
//   console.log({ server: singleBlog?.image, image }, 'singleBlog?.image')
//   const onSubmit = async (values: BlogFormValues) => {
//     try {
//       console.log(values, 'send value')
//       const formData = new FormData()

//       // Add text fields
//       formData.append('title', values.title)
//       if (values.content) formData.append('content', values.content)

//       // Add image files
//       if (values.image && values.image instanceof File) {
//         formData.append('image', values.image)
//       } else if (singleBlog?.image && typeof values.image === 'string') {
//         formData.append('image', values.image)
//       }

//       if (id) {
//         // Update existing banner
//         await updateBlog({ id: id, data: formData })
//           .unwrap()
//           .then(res => {
//             if (res?.id) {
//               toast.success('Blog updated successfully')
//               router.push('/admin/blog')
//             } else {
//               toast.error('Failed to Update blog. Please try again.')
//             }
//           })
//           .catch(err => {
//             toast.error('Failed to Update blog. Please try again.')
//           })
//       } else {
//         // Create new banner
//         await addBlog(formData)
//           .unwrap()
//           .then(res => {
//             if (res?.id) {
//               toast.success('Blog created successfully')
//               router.push('/admin/blog')
//             } else {
//               toast.error('Failed to create blog. Please try again.')
//             }
//           })
//           .catch(err => {
//             toast.error('Failed to create blog. Please try again.')
//           })
//       }
//     } catch (error: any) {
//       toast.error(error?.data?.message || 'Something went wrong')
//     }
//   }

//   // Handle cover image upload
//   const handleCoverUpload = (file: File | null) => {
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImage(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   return (
//     <FormProvider {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <Card>
//           <CardContent className="p-6">
//             <div className="space-y-4">
//               <InputField name="title" label="Title" placeholder="Enter banner title" type="text" required disabled={isLoading} />
//               <div className="">
//                 <InputField
//                   name="content"
//                   label="Description"
//                   placeholder="Enter banner description"
//                   type="rich-text"
//                   textAreaRows={4}
//                   disabled={isLoading}
//                 />
//               </div>

//               <div className="space-y-4">
//                 <InputField
//                   name="image"
//                   label="image Image"
//                   type="file"
//                   accept="image/*"
//                   required={!singleBlog?.image}
//                   disabled={isLoading}
//                   SingleImageUploadFunction={handleCoverUpload}
//                   helperText="Recommended size: 1200x600px (16:9 ratio)"
//                   customDesign={
//                     <div className="flex h-full w-full flex-col items-center justify-center space-y-2 rounded-md border border-gray-300 bg-white p-4 text-center">
//                       <div className="flex items-center justify-center rounded-full bg-gray-100 p-2">
//                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                           <path
//                             d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
//                             stroke="#6B7280"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                       </div>
//                       <div className="text-sm text-gray-600">{image ? 'Change cover image' : 'Upload cover image'}</div>
//                       <div className="text-xs text-gray-500">
//                         Accepted file types: png, jpg, jpeg, webp
//                         <br />
//                         Maximum file size: 2MB
//                       </div>
//                       <div className="text-xs text-gray-400">Required</div>
//                     </div>
//                   }
//                 />
//                 {image && (
//                   <div className="aspect-[16/9] w-full overflow-hidden">
//                     <div className="relative h-full w-full">
//                       <Image
//                         src={image || '/placeholder.svg'}
//                         alt="Cover preview"
//                         fill
//                         className="object-contain"
//                         sizes="(max-width: 768px) 100vw, 50vw"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex justify-end space-x-4">
//           <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isLoading} isLoading={isLoading}>
//             {id ? 'Update Blog' : 'Create Blog'}
//           </Button>
//         </div>
//       </form>
//     </FormProvider>
//   )
// }

'use client'

import type React from 'react'

import InputField from '@/components/custom/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { blogFormSchema, type BlogFormValues } from '@/schemas'
import { useAddBlogMutation, useGetSingleBlogQuery, useUpdateBlogMutation } from '@/store/features/blog/blogApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, Plus, Save, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

export function BlogCreateAndUpdate({ id }: { id?: string }) {
  const router = useRouter()
  const { data: singleBlog, isLoading: isLoadingSingleBlog } = useGetSingleBlogQuery(id ?? '', { skip: !id })

  const [image, setImage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const [addBlog, { isLoading: isLoadingAdd }] = useAddBlogMutation()
  const [updateBlog, { isLoading: isLoadingUpdate }] = useUpdateBlogMutation()

  const isLoading = isLoadingAdd || isLoadingUpdate
  const isEditMode = !!id

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: singleBlog?.title || '',
      image: singleBlog?.image || '',
      content: singleBlog?.content || ''
    }
  })

  useEffect(() => {
    form.reset({
      title: singleBlog?.title || '',
      image: singleBlog?.image || '',
      content: singleBlog?.content || ''
    })
    setImage(singleBlog?.image || null)
  }, [singleBlog])

  const onSubmit = async (values: BlogFormValues) => {
    try {
      const formData = new FormData()

      // Add text fields
      formData.append('title', values.title)
      if (values.content) formData.append('content', values.content)

      // Add image files
      if (values.image && values.image instanceof File) {
        formData.append('image', values.image)
      } else if (singleBlog?.image && typeof values.image === 'string') {
        formData.append('image', values.image)
      }

      if (id) {
        // Update existing blog
        await updateBlog({ id: id, data: formData })
          .unwrap()
          .then(res => {
            if (res?.id) {
              toast.success('Blog updated successfully')
              router.push('/admin/blog')
            } else {
              toast.error('Failed to update blog. Please try again.')
            }
          })
          .catch(err => {
            toast.error('Failed to update blog. Please try again.')
          })
      } else {
        // Create new blog
        await addBlog(formData)
          .unwrap()
          .then(res => {
            if (res?.id) {
              toast.success('Blog created successfully')
              router.push('/admin/blog')
            } else {
              toast.error('Failed to create blog. Please try again.')
            }
          })
          .catch(err => {
            toast.error('Failed to create blog. Please try again.')
          })
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // Handle cover image upload
  const handleCoverUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleCoverUpload(files[0])
    }
  }

  const removeImage = () => {
    setImage(null)
    form.setValue('image', '')
  }

  if (isLoadingSingleBlog) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/3 rounded bg-gray-200"></div>
            <div className="h-64 rounded bg-gray-200"></div>
            <div className="h-32 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
              {isEditMode && (
                <Badge variant="secondary" className="text-xs">
                  Editing
                </Badge>
              )}
            </div>
          </div>
          <p className="ml-12 text-gray-600">
            {isEditMode ? 'Make changes to your blog post and save when ready.' : 'Fill in the details below to create a new blog post.'}
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Main Content Card */}
            <Card className="border-0 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  Blog Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <InputField
                    name="title"
                    label="Blog Title"
                    placeholder="Enter an engaging title for your blog post"
                    type="text"
                    required
                    disabled={isLoading}
                    className="text-lg font-medium"
                  />
                  <p className="text-xs text-gray-500">A compelling title helps readers understand what your post is about</p>
                </div>

                <Separator />

                {/* Content Field */}
                <div className="space-y-2">
                  <InputField
                    name="content"
                    label="Blog Content"
                    placeholder="Write your blog content here..."
                    type="rich-text"
                    textAreaRows={8}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500">Use the rich text editor to format your content with headings, lists, and more</p>
                </div>
              </CardContent>
            </Card>

            {/* Cover Image Card */}
            <Card className="overflow-hidden border-0 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Cover Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!image ? (
                  <div
                    className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                      isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <InputField
                      name="image"
                      label=""
                      type="file"
                      accept="image/*"
                      required={!singleBlog?.image}
                      disabled={isLoading}
                      SingleImageUploadFunction={handleCoverUpload}
                      customDesign={
                        <div className="space-y-4">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900">Upload cover image</h3>
                            <p className="text-sm text-gray-600">Drag and drop your image here, or click to browse</p>
                            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                              <span>PNG, JPG, JPEG, WEBP</span>
                              <span>•</span>
                              <span>Max 2MB</span>
                              <span>•</span>
                              <span>Recommended: 1200×600px</span>
                            </div>
                          </div>
                          <Button type="button" variant="outline" size="sm" className="mt-4">
                            Choose File
                          </Button>
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="group relative">
                      <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border bg-gray-50">
                        <Image
                          src={image || '/placeholder.svg'}
                          alt="Cover preview"
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-black/0 transition-colors group-hover:bg-black/20">
                        <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between rounded-lg border-t bg-white p-6 pt-6 shadow-sm">
              <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isLoading} className="flex items-center gap-2">
                Cancel
              </Button>

              <div className="flex items-center gap-3">
                {isEditMode && (
                  <Button type="button" variant="outline" disabled={isLoading} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                )}

                <Button type="submit" disabled={isLoading} className="flex min-w-[120px] items-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <>
                          <Save className="h-4 w-4" />
                          Update Blog
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Create Blog
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
