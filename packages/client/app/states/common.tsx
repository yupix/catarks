import type { UserRoles, UserSettings, Users } from "@catarks/db";
import { proxy } from "valtio";
import { atom } from "jotai"

export const useSessionState = atom<{ user: Users & {role: UserRoles, settings: UserSettings | null} } | undefined>(undefined)

export const useUserDevice = proxy<{useTheme: 'dark' | 'light'}>({
  useTheme: 'light'
})

export const useModalState = proxy<{ isOpenedPriceRepost: boolean }>({
  isOpenedPriceRepost: false
})
