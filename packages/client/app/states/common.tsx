import type { UserRoles, Users } from "@catarks/db";
import { proxy } from "valtio";

export const useSessionState = proxy<{ user: Users & {role: UserRoles} | undefined }>({
  user: undefined
})

export const useUserDevice = proxy<{useTheme: 'dark' | 'light'}>({
  useTheme: 'light'
})

export const useModalState = proxy<{ isOpenedPriceRepost: boolean }>({
  isOpenedPriceRepost: false
})
