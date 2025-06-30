'use client'

import type React from 'react'

import { MapComponent } from '@/app/(buyer)/buyer/job-post-create/map-components/map'
import { MapProvider } from '@/app/(buyer)/buyer/job-post-create/map-components/map-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, formatPrice } from '@/lib/utils'
import { type FormData, stepSchemas } from '@/schemas/multi-step-form'
import { PriceSetting } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronDown, Info, Tags, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import InputField from '../custom/input'
import { validateFixedAmount, validateHourlyRates, validateStepFields, validateSubCategories } from './utils'

const priceSetting: PriceSetting = {
  minPrice: 100,
  maxPrice: 9999999
}

export default function BuyerJobPost({ category }: any) {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [previousStep, setPreviousStep] = useState(0)
  const { push } = useRouter()

  // Category and subcategory selection states
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [subcategoryOpen, setSubcategoryOpen] = useState(false)
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([])

  // Create a single source of truth for all form data
  const [completeFormData, setCompleteFormData] = useState<FormData>({
    title: '',
    categoryId: { value: '', label: '' },
    budget: '',
    subCategories: [],
    description: '',
    paymentType: 'hourly',
    minAmount: 0,
    maxAmount: 0,
    fixedAmount: 0,
    expertise: 'expert',
    lat: 27.7103145,
    lng: 85.3221634,
    place: `Kathmandu 44600, Nepal`,
    city: 'Kathmandu',
    country: 'Nepal'
  })

  // Create the form with the complete schema
  const methods = useForm<FormData>({
    //@ts-ignore
    resolver: zodResolver(stepSchemas[currentStep]),
    defaultValues: completeFormData,
    mode: 'onChange' // Enable onChange validation mode
  })

  const {
    handleSubmit,
    trigger,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid }
  } = methods

  const paymentType = watch('paymentType')
  const categoryData = watch('categoryId')
  const subCategories = watch('subCategories') || []
  const minAmount = watch('minAmount')
  const maxAmount = watch('maxAmount')
  const fixedAmount = watch('fixedAmount')

  // Use a ref to prevent infinite loops
  const formDataRef = useRef(completeFormData)

  // Update form values when step changes to ensure data persistence
  useEffect(() => {
    // Set form values from our complete data store
    Object.entries(completeFormData).forEach(([key, value]) => {
      setValue(key as any, value)
    })
  }, [currentStep, setValue])

  // Update available subcategories when selected category changes
  useEffect(() => {
    if (categoryData?.value && category) {
      const selectedCategory = category.find((c: any) => c.id === categoryData.value)
      setAvailableSubcategories(selectedCategory?.subCategories || [])
    } else {
      setAvailableSubcategories([])
    }
  }, [categoryData, category])

  // Save current step data to our complete data store
  const saveCurrentStepData = () => {
    const currentValues = getValues()
    setCompleteFormData(prev => {
      const newData = {
        ...prev,
        ...currentValues,
        expertise: currentValues.expertise || prev.expertise
      }
      formDataRef.current = newData
      return newData
    })
  }

  // Validate numeric input with regex
  const validateNumericInput = (value: string | number): boolean => {
    if (value === undefined || value === null) return false
    const stringValue = String(value).trim()
    // Regex to validate positive numbers (integers or decimals with up to 2 decimal places)
    const numericRegex = /^[0-9]+(\.[0-9]{1,2})?$/
    return numericRegex.test(stringValue) && Number(stringValue) > 0
  }

  const prev = () => {
    if (currentStep > 1) {
      // Save current step data before going back
      saveCurrentStepData()
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  const next = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    //@ts-ignore
    const fields = Object.keys(stepSchemas[currentStep].shape)
    let isValid = await validateStepFields(fields, trigger)

    if (!validateSubCategories(currentStep, categoryData, subCategories, setError, clearErrors)) {
      isValid = false
    }

    if (currentStep === 3) {
      if (paymentType === 'hourly') {
        if (!validateHourlyRates(minAmount, maxAmount, setError, clearErrors, validateNumericInput)) {
          isValid = false
        }
      } else if (paymentType === 'fixed') {
        if (!validateFixedAmount(fixedAmount, setError, clearErrors, validateNumericInput)) {
          isValid = false
        }
      }
    }

    if (isValid) {
      saveCurrentStepData()
      if (currentStep < steps.length) {
        setPreviousStep(currentStep)
        setCurrentStep(step => step + 1)
      }
    } else {
      document.getElementById('error-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setValue('categoryId', { value: categoryId, label: categoryName })
    setValue('subCategories', [])
    setCategoryOpen(false)
    clearErrors('categoryId')
  }

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategoryId: string, subcategoryName: string) => {
    const currentSubcategories = [...subCategories]
    const isSelected = currentSubcategories.some(s => s.value === subcategoryId)

    if (isSelected) {
      // Remove if already selected
      setValue(
        'subCategories',
        currentSubcategories.filter(s => s.value !== subcategoryId)
      )
    } else {
      // Add the subcategory (no maximum limit)
      setValue('subCategories', [...currentSubcategories, { value: subcategoryId, label: subcategoryName }])
    }

    // Clear subcategory errors if at least one is selected
    if (currentSubcategories.length > 0 || !isSelected) {
      clearErrors('subCategories')
    }
  }

  // Remove a subcategory
  const removeSubcategory = (subcategoryId: string) => {
    const currentSubcategories = [...subCategories]
    setValue(
      'subCategories',
      currentSubcategories.filter(s => s.value !== subcategoryId)
    )

    // Add error if all subcategories are removed
    if (currentSubcategories.length <= 1) {
      setError('subCategories', {
        type: 'manual',
        message: 'At least one skill is required'
      })
    }
  }

  // Clear category selection
  const clearCategory = (e: React.MouseEvent) => {
    e.stopPropagation()
    setValue('categoryId', { value: '', label: '' })
    setValue('subCategories', [])
  }

  const categories = category?.map((item: any) => ({
    value: item.id,
    label: item.name
  }))

  const expertLabels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'intermediate', label: 'Mid Level' },
    { value: 'expert', label: 'Expert Level' }
  ]

  // // Validate budget fields when they change
  // useEffect(() => {
  //   if (currentStep === 3) {
  //     if (paymentType === 'hourly') {
  //       // Clear fixed amount errors if we're in hourly mode
  //       clearErrors('fixedAmount')

  //       // Validate min amount with regex for numeric values
  //       const minAmountValue = Number(minAmount)
  //       if (isNaN(minAmountValue) || minAmountValue <= 0) {
  //         setError('minAmount', {
  //           type: 'manual',
  //           message: 'Minimum price range must be greater than zero'
  //         })
  //       } else if (!validateNumericInput(minAmount)) {
  //         setError('minAmount', {
  //           type: 'manual',
  //           message: 'Please enter a valid positive number'
  //         })
  //       } else {
  //         clearErrors('minAmount')
  //       }

  //       // Validate max amount with regex for numeric values
  //       const maxAmountValue = Number(maxAmount)
  //       if (isNaN(maxAmountValue) || maxAmountValue <= 0) {
  //         setError('maxAmount', {
  //           type: 'manual',
  //           message: 'Maximum price range must be greater than zero'
  //         })
  //       } else if (!validateNumericInput(maxAmount)) {
  //         setError('maxAmount', {
  //           type: 'manual',
  //           message: 'Please enter a valid positive number'
  //         })
  //       } else if (Number(minAmount) > Number(maxAmount)) {
  //         setError('maxAmount', {
  //           type: 'manual',
  //           message: 'Maximum rate must be greater than minimum rate'
  //         })
  //       } else {
  //         clearErrors('maxAmount')
  //       }
  //     } else if (paymentType === 'fixed') {
  //       // Clear hourly errors if we're in fixed mode
  //       clearErrors(['minAmount', 'maxAmount'])

  //       // Validate fixed amount with regex for numeric values
  //       const fixedAmountValue = Number(fixedAmount)
  //       if (isNaN(fixedAmountValue) || fixedAmountValue <= 0) {
  //         setError('fixedAmount', {
  //           type: 'manual',
  //           message: 'Fixed amount must be greater than zero'
  //         })
  //       } else if (!validateNumericInput(fixedAmount)) {
  //         setError('fixedAmount', {
  //           type: 'manual',
  //           message: 'Please enter a valid positive number'
  //         })
  //       } else {
  //         clearErrors('fixedAmount')
  //       }
  //     }
  //   }
  // }, [paymentType, minAmount, maxAmount, fixedAmount, currentStep, setError, clearErrors])

  // Validate budget fields when they change
  useEffect(() => {
    if (currentStep === 3) {
      const { minPrice, maxPrice } = priceSetting

      if (paymentType === 'hourly') {
        clearErrors('fixedAmount')

        const minAmountValue = Number(minAmount)
        if (isNaN(minAmountValue) || minAmountValue < minPrice) {
          setError('minAmount', {
            type: 'manual',
            message: `Minimum price must be at least ${minPrice}`
          })
        } else if (!validateNumericInput(minAmount)) {
          setError('minAmount', {
            type: 'manual',
            message: 'Please enter a valid positive number'
          })
        } else if (minAmountValue > maxPrice) {
          setError('minAmount', {
            type: 'manual',
            message: `Minimum price must not exceed ${maxPrice}`
          })
        } else {
          clearErrors('minAmount')
        }

        const maxAmountValue = Number(maxAmount)
        if (isNaN(maxAmountValue) || maxAmountValue < minPrice) {
          setError('maxAmount', {
            type: 'manual',
            message: `Maximum price must be at least ${minPrice}`
          })
        } else if (!validateNumericInput(maxAmount)) {
          setError('maxAmount', {
            type: 'manual',
            message: 'Please enter a valid positive number'
          })
        } else if (maxAmountValue > maxPrice) {
          setError('maxAmount', {
            type: 'manual',
            message: `Maximum price must not exceed ${maxPrice}`
          })
        } else if (minAmountValue >= maxAmountValue) {
          setError('maxAmount', {
            type: 'manual',
            message: 'Maximum rate must be greater than minimum rate'
          })
        } else {
          clearErrors('maxAmount')
        }
      } else if (paymentType === 'fixed') {
        clearErrors(['minAmount', 'maxAmount'])

        const fixedAmountValue = Number(fixedAmount)
        if (isNaN(fixedAmountValue) || fixedAmountValue < minPrice) {
          setError('fixedAmount', {
            type: 'manual',
            message: `Fixed amount must be at least ${minPrice}`
          })
        } else if (!validateNumericInput(fixedAmount)) {
          setError('fixedAmount', {
            type: 'manual',
            message: 'Please enter a valid positive number'
          })
        } else if (fixedAmountValue > maxPrice) {
          setError('fixedAmount', {
            type: 'manual',
            message: `Fixed amount must not exceed ${maxPrice}`
          })
        } else {
          clearErrors('fixedAmount')
        }
      }
    }
  }, [paymentType, minAmount, maxAmount, fixedAmount, currentStep, setError, clearErrors])

  const onSubmit: SubmitHandler<FormData> = async data => {
    saveCurrentStepData()
    const finalData = { ...completeFormData, ...data }
    let isValid = true
    if (!finalData.subCategories || finalData.subCategories.length === 0) {
      isValid = false
    }
    if (paymentType === 'hourly') {
      if (Number(minAmount) <= 0) {
        setError('minAmount', { type: 'manual', message: 'Minimum price range must be greater than zero' })
        isValid = false
      }
      if (Number(maxAmount) <= 0) {
        setError('maxAmount', { type: 'manual', message: 'Maximum price range must be greater than zero' })
        isValid = false
      }
      if (Number(minAmount) > Number(maxAmount)) {
        setError('maxAmount', { type: 'manual', message: 'Maximum rate must be greater than minimum rate' })
        isValid = false
      }
    } else if (paymentType === 'fixed') {
      if (Number(fixedAmount) <= priceSetting.minPrice) {
        setError('fixedAmount', { type: 'manual', message: 'Fixed amount must be greater than ' + formatPrice(priceSetting.minPrice) })
        isValid = false
      }
    }

    if (!isValid) {
      // If validation fails, don't proceed with submission
      // Instead, show a toast or alert message
      console.error('Form validation failed. Please check all fields.')
      return
    }

    setSubmitLoading(true)

    try {
      if (paymentType === 'hourly') {
        finalData.budget = `$${finalData.minAmount} - $${finalData.maxAmount} per hour`
      } else {
        finalData.budget = `Fixed price: $${finalData.fixedAmount}`
      }

      await localStorage.setItem('jobDetails', JSON.stringify(finalData))
      push('/buyer/job-details')
    } catch (error) {
      console.error('Error saving job details:', error)
      // Show error notification here if needed
    } finally {
      // Add a 2s loading state before redirecting
      setTimeout(() => {
        setSubmitLoading(false)
      }, 2000)
    }
  }

  return (
    <div className="mx-auto mt-2 flex w-full max-w-7xl flex-col justify-between gap-10 p-4 lg:mt-10 lg:flex-row lg:gap-28">
      {/* Step Indicator */}
      <nav className="flex min-w-full space-x-4 lg:min-w-lg">
        <div>
          <div className="my-3">
            {steps.map(s => (
              <div key={s.id}>
                {currentStep === s.id && <h1 className="my-2 text-3xl md:text-5xl">{s.title}</h1>}
                {currentStep === s.id && s.des && <p className="mt-2 text-base text-gray-600">{s.des}</p>}
                {currentStep === s.id && s.sub && <p className="mt-4 text-sm">{s.sub}</p>}
              </div>
            ))}
          </div>
          <div className="my-7 flex flex-wrap items-end gap-2 gap-y-8">
            {steps.map(step => (
              <div key={step.id} className="">
                {currentStep === step.id && (
                  <h1 className="my-2 text-sm font-semibold text-[#3F3F46]">
                    Step {step.id} of {steps.length}
                  </h1>
                )}
                <div
                  className={cn(
                    'flex h-1 w-20 items-center justify-center rounded-full border-2 text-sm font-medium sm:w-24',
                    currentStep === step.id
                      ? 'border-primary bg-primary text-white'
                      : currentStep > step.id
                        ? 'border-primary text-primary bg-sky-100'
                        : 'border-gray-200 bg-gray-100 text-gray-500'
                  )}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Form Content */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {currentStep === 1 && (
            <div className="space-y-6">
              <InputField
                name="title"
                type="text"
                label="Write a title for your job post"
                placeholder="Enter project title"
                className="bg-transparent shadow-none"
                required
                helperText="A clear title helps attract the right talent"
                errorMessage={errors.title?.message?.toString()}
              />

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Category <span className="text-destructive">*</span>
                </label>

                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={categoryOpen} className="w-full justify-between">
                      <span className="truncate">{categoryData?.label ? categoryData.label : 'Select a category'}</span>
                      <div className="flex items-center">
                        {categoryData?.value && (
                          <Button variant="ghost" size="icon" className="mr-1 h-4 w-4 hover:bg-transparent" onClick={clearCategory}>
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-[200px]">
                            {categories?.map((cat: any) => (
                              <CommandItem
                                key={cat.value}
                                value={cat.label}
                                onSelect={() => handleCategorySelect(cat.value, cat.label)}
                                className="cursor-pointer"
                              >
                                <Check className={cn('mr-2 h-4 w-4', categoryData?.value === cat.value ? 'opacity-100' : 'opacity-0')} />
                                {cat.label}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.categoryId && (
                  <p className="text-destructive text-sm font-medium">{errors.categoryId.message?.toString() || 'Category is required'}</p>
                )}
              </div>

              {/* Subcategory Selector - Only show if a category is selected */}
              {categoryData?.value && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Skills <span className="text-destructive">*</span>
                    </label>
                    <span className="text-muted-foreground text-xs">{subCategories.length} selected</span>
                  </div>

                  {/* Display selected subcategories */}
                  {subCategories.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {subCategories.map(subcategory => (
                        <Badge key={subcategory.value} variant="secondary" className="pl-2">
                          {subcategory.label}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-4 w-4 hover:bg-transparent"
                            onClick={() => removeSubcategory(subcategory.value)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Subcategory dropdown */}
                  <Popover open={subcategoryOpen} onOpenChange={setSubcategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={subcategoryOpen} className="w-full justify-between">
                        <span className="truncate">
                          {subCategories.length === 0 ? 'Select skills' : `${subCategories.length} skills selected`}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Search skills..." />
                        <CommandList>
                          <CommandEmpty>No skills found.</CommandEmpty>
                          <CommandGroup>
                            {availableSubcategories.length === 0 ? (
                              <p className="text-muted-foreground py-6 text-center text-sm">No skills available for this category.</p>
                            ) : (
                              <ScrollArea className="h-[200px]">
                                {availableSubcategories.map((subcategory: any) => (
                                  <CommandItem
                                    key={subcategory.id}
                                    value={subcategory.name}
                                    onSelect={() => handleSubcategorySelect(subcategory.id, subcategory.name)}
                                    className="cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        subCategories.some(s => s.value === subcategory.id) ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {subcategory.name}
                                  </CommandItem>
                                ))}
                              </ScrollArea>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.subCategories && (
                    <p className="text-destructive text-sm font-medium">{errors.subCategories.message?.toString()}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <InputField
                textAreaRows={8}
                name="description"
                type="textarea"
                label="Project Description"
                placeholder="Describe your project"
                required
                helperText="Provide details about your project requirements, goals, and expectations"
                errorMessage={errors.description?.message?.toString()}
              />
              <MapProvider>
                <MapComponent
                  place={watch('place') || ''}
                  lat={watch('lat') || 27.7103145}
                  lng={watch('lng') || 85.3221634}
                  getValue={value => {
                    setValue('place', value.place)
                    setValue('lat', value.lat)
                    setValue('lng', value.lng)
                    setValue('city', value.state?.city)
                    setValue('country', value.state?.country)
                  }}
                />
              </MapProvider>
              {watch('place') ? (
                <></>
              ) : (
                <p id="location-error" className="text-destructive -mt-2 text-sm font-medium">
                  <span>Location is required</span>
                </p>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Budget Requirements Information Box */}
              <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-blue-800">Budget Requirements</h4>
                    <ul className="list-disc space-y-1 pl-4 text-xs text-blue-700">
                      <li>Select either price range or fixed rate payment method</li>
                      <li>All monetary values must be greater than zero</li>
                      <li>For price ranges, maximum must be greater than minimum</li>
                      <li>Only numbers and decimal points are allowed in rate fields</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Type Selection */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Select Payment Type</Label>
                <p className="mb-2 text-sm text-gray-500">Choose how you want to pay for this project</p>

                <RadioGroup
                  defaultValue="hourly"
                  value={paymentType}
                  onValueChange={value => {
                    setValue('paymentType', value as 'hourly' | 'fixed')
                    // Clear errors when changing payment type
                    clearErrors(['minAmount', 'maxAmount', 'fixedAmount'])
                  }}
                  className="grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                  <div className="relative">
                    <div className="absolute top-4 right-4">
                      <RadioGroupItem value="hourly" id="hourly" className="h-5 w-5" />
                    </div>
                    <Label
                      htmlFor="hourly"
                      className={cn(
                        'flex h-full w-full cursor-pointer flex-col rounded-lg bg-white p-4',
                        paymentType === 'hourly' ? 'ring-primary ring-2' : 'ring-muted ring-1'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Tags />
                      </div>
                      <h2 className="py-5">Price Range </h2>
                    </Label>
                  </div>

                  <div className="relative">
                    <div className="absolute top-4 right-4">
                      <RadioGroupItem value="fixed" id="fixed" className="h-5 w-5" />
                    </div>
                    <Label
                      htmlFor="fixed"
                      className={cn(
                        'flex h-full w-full cursor-pointer flex-col rounded-lg bg-white p-4',
                        paymentType === 'fixed' ? 'ring-primary ring-2' : 'ring-muted ring-1'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10.4805 5.55027C14.676 10.1921 21.5951 0.173828 25.6892 3.80958C28.045 5.90156 27.3002 10.5206 24.242 13.53"
                            stroke="#023D54"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M20.6836 20.9759C20.7103 20.4742 20.8511 19.556 20.0881 18.8584M20.0881 18.8584C19.852 18.6424 19.5292 18.4475 19.0898 18.2927C17.5172 17.7385 15.5855 19.5935 16.952 21.2917C17.6866 22.2046 18.2528 22.4852 18.1996 23.5219C18.1621 24.251 17.4457 25.0129 16.5017 25.303C15.6817 25.5551 14.777 25.2214 14.2048 24.5819C13.5062 23.8013 13.5767 23.0654 13.5707 22.7446M20.0881 18.8584L20.9492 17.9971M14.2671 24.6793L13.4492 25.4971"
                            stroke="#023D54"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M27.4089 9.94946C28.7971 10.2161 29.1085 11.0928 29.523 13.5254C29.8963 15.7163 30.001 18.3455 30.001 19.4646C29.9629 19.8771 29.7937 20.262 29.523 20.576C26.6203 23.6181 20.8596 29.3628 17.9521 32.2166C16.8111 33.2352 15.0895 33.2573 13.8786 32.3222C11.3989 30.0917 9.01642 27.5703 6.68251 25.2936C5.74489 24.086 5.76686 22.3692 6.7885 21.2315C9.86431 18.0407 15.43 12.5789 18.5719 9.56163C18.8869 9.29171 19.2729 9.12287 19.6864 9.08496C20.3914 9.08478 21.6007 9.17954 22.7788 9.24783"
                            stroke="#023D54"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <h2 className="py-5">Fixed Rate</h2>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.paymentType && <p className="text-destructive text-sm font-medium">{errors.paymentType.message?.toString()}</p>}
              </div>

              {/* Hourly Rate Fields */}
              {paymentType === 'hourly' && (
                <div className="mt-6 space-y-4">
                  <div className="flex flex-col items-start gap-5 md:flex-row">
                    <div className="flex w-full flex-col md:w-auto">
                      <InputField
                        name="minAmount"
                        type="number"
                        label="Minimum amount"
                        placeholder="12.00"
                        className="max-w-full lg:max-w-[200px]"
                        required={paymentType === 'hourly'}
                        helperText={`Minimum amount (must be ≥ ${formatPrice(priceSetting.minPrice)})`}
                        errorMessage={errors.minAmount?.message?.toString()}
                        onChange={value => {
                          if (value && Number(value) > 0 && Number(maxAmount) > 0 && Number(value) > Number(maxAmount)) {
                            setError('maxAmount', {
                              type: 'manual',
                              message: 'Maximum rate must be greater than minimum rate'
                            })
                          }
                        }}
                      />
                    </div>

                    <div className="mt-4 flex w-full flex-col md:mt-0 md:w-auto">
                      <InputField
                        name="maxAmount"
                        type="number"
                        label="Maximum amount"
                        placeholder="25.00"
                        required={paymentType === 'hourly'}
                        className="max-w-full lg:max-w-[200px]"
                        helperText={`Maximum amount (must be > ${watch('minAmount') > 0 ? watch('minAmount') : formatPrice(priceSetting.minPrice)})`}
                        errorMessage={errors.maxAmount?.message?.toString()}
                      />
                    </div>
                  </div>

                  {/* price range  Guidelines */}
                  <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tip:</span> Set a clear price range to attract qualified freelancers. The minimum should
                      reflect the baseline skill level required, and the maximum should accommodate more experienced candidates.
                    </p>
                  </div>
                </div>
              )}

              {/* Fixed Rate Fields */}
              {paymentType === 'fixed' && (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Set a price for the project and pay at the end, or you can divide the project into milestones and pay as each milestone
                    is completed.
                  </p>
                  <div className="mt-8 space-y-2">
                    <Label className="text-base">What is the best cost estimate for your project?</Label>
                    <p className="text-muted-foreground text-sm">
                      You can negotiate this cost and create milestone when you chat with your freelancer.
                    </p>
                    <div className="flex items-start gap-2">
                      <InputField
                        name="fixedAmount"
                        type="number"
                        placeholder="Enter fixed amount"
                        className="max-w-[200px]"
                        required={paymentType === 'fixed'}
                        helperText={`Total budget (must be at least ${formatPrice(priceSetting.minPrice)})`}
                        errorMessage={errors.fixedAmount?.message?.toString()}
                      />
                      <span className="mt-2 text-[#3F3F46]">NPR</span>
                    </div>
                  </div>

                  {/* Fixed Rate Guidelines */}
                  <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tip:</span> When setting a fixed price, consider the total scope of work, complexity,
                      and estimated time to complete. This helps ensure fair compensation for the freelancer while staying within your
                      budget.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <h1 className="font-semibold">What level of experience will need?</h1>
                <p className="text-xs text-[#A1A1AA]">This won't restrict any proposals, but helps match expertise to your budget</p>
                <RadioGroup
                  defaultValue="entry"
                  value={watch('expertise')}
                  onValueChange={value => {
                    setValue('expertise', value as 'entry' | 'intermediate' | 'expert')
                  }}
                  className="mt-5 flex flex-col space-y-3"
                >
                  {expertLabels.map(level => (
                    <div key={level.value} className="flex items-start space-y-0 space-x-3">
                      <RadioGroupItem value={level.value} id={`expert-${level.value}`} className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor={`expert-${level.value}`} className="font-medium">
                          {level.label}
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {level.value === 'entry' && 'Perfect for simple tasks and getting started.'}
                          {level.value === 'intermediate' && 'Ideal for more complex projects requiring some experience.'}
                          {level.value === 'expert' && 'For specialized work requiring advanced knowledge and skills.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between">
            <Button type="button" onClick={prev} disabled={currentStep === 1}>
              Previous
            </Button>
            {currentStep < steps.length ? (
              <div className="flex items-center gap-2">
                <Link href={'/buyer'} className="cursor-pointer text-xs text-[#A1A1AA]">
                  Cancel
                </Link>
                <Button type="button" onClick={next} className="rounded-sm px-8 py-4">
                  Next
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={'/buyer'} className="cursor-pointer text-xs text-[#A1A1AA]">
                  Cancel
                </Link>
                <Button isLoading={submitLoading} disabled={submitLoading} type="submit" className="rounded-sm px-8 py-4">
                  Submit
                </Button>
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

const steps = [
  {
    id: 1,
    title: "Let's Start with strong title...",
    des: '',
    sub: 'Follow these 4 simple steps to find and hire the right talent.'
  },
  {
    id: 2,
    title: 'Provide a Brief Job Description',
    des: '',
    sub: ''
  },
  {
    id: 3,
    title: 'Set Your Budget Requirements',
    des: 'Choose either hourly or fixed rate payment',
    sub: 'All rates must be greater than zero to proceed'
  },
  {
    id: 4,
    title: 'Set the Required Experience Level',
    des: '',
    sub: ''
  }
]
