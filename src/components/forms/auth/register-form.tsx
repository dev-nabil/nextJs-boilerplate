'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import InputField from '@/components/custom/input'
import { Button } from '@/components/ui/button'
import { useSignupWithOtpMutation } from '@/store/features/user/userApi'
import OtpVerificationModal from './OtpvarificationModal'

// Define validation schema with zod
const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name cannot exceed 50 characters' })
    .refine(val => /^[a-zA-Z\s]*$/.test(val), {
      message: 'Name should only contain letters and single spaces'
    })
    .refine(val => !/\s{3,}/.test(val), {
      message: 'Name should not contain multiple consecutive spaces'
    }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .max(30, { message: 'Email cannot be longer than 30 characters' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
})

// Infer the type from the schema
type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm({ role }: { role: 'buyer' | 'seller' }) {
  const [signupWihOtp, { isLoading: signUpWithOtpLoading }] = useSignupWithOtpMutation()
  const [user, setUser] = useState<{ name: string; email: string; password: string; role: 'buyer' | 'seller' } | null>(null)
  const [error, setError] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const {
    handleSubmit,
    formState: { errors },
    watch
  } = methods

  const onSubmit = async (data: RegisterFormValues) => {
    if (data) {
      setUser({ name: data.name, email: data.email, password: data.password, role: role })
    }
    try {
      const response = await signupWihOtp({ ...data, role }).unwrap()
      if (response.message) {
        setModalOpen(true)
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Something went wrong! Please try again.'
      toast.error(errorMessage)
      setError(error)
      console.error('Signup failed:', error)
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex h-auto w-full max-w-md flex-col gap-5 p-4"
        aria-label="Registration form"
      >
        <InputField
          name="name"
          type="text"
          label="Name"
          placeholder="Enter your name"
          className="w-full"
          required
          errorMessage={errors.name?.message}
        />

        <InputField
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          className="w-full"
          required
          errorMessage={errors.email?.message}
        />

        <InputField
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          className="w-full"
          required
          helperText="Password must be at least 8 characters with uppercase, lowercase, and numbers"
          errorMessage={errors.password?.message}
        />

        {watch('password') && (
          <div className="space-y-1">
            {/* Password requirements */}
            <ul className="mt-2 space-y-1 text-xs text-gray-500">
              <li className={`flex items-center ${/[A-Z]/.test(watch('password')) ? 'text-green-600' : ''}`}>
                <span className={`mr-1 text-xs ${/[A-Z]/.test(watch('password')) ? 'text-green-600' : ''}`}>
                  {/[A-Z]/.test(watch('password')) ? '✓' : '•'}
                </span>
                At least one uppercase letter
              </li>
              <li className={`flex items-center ${/[a-z]/.test(watch('password')) ? 'text-green-600' : ''}`}>
                <span className={`mr-1 text-xs ${/[a-z]/.test(watch('password')) ? 'text-green-600' : ''}`}>
                  {/[a-z]/.test(watch('password')) ? '✓' : '•'}
                </span>
                At least one lowercase letter
              </li>
              <li className={`flex items-center ${/[0-9!@#$%^&*(),.?":{}|<>]/.test(watch('password')) ? 'text-green-600' : ''}`}>
                <span className={`mr-1 text-xs ${/[0-9!@#$%^&*(),.?":{}|<>]/.test(watch('password')) ? 'text-green-600' : ''}`}>
                  {/[0-9!@#$%^&*(),.?":{}|<>]/.test(watch('password')) ? '✓' : '•'}
                </span>
                At least one number or special character
              </li>
              <li className={`flex items-center ${watch('password')?.length >= 8 ? 'text-green-600' : ''}`}>
                <span className={`mr-1 text-xs ${watch('password')?.length >= 8 ? 'text-green-600' : ''}`}>
                  {watch('password')?.length >= 8 ? '✓' : '•'}
                </span>
                At least 8 characters
              </li>
            </ul>
          </div>
        )}

        {error?.data?.message && (
          <p className="text-start text-sm text-red-600" role="alert">
            {error.data.message}
          </p>
        )}

        <Button type="submit" disabled={signUpWithOtpLoading} className="w-full">
          {signUpWithOtpLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      {user && modalOpen && <OtpVerificationModal user={user} isOpen={modalOpen} />}
    </FormProvider>
  )
}
//  isOpen={modalOpen}
