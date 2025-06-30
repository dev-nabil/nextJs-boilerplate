'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle, X } from 'lucide-react'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'

const serviceOptions = [
  'user',
  'banner',
  'blog',
  'category',
  'chat',
  'contract',
  'dispute',
  'faq',
  'order',
  'projects',
  'proposal',
  'review',
  'settings',
  'subscription'
]

interface AccessLevelFormProps {
  form: UseFormReturn<any>
  onSubmit: (data: any) => Promise<void>
  isSubmitting: boolean
}

export default function AccessLevelForm({ form, onSubmit, isSubmitting }: AccessLevelFormProps) {
  const [selectedService, setSelectedService] = useState<string>('')

  const { control, handleSubmit, watch, setValue } = form
  const accessLevels = watch('accessLevels') || []

  const addAccessLevel = () => {
    if (!selectedService || accessLevels.some((level: any) => level.service === selectedService)) {
      return
    }

    setValue('accessLevels', [
      ...accessLevels,
      {
        service: selectedService,
        create: false,
        read: true, // Default to read access
        update: false,
        delete: false
      }
    ])

    setSelectedService('')
  }

  const removeAccessLevel = (index: number) => {
    const newAccessLevels = [...accessLevels]
    newAccessLevels.splice(index, 1)
    setValue('accessLevels', newAccessLevels)
  }

  const availableServices = serviceOptions.filter(service => !accessLevels.some((level: any) => level.service === service))

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <FormLabel>Add Service</FormLabel>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map(service => (
                  <SelectItem key={service} value={service}>
                    {service.charAt(0).toUpperCase() + service.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={addAccessLevel} disabled={!selectedService}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        {accessLevels.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">No access levels added. Add a service to get started.</p>
        ) : (
          <div className="space-y-3">
            {accessLevels.map((level: any, index: number) => (
              <Card key={level.service}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">{level.service.charAt(0).toUpperCase() + level.service.slice(1)}</h4>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeAccessLevel(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name={`accessLevels.${index}.read`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-y-0 space-x-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Read</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`accessLevels.${index}.create`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-y-0 space-x-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Create</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`accessLevels.${index}.update`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-y-0 space-x-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Update</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`accessLevels.${index}.delete`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-y-0 space-x-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Delete</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting || accessLevels.length === 0}>
          {isSubmitting ? 'Saving...' : 'Save Access Levels'}
        </Button>
      </form>
    </Form>
  )
}
