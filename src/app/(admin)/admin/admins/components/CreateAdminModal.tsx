'use client'
import Modal from '@/components/custom/modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateAdminMutation } from '@/store/features/admin/adminApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

// Define validation schema with zod
const adminSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(50, { message: 'Name cannot exceed 50 characters' }),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
})

type AdminFormValues = z.infer<typeof adminSchema>

interface CreateAdminModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateAdminModal({ isOpen, onClose, onSuccess }: CreateAdminModalProps) {
  const [signup, { isLoading }] = useCreateAdminMutation()

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },
    mode: 'onTouched' // Only validate fields that have been touched
  })

  const onSubmit = async (data: AdminFormValues) => {
    try {
      // Add role as admin
      const adminData = {
        ...data,
        role: 'admin'
      }

      await signup(adminData).unwrap()
      toast.success('Admin created successfully')
      form.reset()
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create admin. Please try again.')
      console.error('Admin creation failed:', error)
    }
  }

  // Get form state to check if password field has been touched or form submitted
  const { touchedFields, isSubmitted } = form.formState
  const showPasswordHint = touchedFields.password || isSubmitted

  return (
    <Modal isOpen={isOpen} onClose={onClose} header="Create New Admin">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter admin name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter admin email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter admin password" {...field} />
                </FormControl>
                {showPasswordHint && (
                  <FormMessage className="text-xs">
                    Password must be at least 8 characters with uppercase, lowercase, and numbers
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Admin'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  )
}
