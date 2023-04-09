import { twMerge } from "tailwind-merge";

export type ContainerProps = {
  classes?: {
    root?: string;
  };
  children?: React.ReactNode;
};

export function Container({ classes, children }: ContainerProps) {
  const baseContainerRootClass =
    "container h-full p-4 mx-auto";

  const mergedRootClass = twMerge(baseContainerRootClass, classes?.root);
  return <div className={mergedRootClass}>{children}</div>;
}
