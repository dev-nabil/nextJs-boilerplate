import { z } from 'zod'

export const settingsSchema = z.object({
  companyName: z.string(),
  siteTitle: z.string(),
  timezone: z.object({
    label: z.string(),
    value: z.coerce.number()
  }),
  allowedCountries: z.array(
    z.object({
      value: z.string(),
      label: z.string()
    })
  ),

  siteLogo: z.union([z.string(), z.instanceof(File)]).optional(),
  siteIcon: z.union([z.string(), z.instanceof(File)]).optional()
})

export type Settings = z.infer<typeof settingsSchema>
