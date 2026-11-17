import { Link } from "react-router-dom";
import { BadgeCheck, Bell, FileSignature, MapPin, Wallet } from "lucide-react";
import { PageMeta } from "@/components/layout/PageMeta";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/PageHero";
import { Faq, type FaqEntry } from "@/components/marketing/Faq";
import { CtaBand } from "@/components/marketing/CtaBand";
import { APP_AUTH_URL } from "@/lib/site";

const GIVES = [
  {
    icon: BadgeCheck,
    title: "A HOZGO Approved profile",
    text: "Customers see that we have checked your documents ourselves.",
  },
  {
    icon: Bell,
    title: "Jobs at the price shown",
    text: "Accept at the price shown, or send your own offer. The first to accept at the customer's price takes the job.",
  },
  {
    icon: FileSignature,
    title: "A contract in the app",
    text: "Every job is signed in the app before the horse travels.",
  },
  {
    icon: Wallet,
    title: "Paid on completion",
    text: "Payments run through Stripe Connect and arrive when the job is done.",
  },
  {
    icon: MapPin,
    title: "UK work only",
    text: "Journeys within the United Kingdom. Whether you cover your local area or travel nationwide, we would be glad to hear from you.",
  },
];

const STEPS = [
  "Sign up in the app.",
  "Upload your documents.",
  "We verify each one.",
  "Go online.",
  "Jobs arrive by notification.",
  "Accept at the price shown, or send an offer.",
];

const FAQ: FaqEntry[] = [
  {
    q: "How is HOZGO different from HorseLift?",
    a: "HorseLift works from Germany and internationally. HOZGO is UK only, and it is run by working transporters.",
  },
  {
    q: "Do you see the jobs first?",
    a: "No. Our own lorries see every job at the same time as yours.",
  },
  {
    q: "Do I have to accept HOZGO's price?",
    a: "No. If you cannot do a job at the price shown, send your own offer. The customer sees it and chooses.",
  },
  {
    q: "How do I get paid?",
    a: "Through Stripe Connect. You are paid on completion of the job.",
  },
];

export default function Transporters() {
  return (
    <>
      <PageMeta
        title="For transporters | HOZGO"
        description="Gain approval, and the work comes to you. HOZGO is a UK horse transport network built by working transporters. Paid on completion, contract in the app."
      />
      <PageHero
        eyebrow="ARE YOU A DEDICATED HORSE TRANSPORTER?"
        title="Gain approval, and the work comes to you."
        intro="UK work only, at the price shown or the offer you send, and you are paid on completion. Our own lorries see every job at the same time as yours."
      >
        <Button asChild size="lg">
          <Link to="/transporters/documents">See the documents we check</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/transporters/setup">We&rsquo;ll set it up for you</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <a href={APP_AUTH_URL}>Get the app</a>
        </Button>
      </PageHero>

      <Section eyebrow="WHAT APPROVAL GIVES YOU" title="A closed network. Every transporter approved.">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GIVES.map((g) => (
            <li key={g.title} className="card-premium p-6">
              <g.icon className="mb-4 h-6 w-6 text-gunmetal-600" aria-hidden="true" />
              <h3 className="text-lg">{g.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{g.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section muted eyebrow="HOW IT WORKS FOR YOU" title="From sign-up to your first job.">
        <ol className="grid max-w-3xl gap-4">
          {STEPS.map((s, i) => (
            <li key={s} className="card-premium flex items-center gap-4 p-4">
              <span className="text-2xl font-semibold text-foreground" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="WHAT IT COSTS" title="A commission on the jobs you take.">
        <p className="max-w-2xl text-muted-foreground">
          No subscription. No lead fees. HOZGO&rsquo;s service fee comes out of the job price, so the figure you see on a job is your
          figure, with nothing to invoice us for afterwards.
        </p>
      </Section>

      <Section muted eyebrow="STRAIGHT ANSWERS" title="Before you ask.">
        <Faq items={FAQ} className="max-w-3xl" />
      </Section>

      <CtaBand
        title="Put your area on the HOZGO map."
        text="See what we check, or let us do the typing for you."
        badges
      >
        <Button asChild size="lg" variant="secondary">
          <Link to="/transporters/documents">See the documents we check</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/transporters/setup">We&rsquo;ll set it up for you</Link>
        </Button>
      </CtaBand>
    </>
  );
}
