import { proxy } from "valtio";

export const useSessionState = proxy<{ user: MeDto | null }>({
  user: null
})