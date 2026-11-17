import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckRowProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  error?: string;
  className?: string;
  disabled?: boolean;
}

/** A checkbox with a large tap target and its label beside it. */
export function CheckRow({ id, checked, onChange, children, error, className, disabled }: CheckRowProps) {
  return (
    <div className={cn("space-y-2", className)} data-field={id}>
      <div className="flex min-h-[44px] items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(v) => onChange(v === true)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 h-5 w-5"
        />
        <label htmlFor={id} className="text-sm leading-relaxed">
          {children}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-destructive" data-error>
          {error}
        </p>
      )}
    </div>
  );
}

interface ConsentCheckboxProps extends Omit<CheckRowProps, "children"> {
  text: string;
}

/** Consent line ending in a link to /privacy. */
export function ConsentCheckbox({ text, ...rest }: ConsentCheckboxProps) {
  return (
    <CheckRow {...rest}>
      {text}{" "}
      <Link to="/privacy" className="font-medium underline underline-offset-4" target="_blank" rel="noopener">
        Privacy
      </Link>
    </CheckRow>
  );
}
