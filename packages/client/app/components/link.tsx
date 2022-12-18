import type { RemixLinkProps } from "@remix-run/react/dist/components";
import type { FC, ReactNode } from "react";
import { Link } from "@remix-run/react";

export const VentLink: FC<{ children?: ReactNode, options: RemixLinkProps & React.RefAttributes<HTMLAnchorElement> & { disabled: boolean } }> = ({ children, options }) => {
  return (
    <>
      {options.disabled ? children : <Link {...options}>{children}</Link>}
    </>
  )
}