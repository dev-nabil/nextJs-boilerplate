"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormContext } from "react-hook-form"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface LogoSettingsProps {
  setAppLogo: (file: File | null) => void
}

export default function LogoSettings({ setAppLogo }: LogoSettingsProps) {
  const { watch, setValue } = useFormContext()
  const currentLogo = watch("appLogo")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (currentLogo && typeof currentLogo === "string") {
      setPreviewUrl(currentLogo)
    }
  }, [currentLogo])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
      setAppLogo(file)
    }
  }

  const handleRemoveLogo = () => {
    setPreviewUrl(null)
    setValue("appLogo", null)
    setAppLogo(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo & Branding</CardTitle>
        <CardDescription>Upload your application logo and branding assets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="app-logo">Application Logo</Label>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {previewUrl ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                <Image src={previewUrl || "/placeholder.svg"} alt="App Logo" fill className="object-contain" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={handleRemoveLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-dashed">
                <span className="text-muted-foreground text-sm">No logo</span>
              </div>
            )}

            <div className="flex-1">
              <Label
                htmlFor="app-logo-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center hover:bg-muted/50"
              >
                <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                <span className="font-medium">Click to upload</span>
                <span className="text-muted-foreground text-xs">SVG, PNG, JPG (max. 2MB)</span>
                <input
                  id="app-logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
              <p className="mt-2 text-muted-foreground text-xs">
                Recommended size: 512x512 pixels. This logo will be used throughout the application.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
