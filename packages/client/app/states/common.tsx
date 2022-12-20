import { proxy } from "valtio";

export const useSessionState = proxy<{ user: TUserSession | null }>({
  user: null
})