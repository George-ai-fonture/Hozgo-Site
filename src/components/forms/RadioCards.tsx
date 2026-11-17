import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export interface RadioCardOption<V extends string> {
  value: V;
  label: string;
  description?: string;
}

interface RadioCardsProps<V extends string> {
  id: string;
  value: V | undefined | "";
  onChange: (value: V) => void;
  options: ReadonlyArray<RadioCardOption<V>>;
  invalid?: boolean;
  className?: string;
  /** Tailwind grid columns class for wider screens. */
  columns?: string;
  disabled?: boolean;
}

export function RadioCards<V extends string>({
  id,
  value,
  onChange,
  options,
  invalid,
  className,
  columns = "sm:grid-cols-2",
  disabled,
}: RadioCardsProps<V>) {
  return (
    <RadioGroupPrimitive.Root
      id={id}
      value={value || ""}
      onValueChange={(v) => onChange(v as V)}
      aria-labelledby={`${id}-label`}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      disabled={disabled}
      className={cn("grid grid-cols-1 gap-3", columns, className)}
    >
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <RadioGroupPrimitive.Item
            key={opt.value}
            value={opt.value}
            className={cn(
              "flex min-h-[44px] w-full items-start gap-3 rounded-lg border bg-background p-4 text-left transition-colors focus-ring",
              "hover:border-foreground/40",
              checked ? "border-foreground ring-1 ring-foreground" : "border-input",
              invalid && !checked && "border-destructive",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                checked ? "border-foreground" : "border-muted-foreground",
              )}
            >
              {checked && <span className="h-2 w-2 rounded-full bg-foreground" />}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-sm font-semibold leading-snug">{opt.label}</span>
              {opt.description && <span className="text-sm text-muted-foreground">{opt.description}</span>}
            </span>
          </RadioGroupPrimitive.Item>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
}
