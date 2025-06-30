import { z } from 'zod'

export const notificationSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, 'Title is required').max(65, 'The title must not exceed 65 characters'),
  body: z.string().trim().min(1, 'Body is required').max(240, 'Body must not exceed 240 characters'),
  imageType: z.enum(['upload', 'url']).optional(),
  image: z.union([z.string(), z.instanceof(File)]).optional(),
  type: z.enum(['in_app', 'url']),
  actionUrl: z.string().optional(),
  createdAt: z.coerce.number().optional()
})

export type Notification = z.infer<typeof notificationSchema>
