import { z } from 'zod';


export const validateUpdateUser = z.object({
  avatarUrl: z.optional(z.string()),
  description: z.optional(z.string()),
  // limit: z.optional(z.string().transform((val) => Number(val)))
})

export type TUpdateUser = z.infer<typeof validateUpdateUser>