import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { StoreBadges } from "@/components/layout/StoreBadges";

interface CtaBandProps {
  title: string;
  text?: ReactNode;
  children?: ReactNode;
  badges?: boolean;
}

export function CtaBand({ title, text, children, badges }: CtaBandProps) {
  return (
    <section className="bg-gunmetal-900 text-white">
      <Container className="py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl">{title}</h2>
          {text && <div className="mt-4 text-base text-gunmetal-200">{text}</div>}
          {children && <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>}
          {badges && <StoreBadges className="mt-8" />}
        </div>
      </Container>
    </section>
  );
}
