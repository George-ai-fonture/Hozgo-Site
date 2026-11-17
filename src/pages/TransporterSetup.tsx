import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";
import { FileText, Loader2 } from "lucide-react";
import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";
import { StoreBadges } from "@/components/layout/StoreBadges";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, controlClass, describedBy, nativeSelectClass } from "@/components/forms/Field";
import { RadioCards } from "@/components/forms/RadioCards";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { SubmitError, SubmitSuccess } from "@/components/forms/SubmitState";
import { scrollToFirstError } from "@/components/forms/scrollToFirstError";
import { APP_AUTH_URL, CONTACT_EMAIL } from "@/lib/site";
import { buildMailtoFallback, compact, submitLead } from "@/lib/leads";
import { email, normalisePostcode, personName, ukPhone, ukPostcode } from "@/lib/validation";

const PREFERENCES = [
  { value: "call", label: "Book a 15-minute call", description: "We ring you, ask the questions and do the typing." },
  { value: "send_details", label: "Just send my details", description: "No call needed. We only ring if something is unclear." },
] as const;

const CALL_TIMES = [
  "Weekday morning 9am to 12pm",
  "Weekday afternoon 12pm to 5pm",
  "Weekday evening 5pm to 7pm",
  "Saturday morning",
] as const;

const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

const APHA = [
  { value: "type_1", label: "Type 1" },
  { value: "type_2", label: "Type 2" },
  { value: "not_yet", label: "Not yet" },
] as const;

const STEPS = [
  "Tell us how to reach you",
  "Book a 15-minute call or just send your details",
  "We build your profile with you",
  "You check the app and go online",
];

const DOCUMENTS = [
  "Driver Licence",
  "Vehicle Registration",
  "Lorry Insurance",
  "Public Liability",
  "Care Custody and Control insurance",
  "APHA Transporter Authorisation, Type 1 or 2",
  "Certificate of Competence",
  "Photos of your lorry, inside and out",
];
const DOCUMENTS_OVER_3_5T = ["Operator Licence", "Transport Manager details", "Driver CPC card"];

const CONSENT_TEXT =
  "I run this business and I'm happy for HOZGO to contact me and use these details to set up and check my profile.";

const schema = z
  .object({
    name: personName,
    businessName: z.string().trim().min(2, "Enter your business name").max(160),
    phone: ukPhone,
    email,
    preference: z.enum(["call", "send_details"], { errorMap: () => ({ message: "Choose how you would like to do it" }) }),
    bestTimeToCall: z.string(),
    basePostcode: ukPostcode,
    vehicles: z.string().trim().min(2, "Tell us what you drive").max(500),
    over3_5t: z.enum(["yes", "no"], { errorMap: () => ({ message: "Choose yes or no" }) }),
    aphaType: z.enum(["type_1", "type_2", "not_yet"], { errorMap: () => ({ message: "Choose your APHA authorisation" }) }),
    notes: z.string().trim().max(2000),
    consent: z.boolean().refine((v) => v, "Tick the box so we can set up your profile"),
    website: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.preference === "call" && !v.bestTimeToCall) {
      ctx.addIssue({ code: "custom", path: ["bestTimeToCall"], message: "Choose the best time to call" });
    }
  });

type Values = z.input<typeof schema>;

const defaults: Values = {
  name: "",
  businessName: "",
  phone: "",
  email: "",
  preference: undefined as unknown as Values["preference"],
  bestTimeToCall: "",
  basePostcode: "",
  vehicles: "",
  over3_5t: undefined as unknown as Values["over3_5t"],
  aphaType: undefined as unknown as Values["aphaType"],
  notes: "",
  consent: false,
  website: "",
};

export default function TransporterSetup() {
  const formRef = useRef<HTMLFormElement>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults, mode: "onTouched", shouldFocusError: false });

  const preference = watch("preference");
  const err = (k: keyof Values) => errors[k]?.message as string | undefined;

  const onValid = async (v: Values) => {
    setMailto(null);
    const payload = compact({
      businessName: v.businessName,
      preference: v.preference,
      bestTimeToCall: v.preference === "call" ? v.bestTimeToCall : undefined,
      basePostcode: normalisePostcode(v.basePostcode),
      vehicles: v.vehicles,
      over3_5t: v.over3_5t === "yes",
      aphaType: v.aphaType,
      notes: v.notes,
    });
    const r = await submitLead("transporter_setup", { name: v.name, email: v.email, phone: v.phone, website: v.website, payload });
    if (r.ok) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setMailto(
      buildMailtoFallback("transporter_setup", [
        ["Name", v.name],
        ["Business", v.businessName],
        ["Mobile", v.phone],
        ["Email", v.email],
        ["How", PREFERENCES.find((p) => p.value === v.preference)?.label],
        ["Best time to call", v.preference === "call" ? v.bestTimeToCall : ""],
        ["Base postcode", normalisePostcode(v.basePostcode)],
        ["Vehicles", v.vehicles],
        ["Any vehicle over 3.5t", v.over3_5t === "yes"],
        ["APHA authorisation", APHA.find((a) => a.value === v.aphaType)?.label],
        ["Notes", v.notes],
      ]),
    );
  };

  return (
    <>
      <PageMeta
        title="We'll set it up for you"
        description="HOZGO transporters: send us the basics and we build your profile with you. You check it in the app, upload documents and go online."
      />
      <Container className="py-12 sm:py-16">
        <header className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">For transporters</p>
          <h1 className="text-3xl sm:text-4xl">We'll set it up for you.</h1>
          <p className="mt-4 text-base text-muted-foreground">
            Send us the basics and we do the typing. You then check it in the app, upload your documents and accept the
            terms. Only you can do those.
          </p>
        </header>

        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s} className="card-premium flex items-start gap-3 p-4">
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium leading-snug">{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div className="min-w-0">
            {done ? (
              <SubmitSuccess title="Thank you. One of us will be in touch.">
                <p className="text-sm text-muted-foreground">
                  In the meantime you can get the app ready. Your profile, documents and the terms are all done there.
                </p>
                <Button asChild size="lg" className="h-12 text-base">
                  <a href={APP_AUTH_URL}>Get the app</a>
                </Button>
                <StoreBadges />
              </SubmitSuccess>
            ) : (
              <form
                ref={formRef}
                noValidate
                onSubmit={handleSubmit(onValid, () => scrollToFirstError(formRef.current))}
                className="relative space-y-6"
                aria-label="Transporter set-up"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="name" label="Your name" error={err("name")}>
                    <Input id="name" {...register("name")} autoComplete="name" className={controlClass} {...describedBy("name", { error: err("name") })} />
                  </Field>
                  <Field id="businessName" label="Business name" error={err("businessName")}>
                    <Input
                      id="businessName"
                      {...register("businessName")}
                      autoComplete="organization"
                      className={controlClass}
                      {...describedBy("businessName", { error: err("businessName") })}
                    />
                  </Field>
                  <Field id="phone" label="Mobile" error={err("phone")}>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      {...register("phone")}
                      autoComplete="tel"
                      className={controlClass}
                      {...describedBy("phone", { error: err("phone") })}
                    />
                  </Field>
                  <Field id="email" label="Email" error={err("email")}>
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      {...register("email")}
                      autoComplete="email"
                      className={controlClass}
                      {...describedBy("email", { error: err("email") })}
                    />
                  </Field>
                </div>

                <Field id="preference" label="How would you like to do it?" as="group" error={err("preference")}>
                  <Controller
                    control={control}
                    name="preference"
                    render={({ field }) => (
                      <RadioCards id="preference" value={field.value} onChange={field.onChange} options={PREFERENCES} invalid={Boolean(errors.preference)} />
                    )}
                  />
                </Field>

                {preference === "call" && (
                  <Field id="bestTimeToCall" label="Best time to call" error={err("bestTimeToCall")}>
                    <select
                      id="bestTimeToCall"
                      {...register("bestTimeToCall")}
                      className={nativeSelectClass}
                      {...describedBy("bestTimeToCall", { error: err("bestTimeToCall") })}
                    >
                      <option value="">Choose a time</option>
                      {CALL_TIMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="basePostcode" label="Base postcode" error={err("basePostcode")}>
                    <Input
                      id="basePostcode"
                      {...register("basePostcode", { setValueAs: (v: string) => (typeof v === "string" ? v.toUpperCase() : v) })}
                      autoComplete="postal-code"
                      autoCapitalize="characters"
                      className={`${controlClass} uppercase`}
                      {...describedBy("basePostcode", { error: err("basePostcode") })}
                    />
                  </Field>
                </div>

                <Field id="vehicles" label="Vehicles" error={err("vehicles")}>
                  <Input
                    id="vehicles"
                    {...register("vehicles")}
                    placeholder="e.g. 7.5t lorry, 3.5t box, trailer"
                    className={controlClass}
                    {...describedBy("vehicles", { error: err("vehicles") })}
                  />
                </Field>

                <Field id="over3_5t" label="Is any vehicle over 3.5t?" as="group" error={err("over3_5t")}>
                  <Controller
                    control={control}
                    name="over3_5t"
                    render={({ field }) => (
                      <RadioCards id="over3_5t" value={field.value} onChange={field.onChange} options={YES_NO} columns="grid-cols-2" invalid={Boolean(errors.over3_5t)} />
                    )}
                  />
                </Field>

                <Field id="aphaType" label="APHA transporter authorisation" as="group" error={err("aphaType")}>
                  <Controller
                    control={control}
                    name="aphaType"
                    render={({ field }) => (
                      <RadioCards id="aphaType" value={field.value} onChange={field.onChange} options={APHA} columns="sm:grid-cols-3" invalid={Boolean(errors.aphaType)} />
                    )}
                  />
                </Field>

                <Field id="notes" label="Anything we should know?" optional error={err("notes")}>
                  <Textarea id="notes" {...register("notes")} rows={4} className="text-base" {...describedBy("notes", { error: err("notes") })} />
                </Field>

                <Controller
                  control={control}
                  name="consent"
                  render={({ field }) => (
                    <ConsentCheckbox id="consent" checked={field.value} onChange={field.onChange} text={CONSENT_TEXT} error={err("consent")} />
                  )}
                />
                <HoneypotField registration={register("website")} />

                {mailto && <SubmitError mailto={mailto} />}

                <Button type="submit" size="lg" className="h-12 w-full text-base sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
                  Send to the HOZGO team
                </Button>

                <p className="text-sm text-muted-foreground">
                  Prefer to do it yourself?{" "}
                  <a href={APP_AUTH_URL} className="font-medium text-foreground underline underline-offset-4">
                    Sign up in the app
                  </a>
                </p>
              </form>
            )}
          </div>

          <aside aria-labelledby="docs-heading" className="card-elevated h-fit space-y-4 p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" aria-hidden="true" />
              <h2 id="docs-heading" className="text-lg">
                Your documents
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">Have these ready. You do not upload them here.</p>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {DOCUMENTS.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="text-sm font-medium">If any vehicle is over 3.5t, also:</p>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {DOCUMENTS_OVER_3_5T.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Uploads happen in the app, phone photos are fine, PDF or image up to 10 MB each. If you would rather, email
              them to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-foreground underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>{" "}
              and an admin will upload them for you.
            </p>
            <Link to="/transporters/documents" className="inline-flex min-h-[44px] items-center text-sm font-semibold underline underline-offset-4">
              See what we check and why
            </Link>
          </aside>
        </div>
      </Container>
    </>
  );
}
