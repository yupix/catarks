import type {FC, ReactNode} from "react"

export const SidebarBase: FC<{children: ReactNode}> = ({children}) => (
  <div className="bg-slate-50 rounded-lg p-2 shadow-md">
  {children}
  </div>
)
