import type { UserRoles, UserSettings, UserShortCuts, Users } from "@catarks/db";
import { atom } from "jotai";

export const useSessionState = atom<
  | { user: Users & { role: UserRoles[]; settings: UserSettings | null; UserShortCut: UserShortCuts[] } }
  | undefined
>(undefined);

export const useModalState = atom<{ isOpenedPriceRepost: boolean }>({
  isOpenedPriceRepost: false,
});
