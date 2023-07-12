import { z } from "zod";
import { THEMES } from "~/const";

export const validateUpdateUserTheme = z.object({
    useTheme: z.enum(THEMES)
})

export type TUpdateUserTheme = z.infer<typeof validateUpdateUserTheme>