import { z } from 'zod';

import { ITEM_TYPES } from '@catarks/utils';

export const validateSearchItemQuery = z.object({
  category: z.enum(ITEM_TYPES),
  skip: z.string().default("0").transform((val) => Number(val)),
  limit: z.string().default("20").transform((val) => Number(val)),
  q: z.optional(z.string()),
  include_price_average: z.optional(z.boolean())
})

export type SearchItemQuery = z.infer<typeof validateSearchItemQuery>