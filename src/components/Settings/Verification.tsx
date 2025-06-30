'use client'

import VerificationModal from '@/app/(auth)/varification/Varification'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { profileVerificationSchema } from '@/schemas'
import type { RootState } from '@/store'
import { useUpdateSellerMutation } from '@/store/features/seller/sellerApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle, CreditCard, Info, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import InputField from '../custom/input'
import ImageUploader from './ImageUploader'

export default function Verification() {
  const { user }: any = useSelector((state: RootState) => state?.auth)
  const [updateSeller, { isLoading }] = useUpdateSellerMutation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(profileVerificationSchema),
    defaultValues: {
      nid: '',
      nidFront: '',
      nidBack: ''
    }
  })

  const { watch, control, formState } = form

  useEffect(() => {
    if (user) {
      form.reset({
        nid: user?.nid || '',
        nidFront: user?.nidFront || '',
        nidBack: user?.nidBack || ''
      })
    }
  }, [user])

  const onSubmit = async (data: any) => {
    const toastId = toast.loading('Uploading verification documents...')
    try {
      const formData = new FormData()
      const sendData = {
        nid: data.nid,
        socialMediaLinks: data?.socialMediaLinks?.map((link: any) => link.link)
      }
      formData.append('nidFront', data.nidFront)
      formData.append('nidBack', data.nidBack)
      formData.append('data', JSON.stringify(sendData))

      updateSeller(formData)
        .unwrap()
        .then(() => {
          toast.success('Verification documents uploaded successfully!', { id: toastId })
        })
        .catch((error: any) => {
          const message = error?.data?.message || (error as Error).message
          toast.error(message, { id: toastId })
        })
    } catch (error) {
      toast.error(`Upload failed: ${(error as Error).message}`, { id: toastId })
    }
  }

  const nidFrontFile: any = watch('nidFront')
  const nidBackFile: any = watch('nidBack')
  const nidFrontPreviewUrl = nidFrontFile && nidFrontFile instanceof File ? URL.createObjectURL(nidFrontFile) : nidFrontFile
  const nidBackPreviewUrl = nidBackFile && nidBackFile instanceof File ? URL.createObjectURL(nidBackFile) : nidBackFile

  // Calculate verification progress
  const getVerificationProgress = () => {
    let progress = 0
    if (user?.nid) progress += 10
    if (user?.nidFront) progress += 10
    if (user?.verified) progress += 30
    if (user?.nidBack) progress += 25
    if (user?.user?.phoneVerified) progress += 25
    return progress
  }

  const verificationProgress = getVerificationProgress()
  const isFullyVerified = user?.verified && user?.user?.phoneVerified

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Account Verification</h1>
        <p className="text-gray-600">Complete your verification to unlock all features and build trust with customers.</p>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Verification Progress</CardTitle>
              <CardDescription>{isFullyVerified ? 'Your account is fully verified!' : `${verificationProgress}% complete`}</CardDescription>
            </div>
            {isFullyVerified && <CheckCircle className="h-8 w-8 text-green-500" />}
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={verificationProgress} className="h-2" />
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${user?.nid && user?.nidFront && user?.nidBack ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className={user?.nid && user?.nidFront && user?.nidBack ? 'text-green-700' : 'text-gray-500'}>
                National ID Verification
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${user?.user?.phoneVerified ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className={user?.user?.phoneVerified ? 'text-green-700' : 'text-gray-500'}>Mobile Verification</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {!user?.verified && user?.verificationReason && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
              <div>
                <h3 className="font-medium text-red-800">Verification Issue</h3>
                <p className="mt-1 text-sm text-red-700">{user?.verificationReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* National ID Verification Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">National ID Verification</CardTitle>
                  <CardDescription>Upload clear photos of both sides of your National ID card</CardDescription>
                  {user.verificationStatus === 'complete' && (
                    <div className="text-primary flex items-center gap-2">
                      <p className="text-sm">NID Number: {user?.nid}</p>
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                  {user.verificationStatus === 'pending' && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <p className="text-sm">NID Number: {user?.nid}</p>
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-medium">Pending Verification</span>
                    </div>
                  )}
                  {user.verificationStatus === 'failed' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <p className="text-sm">NID Number: {user?.nid}</p>
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Verification Failed</span>
                    </div>
                  )}
                  {user.verificationStatus === 'not_applied' && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <p className="text-sm">NID Number: Not submitted</p>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="disabled-overlay"></div>
              {/* Info Banner */}
              {!user?.verified && (
                <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
                  <Info className="mt-0.5 h-5 w-5 text-blue-500" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Tips for better verification:</p>
                    <ul className="mt-1 list-inside list-disc space-y-1">
                      <li>Ensure all text is clearly visible and readable</li>
                      <li>Take photos in good lighting conditions</li>
                      <li>Avoid glare and shadows on the ID card</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* NID Number Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  National ID Number <span className="text-red-500">*</span>
                </Label>
                <InputField name="nid" type="number" placeholder="Enter your 10-17 digit National ID number" className="mt-1 w-full" />
              </div>

              {/* Image Upload Section */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Front Side Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Front Side <span className="text-red-500">*</span>
                  </Label>
                  <InputField
                    type="file"
                    name="nidFront"
                    placeholder="Upload front side of NID"
                    inputClass="w-full h-auto bg-white"
                    className="h-auto w-full"
                    customDesign={<ImageUploader text="Upload Front Side" previewUrl={nidFrontPreviewUrl || user?.seller?.nidFront} />}
                  />
                  {formState?.errors?.nidFront && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {String(formState?.errors?.nidFront?.message)}
                    </p>
                  )}
                </div>

                {/* Back Side Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Back Side <span className="text-red-500">*</span>
                  </Label>
                  <InputField
                    type="file"
                    name="nidBack"
                    placeholder="Upload back side of NID"
                    inputClass="h-auto w-full bg-white"
                    className="h-auto w-full"
                    customDesign={<ImageUploader text="Upload Back Side" previewUrl={nidBackPreviewUrl || user?.seller?.nidBack} />}
                  />
                  {formState?.errors?.nidBack?.message && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {String(formState.errors.nidBack.message)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Verification Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Smartphone className="text-primary h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mobile Number Verification</CardTitle>
                  <CardDescription>Verify your mobile number to secure your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user?.mobile || 'No mobile number set'}</p>
                    <p className="text-gray-500">Mobile number</p>
                    {user?.user?.phoneVerified && (
                      <div className="text-primary flex items-center gap-2">
                        <p>{user?.user?.phone}</p>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="hover:bg-primary border-blue-200"
                  >
                    {user?.user?.phoneVerified ? 'Change Number' : 'Verify Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="text-sm text-gray-600">
                  <p>By submitting, you confirm that all information provided is accurate and authentic.</p>
                </div>
                <Button
                  type="submit"
                  className="w-full min-w-[120px] sm:w-auto"
                  disabled={
                    (user.verificationStatus === 'complete' && true) || (user.verificationStatus === 'pending' && true) || isLoading
                  }
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Verification Modal */}
      <VerificationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} user={user?.user} />
    </div>
  )
}
