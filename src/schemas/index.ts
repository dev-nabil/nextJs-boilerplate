import * as z from 'zod'

/* ---------------------------------
   Common Schemas and Utilities
--------------------------------- */
const MAX_TITLE_LENGTH = 600
const MAX_DESCRIPTION_LENGTH = 600
const MAX_SELECTED_CATEGORIES = 10
const MAX_SELECTED_TOOLS = 10

const optionSchema = z.object({
  value: z.string(),
  label: z.string()
})

export type MultiSelectOption = z.infer<typeof optionSchema>

// =======buyer and seller profile image schema==========
export const profileImageSchema = z.object({
  image: z.instanceof(File).refine(file => file instanceof File, { message: 'Image is required' })
})
export type ProfileImageSchema = z.infer<typeof profileImageSchema>

/* ---------------------------------
   Auth Schemas
--------------------------------- */
export const userAuthSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(8, { message: 'Enter at least 8 characters' })
})
export type TUserLogin = z.infer<typeof userAuthSchema>

export const userSignUpSchema = userAuthSchema.extend({
  name: z.string().min(1, { message: 'Enter your name' })
})
export type TUserSignUp = z.infer<typeof userSignUpSchema>

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, { message: 'Please enter your old password' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string().optional()
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'New password and confirm password must match',
    path: ['confirmPassword']
  })
export type PasswordChangeFormData = z.infer<typeof changePasswordSchema>

/* ---------------------------------
   Project and Category Schemas
--------------------------------- */
export const projectCreateSchema = z
  .object({
    title: z.string().min(1, { message: 'Title is required' }),
    dateRange: z.object({
      from: z.date(),
      to: z.date()
    }),
    description: z
      .string()
      .max(MAX_DESCRIPTION_LENGTH, { message: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters` })
      .optional(),
    serviceType: z.enum(['photography', 'videography', 'editing', 'all', 'both'], {
      message: 'Select a valid service type'
    }),
    amount: z.coerce.number().positive({ message: 'Amount must be a valid number' }),
    boosted: z.boolean().optional(),
    boostAmount: z.coerce.number().min(0, { message: 'Boost amount must be a valid number' }).default(0.0),
    city: z.string().min(1, { message: 'City is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
    status: z.enum(['draft', 'published', 'ongoing', 'completed'], { message: 'Select a valid status' }).default('draft')
  })
  .passthrough()
export type TProjectCreate = z.infer<typeof projectCreateSchema>

export const singlePackageSchema = z.object({
  type: z.string(),
  rate: z.coerce
    .number({
      required_error: 'Rate is required'
    })
    .refine(value => !isNaN(Number(value)) && Number(value) >= 0, {
      message: 'Rate must be a number greater than or equal to 0'
    }),
  numberOfPhotographers: z.coerce
    .number({
      required_error: 'Number of photographers is required'
    })
    .refine(value => !isNaN(Number(value)) && Number(value) >= 1, {
      message: 'Number of photographers must be greater than or equal to 1'
    }),
  numberOfImages: z
    .string()
    .optional()
    .refine(value => value === 'unlimited' || (!isNaN(Number(value)) && Number(value) >= 500), {
      message: "Number of images must be a number greater than or equal to 500 or 'unlimited'"
    }),
  hoursOfWork: z.coerce
    .number({
      required_error: 'Hours of work is required'
    })
    .refine(value => !isNaN(Number(value)) && Number(value) >= 1, {
      message: 'Hours of work must be greater than or equal to 1'
    }),
  deliveryTime: z.coerce
    .number({
      required_error: 'Delivery time is required'
    })
    .refine(value => !isNaN(Number(value)) && Number(value) >= 1, {
      message: 'Delivery time must be greater than or equal to 1'
    }),
  captureAmountUnlimited: z.boolean().optional()
})

export const packageSchema = z.object({
  gigs: z.array(singlePackageSchema)
})

export type TPackageCreate = z.infer<typeof singlePackageSchema>

export const projectFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Project title is required' })
    .max(MAX_TITLE_LENGTH, { message: `Title cannot exceed ${MAX_TITLE_LENGTH} characters` }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(MAX_DESCRIPTION_LENGTH, { message: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters` }),
  category: z.string().min(1, { message: 'Category is required' }),
  subCategories: z
    .array(optionSchema)
    .min(1, { message: 'At least one category is required' })
    .max(MAX_SELECTED_CATEGORIES, { message: `You can select up to ${MAX_SELECTED_CATEGORIES} categories` }),
  tools: z
    .array(optionSchema)
    .min(1, { message: 'At least one tool is required' })
    .max(MAX_SELECTED_TOOLS, { message: `You can select up to ${MAX_SELECTED_TOOLS} tools` }),
  completedDate: z.date({ message: 'Project completion date is required' })
})

export type TShareProjectSchema = z.infer<typeof projectFormSchema>

/* ---------------------------------
   Category Schema
--------------------------------- */
export const categoryFormSchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }).max(15, { message: 'Category name must be less than 15 characters' }),
  // parentCategoryId: z
  //   .string()
  //   .uuid({ message: 'Parent Category ID must be a valid UUID' })
  //   .optional()
  //   .or(z.literal(''))
  //   .or(z.literal('none'))
  //   .transform(val => val || undefined),

  featured: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  subCategories: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, { message: 'Subcategory name is required' })
          .max(15, { message: 'Sub Category name must be less than 15 characters' }),
        featured: z.boolean().optional().default(false),
        visible: z.boolean().optional().default(true)
      })
    )
    .optional()
    .default([])
})

export type TCategorySchema = z.infer<typeof categoryFormSchema>

export const categoriesSchema = z.object({
  selectedCategories: z
    .array(optionSchema)
    .min(1, { message: 'Select at least one category' })
    .max(MAX_SELECTED_CATEGORIES, { message: 'You can select up to 10 categories only' })
})
export type CategoriesTypes = z.infer<typeof categoriesSchema>

/* ---------------------------------
   Milestones and Proposal Schemas
--------------------------------- */

export const submitProposalSchema = z
  .object({
    paymentType: z.enum(['milestone', 'project']),
    rows: z
      .array(
        z.object({
          title: z.string().optional(),
          date: z.preprocess(arg => {
            if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
            return arg
          }, z.date()),
          milestone: z.coerce.number().min(1, 'Minimum value is 1').max(1000000, 'Maximum value is 1000000')
        })
      )
      .optional(),
    bidAmount: z.coerce.number().min(1, 'Minimum value is 1').max(1000000, 'Maximum value is 1000000').optional(),
    // hourlyRate: z.coerce.number().min(1, 'Range rate cannot be less than 1').optional(),
    message: z.string().min(10, 'Message must be at least 10 characters long')
  })
  .superRefine((data, ctx) => {
    if (data.paymentType === 'milestone') {
      if (!data.rows || data.rows.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one milestone is required for milestone-based payment',
          path: ['rows']
        })
      } else {
        if (data.paymentType === 'milestone') {
          data.rows.forEach((row, index) => {
            if (!row.title) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Milestone title is required',
                path: ['rows', index, 'title']
              })
            }
            if (!row.date) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Milestone date is required',
                path: ['rows', index, 'date']
              })
            }

            if (!row.milestone || row.milestone < 1 || row.milestone > 1000000) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Milestone amount must be between 1000 and 1000000',
                path: ['rows', index, 'milestone']
              })
            }
          })
        }
      }
    } else if (data.paymentType === 'project') {
      if (!data.bidAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bid amount is required',
          path: ['bidAmount']
        })
      }
    }
  })

/* ---------------------------------
   Profile Schemas
--------------------------------- */

export type ProfileFormTypes = z.infer<typeof profileSchema>

export const addressSchema = z.object({
  addressLine1: z.string().min(1, { message: 'Address Line 1 is required' }),
  addressLine2: z.string().optional(),
  city: z.string().min(1, { message: 'City is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  postal: z.coerce.number().optional().nullable()
})
export type AddressFormTypes = z.infer<typeof addressSchema>

export const experienceSchema = z.object({
  experiences: z.array(
    z.object({
      name: z.string().min(1, { message: 'Company name is required' }),
      position: z.string().min(1, { message: 'Position is required' }),
      city: z.string().min(1, { message: 'City is required' }),
      yearsOfExperience: z.coerce.number().positive({ message: 'Must be a valid number' }),
      website: z.string().url().optional()
    })
  )
})

export type ExperienceTypes = z.infer<typeof experienceSchema>

// ====================settings Validation Schema===================
export const profileVerificationSchema = z.object({
  nid: z.string().min(1, { message: 'NID is required' }),
  nidFront: z.union([
    z.instanceof(File).refine(file => file.size > 0, { message: 'Invalid file' }),
    z.string().url({ message: 'Nid Front Side must be a valid URL' })
  ]),
  nidBack: z.union([
    z.instanceof(File).refine(file => file.size > 0, { message: 'Invalid file' }),
    z.string().url({ message: 'Nid Back Side must be a valid URL' })
  ])
  // socialMediaLinks: z.array(
  //   z.object({
  //     link: z.string().url().optional()
  //   })
  // )
})

export type ProfileVerificationTypes = z.infer<typeof profileVerificationSchema>

export const BlogFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long' }),
  published: z.any({ message: 'Status is required' }),
  image: z.union([
    z.instanceof(File).refine(file => file.size > 0, { message: 'Invalid file' }),
    z.string().url({ message: 'Nid Back Side must be a valid URL' })
  ])
})

export type BlogFormTypes = z.infer<typeof BlogFormSchema>

export const SubscriptionFormSchema = z.object({
  price: z.coerce.number().positive('Price must be a positive number').min(0, 'Price cannot be negative'),
  salePrice: z.coerce.number().positive('Sale price must be a positive number').min(0, 'Sale price cannot be negative'),
  discount: z.coerce.number().int().min(0, 'Discount cannot be less than 0').max(100, 'Discount cannot be greater than 100'),
  currency: z.enum(['USD', 'EUR', 'GBP'], { errorMap: () => ({ message: 'Invalid currency' }) }), // Add more currencies if necessary
  features: z.array(z.string().min(1, 'Feature must be at least 1 character')).nonempty('Features cannot be empty'),
  bidPoints: z.coerce.number().int().positive('Bid Points must be a positive number').min(0, 'Bid Points cannot be negative'),
  duration: z.coerce.number().int().positive('Duration must be a positive number').min(1, 'Duration cannot be less than 1'),
  durationType: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'offer'], {
    errorMap: () => ({ message: 'Invalid duration type' })
  }) // Assuming only "yearly" or "monthly"
})

export type SubscriptionFormTypes = z.infer<typeof SubscriptionFormSchema>
/* ---------------------------------
   Miscellaneous Schemas
--------------------------------- */

const fileOrUrl = z.union([
  z.string().url({ message: 'Image must be a valid URL' }),
  z.instanceof(File, { message: 'Image must be a valid file' })
])

export const certificateSchema = z.object({
  certification: z.array(
    z.object({
      title: z.string().nonempty('Title is required').min(3, 'Title must be at least 3 characters long'),
      achievedDate: z.string().nonempty('date is required'),
      image: fileOrUrl
    })
  )
})
export const profileSchema = z.object({
  firstname: z.string().min(3, { message: 'Product Name must be at least 3 characters' }),
  lastname: z.string().min(3, { message: 'Product Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Product Name must be at least 3 characters' }),
  contactno: z.coerce.number(),
  country: z.string().min(1, { message: 'Please select a category' }),
  city: z.string().min(1, { message: 'Please select a category' }),
  // jobs array is for the dynamic fields
  jobs: z.array(
    z.object({
      jobcountry: z.string().min(1, { message: 'Please select a category' }),
      jobcity: z.string().min(1, { message: 'Please select a category' }),
      jobtitle: z.string().min(3, { message: 'Product Name must be at least 3 characters' }),
      employer: z.string().min(3, { message: 'Product Name must be at least 3 characters' }),
      startdate: z.string().refine(value => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: 'Start date should be in the format YYYY-MM-DD'
      }),
      enddate: z.string().refine(value => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: 'End date should be in the format YYYY-MM-DD'
      })
    })
  )
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const userInformationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  country: z.string({
    required_error: 'Please select a country'
  }),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postal: z.string().min(1, 'ZIP/Postal code is required')
})

export type UserInformationValues = z.infer<typeof userInformationSchema>

// Define validation schema with zod
export const projectSchema = z.object({
  title: z
    .string()
    .min(10, { message: 'Title Min 10 characters' })
    .max(100, { message: 'Title cannot exceed 100 characters' })
    .refine(val => /^[a-zA-Z0-9:. &’-\s]*$/.test(val), {
      message: 'Title should only contain letters and single spaces'
    })
    .refine(val => !/\s{3,}/.test(val), {
      message: 'Name should not contain multiple consecutive spaces.'
    }),
  description: z
    .string()
    .max(600, { message: 'Description cannot exceed 600 characters' })
    .refine(val => /^[a-zA-Z0-9 &@#\-_*,.:’()\n\r]+$/.test(val), {
      message: 'Description should only contain letters and single spaces'
    })
    .refine(val => !/\s{3,}/.test(val), {
      message: 'Name should not contain multiple consecutive spaces.'
    }),
  categories: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, { message: 'Please select at least one category' })
    .max(10, { message: 'You can select up to 10 categories only' })
})
// Infer the type from the schema
export type ProjectFormValues = z.infer<typeof projectSchema> & {
  cover?: string // Add the cover property
  images?: string[]
  video?: string
  file?: string
  text?: string
  link?: string
}

export const bannerFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  cta: z.string().optional(),
  ctaText: z.string().optional(),
  lottie: z.string().optional(),
  cover: z.any().refine(value => {
    // If it's an update and we already have a cover, it's optional
    if (typeof value === 'string' && value) return true
    // For new banners, require a file
    return value instanceof File || value === null || value === undefined
  }, 'Cover image is required'),
  sideImage: z.any().optional()
})

export type BannerFormValues = z.infer<typeof bannerFormSchema>

export const blogFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  image: z.any().refine(value => {
    // If it's an update and we already have a image, it's optional
    if (typeof value === 'string' && value) return true
    // For new banners, require a file
    return value instanceof File || value === null || value === undefined
  }, 'Cover image is required')
})

export type BlogFormValues = z.infer<typeof blogFormSchema>

export const contactSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email' }),
  firstName: z.string().min(1, { message: 'First name is required' }).max(255, { message: 'First name cannot exceed 255 characters' }),
  lastName: z.string().min(1, { message: 'Last name is required' }).max(255, { message: 'Last name cannot exceed 255 characters' }),
  message: z.string().min(1, { message: 'Message is required' }),
  reply: z.string().optional(),
  status: z.enum(['pending', 'resolved'], { message: "Status must be either 'pending' or 'resolved'" }).default('pending')
})

export const replySchema = z.object({
  reply: z.string().min(1, { message: 'Reply is required' })
})

export type ContactFormValues = z.infer<typeof contactSchema>
export type ReplyFormValues = z.infer<typeof replySchema>

export const categoriesCreateJobSchema = z.object({
  categoryId: z.object({
    label: z.string(),
    value: z.string()
  }),
  subCategories: z
    .array(
      z.object({
        label: z.string(),
        value: z.string()
      })
    )
    .min(1, 'Select at least one sub-category')
})
export type CategoriesFormValues = z.infer<typeof categoriesCreateJobSchema>

export const faqFormSchema = z.object({
  question: z.string().optional(),
  answer: z.string().optional()
})

export type TFaqFormValues = z.infer<typeof faqFormSchema>
