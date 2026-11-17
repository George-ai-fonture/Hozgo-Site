import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, CreditCard, FileSignature, Gauge, MapPinned } from "lucide-react";
import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { APP_AUTH_URL } from "@/lib/site";
import { MiniQuoteForm } from "@/components/marketing/MiniQuoteForm";
import { Steps } from "@/components/marketing/Steps";
import { Faq, type FaqEntry } from "@/components/marketing/Faq";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ALWAYS_DOCUMENTS } from "@/components/marketing/documents";

const TRUST = ["Approved transporters", "Guide price in seconds", "Held, not charged", "Contract in the app"];

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "HOZGO APPROVED",
    text: "Every transporter's documents are checked and their legal compliance verified before they see a job.",
  },
  {
    icon: Gauge,
    title: "GUIDE PRICE IN SECONDS",
    text: "Enter your postcodes and the guide price comes back. No call-backs. No waiting for quotes.",
  },
  {
    icon: CreditCard,
    title: "HELD, NOT CHARGED",
    text: "Your card is held at booking and charged on the day of the trip. The transporter is paid on completion.",
  },
  {
    icon: FileSignature,
    title: "CONTRACT IN THE APP",
    text: "Every job is signed in the app before your horse travels.",
  },
  {
    icon: MapPinned,
    title: "FOLLOW THE JOURNEY",
    text: "Live updates from booking to delivery, with your documents and messages kept in one place.",
  },
];

const FAQ: FaqEntry[] = [
  {
    q: "Is the guide price the final price?",
    a: "It is the price your job goes out at. If an approved transporter accepts it, that is your price. If none can, they send you offers and you choose. An offer above your card hold means a small top-up.",
  },
  {
    q: "What happens after I accept?",
    a: "A hold is placed on your card and your job goes to HOZGO Approved transporters. The first to accept at your price takes it. The contract is signed in the app. Your name and phone number are shared with the transporter only once they accept.",
  },
  {
    q: "When is my card charged?",
    a: "On the day of the trip. At booking your card is held, not charged.",
  },
  {
    q: "What if no transporter accepts?",
    a: "They can send you offers instead, and you can choose one or none. If nobody accepts and you take no offer, the hold is released and nothing is taken.",
  },
  {
    q: "Can I book without the app?",
    a: "The website collects your journey and shows your guide price. Booking and payment happen in the app.",
  },
];

export default function Home() {
  return (
    <>
      <PageMeta
        title="Horse transport, booked in the app | HOZGO"
        description="Enter your postcodes and see a guide price in seconds. Your job goes only to HOZGO Approved transporters, and your card is held, not charged, until the day of the trip."
      />

      <section className="border-b bg-secondary">
        <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              HORSE TRANSPORT. BOOKED IN THE APP.
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl">Your horse can&rsquo;t check. We do.</h1>
            <p className="mt-5 max-w-xl text-base text-foreground/90 sm:text-lg">
              Enter your postcodes and see a guide price in seconds. Your job is offered only to HOZGO Approved transporters,
              and your card is held, not charged, until the day of the trip.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/quote">
                  Get a quote
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={APP_AUTH_URL}>Get the app</a>
              </Button>
            </div>
          </div>
          <MiniQuoteForm />
        </Container>
      </section>

      <div className="relative h-48 w-full overflow-hidden sm:h-72">
        <img
          src="/brand/horse-transport.jpg"
          alt="A bay horse in a head collar standing beside an open horse lorry at sunset"
          width={1600}
          height={640}
          className="h-full w-full object-cover object-[60%_40%]"
          loading="eager"
        />
      </div>

      <section className="border-b" aria-label="Why HOZGO">
        <Container>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 py-6 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:flex sm:flex-wrap sm:justify-between sm:text-xs">
            {TRUST.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Container>
      </section>

      <Section
        eyebrow="HOW IT WORKS"
        title="Four steps. One app."
        intro={
          <>
            Postcodes, date, number of horses. That is the form.{" "}
            <Link to="/how-it-works" className="font-medium text-foreground underline underline-offset-4">
              See how it works in full
            </Link>
            .
          </>
        }
      >
        <Steps />
      </Section>

      <Section
        muted
        eyebrow="HOZGO APPROVED"
        title="Every transporter has shown us the paperwork."
        intro="We check every document ourselves before a transporter can see a job. Here is what we ask for, in plain words."
      >
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {ALWAYS_DOCUMENTS.map((d) => (
            <li key={d.label} className="flex items-start gap-3 text-sm">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-gunmetal-500" aria-hidden="true" />
              <span>{d.plain}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
          For vehicles over 3.5t we also check the operator (O) licence, the transport manager details and the Driver CPC card.
          An admin looks at each document. Expired documents take a transporter offline.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/transporters/documents">See what we check, and why</Link>
        </Button>
      </Section>

      <Section eyebrow="THE HOZGO APP" title="The price before you speak to anyone.">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="card-premium p-6">
              <f.icon className="mb-4 h-6 w-6 text-gunmetal-600" aria-hidden="true" />
              <h3 className="text-base tracking-wide">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section muted eyebrow="ABOUT HOZGO" title="Built by two working transporters.">
        <div className="max-w-2xl space-y-4 text-muted-foreground">
          <p>
            HOZGO was founded by Michelle Hale of Warwickshire Horse Transport and George Betson of Fonture Equine Transport.
            We still run our own lorries. We know what it means to be handed someone else&rsquo;s horse, and we know how hard
            it is to check a stranger from a Facebook advert.
          </p>
          <p>The cheapest quote can sometimes become the most expensive journey.</p>
        </div>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/about">About HOZGO</Link>
        </Button>
      </Section>

      <section className="border-b">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl">Are you a dedicated horse transporter?</h2>
            <p className="mt-2 text-muted-foreground">Gain approval, and the work comes to you.</p>
          </div>
          <Button asChild size="lg">
            <Link to="/transporters">
              For transporters
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Container>
      </section>

      <Section eyebrow="QUESTIONS" title="Straight answers.">
        <Faq items={FAQ} className="max-w-3xl" />
      </Section>

      <CtaBand
        title="Postcodes in. Guide price out."
        text="Start on the website, then book in the app."
        badges
      >
        <Button asChild size="lg" variant="secondary">
          <Link to="/quote">Get a quote</Link>
        </Button>
      </CtaBand>
    </>
  );
}
