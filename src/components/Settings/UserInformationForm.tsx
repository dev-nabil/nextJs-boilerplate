'use client'

import { userInformationSchema } from '@/schemas'
import { RootState } from '@/store'
import { useUpdateOwnProfileMutation } from '@/store/features/user/userApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import InputField from '../custom/input'
import { Button } from '../ui/button'
import countries from './../../../db/countries.json'

export default function UserInformationForm() {
  const [updateOwnProfile, { isLoading }] = useUpdateOwnProfileMutation()
  const { user }: any = useSelector((state: RootState) => state?.auth)
  const form = useForm({
    resolver: zodResolver(userInformationSchema),
    defaultValues: {
      name: '',
      country: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postal: ''
    }
  })
  useEffect(() => {
    form.reset({
      name: user?.user?.name || '',
      country: user?.user?.address?.country || '',
      addressLine1: user?.user?.address?.addressLine1 || '',
      addressLine2: user?.user?.address?.addressLine2 || '',
      city: user?.user?.address?.city || '',
      postal: user?.user?.address?.postal?.toString() || ''
    })
  }, [user])

  const onSubmit = async (data: any) => {
    const toastId = toast.loading('Uploading Information...')
    const sendDataFormate = {
      name: data.name,
      address: {
        country: data.country,
        city: data.city,
        postal: data.postal,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2
      }
      //   aboutMe: 'abfbafbsfb'
    }
    try {
      updateOwnProfile(sendDataFormate)
        .unwrap()
        .then(() => {
          toast.success('Profile Information has been updated successfully!', { id: toastId })
        })
        .catch((error: any) => {
          toast.error(`Upload failed: ${(error as Error).message}`, { id: toastId })
        })
    } catch (error) {
      toast.error(`Upload failed: ${(error as Error).message}`, { id: toastId })
    }
  }

  const countryOptions = useMemo(() => {
    return Array.isArray(countries)
      ? countries.map((country: any) => ({
          label: country.name,
          value: country.code2
        }))
      : []
  }, []) // Memoized once

  const selectedCountry = useMemo(() => {
    const code = form.watch('country') || ''
    return countries.find(c => c.code2 === code)
  }, [form.watch('country')]) // Recompute only when selected country changes

  const selectedCountryStatesOption = useMemo(() => {
    return Array.isArray(selectedCountry?.states)
      ? selectedCountry.states.map((st: any) => ({
          label: st.name,
          value: st.name
        }))
      : []
  }, [selectedCountry]) // Recompute only when selectedCountry changes

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto w-full space-y-6">
          <InputField type="text" name="name" label="Name" placeholder="Enter Your Name" />
          <InputField type="text" name="addressLine1" label="Address" placeholder="Enter Your Location" />

          <InputField type="text" name="addressLine2" label="Address 2" placeholder="Enter Your Location" />
          <InputField
            name="country"
            type="select"
            label="Country"
            placeholder="Select country"
            defaultInputValue={user?.user?.address?.country}
            options={countryOptions as any}
            readOnly={false}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {selectedCountry?.states?.length !== 0 ? (
              <InputField
                name="city"
                type="select"
                label="city"
                placeholder="Select city"
                defaultInputValue={user?.user?.address?.city}
                options={selectedCountryStatesOption as any}
                readOnly={false}
              />
            ) : (
              <InputField type="text" name="city" label="City" placeholder="City" />
            )}

            <InputField type="text" name="postal" label="ZIP/Postal Code" placeholder="ZIP/Postal Code" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2"></div>
          <div className="flex justify-end">
            <Button type="submit" className="" disabled={isLoading} isLoading={isLoading}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
