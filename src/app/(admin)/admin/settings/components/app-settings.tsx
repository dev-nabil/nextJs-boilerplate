"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import InputField from "@/components/custom/input"
import { useFormContext } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Apple, SmartphoneIcon as Android, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AppSettings() {
  const { watch, setValue } = useFormContext()
  const maintenanceMode = watch("maintenanceMode")
  const appInReview = watch("appInReview")

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Configuration</CardTitle>
        <CardDescription>Configure mobile app settings and system status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="maintenance-mode" className="flex flex-col space-y-1">
              <span>Maintenance Mode</span>
              <span className="font-normal text-muted-foreground text-sm">
                When enabled, users will see a maintenance message
              </span>
            </Label>
            <Switch
              id="maintenance-mode"
              checked={maintenanceMode}
              onCheckedChange={(checked) => setValue("maintenanceMode", checked)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="app-in-review" className="flex flex-col space-y-1">
              <span>App In Review</span>
              <span className="font-normal text-muted-foreground text-sm">
                When enabled, app store review mode is activated
              </span>
            </Label>
            <Switch
              id="app-in-review"
              checked={appInReview}
              onCheckedChange={(checked) => setValue("appInReview", checked)}
            />
          </div>
        </div>


        {maintenanceMode && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Maintenance mode is currently active. The application will be inaccessible to users.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            name="iosDownloadUrl"
            label="iOS App Download URL"
            type="text"
            placeholder="https://apps.apple.com/app/id123456789"
            icon={<Apple className="h-4 w-4" />}
          />
          <InputField
            name="androidDownloadUrl"
            label="Android App Download URL"
            type="text"
            placeholder="https://play.google.com/store/apps/details?id=com.example"
            icon={<Android className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InputField name="iosFirebaseTopic" label="iOS Firebase Topic" type="text" placeholder="ios_notifications" />
          <InputField
            name="androidFirebaseTopic"
            label="Android Firebase Topic"
            type="text"
            placeholder="android_notifications"
          />
        </div>

        <InputField
          name="versionControl"
          label="Version Control"
          type="text"
          placeholder="1.0.0"
          helperText="Current app version (format: x.y.z)"
        />

        <InputField
          name="allowedCountries"
          label="Allowed Countries"
          type="react-select-multi"
          placeholder="Select countries"
          options={[
            { value: "US", label: "United States" },
            { value: "CA", label: "Canada" },
            { value: "UK", label: "United Kingdom" },
            { value: "AU", label: "Australia" },
            { value: "DE", label: "Germany" },
            { value: "FR", label: "France" },
            { value: "JP", label: "Japan" },
            { value: "IN", label: "India" },
            { value: "BR", label: "Brazil" },
            { value: "ZA", label: "South Africa" },
          ]}
          helperText="Select countries where the app is available"
        />
      </CardContent>
    </Card>
  )
}
