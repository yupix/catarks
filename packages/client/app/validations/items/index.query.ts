import { z } from 'zod';

import { ITEM_TYPES } from '@catarks/utils';

export const validateItemQuery = z.object({
  type: z.optional(z.enum(ITEM_TYPES)),
  skip: z.optional(z.string().transform((val) => Number(val))),
  limit: z.optional(z.string().transform((val) => Number(val)))
})

export type TItemQuery = z.infer<typeof validateItemQuery>

export const validateItemRankingQuery = z.object({
  type: z.optional(z.enum(ITEM_TYPES)),
  ship: z.optional(z.string().transform((val) => Number(val))),
  sort: z.optional(z.enum(['asc', 'desc'])).default('desc')
})

export type TItemRankingQuery = z.infer<typeof validateItemRankingQuery>
