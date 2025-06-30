// 'use client'

// import InputField from '@/components/custom/input'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { faqFormSchema, TFaqFormValues } from '@/schemas'
// import { useAddFaqMutation, useGetSingleFaqQuery, useUpdateFaqMutation } from '@/store/features/faq/faqApi'

// import { zodResolver } from '@hookform/resolvers/zod'
// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'
// import { FormProvider, useForm } from 'react-hook-form'
// import { toast } from 'react-hot-toast'

// export function CreateAndUpdateBidPointsForm({ id }: { id?: string }) {
//   const router = useRouter()
//   const { data: singleAuction, isLoading: isLoadingSingle } = useGetSingleFaqQuery(id ?? '', { skip: !id })

//   const [addAuction, { isLoading: isLoadingAdd }] = useAddFaqMutation()
//   const [updateAuction, { isLoading: isLoadingUpdate }] = useUpdateFaqMutation()

//   const isLoading = isLoadingAdd || isLoadingUpdate || isLoadingSingle

//   const form = useForm<TFaqFormValues>({
//     resolver: zodResolver(faqFormSchema),
//     defaultValues: {
//       question: '',
//       answer: ''
//     }
//   })

//   useEffect(() => {
//     if (singleAuction) {
//       form.reset({
//         question: singleAuction.question ?? '',
//         answer: singleAuction.answer ?? ''
//       })
//     }
//   }, [singleAuction])

//   const onSubmit = async (values: TFaqFormValues) => {
//     try {
//       if (id) {
//         await updateAuction({ id, data: values }).unwrap()
//         toast.success('Auction updated successfully')
//       } else {
//         await addAuction(values).unwrap()
//         toast.success('Auction created successfully')
//       }
//       router.push('/admin/faq')
//     } catch (err) {
//       toast.error('Something went wrong. Please try again.')
//     }
//   }

//   return (
//     <FormProvider {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <Card>
//           <CardContent className="space-y-4 p-6">
//             <InputField name="question" label="Question" type="text" disabled={isLoading} required />
//             <InputField name="answer" label="Answer" type="text" disabled={isLoading} required />
//           </CardContent>
//         </Card>

//         <div className="flex justify-end space-x-4">
//           <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isLoading} isLoading={isLoading}>
//             {id ? 'Update Bid Package' : 'Create Bid Package'}
//           </Button>
//         </div>
//       </form>
//     </FormProvider>
//   )
// }

'use client'

import InputField from '@/components/custom/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { faqFormSchema, type TFaqFormValues } from '@/schemas'
import { useAddFaqMutation, useGetSingleFaqQuery, useUpdateFaqMutation } from '@/store/features/faq/faqApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save, Plus, HelpCircle, MessageSquare, Eye, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react'

export function CreateAndUpdateFaqForm({ id }: { id?: string }) {
  const router = useRouter()
  const { data: singleFaq, isLoading: isLoadingSingle } = useGetSingleFaqQuery(id ?? '', { skip: !id })

  const [addFaq, { isLoading: isLoadingAdd }] = useAddFaqMutation()
  const [updateFaq, { isLoading: isLoadingUpdate }] = useUpdateFaqMutation()
  const [showPreview, setShowPreview] = useState(false)

  const isLoading = isLoadingAdd || isLoadingUpdate || isLoadingSingle
  const isEditMode = !!id

  const form = useForm<TFaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: '',
      answer: ''
    }
  })

  const watchedValues = form.watch()

  useEffect(() => {
    if (singleFaq) {
      form.reset({
        question: singleFaq.question ?? '',
        answer: singleFaq.answer ?? ''
      })
    }
  }, [singleFaq, form])

  const onSubmit = async (values: TFaqFormValues) => {
    try {
      if (id) {
        await updateFaq({ id, data: values }).unwrap()
        toast.success('FAQ updated successfully! Your changes are now live.')
      } else {
        await addFaq(values).unwrap()
        toast.success("FAQ created successfully! It's now available to help users.")
      }
      router.push('/admin/faq')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  if (isLoadingSingle) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="mx-auto max-w-4xl p-6">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit FAQ' : 'Create New FAQ'}</h1>
            {isEditMode && (
              <Badge variant="secondary" className="text-xs">
                Editing
              </Badge>
            )}
          </div>
        </div>
        <p className="ml-12 text-gray-600">
          {isEditMode
            ? 'Update your FAQ to provide better assistance to users.'
            : 'Create a helpful FAQ entry to address common user questions.'}
        </p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Question Section */}
          <Card className="border-0 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Question Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">FAQ Question</span>
                </div>
                <InputField
                  name="question"
                  label=""
                  placeholder="What question do users frequently ask?"
                  type="text"
                  disabled={isLoading}
                  required
                  className="text-lg font-medium"
                />
                <p className="text-xs text-gray-500">
                  Write a clear, concise question that users commonly ask. Start with question words like "How", "What", "Why", or "When".
                </p>
              </div>

              {/* Question Tips */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-blue-900">Tips for writing good questions:</h4>
                    <ul className="space-y-1 text-xs text-blue-800">
                      <li>• Keep it specific and focused on one topic</li>
                      <li>• Use language your users would actually use</li>
                      <li>• Avoid jargon or technical terms when possible</li>
                      <li>• Make it searchable with relevant keywords</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answer Section */}
          <Card className="border-0 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                Answer Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">FAQ Answer</span>
                </div>
                <InputField
                  name="answer"
                  label=""
                  placeholder="Provide a comprehensive answer that solves the user's problem..."
                  type="rich-text"
                  textAreaRows={6}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-gray-500">
                  Provide a detailed, helpful answer. Use formatting to make it easy to scan and understand.
                </p>
              </div>

              {/* Answer Guidelines */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-green-900">Guidelines for effective answers:</h4>
                    <ul className="space-y-1 text-xs text-green-800">
                      <li>• Start with a direct answer to the question</li>
                      <li>• Provide step-by-step instructions when applicable</li>
                      <li>• Include relevant links or references</li>
                      <li>• Use bullet points or numbered lists for clarity</li>
                      <li>• Keep the tone friendly and helpful</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {(watchedValues.question || watchedValues.answer) && (
            <Card className="border-0 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    FAQ Preview
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
              </CardHeader>
              {showPreview && (
                <CardContent className="pt-0">
                  <div className="rounded-lg border bg-gray-50 p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="mb-3 flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <HelpCircle className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {watchedValues.question || 'Your question will appear here...'}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="prose prose-sm max-w-none text-gray-700">
                            {watchedValues.answer ? (
                              <div dangerouslySetInnerHTML={{ __html: watchedValues.answer }} />
                            ) : (
                              <p className="text-gray-500 italic">Your answer will appear here...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Validation Summary */}
          {form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
            <Card className="border-red-200 bg-red-50 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-red-900">Please fix the following issues:</h4>
                    <ul className="space-y-1 text-sm text-red-800">
                      {Object.entries(form.formState.errors).map(([field, error]) => (
                        <li key={field}>• {error?.message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between rounded-lg border-t bg-white p-6 pt-6 shadow-sm">
            <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isLoading} className="flex items-center gap-2">
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview FAQ
              </Button>

              <Button type="submit" disabled={isLoading} className="flex min-w-[140px] items-center gap-2">
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
                        Update FAQ
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create FAQ
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
  )
}
