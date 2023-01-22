import { Users } from "@catarks/db";
import { proxy } from "valtio";

export const useSessionState = proxy<{ user: Users | null }>({
  user: null
})

export const useModalState = proxy<{ isOpenedPriceRepost: boolean }>({
  isOpenedPriceRepost: false
})