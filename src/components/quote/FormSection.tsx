import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FormSection({
  n,
  title,
  intro,
  children,
  className,
}: {
  n: number;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = `quote-section-${n}`;
  return (
    <section aria-labelledby={id} className={cn("border-t pt-8 first:border-t-0 first:pt-0", className)}>
      <h2 id={id} className="flex items-center gap-3 text-xl sm:text-2xl">
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
        >
          {n}
        </span>
        {title}
      </h2>
      {intro && <p className="mt-2 text-sm text-muted-foreground">{intro}</p>}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}
