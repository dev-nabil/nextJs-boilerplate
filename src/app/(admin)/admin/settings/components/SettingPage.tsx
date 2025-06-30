'use client'

import { checkDefaultValue, ServiceProps, settingsEditPermission, settingsViewPermission } from '@/app/(admin)/permission/permission'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUploadFileMutation } from '@/store/features/FileUpload/uploadApi'
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/store/features/settings/settingsApi'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AppSettings from './app-settings'
import Bids from './bids'
import CompanyAddress from './company-address'
import GeneralSettings from './general-settings'
import LegalDocuments from './legal-documents'
import LogoSettings from './logo-settings'
import PlatformFees from './platform-fees'
import SocialLinks from './social-links'
import TopSellerConditions from './top-seller-conditions'

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState('')
  const [appLogo, setAppLogo] = useState<File | null>(null)
  const { data: settingsData, isLoading, error } = useGetSettingsQuery({})
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation()
  const [uploadImage] = useUploadFileMutation()

  const form = useForm({
    defaultValues: {
      appTitle: '',
      appTagline: '',
      appDescription: '',
      appEmail: '',
      supportMail: '',
      appPhone: '',
      appAddress: '',
      instagramUrl: '',
      linkedinUrl: '',
      facebookUrl: '',
      twitterUrl: '',
      appInReview: false,
      iosDownloadUrl: '',
      androidDownloadUrl: '',
      termsAndConditions: '',
      privacyPolicy: '',
      aboutUs: '',
      refundPolicy: '',
      termsAndConditionsUrl: '',
      privacyPolicyUrl: '',
      aboutUsUrl: '',
      refundPolicyUrl: '',
      androidFirebaseTopic: '',
      iosFirebaseTopic: '',
      platformFee: '',
      transactionFee: '',
      platformFeeForTopSeller: '',
      boostMinAmount: 0,
      versionControl: '',
      maintenanceMode: false,
      bidUnit: '',
      minBidAmount: '',
      maxBidAmount: '',
      bidDuration: '',
      bidDurationType: '',
      allowedCountries: [],
      address: {
        postal: null,
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: ''
      },
      topSellerCondition: {
        days: 30,
        earnedAmount: 1000,
        totalProjectComplete: 10,
        reviewThreshold: 4
      }
    }
  })

  useEffect(() => {
    if (settingsData) {
      // Transform the data to match form structure
      const formData = {
        ...settingsData,
        address: settingsData.companyAddress || {
          postal: null,
          addressLine1: '',
          addressLine2: '',
          city: '',
          country: ''
        },
        topSellerCondition: settingsData.topSellerCondition || {
          days: 30,
          earnedAmount: 1000,
          totalProjectComplete: 10,
          reviewThreshold: 4
        }
      }
      form.reset(formData)
    }
  }, [settingsData, form])

  const onSubmit = async (data: any) => {
    try {
      delete data.id
      delete data.createdAt
      delete data.visible
      delete data.topSellerConditionId
      delete data.topSellerCondition.id
      delete data.topSellerCondition.visible
      delete data.topSellerCondition.createdAt
      delete data.addressId
      delete data.address.id
      delete data.address.createdAt
      delete data.address.visible

      // Handle logo upload if changed
      if (appLogo && !(appLogo as any)?.preview?.includes('https://')) {
        const formData = new FormData()
        formData.append('file', appLogo)
        const uploadResult = await uploadImage(formData).unwrap()
        data.appLogo = uploadResult.url
      }

      // Transform data for API
      const apiData = {
        ...data,
        companyAddress: data.address,
        topSellerCondition: data.topSellerCondition
      }
      delete apiData.address

      // Update settings
      await updateSettings(apiData).unwrap()
      toast.success('Settings updated successfully')
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast.error('Failed to update settings')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-2xl bg-[#F7F7F7] p-4 pt-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Configure all aspects of your application from one place</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue={checkDefaultValue()?.value} className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-8">
                <div className="w-full md:w-56">
                  <TabsList className="flex w-full flex-col justify-start space-y-4 bg-white md:h-full">
                    {settingsViewPermission['General Settings'].status && (
                      <TabsTrigger onClick={() => setActiveTab('General Settings')} value="general" className="w-full justify-start">
                        General
                      </TabsTrigger>
                    )}
                    {settingsViewPermission['Logo & Branding'].status && (
                      <TabsTrigger onClick={() => setActiveTab('Logo & Branding')} value="logo" className="w-full justify-start">
                        Logo & Branding
                      </TabsTrigger>
                    )}
                    {settingsViewPermission['Social Links'].status && (
                      <TabsTrigger onClick={() => setActiveTab('Social Links')} value="social" className="w-full justify-start">
                        Social Links
                      </TabsTrigger>
                    )}
                    {settingsViewPermission['App Settings'].status && (
                      <TabsTrigger onClick={() => setActiveTab('App Settings')} value="app" className="w-full justify-start">
                        App Settings
                      </TabsTrigger>
                    )}
                    {settingsViewPermission['Company Address'].status && (
                      <TabsTrigger onClick={() => setActiveTab('Company Address')} value="address" className="w-full justify-start">
                        Company Address
                      </TabsTrigger>
                    )}
                    {settingsViewPermission['Legal Documents'].status && (
                      <TabsTrigger onClick={() => setActiveTab('Legal Documents')} value="legal" className="w-full justify-start">
                        Legal Documents
                      </TabsTrigger>
                    )}
                    {settingsViewPermission['Platform Fees'].status && (
                      <TabsTrigger onClick={() => setActiveTab('Platform Fees')} value="fees" className="w-full justify-start">
                        Platform Fees
                      </TabsTrigger>
                    )}
                    {settingsViewPermission['Top Seller Conditions'].status && (
                      <TabsTrigger onClick={() => setActiveTab('Top Seller Conditions')} value="topseller" className="w-full justify-start">
                        Top Seller Conditions
                      </TabsTrigger>
                    )}
                    {settingsViewPermission.Bids.status && (
                      <TabsTrigger onClick={() => setActiveTab('Bids')} value="bids" className="w-full justify-start">
                        Bids
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <div className="flex-1 space-y-6">
                  <TabsContent value="general" className="mt-0">
                    <GeneralSettings />
                  </TabsContent>

                  <TabsContent value="logo" className="mt-0">
                    <LogoSettings setAppLogo={setAppLogo} />
                  </TabsContent>

                  <TabsContent value="social" className="mt-0">
                    <SocialLinks />
                  </TabsContent>

                  <TabsContent value="app" className="mt-0">
                    <AppSettings />
                  </TabsContent>

                  <TabsContent value="address" className="mt-0">
                    <CompanyAddress />
                  </TabsContent>

                  <TabsContent value="legal" className="mt-0">
                    <LegalDocuments />
                  </TabsContent>

                  <TabsContent value="fees" className="mt-0">
                    <PlatformFees />
                  </TabsContent>

                  <TabsContent value="topseller" className="mt-0">
                    <TopSellerConditions />
                  </TabsContent>
                  <TabsContent value="bids" className="mt-0">
                    <Bids />
                  </TabsContent>
                </div>
              </Tabs>

              {(checkDefaultValue()?.key && activeTab === ''
                ? settingsEditPermission[checkDefaultValue()!.key as ServiceProps]?.status
                : settingsEditPermission[activeTab as ServiceProps]?.status) && (
                <div className="flex justify-end">
                  <Button type="submit" disabled={isUpdating} className="w-32">
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              )}
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
