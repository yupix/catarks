import { proxy } from "valtio";

export const useSessionState = proxy<{ user: MeDto | null }>({
  user: null
})

export const useModalState = proxy<{ isOpenedPriceRepost: boolean }>({
  isOpenedPriceRepost: false
})