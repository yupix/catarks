import type { FC} from "react";
import { twMerge } from "tailwind-merge";

type CardProps = {
  classes?: {
    root?: string;
    body?: string;
  };
  children?: React.ReactNode;
};

export const Card: FC<CardProps> = ({ classes,children }) => {
  const baseInputClass =
    "card bg-base-100 shadow-sm h-full";
  const baseLabelClass =
    "card-body";
  const mergedRootClass = twMerge(baseInputClass, classes?.root);
  const mergedBodyClass = twMerge(baseLabelClass, classes?.body);
  return (
    <div className={mergedRootClass}>
      <div className={mergedBodyClass}>
      {children}
      </div>
    </div>
  );
};

