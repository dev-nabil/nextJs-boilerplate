import { z, ZodIssueCode } from 'zod'

// Define the form data type
export type FormData = {
  title: string
  categoryId: { value: string; label: string }
  budget: string
  subCategories: { value: string; label: string }[]
  description: string
  paymentType: 'hourly' | 'fixed'
  minAmount: number
  maxAmount: number
  fixedAmount: number
  expertise: 'entry' | 'intermediate' | 'expert'
  lat?: number
  lng?: number
  place?: string
  city?: string
  country?: string
}

// Step 1 schema
const stepOneSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' })
    .max(100, { message: 'Title cannot exceed 100 characters' })
    .refine(val => {
      if (val.length > 100) {
        throw new z.ZodError([
          {
            code: ZodIssueCode.custom,
            message: `Title cannot exceed 100 characters (currently ${val.length})`,
            path: ['title']
          }
        ])
      }
      return true
    })
    // .refine(val => /^[a-zA-Z0-9 &#\-_.:’]+$/.test(val), {
    //   message: 'Title should only contain letters, numbers, and certain special characters like & @ # - _ *'
    // })
    .refine(val => !/\s{4,}/.test(val), {
      message: 'Title should not contain multiple consecutive spaces'
    }),
  categoryId: z.object({
    value: z.string().min(1, { message: 'Category is required' }),
    label: z.string().min(1, { message: 'Category is required' })
  }),
  subCategories: z
    .array(
      z.object({
        value: z.string(),
        label: z.string()
      })
    )
    .min(1, { message: 'At least one skill is required' })
})

// Step 2 schema
const stepTwoSchema = z.object({
  description: z
    .string()
    .min(30, { message: 'Description must be at least 30 characters long' })
    .max(2000, { message: 'Description cannot exceed 2000 characters' })
    .refine(val => {
      if (val.length > 2000) {
        throw new z.ZodError([
          {
            code: ZodIssueCode.custom,
            message: `Description cannot exceed 2000 characters (currently ${val.length})`,
            path: ['description']
          }
        ])
      }
      return true
    }),
  lat: z.number().optional(),
  lng: z.number().optional(),
  Place: z.string().optional()
})
// Step 3 schema
const stepThreeSchema = z.object({
  paymentType: z.enum(['hourly', 'fixed']),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  fixedAmount: z.coerce.number().optional()
})

// Step 4 schema
const stepFourSchema = z.object({
  expertise: z.enum(['entry', 'intermediate', 'expert'])
})

// Custom refinement for step 3
stepThreeSchema.refine(
  (data: any) => {
    if (data.paymentType === 'hourly') {
      return data.minAmount > 0 && data.maxAmount > 0 && data.maxAmount >= data.minAmount
    } else if (data.paymentType === 'fixed') {
      return data.fixedAmount > 0
    }
    return false
  },
  {
    message: 'Invalid payment details. Ensure minAmount <= maxAmount for Range or fixedAmount > 0 for fixed.'
  }
)

// Export schemas for each step
export const stepSchemas = {
  1: stepOneSchema,
  2: stepTwoSchema,
  3: stepThreeSchema,
  4: stepFourSchema
}

// Complete schema for the entire form
export const formSchema = stepOneSchema.merge(stepTwoSchema).merge(stepThreeSchema).merge(stepFourSchema)
