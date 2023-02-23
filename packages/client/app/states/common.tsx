import type { UserRoles, UserSettings, Users } from "@catarks/db";
import { proxy } from "valtio";

export const useSessionState = proxy<{ user: Users & {role: UserRoles} | undefined, settings: UserSettings | undefined }>({
  user: undefined,
  settings: undefined
})

export const useUserDevice = proxy<{useTheme: 'dark' | 'light'}>({
  useTheme: 'light'
})

export const useModalState = proxy<{ isOpenedPriceRepost: boolean }>({
  isOpenedPriceRepost: false
})
