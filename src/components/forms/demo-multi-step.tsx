/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { FormData, refineStepThreeSchema, stepSchemas } from '@/schemas/buyer-job-post-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputField from '../custom/input'

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [previousStep, setPreviousStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    subCategory: '',
    description: '',
    paymentType: 'hourly',
    minAmount: 0,
    maxAmount: 0,
    fixedAmount: 0,
    expertLabel: 'entry'
  })

  const form = useForm<FormData>({
    resolver: zodResolver(stepSchemas[currentStep]), // Validate based on the current step
    defaultValues: formData,
    mode: 'onChange'
  })

  const { handleSubmit, trigger, watch, setError } = form

  const paymentType = watch('paymentType')

  const steps = [
    { id: 1, name: 'Project Details' },
    { id: 2, name: 'Description' },
    { id: 3, name: 'Budget' },
    { id: 4, name: 'Expert Level' }
  ]

  const next = async () => {
    const fields = Object.keys(stepSchemas[currentStep].shape)
    const isValid = await trigger(fields as any, { shouldFocus: true })

    // Apply refinement logic for step 3
    if (currentStep === 3 && !refineStepThreeSchema(form.getValues())) {
      setError('paymentType', {
        type: 'manual',
        message: 'Please fill in the required fields for the selected budget type'
      })
      return
    }

    if (isValid) {
      if (currentStep < steps.length) {
        setPreviousStep(currentStep)
        setCurrentStep(step => step + 1)
      }
    }
  }

  const prev = () => {
    if (currentStep > 1) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  const onSubmit: SubmitHandler<FormData> = data => {
    setFormData(data)
    alert('Form submitted successfully!')
  }

  // Sample options for selects
  const categories = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'graphic-design', label: 'Graphic Design' }
  ]

  const subCategories = [
    { value: 'react', label: 'React' },
    { value: 'flutter', label: 'Flutter' },
    { value: 'ui-ux', label: 'UI/UX Design' }
  ]

  const expertLabels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'expert', label: 'Expert Level' }
  ]

  return (
    <div className="mx-auto max-w-2xl p-4">
      {/* Step Indicator */}
      <nav className="flex justify-center space-x-4">
        {steps.map(step => (
          <div
            key={step.id}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium',
              currentStep === step.id
                ? 'border-sky-600 bg-sky-600 text-white'
                : currentStep > step.id
                  ? 'border-sky-600 bg-sky-100 text-sky-600'
                  : 'border-gray-200 bg-gray-100 text-gray-500'
            )}
          >
            {step.id}
          </div>
        ))}
      </nav>

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <InputField name="title" type="text" label="Project Title" placeholder="Enter project title" />
              <InputField name="category" type="select" label="Category" placeholder="Select a category" options={categories} />
              <InputField
                name="subCategory"
                type="select"
                label="Sub-Category"
                placeholder="Select a sub-category"
                options={subCategories}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <InputField name="description" type="textarea" label="Project Description" placeholder="Describe your project" />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <InputField
                name="paymentType"
                type="select"
                label="Budget Type"
                placeholder="Select budget type"
                options={[
                  { value: 'hourly', label: 'Hourly' },
                  { value: 'fixed', label: 'Fixed' }
                ]}
              />
              {paymentType === 'hourly' && (
                <>
                  <InputField name="minAmount" type="number" label="Minimum Amount" placeholder="Enter minimum amount" />
                  <InputField name="maxAmount" type="number" label="Maximum Amount" placeholder="Enter maximum amount" />
                </>
              )}
              {paymentType === 'fixed' && (
                <InputField name="fixedAmount" type="number" label="Fixed Amount" placeholder="Enter fixed amount" />
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <InputField name="expertLabel" type="select" label="Expert Level" placeholder="Select expert level" options={expertLabels} />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button type="button" onClick={prev} disabled={currentStep === 1}>
              Previous
            </Button>
            {currentStep < steps.length ? (
              <Button type="button" onClick={next}>
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
