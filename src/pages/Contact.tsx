import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail } from "lucide-react";
import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, controlClass, describedBy, nativeSelectClass } from "@/components/forms/Field";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { SubmitError, SubmitSuccess } from "@/components/forms/SubmitState";
import { scrollToFirstError } from "@/components/forms/scrollToFirstError";
import { CONTACT_EMAIL, FACEBOOK_URL } from "@/lib/site";
import { buildMailtoFallback, submitLead } from "@/lib/leads";
import { email, optionalUkPhone, personName } from "@/lib/validation";

const TOPICS = [
  { value: "booking", label: "Booking transport" },
  { value: "transporter", label: "Joining as a transporter" },
  { value: "support", label: "App support" },
  { value: "other", label: "Something else" },
] as const;

const schema = z.object({
  name: personName,
  email,
  phone: optionalUkPhone,
  topic: z.enum(["booking", "transporter", "support", "other"], {
    errorMap: () => ({ message: "Choose what it is about" }),
  }),
  message: z.string().trim().min(5, "Write your question").max(4000, "Keep this under 4,000 characters"),
  website: z.string(),
});

type Values = z.input<typeof schema>;

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", topic: "" as Values["topic"], message: "", website: "" },
    mode: "onTouched",
    shouldFocusError: false,
  });
  const err = (k: keyof Values) => errors[k]?.message as string | undefined;

  const onValid = async (v: Values) => {
    setMailto(null);
    const r = await submitLead("enquiry", {
      name: v.name,
      email: v.email,
      phone: v.phone,
      website: v.website,
      payload: { topic: v.topic, message: v.message.trim() },
    });
    if (r.ok) {
      setDone(true);
      return;
    }
    setMailto(
      buildMailtoFallback("enquiry", [
        ["Name", v.name],
        ["Email", v.email],
        ["Phone", v.phone],
        ["About", TOPICS.find((t) => t.value === v.topic)?.label],
        ["Message", v.message],
      ]),
    );
  };

  return (
    <>
      <PageMeta title="Contact" description="Ask HOZGO before you book. Michelle or George will answer." />
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
          <header className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Get in touch</p>
            <h1 className="text-3xl sm:text-4xl">Ask us before you book.</h1>
            <p className="mt-4 text-base text-muted-foreground">
              Send your question and Michelle or George will answer it. Transporters who want to join can use the same form.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-[44px] items-center gap-2 font-medium underline-offset-4 hover:underline">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center font-medium underline-offset-4 hover:underline"
                >
                  HOZGO on Facebook
                </a>
              </li>
            </ul>
          </header>

          <div className="min-w-0">
            {done ? (
              <SubmitSuccess title="Thank you. We have your message and one of us will reply." />
            ) : (
              <form
                ref={formRef}
                noValidate
                onSubmit={handleSubmit(onValid, () => scrollToFirstError(formRef.current))}
                className="card-elevated relative space-y-5 p-5 sm:p-8"
                aria-label="Contact HOZGO"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="name" label="Your name" error={err("name")}>
                    <Input id="name" {...register("name")} autoComplete="name" className={controlClass} {...describedBy("name", { error: err("name") })} />
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
                <Field id="phone" label="Phone" optional error={err("phone")}>
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
                <Field id="topic" label="What is it about?" error={err("topic")}>
                  <select id="topic" {...register("topic")} className={nativeSelectClass} {...describedBy("topic", { error: err("topic") })}>
                    <option value="">Choose one</option>
                    {TOPICS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="message" label="Message" error={err("message")}>
                  <Textarea id="message" {...register("message")} rows={6} className="text-base" {...describedBy("message", { error: err("message") })} />
                </Field>
                <HoneypotField registration={register("website")} />

                {mailto && <SubmitError mailto={mailto} />}

                <Button type="submit" size="lg" className="h-12 w-full text-base sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
                  Send
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
