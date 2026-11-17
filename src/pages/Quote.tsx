import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PageMeta } from "@/components/layout/PageMeta";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Field, controlClass, describedBy, nativeSelectClass } from "@/components/forms/Field";
import { RadioCards } from "@/components/forms/RadioCards";
import { Stepper } from "@/components/forms/Stepper";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { CheckRow, ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { SubmitError } from "@/components/forms/SubmitState";
import { scrollToFirstError } from "@/components/forms/scrollToFirstError";
import { FormSection } from "@/components/quote/FormSection";
import { GuidePricePanel, type GuideState } from "@/components/quote/GuidePricePanel";
import { PostcodeField } from "@/components/quote/PostcodeField";
import { useMediaQuery } from "@/components/quote/useMediaQuery";
import {
  QUOTE_DRAFT_KEY,
  QUOTE_SENT_KEY,
  readSession,
  removeSession,
  writeSession,
  type QuoteSentState,
} from "@/components/quote/storage";
import {
  FLEXIBILITY,
  HORSE_TYPES,
  JOURNEY_TYPES,
  MAX_HORSES,
  REASONS,
  TIMES_OF_DAY,
  VEHICLES,
  buildGuideInput,
  buildQuotePayload,
  journeySummary,
  priceSignature,
  quoteDefaults,
  quoteMailFields,
  quoteResolver,
  type QuoteFormValues,
} from "@/components/quote/quoteForm";
import { fetchGuidePrice, type GuidePriceResponse } from "@/lib/guidePrice";
import { buildMailtoFallback, compact, submitLead } from "@/lib/leads";
import { lookupPostcode } from "@/lib/postcodes";
import { isValidDateOnly, normalisePostcode, todayLondon, UK_POSTCODE_REGEX } from "@/lib/validation";

interface Draft {
  values: QuoteFormValues;
  guide?: GuidePriceResponse | null;
  guideSig?: string | null;
}

const CONSENT_TEXT =
  "I'm happy for HOZGO to contact me about this journey and to share the journey details (not my name or number) with HOZGO Approved transporters.";

const SIDES = ["collection", "delivery"] as const;
type Side = (typeof SIDES)[number];

/** Draft from this tab's session, then URL params from the home page mini form on top. */
function loadInitial(params: URLSearchParams): { draft: Draft; fromParams: boolean } {
  const saved = readSession<Draft>(QUOTE_DRAFT_KEY);
  const values: QuoteFormValues = {
    ...quoteDefaults,
    ...(saved?.values ?? {}),
    website: "",
  };
  if (!Array.isArray(values.horseNames) || values.horseNames.length < MAX_HORSES) {
    values.horseNames = Array.from({ length: MAX_HORSES }, (_, i) => values.horseNames?.[i] ?? "");
  }
  const from = params.get("from");
  const to = params.get("to");
  const horses = params.get("horses");
  const date = params.get("date");
  const fromParams = Boolean(from || to || horses || date);

  const applyPostcode = (side: Side, raw: string | null) => {
    if (!raw) return;
    const pc = normalisePostcode(raw);
    if (!UK_POSTCODE_REGEX.test(pc) || pc === values[`${side}Postcode`]) return;
    values[`${side}Postcode`] = pc;
    values[`${side}Lat`] = null;
    values[`${side}Lng`] = null;
    values[`${side}Town`] = "";
  };
  applyPostcode("collection", from);
  applyPostcode("delivery", to);
  if (horses) {
    const n = Number.parseInt(horses, 10);
    if (Number.isFinite(n)) values.horseCount = Math.min(MAX_HORSES, Math.max(1, n));
  }
  if (date && isValidDateOnly(date) && date >= todayLondon()) values.preferredDate = date;
  if (values.preferredDate && values.preferredDate < todayLondon()) values.preferredDate = "";

  // A saved price whose signature no longer matches is kept, so the panel can say "out of date".
  const guide = saved?.guide ?? null;
  const guideSig = guide ? saved?.guideSig ?? null : null;
  return { draft: { values, guide, guideSig }, fromParams };
}

export default function Quote() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const submitErrorRef = useRef<HTMLDivElement>(null);

  const initial = useMemo(() => loadInitial(params), []);

  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: quoteResolver,
    shouldFocusError: false,
    defaultValues: initial.draft.values,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [guide, setGuide] = useState<GuideState>(
    initial.draft.guide ? { status: "ready", data: initial.draft.guide } : { status: "empty" },
  );
  const [guideSig, setGuideSig] = useState<string | null>(initial.draft.guideSig ?? null);
  const [mailto, setMailto] = useState<string | null>(null);
  const lastGuideCall = useRef(0);
  const guideAbort = useRef<AbortController | null>(null);

  const values = watch();
  const today = todayLondon();
  const isToday = values.preferredDate === today;
  const currentSig = priceSignature(values);
  const stale = guide.status === "ready" && guideSig !== currentSig;

  // Strip the mini-form params once applied so a refresh does not overwrite later edits.
  useEffect(() => {
    if (initial.fromParams) setParams({}, { replace: true });
  }, []);

  // Resolve postcodes that arrived without coordinates (URL params, older drafts).
  useEffect(() => {
    for (const side of SIDES) {
      const v = getValues();
      if (v[`${side}Postcode`] && v[`${side}Lat`] == null && UK_POSTCODE_REGEX.test(v[`${side}Postcode`])) {
        void lookupPostcode(v[`${side}Postcode`]).then((r) => {
          if (!r || getValues(`${side}Postcode`) !== v[`${side}Postcode`]) return;
          applyResolved(side, r);
        });
      }
    }
  }, []);

  // Keep a draft in sessionStorage so a refresh keeps the form.
  const guideRef = useRef<{ guide: GuideState; sig: string | null }>({ guide, sig: guideSig });
  guideRef.current = { guide, sig: guideSig };
  const saveTimer = useRef<number | undefined>();
  const saveDraft = useCallback(() => {
    const g = guideRef.current;
    const { website: _hp, ...rest } = getValues();
    void _hp;
    writeSession(QUOTE_DRAFT_KEY, {
      values: { ...rest, website: "" },
      guide: g.guide.status === "ready" ? g.guide.data : null,
      guideSig: g.guide.status === "ready" ? g.sig : null,
    } satisfies Draft);
  }, [getValues]);
  useEffect(() => {
    const sub = watch(() => {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(saveDraft, 300);
    });
    return () => {
      sub.unsubscribe();
      window.clearTimeout(saveTimer.current);
    };
  }, [watch, saveDraft]);
  useEffect(() => {
    saveDraft();
  }, [guide, guideSig, saveDraft]);

  // "That's me" copies the contact from Your details.
  useEffect(() => {
    for (const side of SIDES) {
      if (!getValues(`${side}IsMe`)) continue;
      if (getValues(`${side}ContactName`) !== values.name) setValue(`${side}ContactName`, values.name);
      if (getValues(`${side}ContactPhone`) !== values.phone) setValue(`${side}ContactPhone`, values.phone);
    }
  }, [values.collectionIsMe, values.deliveryIsMe, values.name, values.phone, getValues, setValue]);

  function applyResolved(side: Side, r: { postcode: string; town: string; lat: number; lng: number }) {
    setValue(`${side}Postcode`, r.postcode, { shouldValidate: true });
    setValue(`${side}Lat`, r.lat);
    setValue(`${side}Lng`, r.lng);
    if (!getValues(`${side}Town`).trim() && r.town) setValue(`${side}Town`, r.town, { shouldValidate: true });
  }
  function clearResolved(side: Side) {
    setValue(`${side}Lat`, null);
    setValue(`${side}Lng`, null);
  }

  async function showGuidePrice() {
    if (guide.status === "loading") return;
    const v = getValues();
    const bothPostcodes = v.collectionLat != null && v.deliveryLat != null;
    if (!bothPostcodes) {
      await trigger(["collectionPostcode", "deliveryPostcode"]);
      setGuide({ status: "error", message: "Enter both postcodes and press Find to see a guide price." });
      revealPanel();
      return;
    }
    const ok = await trigger(["preferredDate", "vehicleNeeded", "horseCount"]);
    const input = buildGuideInput(v);
    if (!ok || !input) {
      setGuide({ status: "error", message: "Choose a date and the vehicle you need to see a guide price." });
      scrollToFirstError(formRef.current);
      return;
    }
    const sig = priceSignature(v);
    if (guide.status === "ready" && sig === guideSig) {
      revealPanel();
      return;
    }
    // The function allows 10 calls a minute per IP. Do not let a double tap spend two.
    const now = Date.now();
    if (now - lastGuideCall.current < 1500) return;
    lastGuideCall.current = now;

    guideAbort.current?.abort();
    const ctrl = new AbortController();
    guideAbort.current = ctrl;
    setGuide({ status: "loading" });
    revealPanel();
    const r = await fetchGuidePrice(input, ctrl.signal);
    if (ctrl.signal.aborted) return;
    if (r.ok) {
      setGuide({ status: "ready", data: r.data });
      setGuideSig(sig);
    } else {
      setGuide({ status: "error", message: r.message });
    }
    // Again once the result has rendered: the panel changes height, which can cut the first scroll short.
    revealPanel();
  }

  function revealPanel() {
    if (!isDesktop) {
      window.requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  const onValid = async (v: QuoteFormValues) => {
    setMailto(null);
    const guideForLead =
      guide.status === "ready" && !stale ? { totalGbp: guide.data.fare.total, distanceMiles: guide.data.distanceMiles } : null;
    const payload = compact(buildQuotePayload(v, guideForLead));
    const result = await submitLead("quote", {
      name: v.name,
      email: v.email,
      phone: v.phone,
      website: v.website,
      payload,
    });
    if (result.ok) {
      const state: QuoteSentState = {
        leadId: result.leadId,
        email: v.email.trim(),
        guidePriceGbp: guideForLead?.totalGbp ?? null,
        summary: journeySummary(v),
      };
      window.clearTimeout(saveTimer.current);
      writeSession(QUOTE_SENT_KEY, state);
      removeSession(QUOTE_DRAFT_KEY);
      navigate("/quote/sent", { state });
      return;
    }
    setMailto(buildMailtoFallback("quote", quoteMailFields(v, guideForLead)));
    window.requestAnimationFrame(() => submitErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const panel = (
    <GuidePricePanel
      state={guide}
      stale={stale}
      onRefresh={() => void showGuidePrice()}
      canRefresh={guide.status !== "loading"}
    />
  );

  const err = (name: keyof QuoteFormValues) => errors[name]?.message as string | undefined;

  return (
    <>
      <PageMeta
        title="Get a guide price and request a quote"
        description="Enter your journey to see a guide price, send it to HOZGO, then finish the booking in the app where your card is held, not charged."
      />
      <Container className="py-12 sm:py-16">
        <header className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Get a quote</p>
          <h1 className="text-3xl sm:text-4xl">Get a guide price and request a quote</h1>
          <p className="mt-4 text-base text-muted-foreground">
            Enter your journey to see a guide price. Send it to us. Then finish the booking in the app, where your card is
            held, not charged.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit(onValid, () => scrollToFirstError(formRef.current))}
            className="relative min-w-0 space-y-12"
            aria-label="Journey details"
          >
            {/* 1. This journey */}
            <FormSection n={1} title="This journey">
              <Field id="reason" label="What is the journey for?" as="group" error={err("reason")}>
                <Controller
                  control={control}
                  name="reason"
                  render={({ field }) => (
                    <RadioCards
                      id="reason"
                      value={field.value}
                      onChange={field.onChange}
                      options={REASONS}
                      invalid={Boolean(errors.reason)}
                      columns="sm:grid-cols-2 xl:grid-cols-3"
                    />
                  )}
                />
              </Field>
              {values.reason === "other" && (
                <Field id="reasonOther" label="Tell us the reason" error={err("reasonOther")}>
                  <Input
                    id="reasonOther"
                    {...register("reasonOther")}
                    className={controlClass}
                    {...describedBy("reasonOther", { error: err("reasonOther") })}
                  />
                </Field>
              )}
              <Field id="journeyType" label="Journey" as="group" error={err("journeyType")}>
                <Controller
                  control={control}
                  name="journeyType"
                  render={({ field }) => (
                    <RadioCards
                      id="journeyType"
                      value={field.value}
                      onChange={field.onChange}
                      options={JOURNEY_TYPES}
                      invalid={Boolean(errors.journeyType)}
                    />
                  )}
                />
              </Field>
              {values.journeyType === "return" && (
                <Field id="waitingHours" label="Waiting time" hint="How long the transporter waits before the return leg." error={err("waitingHours")}>
                  <select
                    id="waitingHours"
                    {...register("waitingHours")}
                    className={nativeSelectClass}
                    {...describedBy("waitingHours", { error: err("waitingHours"), hint: true })}
                  >
                    <option value="">Choose hours</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={String(h)}>
                        {h} {h === 1 ? "hour" : "hours"}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </FormSection>

            {/* 2. Who's there on the day */}
            <FormSection n={2} title="Who's there on the day" intro="Often not you. The transporter calls them on arrival.">
              {SIDES.map((side) => {
                const isMe = values[`${side}IsMe`];
                const nameId = `${side}ContactName` as const;
                const phoneId = `${side}ContactPhone` as const;
                return (
                  <fieldset key={side} className="space-y-4 rounded-lg border p-4 sm:p-5">
                    <legend className="px-1 text-sm font-semibold">{side === "collection" ? "At collection" : "At delivery"}</legend>
                    <Controller
                      control={control}
                      name={`${side}IsMe`}
                      render={({ field }) => (
                        <CheckRow id={`${side}IsMe`} checked={field.value} onChange={field.onChange}>
                          That's me
                        </CheckRow>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id={nameId} label="Name" error={isMe ? undefined : err(nameId)}>
                        <Input
                          id={nameId}
                          {...register(nameId)}
                          readOnly={isMe}
                          aria-readonly={isMe || undefined}
                          autoComplete="off"
                          className={`${controlClass} ${isMe ? "bg-secondary text-muted-foreground" : ""}`}
                          {...describedBy(nameId, { error: isMe ? undefined : err(nameId) })}
                        />
                      </Field>
                      <Field id={phoneId} label="Mobile" error={isMe ? undefined : err(phoneId)}>
                        <Input
                          id={phoneId}
                          type="tel"
                          inputMode="tel"
                          {...register(phoneId)}
                          readOnly={isMe}
                          aria-readonly={isMe || undefined}
                          autoComplete="off"
                          className={`${controlClass} ${isMe ? "bg-secondary text-muted-foreground" : ""}`}
                          {...describedBy(phoneId, { error: isMe ? undefined : err(phoneId) })}
                        />
                      </Field>
                    </div>
                    {isMe && <p className="text-sm text-muted-foreground">Copied from Your details at the end of the form.</p>}
                  </fieldset>
                );
              })}
            </FormSection>

            {/* 3. Addresses */}
            <FormSection n={3} title="Collection and delivery">
              {SIDES.map((side) => {
                const line = `${side}AddressLine` as const;
                const pc = `${side}Postcode` as const;
                const town = `${side}Town` as const;
                const notes = `${side}AccessNotes` as const;
                return (
                  <fieldset key={side} className="space-y-4">
                    <legend className="mb-2 text-lg font-semibold">{side === "collection" ? "Collection address" : "Delivery address"}</legend>
                    <Field id={line} label="Address line" error={err(line)}>
                      <Input
                        id={line}
                        {...register(line)}
                        placeholder="Yard or house name, road"
                        autoComplete={side === "collection" ? "section-collection address-line1" : "section-delivery address-line1"}
                        className={controlClass}
                        {...describedBy(line, { error: err(line) })}
                      />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <PostcodeField
                        id={pc}
                        label="Postcode"
                        value={values[pc]}
                        resolved={values[`${side}Lat`] != null}
                        error={err(pc)}
                        registration={register(pc)}
                        onResolved={(r) => applyResolved(side, r)}
                        onCleared={() => clearResolved(side)}
                      />
                      <Field id={town} label="Town" error={err(town)}>
                        <Input
                          id={town}
                          {...register(town)}
                          autoComplete={side === "collection" ? "section-collection address-level2" : "section-delivery address-level2"}
                          className={controlClass}
                          {...describedBy(town, { error: err(town) })}
                        />
                      </Field>
                    </div>
                    <Field id={notes} label="Access notes" optional error={err(notes)}>
                      <Textarea
                        id={notes}
                        {...register(notes)}
                        rows={2}
                        placeholder="Yard gate, field entrance, what3words if you use it"
                        className="text-base"
                        {...describedBy(notes, { error: err(notes) })}
                      />
                    </Field>
                  </fieldset>
                );
              })}
            </FormSection>

            {/* 4. Date */}
            <FormSection n={4} title="Date">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="preferredDate" label="Preferred date" error={err("preferredDate")}>
                  <Input
                    id="preferredDate"
                    type="date"
                    min={today}
                    {...register("preferredDate")}
                    className={controlClass}
                    {...describedBy("preferredDate", { error: err("preferredDate") })}
                  />
                </Field>
              </div>
              <Field id="timeOfDay" label="Time of day" as="group" error={err("timeOfDay")}>
                <Controller
                  control={control}
                  name="timeOfDay"
                  render={({ field }) => (
                    <RadioCards id="timeOfDay" value={field.value} onChange={field.onChange} options={TIMES_OF_DAY} columns="grid-cols-3" />
                  )}
                />
              </Field>
              <Field id="flexibility" label="Is the date flexible?" as="group" error={err("flexibility")}>
                <Controller
                  control={control}
                  name="flexibility"
                  render={({ field }) => (
                    <RadioCards id="flexibility" value={field.value} onChange={field.onChange} options={FLEXIBILITY} columns="sm:grid-cols-3" />
                  )}
                />
              </Field>
              {isToday && (
                <div className="rounded-lg border p-4" data-field="emergencyToday">
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="emergencyToday" className="text-sm font-semibold">
                      This is an emergency today
                    </label>
                    <Controller
                      control={control}
                      name="emergencyToday"
                      render={({ field }) => (
                        <Switch
                          id="emergencyToday"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-describedby="emergencyToday-hint"
                        />
                      )}
                    />
                  </div>
                  <p id="emergencyToday-hint" className="mt-2 text-sm text-muted-foreground">
                    For genuine emergencies, a horse needing a vet or an unsafe situation. Emergency jobs carry a surcharge.
                  </p>
                </div>
              )}
            </FormSection>

            {/* 5. Horses */}
            <FormSection n={5} title="Horses">
              <Field id="horseCount" label="How many?" as="group" error={err("horseCount")}>
                <Controller
                  control={control}
                  name="horseCount"
                  render={({ field }) => (
                    <Stepper id="horseCount" value={field.value} onChange={field.onChange} min={1} max={MAX_HORSES} unit={["horse", "horses"]} />
                  )}
                />
              </Field>
              <Field id="horseType" label="What's travelling?" as="group" error={err("horseType")}>
                <Controller
                  control={control}
                  name="horseType"
                  render={({ field }) => (
                    <RadioCards id="horseType" value={field.value} onChange={field.onChange} options={HORSE_TYPES} columns="grid-cols-3" />
                  )}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: values.horseCount }, (_, i) => {
                  const id = `horseNames.${i}` as const;
                  const e = errors.horseNames?.[i]?.message;
                  return (
                    <Field key={i} id={`horseName${i}`} label={values.horseCount === 1 ? "Horse's name" : `Horse ${i + 1} name`} optional error={e}>
                      <Input
                        id={`horseName${i}`}
                        {...register(id)}
                        autoComplete="off"
                        className={controlClass}
                        {...describedBy(`horseName${i}`, { error: e })}
                      />
                    </Field>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground">
                The app asks for each horse's sex, passport, travel history and any loading concerns when you book.
              </p>
            </FormSection>

            {/* 6. Vehicle */}
            <FormSection n={6} title="Vehicle needed">
              <Field id="vehicleNeeded" label="Which vehicle?" as="group" error={err("vehicleNeeded")}>
                <Controller
                  control={control}
                  name="vehicleNeeded"
                  render={({ field }) => (
                    <RadioCards
                      id="vehicleNeeded"
                      value={field.value}
                      onChange={field.onChange}
                      options={VEHICLES}
                      invalid={Boolean(errors.vehicleNeeded)}
                      columns="sm:grid-cols-3"
                    />
                  )}
                />
              </Field>
            </FormSection>

            {/* 7. Guide price */}
            <FormSection n={7} title="Guide price">
              <Button type="button" size="lg" className="h-12 w-full text-base sm:w-auto" onClick={() => void showGuidePrice()} disabled={guide.status === "loading"}>
                {guide.status === "loading" && <Loader2 className="animate-spin" aria-hidden="true" />}
                Show guide price
              </Button>
              {!isDesktop && (
                <div ref={panelRef} className="scroll-mt-24">
                  {panel}
                </div>
              )}
            </FormSection>

            {/* 8. Your details */}
            <FormSection n={8} title="Your details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="name" label="Your name" error={err("name")}>
                  <Input id="name" {...register("name")} autoComplete="name" className={controlClass} {...describedBy("name", { error: err("name") })} />
                </Field>
                <Field id="phone" label="Phone" error={err("phone")}>
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
              </div>
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
              <Field id="notes" label="Notes" optional error={err("notes")}>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  rows={4}
                  placeholder="Loading, temperament, access, timings"
                  className="text-base"
                  {...describedBy("notes", { error: err("notes") })}
                />
              </Field>
              <Controller
                control={control}
                name="consent"
                render={({ field }) => (
                  <ConsentCheckbox id="consent" checked={field.value} onChange={field.onChange} text={CONSENT_TEXT} error={err("consent")} />
                )}
              />
              <HoneypotField registration={register("website")} />

              {mailto && (
                <div ref={submitErrorRef}>
                  <SubmitError mailto={mailto} />
                </div>
              )}

              <div className="space-y-3">
                <Button type="submit" size="lg" className="h-12 w-full text-base sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
                  Send my journey
                </Button>
                <p className="text-sm text-muted-foreground">Nothing is paid on the website. Booking and the card hold happen in the app.</p>
              </div>
            </FormSection>
          </form>

          {isDesktop && (
            <aside aria-label="Guide price">
              <div className="sticky top-24">{panel}</div>
            </aside>
          )}
        </div>
      </Container>
    </>
  );
}
