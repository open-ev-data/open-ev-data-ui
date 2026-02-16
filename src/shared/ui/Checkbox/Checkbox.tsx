import React, {
  forwardRef,
  type InputHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../../lib/cn";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      checked = false,
      indeterminate = false,
      onCheckedChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <label
        className={cn(styles.label, disabled && styles.disabled, className)}
      >
        <input
          ref={(inputNode) => {
            // Handle both local ref for indeterminate and forwarded ref
            inputRef.current = inputNode;
            if (typeof ref === "function") ref(inputNode);
            else if (ref)
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                inputNode;
          }}
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <div className={styles.box}>
          {indeterminate ? (
            <Minus size={14} strokeWidth={3} />
          ) : (
            checked && <Check size={14} strokeWidth={3} />
          )}
        </div>
        {label && <span>{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
