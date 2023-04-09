import { twMerge } from "tailwind-merge";

export type CardProps = {
  classes?: {
    root?: string;
    body?: string;
  };
  children?: React.ReactNode;
};

export function Card({ classes,children }: CardProps) {
  const baseCardRootClass = "card bg-base-200 shadow-md h-full rounded-md";
  const baseCardBodyClass = "card-body";
  const mergedRootClass = twMerge(baseCardRootClass, classes?.root);
  const mergedBodyClass = twMerge(baseCardBodyClass, classes?.body);
  return (
    <div className={mergedRootClass}>
      <div className={mergedBodyClass}>
      {children}
      </div>
    </div>
  );
};

