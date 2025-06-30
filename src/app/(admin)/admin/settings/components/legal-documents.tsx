"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import InputField from "@/components/custom/input"
import { useFormContext } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LegalDocuments() {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal Documents</CardTitle>
        <CardDescription>Manage your legal documents and policies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="about">About Us</TabsTrigger>
            <TabsTrigger value="refundPolicy">Refund Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="space-y-4 pt-4">
            <InputField
              name="termsAndConditionsUrl"
              label="Terms & Conditions URL"
              type="text"
              placeholder="https://example.com/terms"
              helperText="External link to your terms and conditions page"
            />

            <InputField
              name="termsAndConditions"
              label="Terms & Conditions Content"
              type="rich-text"
              textAreaRows={10}
              placeholder="Enter your terms and conditions here..."
            />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 pt-4">
            <InputField
              name="privacyPolicyUrl"
              label="Privacy Policy URL"
              type="text"
              placeholder="https://example.com/privacy"
              helperText="External link to your privacy policy page"
            />

            <InputField
              name="privacyPolicy"
              label="Privacy Policy Content"
              type="rich-text"
              textAreaRows={10}
              placeholder="Enter your privacy policy here..."
            />
          </TabsContent>

          <TabsContent value="about" className="space-y-4 pt-4">
            <InputField
              name="aboutUsUrl"
              label="About Us URL"
              type="text"
              placeholder="https://example.com/about"
              helperText="External link to your about us page"
            />

            <InputField
              name="aboutUs"
              label="About Us Content"
              type="rich-text"
              textAreaRows={10}
              placeholder="Enter your about us content here..."
            />
          </TabsContent>
          <TabsContent value="refundPolicy" className="space-y-4 pt-4">
            <InputField
              name="refundPolicyUrl"
              label="Refund Policy URL"
              type="text"
              placeholder="https://example.com/refund"
              helperText="External link to your refund page"
            />

            <InputField
              name="refundPolicy"
              label="Refund Policy Content"
              type="rich-text"
              textAreaRows={10}
              placeholder="Enter your about us content here..."
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
