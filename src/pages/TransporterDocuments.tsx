import { Link } from "react-router-dom";
import { CheckCircle2, Clock, FileUp, ShieldCheck } from "lucide-react";
import { PageMeta } from "@/components/layout/PageMeta";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/PageHero";
import { DocumentCard } from "@/components/marketing/DocumentCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ALWAYS_DOCUMENTS, GO_ONLINE_CHECKS, HEAVY_DOCUMENTS } from "@/components/marketing/documents";
import { CONTACT_EMAIL } from "@/lib/site";

const STATUSES = ["Pending", "Approved", "Rejected", "Expired"];

export default function TransporterDocuments() {
  return (
    <>
      <PageMeta
        title="What we check | HOZGO"
        description="The documents every HOZGO Approved transporter has shown us, what a good upload looks like, and what happens after you upload."
      />
      <PageHero
        eyebrow="HOZGO APPROVED"
        title="What we check, and why."
        intro="Every HOZGO Approved transporter has shown us these. Customers cannot check a lorry for themselves, so we do it for them."
      />

      <Section
        eyebrow="EVERY UPLOAD"
        title="What a good upload looks like."
      >
        <ul className="grid max-w-3xl gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <li className="flex gap-3"><FileUp className="mt-0.5 h-4 w-4 shrink-0 text-gunmetal-500" aria-hidden="true" />A phone photo is fine.</li>
          <li className="flex gap-3"><FileUp className="mt-0.5 h-4 w-4 shrink-0 text-gunmetal-500" aria-hidden="true" />PDF or image, up to 10 MB each.</li>
          <li className="flex gap-3"><FileUp className="mt-0.5 h-4 w-4 shrink-0 text-gunmetal-500" aria-hidden="true" />Include all pages.</li>
          <li className="flex gap-3"><FileUp className="mt-0.5 h-4 w-4 shrink-0 text-gunmetal-500" aria-hidden="true" />In date.</li>
          <li className="flex gap-3 sm:col-span-2"><FileUp className="mt-0.5 h-4 w-4 shrink-0 text-gunmetal-500" aria-hidden="true" />The name must match the business.</li>
        </ul>
      </Section>

      <Section muted eyebrow="ALWAYS REQUIRED" title="Nine documents for every transporter.">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ALWAYS_DOCUMENTS.map((d) => (
            <li key={d.label}>
              <DocumentCard doc={d} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="IF YOUR VEHICLE IS OVER 3.5T"
        title="Three more for heavier vehicles."
      >
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HEAVY_DOCUMENTS.map((d) => (
            <li key={d.label}>
              <DocumentCard doc={d} />
            </li>
          ))}
        </ul>
      </Section>

      <Section muted eyebrow="AFTER YOU UPLOAD" title="An admin checks every one.">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="max-w-xl space-y-4 text-muted-foreground">
            <p>An admin checks each document. We may come back to you with a question.</p>
            <p>You can see the status of each one in the app.</p>
            <ul className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <li key={s} className="rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-widest text-foreground">
                  {s}
                </li>
              ))}
            </ul>
            <p className="flex gap-3">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-gunmetal-500" aria-hidden="true" />
              <span>An expired document takes you offline until you replace it.</span>
            </p>
          </div>
          <div className="card-premium p-6">
            <ShieldCheck className="mb-4 h-6 w-6 text-gunmetal-600" aria-hidden="true" />
            <h3 className="text-lg">Uploads happen in the app</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              If you would rather not do it yourself, an admin can upload for you. Send your documents to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-foreground underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="BEFORE YOU CAN GO ONLINE" title="Once your documents are approved.">
        <ul className="max-w-xl space-y-3">
          {GO_ONLINE_CHECKS.map((c) => (
            <li key={c} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gunmetal-600" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title="Prefer us to do the typing?" text="Send us the details and we will set up your profile for you.">
        <Button asChild size="lg" variant="secondary">
          <Link to="/transporters/setup">We&rsquo;ll set it up for you</Link>
        </Button>
      </CtaBand>
    </>
  );
}
