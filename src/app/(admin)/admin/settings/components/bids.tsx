'use client'

import InputField from '@/components/custom/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormContext } from 'react-hook-form'

export default function Bids() {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bids Settings</CardTitle>
        <CardDescription>Configure bid-related settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputField name="bidUnit" label="Bid Unit" type="text" placeholder="Enter bid unit" required />
        <InputField name="minBidAmount" label="Min Bid Amount" type="number" placeholder="Enter min bid amount" required />
        <InputField name="maxBidAmount" label="Max Bid Amount" type="number" placeholder="Enter max bid amount" required />
        <InputField name="bidDuration" label="Bid Duration" type="number" placeholder="Enter bid duration" required />
        <InputField name="bidDurationType" label="Bid Duration Type" type="text" placeholder="Enter bid duration type" required />
      </CardContent>
    </Card>
  )
}
