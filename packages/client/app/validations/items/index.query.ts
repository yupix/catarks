import { z } from 'zod';

import { ITEM_TYPES } from '@catarks/utils';

export const validateItemQuery = z.object({
  type: z.optional(z.enum(ITEM_TYPES)),
  skip: z.optional(z.string().transform((val) => Number(val))),
  limit: z.optional(z.string().transform((val) => Number(val)))
})

export type TItemQuery = z.infer<typeof validateItemQuery>