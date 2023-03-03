import type { UserRoles, UserSettings, Users } from "@catarks/db";
import { atom } from "jotai";

export const useSessionState = atom<
  | { user: Users & { role: UserRoles[]; settings: UserSettings | null } }
  | undefined
>(undefined);

export const useModalState = atom<{ isOpenedPriceRepost: boolean }>({
  isOpenedPriceRepost: false,
});
