'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import InputField from '@/components/custom/input'
import { useFormContext } from 'react-hook-form'

export default function GeneralSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>Basic information about your application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <InputField name="appTitle" label="Application Title" type="text" placeholder="Enter application title" />
          <InputField name="appTagline" label="Tagline" type="text" placeholder="Enter application tagline" />
        </div>

        <InputField
          name="appDescription"
          label="Description"
          type="textarea"
          placeholder="Enter application description"
          textAreaRows={4}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <InputField name="appEmail" label="Primary Email" type="email" placeholder="Enter primary email address" />
          <InputField name="supportMail" label="Support Email" type="email" placeholder="Enter support email address" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InputField name="appPhone" label="Phone Number" type="text" placeholder="Enter phone number" />
          <InputField name="appAddress" label="Short Address" type="text" placeholder="Enter short address" />
        </div>
      </CardContent>
    </Card>
  )
}
