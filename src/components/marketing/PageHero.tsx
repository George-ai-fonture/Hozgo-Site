import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section className="border-b bg-secondary">
      <Container className="py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl">{title}</h1>
          {intro && <div className="mt-5 text-base text-foreground/85 sm:text-lg">{intro}</div>}
          {children && <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
