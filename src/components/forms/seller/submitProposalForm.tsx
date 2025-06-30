'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { default as InputField } from '@/components/custom/input'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitProposalSchema } from '@/schemas'
import { useAddProjectProposalMutation } from '@/store/features/proposal/projectProposalApi'
import { useGetSettingsPublicQuery } from '@/store/features/settings/settingsApi'
import { addDays, format } from 'date-fns'
import toast from 'react-hot-toast'

interface SubmitProposalFormProps {
  projectId: string
  projectPaymentType: 'fixed' | 'milestone' | 'hourly'
}

const SubmitProposalForm: React.FC<SubmitProposalFormProps> = ({ projectId, projectPaymentType }) => {
  const [paymentType, setPaymentType] = useState<'milestone' | 'project'>('milestone')

  const { data: settingData, isLoading: settingLoading } = useGetSettingsPublicQuery({})
  const [addProjectProposal, { isLoading }] = useAddProjectProposalMutation()
  const form = useForm<z.infer<typeof submitProposalSchema>>({
    resolver: zodResolver(submitProposalSchema),
    defaultValues: {
      paymentType: 'project',
      rows: [{ title: '', date: addDays(new Date(), 6), milestone: 1000 }], // Default first milestone is 6 days from now
      bidAmount: 1000,
      message: ''
      // hourlyRate: 0
    }
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows'
  })

  const router = useRouter()
  const watchPaymentType = watch('paymentType')
  const watchRows = watch('rows')
  const watchBidAmount = watch('bidAmount')
  const totalMilestoneAmount = watchRows ? watchRows.reduce((acc, curr) => Number(acc) + Number(curr.milestone || 0), 0) : 0

  const onSubmit = async (data: z.infer<typeof submitProposalSchema>) => {
    try {
      const { bidAmount, message, rows } = data

      const milestones = rows?.map(row => ({
        title: row.title,
        date: row.date,
        amount: row.milestone
      }))

      let amount
      let paymentTypeData

      switch (watchPaymentType) {
        case 'project':
          amount = bidAmount
          paymentTypeData = 'projectBased'
          break
        case 'milestone':
          amount = totalMilestoneAmount
          paymentTypeData = 'milestoneBased'
          break
        default:
          amount = 0
          paymentTypeData = ''
      }

      const sendDatajson = {
        amount,
        paymentType: paymentTypeData,
        message,
        projectId,
        milestones
      }

      await addProjectProposal(sendDatajson)
        .unwrap()
        .then((res: any) => {
          if (res?.id) {
            router.push('/seller/find-work')
            toast.success('Your Proposal Submit Successfully')
          } else {
            toast.error('Something Went Wrong! try again later')
            // router.push('/seller/find-work')
          }
        })
        .catch(error => {
          // router.push('/seller/find-work')
          toast.error(error?.data?.message || 'Something Went Wrong! try again later')
        })
    } catch (error: any) {
      toast.error('Something Went Wrong! try again later')
      console.error('Proposal Submission Failed', error)
    }
  }

  useEffect(() => {
    setPaymentType(watchPaymentType)
  }, [watchPaymentType])

  let chargeFee: number
  if (!settingData || settingLoading) {
    chargeFee = 0
  } else {
    chargeFee =
      (Number(settingData?.platformFee || 0) / 100) * (paymentType === 'project' ? (watchBidAmount ?? 0) : (totalMilestoneAmount ?? 0))
  }

  const totalReceived =
    paymentType === 'project'
      ? (watchBidAmount || 0) - chargeFee
      : paymentType === 'milestone'
        ? totalMilestoneAmount - chargeFee
        : (watchBidAmount || 0) - chargeFee

  const milestones = watch('rows')

  // Function to calculate default date for new milestones
  const getDefaultDate = (index: number) => {
    if (index === 0) return addDays(new Date(), 6) // First milestone is 6 days from now

    // For subsequent milestones, use the previous milestone's date + 6 days
    const prevDate = new Date((milestones ?? [])[index - 1]?.date)
    return addDays(prevDate, 6)
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-[#3F3F46]">
          <h2 className="text-sm font-medium text-gray-800">Payment Terms</h2>
          <p className="mt-2 text-sm text-gray-600">How do you want to be paid?</p>
          {/* {projectPaymentType === 'hourly' && (
            <>
              <div className="mt-10 flex flex-col items-center justify-between gap-[10px] md:flex-row">
                <div>
                  <h2 className="font-semibold text-[#3F3F46]">Rate</h2>
                  <p className="text-sm">Total Amount the client will see on your proposal</p>
                </div>

                <div className="flex w-full items-center justify-center gap-4 md:w-auto">
                  <InputField className="w-full md:w-[320px]" type="number" name="hourlyRate" />

                  <span className="text-base font-medium text-[#3F3F46]">/hr</span>
                </div>
              </div>
            </>
          )} */}

          {(projectPaymentType === 'fixed' || projectPaymentType === 'hourly') && (
            <>
              <Controller
                name="paymentType"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    defaultValue="project"
                    onValueChange={(value: 'milestone' | 'project') => {
                      field.onChange(value)
                      setPaymentType(value)

                      // Reset fields based on payment type
                      if (value === 'milestone') {
                        setValue('bidAmount', undefined)
                        setValue('rows', [{ title: '', date: getDefaultDate(0), milestone: 1000 }])
                      } else {
                        setValue('rows', undefined)
                        setValue('bidAmount', 1000)
                      }
                    }}
                    className="mt-4 space-y-4"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="milestone" id="milestone" />
                      <Label htmlFor="milestone">
                        <span className="text-sm text-gray-800">By Milestone</span>
                        <p className="mt-1 text-sm text-gray-600">
                          Divide the project into smaller segments, called milestones. You will be paid for milestones as they are completed
                          and approved.
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="project" id="project" />
                      <Label htmlFor="project">
                        <span className="text-sm text-gray-800">By Project</span>
                        <p className="mt-1 text-sm text-gray-600">You will be paid for the project as a whole.</p>
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />

              {paymentType === 'milestone' && (
                <>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="my-5 grid grid-cols-1 items-start gap-4 rounded-lg bg-white p-4 md:grid-cols-3 md:bg-transparent lg:p-0"
                    >
                      {/* Milestone Title Input */}
                      <div>
                        <div className="flex flex-col justify-between">
                          <InputField
                            type="text"
                            label={`Milestone ${index + 1}`}
                            placeholder="Milestone Title"
                            name={`rows.${index}.title`}
                          />
                        </div>
                        {errors?.rows?.[index]?.title?.message && (
                          <p className="mt-1 text-[13px] text-red-700">{errors?.rows?.[index]?.title?.message}</p>
                        )}
                      </div>

                      {/* Date Input */}
                      <div className="flex flex-col justify-between">
                        <h2>Date</h2>
                        <Controller
                          name={`rows.${index}.date`}
                          control={control}
                          render={({ field }) => {
                            // Disable editing previous milestone dates if a later milestone exists
                            const isLocked = index < fields.length - 1 // If not the last milestone, lock the date
                            return (
                              <Popover>
                                <PopoverTrigger asChild className="bg-white shadow-sm">
                                  <FormControl>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={isLocked}>
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field?.value && !isNaN(new Date(field.value).getTime())
                                        ? format(new Date(field.value), 'PPP')
                                        : 'Select date'}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                {!isLocked && (
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                      disabled={date => {
                                        // Disable past dates
                                        const today = new Date()
                                        today.setHours(0, 0, 0, 0)
                                        if (date < today) return true

                                        // For first milestone, just disable past dates
                                        if (index === 0) return false

                                        // For other milestones, disable dates before previous milestone's date
                                        const prevMilestoneDate = new Date(milestones?.[index - 1]?.date ?? new Date())
                                        prevMilestoneDate.setHours(0, 0, 0, 0)
                                        return date <= prevMilestoneDate
                                      }}
                                    />
                                  </PopoverContent>
                                )}
                              </Popover>
                            )
                          }}
                        />
                        {/* Show a lock message if the date is locked */}
                        {index < fields.length - 1 && (
                          <span className="mt-1 text-xs text-gray-400">Cannot change date after adding next milestone</span>
                        )}
                      </div>

                      {/* NPR Input with Trash Icon */}
                      <div className="grid grid-cols-5 items-end gap-2">
                        <div className="col-span-4 flex flex-col justify-between">
                          <InputField
                            label="NPR"
                            type="number"
                            placeholder="Enter amount"
                            name={`rows.${index}.milestone`}
                            error={errors.rows?.[1]?.milestone?.message}
                          />

                          {errors?.rows?.[index]?.milestone?.message && (
                            <p className="mt-1 text-[13px] text-red-700">{errors?.rows?.[index]?.milestone?.message}</p>
                          )}
                        </div>
                        <div
                          onClick={() => fields.length > 1 && remove(index)}
                          className={cn(
                            'col-span-1 mb-2 flex cursor-pointer items-center justify-center',
                            fields.length === 1 && 'pointer-events-none opacity-50'
                          )}
                        >
                          <Trash2 className="h-5 w-5 text-red-600 hover:text-red-900" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <h2
                    onClick={() => {
                      if (fields.length < 4) {
                        append({
                          title: '',
                          date: getDefaultDate(fields.length),
                          milestone: 1000
                        })
                      }
                    }}
                    className={cn('text-primary-150 mt-4 w-fit cursor-pointer text-sm', fields.length >= 4 && 'hidden')}
                  >
                    Add More +
                  </h2>
                </>
              )}

              <div className="mt-10 flex flex-col items-center justify-between md:flex-row">
                <div>
                  <h2 className="font-semibold text-[#3F3F46]">{paymentType === 'milestone' ? 'Total Price' : 'Bid'}</h2>
                  <p className="text-sm">
                    {paymentType === 'milestone'
                      ? 'This includes all milestones and is the amount your client will pay.'
                      : 'As client fixed the price, You have no chance to propose any amount.'}
                  </p>
                </div>
                {paymentType !== 'milestone' ? (
                  <InputField
                    label="NPR"
                    className="mt-3 w-full text-right !text-base md:w-[320px]"
                    type="number"
                    placeholder="Enter amount"
                    name="bidAmount"
                  />
                ) : (
                  <div className="mt-3 flex h-[36px] w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 shadow-sm md:w-[320px]">
                    <h2>NPR</h2>
                    <h2>{Number(totalMilestoneAmount).toFixed(2)}</h2>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mt-10 flex flex-col items-center justify-between md:flex-row">
            <div>
              <h2 className="font-semibold text-[#3F3F46]">{settingData?.platformFee || 0}% Freelancer Charge Fee</h2>
              <p className="text-sm">This percentage changes based on the payment amount.</p>
            </div>

            <div className="flex w-full flex-row items-center justify-center gap-4 md:w-auto">
              <div className="mt-3 flex h-[36px] w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 shadow-sm md:mt-0 md:w-[320px]">
                <h2>NPR</h2>
                <h2>{paymentType === 'project' ? Number(chargeFee).toFixed(2) || 0 : Number(chargeFee) || 0}</h2>
              </div>

              {/* {projectPaymentType === 'hourly' && <span className="text-base font-medium text-[#3F3F46]">/hr</span>} */}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between md:flex-row">
            <div>
              <h2 className="font-semibold text-[#3F3F46]">You Will Receive</h2>
              <p className="text-sm">After charge fee, this is the amount you will receive.</p>
            </div>
            <div className="flex w-full flex-row items-center justify-center gap-4 md:w-auto">
              <div className="mt-3 flex h-[36px] w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 shadow-sm md:mt-0 md:w-[320px]">
                <h2>NPR</h2>
                {paymentType === 'project' ? <h2>{totalReceived.toFixed(2)}</h2> : <h2>{Number(totalReceived).toFixed(2)}</h2>}
              </div>
              {/* {projectPaymentType === 'hourly' && <span className="text-base font-medium text-[#3F3F46]">/hr</span>} */}
            </div>
          </div>
        </div>

        <InputField label="Your Message" type="textarea" placeholder="Enter a description..." name="message" className="mt-6 max-h-96" />

        <div className="mt-6 flex justify-between">
          <Button disabled={isLoading} isLoading={isLoading} type="submit" className="px-6 py-2 text-sm text-white">
            Submit Proposal
          </Button>
          <Link href={'/seller/find-work'}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default SubmitProposalForm
