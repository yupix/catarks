import { z} from "zod"

export const validatePriceCreate = z.object({
  itemId: z.string(),
  price: z.string().transform((val) => Number(val)),
  ship: z.string().transform((val) => Number(val)),
  useTax: z.optional(z.enum(['on'])),
  qty: z.string().transform((val) => Number(val))
})

export const validatePriceDelete = z.object({
  priceId: z.string()
})