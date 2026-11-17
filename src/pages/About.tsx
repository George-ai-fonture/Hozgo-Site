import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";

export default function About() {
  return (
    <>
      <PageMeta
        title="About | HOZGO"
        description="HOZGO was founded by two working horse transporters, Michelle Hale and George Betson. We check every transporter ourselves."
      />
      <PageHero
        eyebrow="ABOUT HOZGO"
        title="Built by two working transporters."
        intro="Nobody should have to guess who is collecting their horse."
      />

      <Section eyebrow="WHY THIS EXISTS" title="We know what it means to be handed someone else's horse.">
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            HOZGO was founded by Michelle Hale of Warwickshire Horse Transport and George Betson of Fonture Equine Transport.
            We still run our own lorries. We know what it means to be handed someone else&rsquo;s horse, and we know how hard it
            is to check a stranger from a Facebook advert.
          </p>
          <p>
            So we check every transporter ourselves before they can join. Documents in, legal compliance verified, then jobs.
            That is what HOZGO Approved means.
          </p>
          <p>
            HOZGO is not a directory. It is a closed network, and every transporter in it has been approved.
          </p>
          <p>The cheapest quote can sometimes become the most expensive journey.</p>
        </div>
      </Section>

      <Section muted eyebrow="WHERE HOZGO STANDS" title="What you can rely on.">
        <ul className="grid max-w-3xl gap-3 text-muted-foreground">
          <li>Two working transporters, each running their own company.</li>
          <li>Live on the App Store and Google Play.</li>
          <li>Journeys within the United Kingdom only.</li>
          <li>Every transporter is HOZGO Approved before taking a job.</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/transporters/documents">See what we check</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/how-it-works">How it works</Link>
          </Button>
        </div>
      </Section>

      <Section eyebrow="THE PEOPLE BEHIND HOZGO" title="Michelle and George.">
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <div className="card-premium p-6">
            <h3 className="text-lg">Michelle Hale</h3>
            <p className="mt-2 text-sm text-muted-foreground">Warwickshire Horse Transport. Still drives.</p>
          </div>
          <div className="card-premium p-6">
            <h3 className="text-lg">George Betson</h3>
            <p className="mt-2 text-sm text-muted-foreground">Fonture Equine Transport. Still drives.</p>
          </div>
        </div>
        <blockquote className="mt-10 max-w-2xl space-y-3 border-l-2 border-gunmetal-300 pl-5 text-base text-muted-foreground">
          <p>We built HOZGO from inside this industry, for this industry.</p>
          <p>That is the standard we ask of every transporter, and the standard we hold ourselves to.</p>
          <footer className="font-semibold text-foreground">Michelle and George, Founders of HOZGO</footer>
        </blockquote>
      </Section>

      <CtaBand title="Ask us anything." text="Michelle or George will answer.">
        <Button asChild size="lg" variant="secondary">
          <Link to="/contact">Contact</Link>
        </Button>
      </CtaBand>
    </>
  );
}
