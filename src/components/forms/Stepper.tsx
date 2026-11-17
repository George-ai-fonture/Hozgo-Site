import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: [singular: string, plural: string];
  className?: string;
}

export function Stepper({ id, value, onChange, min, max, unit, className }: StepperProps) {
  const set = (n: number) => onChange(Math.min(max, Math.max(min, n)));
  const btn =
    "inline-flex h-11 w-11 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-secondary focus-ring disabled:opacity-40";
  return (
    <div className={cn("flex items-center gap-3", className)} role="group" aria-labelledby={`${id}-label`}>
      <button type="button" className={btn} onClick={() => set(value - 1)} disabled={value <= min} aria-label="One fewer">
        <Minus className="h-4 w-4" />
      </button>
      <output id={id} aria-live="polite" className="min-w-[5rem] text-center text-lg font-semibold">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{value === 1 ? unit[0] : unit[1]}</span>}
      </output>
      <button type="button" className={btn} onClick={() => set(value + 1)} disabled={value >= max} aria-label="One more">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
