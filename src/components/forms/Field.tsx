import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared class for text inputs and selects: at least 44px tall, 16px text so iOS does not zoom. */
export const controlClass = "h-11 text-base md:text-base";

export const nativeSelectClass =
  "flex h-11 w-full appearance-none rounded-md border border-input bg-background bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23737373%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat px-3 pr-10 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive";

interface FieldProps {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
  /** Render the label as a legend-style heading for groups (radio cards, steppers). */
  as?: "label" | "group";
  children: ReactNode;
}

export function errorId(id: string) {
  return `${id}-error`;
}
export function hintId(id: string) {
  return `${id}-hint`;
}

/** Label, control, optional hint and inline error. The label is always visible. */
export function Field({ id, label, hint, error, optional, className, as = "label", children }: FieldProps) {
  const labelNode = (
    <>
      {label}
      {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
    </>
  );
  return (
    <div className={cn("space-y-2", className)} data-field={id}>
      {as === "label" ? (
        <label htmlFor={id} className="block text-sm font-medium">
          {labelNode}
        </label>
      ) : (
        <p id={`${id}-label`} className="text-sm font-medium">
          {labelNode}
        </p>
      )}
      {hint && (
        <p id={hintId(id)} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={errorId(id)} role="alert" className="text-sm font-medium text-destructive" data-error>
          {error}
        </p>
      )}
    </div>
  );
}

/** aria props for a control inside a Field. */
export function describedBy(id: string, opts: { error?: string; hint?: boolean }) {
  const ids = [opts.hint ? hintId(id) : null, opts.error ? errorId(id) : null].filter(Boolean);
  return {
    "aria-invalid": opts.error ? true : undefined,
    "aria-describedby": ids.length ? ids.join(" ") : undefined,
  } as const;
}
