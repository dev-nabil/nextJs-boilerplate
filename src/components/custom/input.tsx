'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import 'flatpickr/dist/themes/airbnb.css'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import ReactSelect from 'react-select'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import DropzoneSingle from './img-dropzone-single'
import SunEditor from './sun-editor'

const INPUT_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  RICH_TEXT: 'rich-text',
  REACT_SELECT: 'react-select',
  REACT_SELECT_MULTI: 'react-select-multi',
  IMAGE: 'image',
  CHECKBOX: 'checkbox',
  DATETIME: 'datetime',
  DATERANGE: 'daterange',
  FILE: 'file'
} as const

type InputType = (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES]

type Props = {
  name: string
  label?: string
  textAreaRows?: number
  placeholder?: string
  value?: any
  options?: { value: string; label: string }[]
  className?: string
  readOnly?: boolean
  type: InputType
  dateFormat?: string
  mode?: 'single'
  accept?: string
  calendarClass?: string
  iconClass?: string
  inputClass?: string
  customDesign?: React.ReactNode
  icon?: React.ReactNode
  defaultInputValue?: any
  helperText?: string
  showErrorMessage?: boolean
  required?: boolean
  errorMessage?: string
  dateRange?: boolean
  disabled?: boolean
  disabledDate?: any
  error?: string
  onChange?: (value: any) => void
  SingleImageUploadFunction?: any
  maxSelectionLimit?: number
}

export default function InputField(props: Props) {
  const {
    name,
    disabledDate,
    type,
    label,
    placeholder,
    options,
    className,
    readOnly,
    icon,
    iconClass,
    textAreaRows,
    calendarClass,
    inputClass,
    mode = 'single',
    accept = 'image/*',
    customDesign,
    defaultInputValue,
    helperText,
    showErrorMessage = true,
    required = false,
    dateFormat = 'PP',
    dateRange = false,
    errorMessage,
    value,
    disabled,
    onChange,
    error,
    SingleImageUploadFunction,
    maxSelectionLimit = 100
  } = props

  const {
    control,
    formState: { errors, isSubmitting },
    trigger,
    watch
  } = useFormContext()

  // Watch the field value to trigger validation when it changes
  const fieldValue = watch(name)
  const [localError, setLocalError] = useState<string | undefined>(undefined)

  // Check if there's an error for this field
  const hasError = !!errors[name] || !!localError

  // Get the error message from either the direct prop, local state, or from the form errors
  const errorMsg = errorMessage || localError || (hasError && errors[name]?.message ? String(errors[name]?.message) : undefined)

  // Validate the field when its value changes
  useEffect(() => {
    // Only validate if there's already an error (to avoid validating on initial render)
    if (errors[name] || localError) {
      // Use a timeout to avoid too many validations while typing
      const timeoutId = setTimeout(() => {
        trigger(name).then(isValid => {
          if (isValid) {
            setLocalError(undefined)
          }
        })
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [fieldValue, name, trigger, errors, localError])
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {label && (
        <Label htmlFor={name} className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return type === INPUT_TYPES.CHECKBOX ? (
            <div className="flex gap-10">
              {options?.map(({ label, value }) => (
                <div className="flex items-center gap-3" key={value}>
                  <Checkbox
                    className={cn('h-5 w-5', hasError && 'border-destructive')}
                    checked={field.value?.includes(value)}
                    onCheckedChange={checked => {
                      return checked
                        ? field.onChange([...field?.value, value])
                        : field.onChange(field.value?.filter((fieldValue: string) => fieldValue !== value))
                    }}
                    id={label}
                    value={value}
                    disabled={isSubmitting}
                  />

                  <label htmlFor={label} className="cursor-pointer text-sm">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          ) : type === INPUT_TYPES.DATETIME ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground', className)}
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, dateFormat) : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={newDate => {
                    setDate(newDate)
                    if (onChange) {
                      onChange(newDate)
                    }
                  }}
                  initialFocus
                  disabled={disabledDate}
                  defaultMonth={date}
                  fromYear={1900}
                  toYear={2100}
                  fixedWeeks
                  classNames={{
                    day_selected: 'bg-teal-500 text-primary-foreground hover:bg-teal-500 hover:text-primary-foreground',
                    day_today: date ? 'bg-gray-100 text-gray-900' : 'bg-teal-100 text-teal-900',
                    day_range_middle: 'bg-teal-100 text-teal-900',
                    day_range_end: 'bg-teal-500 text-primary-foreground',
                    day_range_start: 'bg-teal-500 text-primary-foreground'
                  }}
                />
              </PopoverContent>
            </Popover>
          ) : type === INPUT_TYPES.TEXTAREA ? (
            <Textarea
              disabled={isSubmitting}
              {...field}
              id={name}
              placeholder={placeholder}
              rows={textAreaRows || 3}
              className={cn(hasError && 'border-destructive focus-visible:ring-destructive')}
              onBlur={e => {
                field.onBlur()
                // Validate on blur
                trigger(name)
              }}
            />
          ) : type === INPUT_TYPES.RICH_TEXT ? (
            <SunEditor name={name} />
          ) : type.includes('react-select') ? (
            <ReactSelect
              className={cn(className, hasError && 'border-destructive')}
              {...field}
              defaultValue={defaultInputValue}
              options={options}
              id={name}
              isMulti={type === INPUT_TYPES.REACT_SELECT_MULTI}
              isDisabled={isSubmitting}
              styles={
                hasError
                  ? {
                      control: base => ({
                        ...base,
                        borderColor: 'var(--destructive)',
                        '&:hover': {
                          borderColor: 'var(--destructive)'
                        }
                      })
                    }
                  : undefined
              }
              onChange={val => {
                // Allow removal always, restrict adding only if under limit
                if (!val || val.length <= maxSelectionLimit) {
                  field.onChange(val)
                } else {
                  setLocalError(`You can select up to ${maxSelectionLimit} options.`)
                }

                // Trigger validation after selection
                setTimeout(() => trigger(name), 0)
              }}
              onBlur={() => {
                field.onBlur()
                // Validate on blur
                trigger(name)
              }}
            />
          ) : type === INPUT_TYPES.FILE ? (
            <>
              <div className={cn('relative h-full w-full cursor-pointer', inputClass)}>
                <input
                  type="file"
                  name={name}
                  className={cn('absolute top-0 left-0 z-20 h-full w-full cursor-pointer opacity-0')}
                  placeholder={placeholder}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null // Handle no file case
                    field.onChange(file) // Set value in react-hook-form
                    if (SingleImageUploadFunction) {
                      SingleImageUploadFunction(file) // Call external upload function if provided
                    }
                  }}
                  accept={accept}
                />
                {customDesign ? (
                  customDesign
                ) : (
                  <div className="flex h-full w-full items-center justify-between space-x-2 rounded-md border border-gray-300 bg-white px-3 text-[#18181b7e]">
                    {field.value ? field.value.name : 'Upload File'}
                    <svg width={45} height={44} viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        opacity="0.5"
                        d="M34.1133 24.5V27.8333C34.1133 28.2754 33.9377 28.6993 33.6251 29.0118C33.3126 29.3244 32.8886 29.5 32.4466 29.5H20.7799C20.3379 29.5 19.914 29.3244 19.6014 29.0118C19.2889 28.6993 19.1133 28.2754 19.1133 27.8333V24.5M30.7799 18.6667L26.6133 14.5M26.6133 14.5L22.4466 18.6667M26.6133 14.5V24.5"
                        stroke="#18181B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </>
          ) : type.includes('react-select') ? (
            <ReactSelect
              className={cn(className, hasError && 'border-destructive')}
              {...field}
              defaultValue={defaultInputValue}
              options={options}
              id={name}
              isMulti={type === INPUT_TYPES.REACT_SELECT_MULTI}
              isDisabled={isSubmitting}
              styles={
                hasError
                  ? {
                      control: base => ({
                        ...base,
                        borderColor: 'var(--destructive)',
                        '&:hover': {
                          borderColor: 'var(--destructive)'
                        }
                      })
                    }
                  : undefined
              }
              onChange={val => {
                field.onChange(val)
                // Trigger validation after selection
                setTimeout(() => trigger(name), 0)
              }}
              onBlur={() => {
                field.onBlur()
                // Validate on blur
                trigger(name)
              }}
            />
          ) : type === INPUT_TYPES.IMAGE ? (
            <DropzoneSingle name={name} />
          ) : type === INPUT_TYPES.SELECT && options ? (
            <Select
              disabled={isSubmitting}
              onValueChange={val => {
                field.onChange(val)
                // Trigger validation after selection
                setTimeout(() => trigger(name), 0)
              }}
              value={field.value || defaultInputValue}
              onOpenChange={() => {
                // Validate when dropdown closes
                setTimeout(() => trigger(name), 100)
              }}
            >
              <SelectTrigger
                className={cn(className, hasError && 'border-destructive focus-visible:ring-destructive')}
                id={name}
                disabled={isSubmitting}
              >
                <SelectValue placeholder={placeholder || 'Select an Option'} />
              </SelectTrigger>

              <SelectContent>
                {options.map((option, i) => (
                  <SelectItem key={i} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              icon={icon}
              iconClass={iconClass}
              {...field}
              className={cn(
                readOnly ? 'bg-muted cursor-not-allowed' : 'bg-background',
                hasError && 'border-destructive focus-visible:ring-destructive',
                className
              )}
              disabled={isSubmitting}
              type={type}
              id={name}
              placeholder={placeholder}
              readOnly={readOnly}
              onWheel={e => type === INPUT_TYPES.NUMBER && (e.target as HTMLInputElement)?.blur()}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${name}-error` : undefined}
              onBlur={e => {
                field.onBlur()
                // Validate on blur
                trigger(name)
              }}
              onChange={e => {
                // field.onChange(e)
                let value = e.target.value

                // Normalize number values: remove leading zeros
                if (type === 'number' || name.includes('Amount')) {
                  // Strip leading zeros, but keep "0" if input is just "0"
                  value = value.replace(/^0+(?=\d)/, '')
                }
                field.onChange(value) // Update React Hook Form field value
              }}
            />
          )
        }}
      />

      {helperText && !hasError && <p className="text-muted-foreground text-xs">{helperText}</p>}

      {showErrorMessage && errorMsg && (
        <p id={`${name}-error`} className="text-destructive text-sm font-medium">
          {errorMsg}
        </p>
      )}
    </div>
  )
}
