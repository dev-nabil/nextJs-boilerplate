'use client'

import type React from 'react'

import { useAddWithdrawMutation } from '@/store/features/withdraw/withdrawApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import InputField from '../custom/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const withdrawSchema = z
  .object({
    amount: z.coerce
      .number({ invalid_type_error: 'Amount is required' })
      .min(1000, 'Minimum withdrawal is 1,000')
      .max(100000, 'Maximum withdrawal is 100,000'),
    method: z.enum(['bank', 'khalti'], {
      required_error: 'Payment method is required'
    }),
    // Bank payment fields
    account: z.string().optional(),
    name: z.string().optional(),
    branch: z.string().optional(),
    bank: z.string().optional(),
    // Khalti payment field
    phone: z.string().optional()
  })
  .refine(
    data => {
      if (data.method === 'bank') {
        return data.account && data.name && data.branch && data.bank
      }
      if (data.method === 'khalti') {
        return data.phone && data.phone.length >= 10
      }
      return false
    },
    {
      message: 'Please fill all required fields for the selected payment method',
      path: ['method']
    }
  )

type WithdrawFormValues = z.infer<typeof withdrawSchema>

export default function WithdrawMoney({ setOpenModal }: { setOpenModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [addWithdraw, { isLoading }] = useAddWithdrawMutation()
  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
      method: 'bank',
      account: '',
      name: '',
      branch: '',
      bank: '',
      phone: ''
    }
  })

  const method = form.watch('method')

  const onSubmit = (data: WithdrawFormValues) => {
    if (Number(data.amount) >= 1000 && Number(data.amount) <= 100000) {
      addWithdraw(data)
        .unwrap()
        .then(() => {
          toast.success('Withdrawal request submitted successfully')
          form.reset()
          setOpenModal(false)
        })
        .catch(error => {
          toast.error(error?.data?.message || 'Failed to submit withdrawal request')
        })
    } else {
      toast.error('Amount must be between 1,000 and 100,000')
    }
  }

  return (
    <div>
      <FormProvider {...form}>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <InputField type="number" name="amount" label="Amount" placeholder="Enter amount" required className="w-full" />

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={method} onValueChange={value => form.setValue('method', value as 'bank' | 'khalti')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Payment</SelectItem>
                <SelectItem value="khalti">Khalti Payment</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.method && <p className="text-sm text-red-500">{form.formState.errors.method.message}</p>}
          </div>

          {method === 'bank' && (
            <>
              <InputField
                type="text"
                name="account"
                label="Account Number"
                placeholder="Enter account number"
                required
                className="w-full"
              />
              <InputField
                type="text"
                name="name"
                label="Account Holder Name"
                placeholder="Enter account holder name"
                required
                className="w-full"
              />
              <InputField type="text" name="branch" label="Branch" placeholder="Enter branch" required className="w-full" />
              <InputField type="text" name="bank" label="Bank Name" placeholder="Enter bank name" required className="w-full" />
            </>
          )}

          {method === 'khalti' && (
            <InputField
              type="number"
              name="phone"
              label="Phone Number"
              placeholder="Enter your Khalti phone number"
              required
              className="w-full"
            />
          )}

          <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Withdrawal Request'}
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}
