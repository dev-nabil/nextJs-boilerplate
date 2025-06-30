import Input from '@/components/custom/input'
import SubmitButton from '@/components/shared/SubmitButton'

import { changePasswordSchema, PasswordChangeFormData } from '@/schemas'
import { useUpdateOwnProfileMutation } from '@/store/features/user/userApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form' // Import FormProvider here
import toast from 'react-hot-toast'

export default function PasswordChange({ userType }: { userType?: string }) {
  const [updateOwn, { isLoading }] = useUpdateOwnProfileMutation()

  // Use the react-hook-form hook
  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(changePasswordSchema)
  })

  // Handle form submission
  const onSubmit = (data: PasswordChangeFormData) => {
    delete data.confirmPassword
    updateOwn(data)
      .unwrap()
      .then(() => {
        toast.success('Password changed successfully')
        form.reset()
      })
      .catch((e: any) => {
        if (e.data.message) {
          toast.error(e.data.message)
        } else {
          toast.error('please try again later')
        }

        // form.setError('confirmPassword', {
        //   type: 'custom',
        //   message: e.data.message || 'Error changing password please try again'
        // })
      })
  }
  return (
    <div className="px-2 py-5 sm:px-0 xl:w-1/2">
      {/* Wrap form with FormProvider to give context to all child components */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Old Password</label>
            <Input
              name="password"
              type="password"
              placeholder="Old Password"
              inputClass="w-full p-2 border rounded-md focus:ring-green-400 focus:border-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
            <Input
              name="newPassword"
              type="password"
              placeholder="New Password"
              inputClass="w-full p-2 border rounded-md focus:ring-green-400 focus:border-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              inputClass="w-full p-2 border rounded-md focus:ring-green-400 focus:border-green-400 placeholder-opacity-50"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-end justify-end">
            {/* <Button type="submit" size="lg" className="bg-primary-50 text-white">
              Change Password
            </Button> */}
            <SubmitButton isLoading={isLoading} type="submit" text="Change Password" className="bg-primary text-white" />
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
