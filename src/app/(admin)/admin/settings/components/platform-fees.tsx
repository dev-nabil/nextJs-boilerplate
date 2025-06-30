"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import InputField from "@/components/custom/input"
import { useFormContext } from "react-hook-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function PlatformFees() {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Fees</CardTitle>
        <CardDescription>Configure platform fees and transaction settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            These fees will be applied to transactions on the platform. Enter values as percentages (e.g., "5" for 5%).
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            name="platformFee"
            label="Platform Fee (%)"
            type="text"
            placeholder="5"
            helperText="Standard fee applied to all transactions"
            required
          />
          <InputField
            name="transactionFee"
            label="Transaction Fee (%)"
            type="text"
            placeholder="2.5"
            helperText="Additional fee for payment processing"
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            name="platformFeeForTopSeller"
            label="Top Seller Fee (%)"
            type="text"
            placeholder="3"
            helperText="Reduced fee for top sellers"
            required
          />
          <InputField
            name="boostMinAmount"
            label="Minimum Boost Amount"
            type="number"
            placeholder="10"
            helperText="Minimum amount required for boosting a listing"
            required
          />
        </div>
      </CardContent>
    </Card>
  )
}
