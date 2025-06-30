import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { userInitials } from '@/lib/utils'
import { profileImageSchema } from '@/schemas'
import { setCredentials } from '@/store/features/auth/authSlice'
import { useUpdateOwnProfileMutation } from '@/store/features/user/userApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import InputField from '../custom/input'
import { Button } from '../ui/button'
export default function UserProfileUploadImageForm({ user }: { user: any }) {
  const [updateOwnProfile, { isLoading }] = useUpdateOwnProfileMutation()
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState<string>('')
  const form = useForm({
    resolver: zodResolver(profileImageSchema),
    defaultValues: {
      //@ts-ignore
      image: ''
    }
  })

  const dispatch = useDispatch()
  const onSubmit = async (data: any) => {
    setProfileImagePreviewUrl(data && data instanceof File ? URL.createObjectURL(data) : '')
    const toastId = toast.loading('Uploading profile photo...')

    try {
      const formData = new FormData()
      formData.append('avatar', data)
      const res = updateOwnProfile(formData)
        .unwrap()
        .then(res => {
          dispatch(setCredentials({ user: res }))
          toast.success('Profile photo has been uploaded successfully!', { id: toastId })
        })
        .catch((error: any) => {
          toast.error(`Upload failed: ${(error as Error).message}`, { id: toastId })
        })
    } catch (error) {
      toast.error(`Upload failed: ${(error as Error).message}`, { id: toastId })
    }
  }

  const onDeleteImage = async () => {
    try {
      const sendDataFormate = {
        avatar: null
      }
      updateOwnProfile(sendDataFormate)
        .unwrap()
        .then(res => {
          dispatch(setCredentials({ user: res }))
          setProfileImagePreviewUrl('')
          toast.success('Profile photo deleted successfully!')
        })
        .catch((error: any) => {
          toast.error(`Upload failed: ${(error as Error).message}`)
        })
    } catch (error) {
      toast.error(`Upload failed: ${(error as Error).message}`)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col items-center md:flex-row">
          <Avatar className="h-24 w-24 rounded-xl border border-gray-300">
            <AvatarImage src={profileImagePreviewUrl || user?.avatar} alt="Profile" />
            <AvatarFallback className="rounded-xl text-white">{userInitials(user?.name)}</AvatarFallback>
          </Avatar>

          <div className="mt-4 flex cursor-pointer items-center space-x-2 sm:ml-4 md:mt-0">
            <div>
              <InputField
                type="file"
                name="image"
                SingleImageUploadFunction={(e: any) => onSubmit(e)}
                placeholder="Upload new profile picture"
                customDesign={
                  <>
                    <Button
                      type="button"
                      isLoading={isLoading}
                      disabled={isLoading}
                      variant="outline"
                      className="border-primary-500 text-primary-500 flex cursor-pointer items-center justify-center bg-transparent"
                    >
                      <svg
                        width={19}
                        height={19}
                        className="cursor-pointer"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.8133 4.7L9.61328 1.5M9.61328 1.5L6.41328 4.7M9.61328 1.5V7.9M4.81328 14.3H4.82128M8.01328 14.3H8.02128M3.21328 11.1H16.0133C16.8969 11.1 17.6133 11.8163 17.6133 12.7V15.9C17.6133 16.7837 16.8969 17.5 16.0133 17.5H3.21328C2.32963 17.5 1.61328 16.7837 1.61328 15.9V12.7C1.61328 11.8163 2.32963 11.1 3.21328 11.1Z"
                          stroke="#1DBF73"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {`Upload ${user?.avatar ? 'New' : 'Your'} Picture`}
                    </Button>
                  </>
                }
              />
            </div>
            {user?.avatar && (
              <Button
                onClick={onDeleteImage}
                variant="outline"
                className="flex items-center justify-center border-gray-300 bg-transparent text-black"
              >
                <svg width={19} height={21} viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.61328 5.16663H3.39106H17.6133"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.8356 5.16664V17.6111C15.8356 18.0826 15.6483 18.5348 15.3149 18.8682C14.9815 19.2016 14.5293 19.3889 14.0578 19.3889H5.16889C4.6974 19.3889 4.24521 19.2016 3.91181 18.8682C3.57841 18.5348 3.39111 18.0826 3.39111 17.6111V5.16664M6.05778 5.16664V3.38886C6.05778 2.91737 6.24508 2.46518 6.57848 2.13178C6.91188 1.79838 7.36406 1.61108 7.83556 1.61108H11.3911C11.8626 1.61108 12.3148 1.79838 12.6482 2.13178C12.9816 2.46518 13.1689 2.91737 13.1689 3.38886V5.16664"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M7.83545 9.61108V14.9444" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.3911 9.61108V14.9444" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Delete
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
