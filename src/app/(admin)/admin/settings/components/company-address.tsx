"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import InputField from "@/components/custom/input"
import { useFormContext } from "react-hook-form"

export default function CompanyAddress() {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Address</CardTitle>
        <CardDescription>Your company's official address information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputField
          name="address.addressLine1"
          label="Address Line 1"
          type="text"
          placeholder="Street address, P.O. box, company name"
          required
        />

        <InputField
          name="address.addressLine2"
          label="Address Line 2"
          type="text"
          placeholder="Apartment, suite, unit, building, floor, etc."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <InputField name="address.city" label="City" type="text" placeholder="City" required />
          <InputField name="address.country" label="Country" type="text" placeholder="Country" required />
          <InputField name="address.postal" label="Postal Code" type="number" placeholder="Postal code" />
        </div>
      </CardContent>
    </Card>
  )
}
