import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock, Eye, Handshake, Info, ShieldCheck, Wallet } from "lucide-react";
import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/PageHero";
import { Steps } from "@/components/marketing/Steps";
import { CtaBand } from "@/components/marketing/CtaBand";

const HORSE_DETAILS = [
  "Name",
  "Sex",
  "Whether they have travelled before",
  "Whether the passport is available",
  "Any loading or travelling concerns",
  "Health status",
];

export default function HowItWorks() {
  return (
    <>
      <PageMeta
        title="How it works | HOZGO"
        description="Four steps from postcodes to a HOZGO Approved transporter. See who sees what, how the card hold works and how offers work."
      />
      <PageHero
        eyebrow="HOW IT WORKS"
        title="Four steps. One app."
        intro="You enter the journey. You see a guide price. Your card is held, not charged. A HOZGO Approved transporter picks the job up."
      >
        <Button asChild size="lg">
          <Link to="/quote">
            Get a quote
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </PageHero>

      <Section>
        <Steps detailed />
      </Section>

      <Section
        muted
        eyebrow="PRIVACY"
        title="Who sees what, and when."
        intro="You should know who has your details before they do."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-premium p-6">
            <Eye className="mb-4 h-6 w-6 text-gunmetal-600" aria-hidden="true" />
            <h3 className="text-lg">Before anyone accepts</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your journey details go to HOZGO Approved transporters, so they can decide whether they can do the job. Your name
              and phone number are not part of that.
            </p>
          </div>
          <div className="card-premium p-6">
            <Handshake className="mb-4 h-6 w-6 text-gunmetal-600" aria-hidden="true" />
            <h3 className="text-lg">Once a transporter accepts</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your name and phone number are shared with that transporter, and only that transporter, once they accept your job.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="YOUR CARD" title="Held, not charged.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="max-w-xl space-y-4 text-muted-foreground">
            <p>
              A hold is placed on your card when you book. That is not a payment. The money stays with you.
            </p>
            <p>Your card is charged on the day of the trip. The transporter is paid on completion.</p>
            <p>If no transporter takes your job and you take no offer, the hold is released. There is nothing to refund, because nothing was charged.</p>
          </div>
          <div className="card-premium p-6">
            <CalendarClock className="mb-4 h-6 w-6 text-gunmetal-600" aria-hidden="true" />
            <h3 className="text-lg">If you book well ahead</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A card hold lapses after about 7 days. If your trip is further away than that, the app may ask you to
              re-authorise your card so the hold stays in place.
            </p>
          </div>
        </div>
      </Section>

      <Section
        muted
        eyebrow="PRICE AND OFFERS"
        title="Your price. Or an offer you choose."
        intro="The guide price is worked out from the distance, at £1.50 a mile, with 20 base miles added to cover getting to the pickup. The minimum is £120."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card-premium p-6">
            <Wallet className="mb-4 h-6 w-6 text-gunmetal-600" aria-hidden="true" />
            <h3 className="text-lg">First to accept</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your job goes out at your price. The first HOZGO Approved transporter to accept it takes the job.
            </p>
          </div>
          <div className="card-premium p-6">
            <Handshake className="mb-4 h-6 w-6 text-gunmetal-600" aria-hidden="true" />
            <h3 className="text-lg">If none can</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Transporters send you their own offers. You see them in the app and you choose one, or none.
            </p>
          </div>
          <div className="card-premium p-6">
            <Info className="mb-4 h-6 w-6 text-gunmetal-600" aria-hidden="true" />
            <h3 className="text-lg">An offer above your hold</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              If you choose an offer that is higher than your card hold, you pay a small top-up to accept it.
            </p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="ABOUT YOUR HORSE"
        title="What the app asks for each horse."
        intro="Transporters need the facts before they load. Tell them the truth, including the awkward parts."
      >
        <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
          {HORSE_DETAILS.map((d) => (
            <li key={d} className="flex items-start gap-3 text-sm">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gunmetal-500" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
          Need a horse moved the same day? Emergency same-day bookings carry a surcharge.
        </p>
      </Section>

      <section className="border-y bg-secondary">
        <Container className="py-12">
          <h2 className="text-xl">Good to know</h2>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>HOZGO does not guarantee an arrival time.</li>
            <li>HOZGO does not insure your horse or the lorry. Each transporter holds their own cover, and we check it.</li>
            <li>UK journeys only.</li>
            <li>Booking and payment happen in the app. The website collects your journey and shows a guide price.</li>
          </ul>
        </Container>
      </section>

      <CtaBand title="Ready to see a guide price?" text="It takes a minute. Booking and payment happen in the app.">
        <Button asChild size="lg" variant="secondary">
          <Link to="/quote">Get a quote</Link>
        </Button>
      </CtaBand>
    </>
  );
}
