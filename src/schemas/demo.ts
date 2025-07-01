import * as z from "zod";

export const projectCreateSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    dateRange: z.object({
      from: z.date(),
      to: z.date(),
    }),

    serviceType: z.enum(
      ["photography", "videography", "editing", "all", "both"],
      {
        message: "Select a valid service type",
      }
    ),
    amount: z.coerce
      .number()
      .positive({ message: "Amount must be a valid number" }),
    boosted: z.boolean().optional(),
    boostAmount: z.coerce
      .number()
      .min(0, { message: "Boost amount must be a valid number" })
      .default(0.0),
    city: z.string().min(1, { message: "City is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    status: z
      .enum(["draft", "published", "ongoing", "completed"], {
        message: "Select a valid status",
      })
      .default("draft"),
  })
  .passthrough();
export type TProjectCreate = z.infer<typeof projectCreateSchema>;
