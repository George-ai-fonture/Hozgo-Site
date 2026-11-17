import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps {
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
  muted?: boolean;
  id?: string;
}

export function Section({ eyebrow, title, intro, children, className, muted, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", muted && "bg-secondary", className)}>
      <Container>
        {(eyebrow || title || intro) && (
          <header className="mb-10 max-w-2xl">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
            )}
            {title && <h2 className="text-3xl sm:text-4xl">{title}</h2>}
            {intro && <div className="mt-4 text-base text-foreground/85">{intro}</div>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
