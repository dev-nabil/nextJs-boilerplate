'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { ErrorMessage } from '@hookform/error-message'
import * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface CheckboxInputProps {
  name: string
  label: string
  className?: string
  checkBoxClass?: string
  id?: string
  disabled?: boolean
  [key: string]: any
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  name,
  label,
  className,
  id = name,
  checkBoxClass,
  disabled = false,
  ...rest
}) => {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Checkbox
              id={id}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={checkBoxClass}
              {...rest}
            />
            <label
              htmlFor={id}
              className="cursor-pointer text-xs leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          </>
        )}
      />
      <ErrorMessage errors={errors} name={name} render={({ message }) => <p className="text-sm text-red-500">{message}</p>} />
    </div>
  )
}
