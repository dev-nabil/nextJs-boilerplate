'use client'

import InputField from '@/components/custom/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BadgeCheck } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export default function TopSellerConditions() {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Seller Conditions</CardTitle>
        <CardDescription>Set requirements for users to qualify as top sellers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <BadgeCheck className="h-4 w-4" />
          <AlertDescription>Users who meet these conditions will qualify for top seller status and reduced platform fees.</AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            name="topSellerCondition.days"
            label="Within Days"
            type="number"
            placeholder="30"
            helperText="Minimum number of days a seller must be active"
            required
          />
          <InputField
            name="topSellerCondition.earnedAmount"
            label="Minimum Earnings"
            type="number"
            placeholder="1000"
            helperText="Minimum amount earned on the platform"
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            name="topSellerCondition.totalProjectComplete"
            label="Completed Projects"
            type="number"
            placeholder="10"
            helperText="Minimum number of completed projects"
            required
          />
          <InputField
            name="topSellerCondition.reviewThreshold"
            label="Review Threshold"
            type="number"
            placeholder="4"
            helperText="Minimum average review rating (out of 5)"
            required
          />
        </div>
      </CardContent>
    </Card>
  )
}
