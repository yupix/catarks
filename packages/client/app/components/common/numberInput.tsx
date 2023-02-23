import type { ComponentProps } from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type TextInputProps = {
  loading?: boolean;
  classes?: {
    label?: string;
    input?: string;
  };
  label: string;
} & ComponentProps<"input">;

export const NumberInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ loading, children, classes, label, ...props }, ref): JSX.Element => {
    const baseInputClass = "input input-primary w-full";
    const baseLabelClass = "label";
    const mergedInputClass = twMerge(baseInputClass, classes?.input);
    const mergedLabelClass = twMerge(baseLabelClass, classes?.label);

    return (
      <div>
        {label && props.id && (
          <label htmlFor={props.id} className={mergedLabelClass}>
            <span className="label-text">{label}</span>
          </label>
        )}
        <input
          type="number"
          className={mergedInputClass}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
