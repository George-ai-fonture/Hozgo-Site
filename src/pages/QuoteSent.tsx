import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";
import { StoreBadges } from "@/components/layout/StoreBadges";
import { Button } from "@/components/ui/button";
import { APP_AUTH_URL, CONTACT_EMAIL } from "@/lib/site";
import { formatGbp } from "@/lib/guidePrice";
import { QUOTE_SENT_KEY, readSession, type QuoteSentState } from "@/components/quote/storage";

function isSentState(v: unknown): v is QuoteSentState {
  return Boolean(v && typeof v === "object" && "summary" in v && "email" in v);
}

/** `${APP_AUTH_URL}?next=/customer?view=new-booking[&lead=<id>]`, with `next` encoded once. */
function continueInAppUrl(leadId: string | null): string {
  const next = new URL("/customer", "https://placeholder.invalid");
  next.searchParams.set("view", "new-booking");
  if (leadId) next.searchParams.set("lead", leadId);
  const url = new URL(APP_AUTH_URL);
  url.searchParams.set("next", `${next.pathname}${next.search}`);
  return url.toString();
}

export default function QuoteSent() {
  const location = useLocation();
  const sent = useMemo<QuoteSentState | null>(() => {
    if (isSentState(location.state)) return location.state;
    const saved = readSession<QuoteSentState>(QUOTE_SENT_KEY);
    return isSentState(saved) ? saved : null;
  }, [location.state]);

  const leadId = sent?.leadId ?? null;
  const reference = leadId ? leadId.slice(0, 8) : "pending";
  const appUrl = continueInAppUrl(leadId);

  const steps = [
    { title: "We have your details", text: "Your journey is saved with HOZGO." },
    {
      title: "Open the app and create your booking",
      text: "You see the price and place the hold. Your card is held, not charged, until the day of the trip.",
    },
    {
      title: "HOZGO Approved transporters respond",
      text: "They accept at the price or send you their own offer.",
    },
  ];

  return (
    <>
      <PageMeta title="Your journey is with us" description="Your journey has been sent to HOZGO. Continue in the app to book." />
      <Container className="py-12 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-7 w-7 shrink-0 text-success" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl">{sent ? "Your journey is with us." : "Continue your booking in the app."}</h1>
          </div>

          {sent && (
            <dl className="card-premium mt-8 grid gap-4 p-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Reference</dt>
                <dd className="mt-1 font-mono text-base font-semibold">{reference}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Guide price</dt>
                <dd className="mt-1 text-base font-semibold">
                  {typeof sent.guidePriceGbp === "number" ? formatGbp(sent.guidePriceGbp) : "In the app"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Journey</dt>
                <dd className="mt-1 text-base">{sent.summary}</dd>
              </div>
              {sent.email && (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">We will reply to</dt>
                  <dd className="mt-1 break-all text-base">{sent.email}</dd>
                </div>
              )}
            </dl>
          )}

          <h2 className="mt-10 text-xl">What happens next</h2>
          <ol className="mt-4 space-y-4">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 space-y-6">
            <Button asChild size="lg" className="h-12 w-full text-base sm:w-auto">
              <a href={appUrl}>Continue in the app</a>
            </Button>
            <StoreBadges />
            <p className="text-sm text-muted-foreground">
              Prefer to talk?{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-foreground underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
