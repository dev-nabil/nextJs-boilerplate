'use client';

import { format } from 'date-fns';
import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

interface DatePickerWithRangeProps {
  name: string;
  label?: string;
  className?: string;
}

export const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({ name, label, className }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cn('grid gap-2', className)}>
      {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}

      <Controller
        name={name}
        control={control}
        defaultValue={{ from: null, to: null }}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <div
                id={name}
                className={cn(
                  'w-full flex justify-start items-center text-left font-normal border border-gray-300 rounded-lg p-3 py-2 cursor-pointer',
                  !field.value?.from && !field.value?.to && 'text-muted-foreground',
                  errors[name] && 'border-red-500',
                )}
              >
                {field.value?.from ? (
                  field.value?.to ? (
                    <>
                      {format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(field.value.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
                <div className="flex items-center ml-auto h-4 w-4 shrink-0 opacity-50">
                  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.3333 1.66797V5.0013M6.66667 1.66797V5.0013M2.5 8.33464H17.5M4.16667 3.33464H15.8333C16.7538 3.33464 17.5 4.08083 17.5 5.0013V16.668C17.5 17.5884 16.7538 18.3346 15.8333 18.3346H4.16667C3.24619 18.3346 2.5 17.5884 2.5 16.668V5.0013C2.5 4.08083 3.24619 3.33464 4.16667 3.33464Z"
                      stroke="#A1A1AA"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar mode="range" selected={field.value} onSelect={field.onChange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
        )}
      />

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="text-sm text-red-500">{message}</p>}
      />
    </div>
  );
};
