import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

export type LegalBlock =
  | { t: "h2" | "h3" | "p"; x: string }
  | { t: "ul"; x: string[] };

const EMAIL = /(Info@hozgo\.co\.uk)/gi;
const BOLD = /\*\*(.+?)\*\*/g;

function inline(text: string, privacyHref?: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(BOLD)) {
    if (m.index > last) nodes.push(...plain(text.slice(last, m.index), privacyHref, key++));
    nodes.push(<strong key={`b${key++}`}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(...plain(text.slice(last), privacyHref, key++));
  return nodes;
}

function plain(text: string, privacyHref: string | undefined, seed: number): ReactNode[] {
  const out: ReactNode[] = [];
  text.split(EMAIL).forEach((part, i) => {
    if (/^Info@hozgo\.co\.uk$/i.test(part)) {
      out.push(
        <a key={`e${seed}-${i}`} href={`mailto:${part}`}>
          {part}
        </a>,
      );
      return;
    }
    if (privacyHref && part.includes("Privacy Policy")) {
      part.split(/(HOZGO Privacy Policy|Privacy Policy)/).forEach((seg, j) => {
        if (seg === "HOZGO Privacy Policy" || seg === "Privacy Policy") {
          out.push(
            <a key={`p${seed}-${i}-${j}`} href={privacyHref} target="_blank" rel="noopener noreferrer">
              {seg}
            </a>,
          );
        } else if (seg) {
          out.push(seg);
        }
      });
      return;
    }
    out.push(part);
  });
  return out;
}

function lines(text: string, privacyHref?: string): ReactNode[] {
  return text.split("\n").flatMap((ln, i) => (i === 0 ? inline(ln, privacyHref) : [<br key={`br${i}`} />, ...inline(ln, privacyHref)]));
}

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  effective: string;
  updated: string;
  note: ReactNode;
  blocks: LegalBlock[];
  privacyHref?: string;
}

export function LegalDocument({ eyebrow, title, effective, updated, note, blocks, privacyHref }: LegalDocumentProps) {
  return (
    <Container className="py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Effective {effective}. Last updated {updated}.
        </p>
        <div className="mt-6 rounded-lg border bg-secondary p-4 text-sm text-muted-foreground">{note}</div>
      </header>
      <div className="mt-10 max-w-3xl [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ul]:leading-relaxed">
        {blocks.map((b, i) => {
          if (b.t === "h2") return <h2 key={i}>{b.x}</h2>;
          if (b.t === "h3") return <h3 key={i}>{b.x}</h3>;
          if (b.t === "ul")
            return (
              <ul key={i}>
                {b.x.map((li, j) => (
                  <li key={j}>{inline(li, privacyHref)}</li>
                ))}
              </ul>
            );
          return <p key={i}>{lines(b.x, privacyHref)}</p>;
        })}
      </div>
    </Container>
  );
}
