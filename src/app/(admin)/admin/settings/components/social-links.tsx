"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import InputField from "@/components/custom/input"
import { useFormContext } from "react-hook-form"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function SocialLinks() {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>Connect your social media accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputField
          name="instagramUrl"
          label="Instagram"
          type="text"
          placeholder="https://instagram.com/youraccount"
          icon={<Instagram className="h-4 w-4" />}
        />

        <InputField
          name="linkedinUrl"
          label="LinkedIn"
          type="text"
          placeholder="https://linkedin.com/company/yourcompany"
          icon={<Linkedin className="h-4 w-4" />}
        />

        <InputField
          name="facebookUrl"
          label="Facebook"
          type="text"
          placeholder="https://facebook.com/yourpage"
          icon={<Facebook className="h-4 w-4" />}
        />

        <InputField
          name="twitterUrl"
          label="Twitter"
          type="text"
          placeholder="https://twitter.com/youraccount"
          icon={<Twitter className="h-4 w-4" />}
        />
      </CardContent>
    </Card>
  )
}
