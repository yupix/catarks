import { z } from 'zod';
import { THEMES } from '~/const';


export const validateUpdateUser = z.object({
  avatarUrl: z.optional(z.string()),
  description: z.optional(z.string()),
  nickname: z.optional(z.string()),
  // limit: z.optional(z.string().transform((val) => Number(val)))
})

export type TUpdateUser = z.infer<typeof validateUpdateUser>

export const validateUpdateUserSettings = z.object({
  useTheme: z.optional(z.enum(THEMES)),
  defaultUseTax: z.optional(z.boolean()),
})

export type TUpdateUserSettings = z.infer<typeof validateUpdateUserSettings>
