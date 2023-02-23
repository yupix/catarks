import type { FC} from "react";
import { twMerge } from "tailwind-merge";

export type ContainerProps = {
  classes?: {
    root?: string;
  };
  children?: React.ReactNode;
};

export const Container: FC<ContainerProps> = ({ classes,children }) => {
  const baseContainerRootClass =
    "container bg-base-200 shadow-sm h-full p-4 mx-auto";

  const mergedRootClass = twMerge(baseContainerRootClass, classes?.root);
  return (
    
    <div className={mergedRootClass}>
      {children}
    </div>
  );
};

