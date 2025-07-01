import { z } from "zod";

export const faqFormSchema = z.object({
  question: z.string().optional(),
  answer: z.string().optional(),
});

export type TFaqFormValues = z.infer<typeof faqFormSchema>;
