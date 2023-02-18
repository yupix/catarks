import type { ComponentProps} from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type TextInputProps = {
  loading: boolean;
  classes: {
    label: string;
    input: string;
  };
  label: string;
} & ComponentProps<"input">;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ loading, children, classes, label, ...props }, ref): JSX.Element => {
    const baseInputClass =
      "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
    const baseLabelClass =
      "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
    const mergedInputClass = twMerge(baseInputClass, classes.input);
    const mergedLabelClass = twMerge(baseLabelClass, classes.label);
    return (
      <div>
        {label && (
          <label htmlFor="first_name" className={mergedLabelClass}>
            {label}
          </label>
        )}
        <input type="text" className={mergedInputClass} {...props} />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
