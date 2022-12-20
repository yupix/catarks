import { proxy } from "valtio";

export const useMenuState = proxy({
  opened: false
})