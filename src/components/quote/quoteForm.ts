import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldErrors, Resolver } from "react-hook-form";
import {
  cleanAddressText,
  dateNotInPast,
  email,
  personName,
  todayLondon,
  ukPhone,
  ukPostcode,
} from "@/lib/validation";
import type { GuidePriceInput, QuoteVehicleType } from "@/lib/guidePrice";

export const REASONS = [
  { value: "show_event", label: "Show or event" },
  { value: "moving_yard", label: "Moving yard" },
  { value: "vet_trip", label: "Vet trip" },
  { value: "sale_viewing", label: "Sale or viewing" },
  { value: "other", label: "Other" },
] as const;

export const JOURNEY_TYPES = [
  { value: "one_way", label: "One way" },
  { value: "return", label: "Return the same day", description: "The transporter waits." },
] as const;

export const TIMES_OF_DAY = [
  { value: "any", label: "Any" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
] as const;

export const FLEXIBILITY = [
  { value: "fixed", label: "No, fixed" },
  { value: "few_days", label: "Within a few days" },
  { value: "any", label: "Any time" },
] as const;

export const HORSE_TYPES = [
  { value: "horse", label: "Horse" },
  { value: "pony", label: "Pony" },
  { value: "mixed", label: "Mixed" },
] as const;

export const VEHICLES = [
  { value: "3_5t", label: "3.5t lorry or trailer", description: "Up to 2 horses" },
  { value: "7_5t", label: "7.5t lorry" },
  { value: "hgv", label: "HGV", description: "More than 4 horses" },
] as const;

export const VEHICLE_TO_QUOTE_TYPE: Record<VehicleNeeded, QuoteVehicleType> = {
  "3_5t": "standard",
  "7_5t": "multi_horse",
  hgv: "multi_horse",
};

type Values<T extends ReadonlyArray<{ value: string }>> = T[number]["value"];
export type Reason = Values<typeof REASONS>;
export type VehicleNeeded = Values<typeof VEHICLES>;

const enumOf = <T extends ReadonlyArray<{ value: string }>>(opts: T, message: string) =>
  z.enum(opts.map((o) => o.value) as [Values<T>, ...Values<T>[]], { errorMap: () => ({ message }) });

export const MAX_HORSES = 6;

const optionalText = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters`);

export const quoteSchema = z
  .object({
    reason: enumOf(REASONS, "Choose a reason for the journey"),
    reasonOther: optionalText(200),
    journeyType: enumOf(JOURNEY_TYPES, "Choose one way or return"),
    waitingHours: z.string(),

    collectionIsMe: z.boolean(),
    collectionContactName: z.string(),
    collectionContactPhone: z.string(),
    deliveryIsMe: z.boolean(),
    deliveryContactName: z.string(),
    deliveryContactPhone: z.string(),

    collectionAddressLine: z.string().trim().min(3, "Enter the yard or house name and road").max(200),
    collectionPostcode: ukPostcode,
    collectionTown: z.string().trim().min(2, "Enter the town").max(100),
    collectionAccessNotes: optionalText(500),
    collectionLat: z.number().nullable(),
    collectionLng: z.number().nullable(),

    deliveryAddressLine: z.string().trim().min(3, "Enter the yard or house name and road").max(200),
    deliveryPostcode: ukPostcode,
    deliveryTown: z.string().trim().min(2, "Enter the town").max(100),
    deliveryAccessNotes: optionalText(500),
    deliveryLat: z.number().nullable(),
    deliveryLng: z.number().nullable(),

    preferredDate: dateNotInPast,
    timeOfDay: enumOf(TIMES_OF_DAY, "Choose a time of day"),
    flexibility: enumOf(FLEXIBILITY, "Tell us if the date can move"),
    emergencyToday: z.boolean(),

    horseCount: z.number().int().min(1).max(MAX_HORSES),
    horseType: enumOf(HORSE_TYPES, "Choose what is travelling"),
    horseNames: z.array(z.string().trim().max(60, "Keep names under 60 characters")),

    vehicleNeeded: enumOf(VEHICLES, "Choose the vehicle you need"),

    name: personName,
    email,
    phone: ukPhone,
    notes: optionalText(2000),
    consent: z.boolean().refine((v) => v, "Tick the box so we can contact you about this journey"),
    website: z.string(),
  })
;

export type QuoteFormValues = z.input<typeof quoteSchema>;

/**
 * Rules that depend on other answers. Kept outside the zod object because zod skips
 * superRefine until every base field passes, which would hide these errors on the first submit.
 */
export function conditionalQuoteErrors(v: QuoteFormValues): Record<string, string> {
  const out: Record<string, string> = {};
  if (v.reason === "other" && (v.reasonOther ?? "").trim().length < 2) out.reasonOther = "Tell us the reason";
  if (v.journeyType === "return") {
    const h = Number(v.waitingHours);
    if (!Number.isInteger(h) || h < 1 || h > 12) out.waitingHours = "Choose how long the transporter waits";
  }
  for (const side of ["collection", "delivery"] as const) {
    if (v[`${side}IsMe`]) continue;
    if (!personName.safeParse(v[`${side}ContactName`] ?? "").success) out[`${side}ContactName`] = "Enter who will be there";
    const p = ukPhone.safeParse(v[`${side}ContactPhone`] ?? "");
    if (!p.success) out[`${side}ContactPhone`] = p.error.issues[0].message;
  }
  return out;
}

/** zod resolver plus the conditional rules, so every error shows on the first submit. */
export const quoteResolver: Resolver<QuoteFormValues> = async (values, context, options) => {
  const base = await zodResolver(quoteSchema)(values, context, options);
  const extra = conditionalQuoteErrors(values);
  const names = Object.keys(extra);
  if (!names.length) return base;
  const errors: FieldErrors<QuoteFormValues> = { ...(base.errors as FieldErrors<QuoteFormValues>) };
  for (const name of names) {
    (errors as Record<string, unknown>)[name] = { type: "custom", message: extra[name] };
  }
  return { values: {}, errors };
};


export const quoteDefaults: QuoteFormValues = {
  reason: undefined as unknown as Reason,
  reasonOther: "",
  journeyType: "one_way",
  waitingHours: "",
  collectionIsMe: false,
  collectionContactName: "",
  collectionContactPhone: "",
  deliveryIsMe: false,
  deliveryContactName: "",
  deliveryContactPhone: "",
  collectionAddressLine: "",
  collectionPostcode: "",
  collectionTown: "",
  collectionAccessNotes: "",
  collectionLat: null,
  collectionLng: null,
  deliveryAddressLine: "",
  deliveryPostcode: "",
  deliveryTown: "",
  deliveryAccessNotes: "",
  deliveryLat: null,
  deliveryLng: null,
  preferredDate: "",
  timeOfDay: "any",
  flexibility: "fixed",
  emergencyToday: false,
  horseCount: 1,
  horseType: "horse",
  horseNames: Array.from({ length: MAX_HORSES }, () => ""),
  vehicleNeeded: undefined as unknown as VehicleNeeded,
  name: "",
  email: "",
  phone: "",
  notes: "",
  consent: false,
  website: "",
};

export function isEmergencyApplicable(v: Pick<QuoteFormValues, "preferredDate" | "emergencyToday">) {
  return v.emergencyToday && v.preferredDate === todayLondon();
}

function addressString(line: string, town: string, postcode: string) {
  return cleanAddressText([line, town, postcode].map((s) => s.trim()).filter(Boolean).join(", "));
}

/** The booking-quote input for the current values, or null when something it needs is missing. */
export function buildGuideInput(v: QuoteFormValues): GuidePriceInput | null {
  if (v.collectionLat == null || v.collectionLng == null || v.deliveryLat == null || v.deliveryLng == null) return null;
  if (!v.preferredDate || !v.vehicleNeeded || !v.horseCount) return null;
  const pickupAddress = addressString(v.collectionAddressLine, v.collectionTown, v.collectionPostcode);
  const dropoffAddress = addressString(v.deliveryAddressLine, v.deliveryTown, v.deliveryPostcode);
  if (pickupAddress.length < 3 || dropoffAddress.length < 3) return null;
  return {
    pickupAddress: pickupAddress.slice(0, 500),
    dropoffAddress: dropoffAddress.slice(0, 500),
    pickupLat: v.collectionLat,
    pickupLng: v.collectionLng,
    dropoffLat: v.deliveryLat,
    dropoffLng: v.deliveryLng,
    horseCount: v.horseCount,
    vehicleType: VEHICLE_TO_QUOTE_TYPE[v.vehicleNeeded],
    scheduledPickupDate: v.preferredDate,
    highPriorityRequested: isEmergencyApplicable(v),
  };
}

/**
 * The fields that change the price. Addresses text is left out on purpose:
 * the price comes from coordinates, so editing "Yard gate" notes does not make it stale.
 */
export function priceSignature(v: QuoteFormValues): string {
  return JSON.stringify([
    v.collectionLat,
    v.collectionLng,
    v.deliveryLat,
    v.deliveryLng,
    v.preferredDate,
    v.horseCount,
    v.vehicleNeeded ? VEHICLE_TO_QUOTE_TYPE[v.vehicleNeeded] : null,
    isEmergencyApplicable(v),
  ]);
}

export const REASON_LABEL = Object.fromEntries(REASONS.map((o) => [o.value, o.label])) as Record<string, string>;
const label = (opts: ReadonlyArray<{ value: string; label: string }>, v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;

export function contactFor(v: QuoteFormValues, side: "collection" | "delivery") {
  return v[`${side}IsMe`]
    ? { name: v.name.trim(), phone: v.phone.trim() }
    : { name: v[`${side}ContactName`].trim(), phone: v[`${side}ContactPhone`].trim() };
}

export function horseNamesFor(v: QuoteFormValues): string[] {
  return v.horseNames.slice(0, v.horseCount).map((n) => n.trim()).filter(Boolean);
}

/** Payload for website-lead kind "quote". Only the agreed keys, undefined dropped by the caller. */
export function buildQuotePayload(
  v: QuoteFormValues,
  guide: { totalGbp: number; distanceMiles: number } | null,
): Record<string, unknown> {
  const col = contactFor(v, "collection");
  const del = contactFor(v, "delivery");
  const names = horseNamesFor(v);
  return {
    reason: v.reason,
    reasonOther: v.reason === "other" ? v.reasonOther : undefined,
    journeyType: v.journeyType,
    waitingHours: v.journeyType === "return" ? Number(v.waitingHours) : undefined,
    collectionContactName: col.name,
    collectionContactPhone: col.phone,
    deliveryContactName: del.name,
    deliveryContactPhone: del.phone,
    collectionAddressLine: v.collectionAddressLine,
    collectionPostcode: v.collectionPostcode,
    collectionTown: v.collectionTown,
    collectionAccessNotes: v.collectionAccessNotes,
    collectionLat: v.collectionLat ?? undefined,
    collectionLng: v.collectionLng ?? undefined,
    deliveryAddressLine: v.deliveryAddressLine,
    deliveryPostcode: v.deliveryPostcode,
    deliveryTown: v.deliveryTown,
    deliveryAccessNotes: v.deliveryAccessNotes,
    deliveryLat: v.deliveryLat ?? undefined,
    deliveryLng: v.deliveryLng ?? undefined,
    preferredDate: v.preferredDate,
    timeOfDay: v.timeOfDay,
    flexibility: v.flexibility,
    emergencyToday: isEmergencyApplicable(v),
    horseCount: v.horseCount,
    horseType: v.horseType,
    horseNames: names.length ? names : undefined,
    vehicleNeeded: v.vehicleNeeded,
    guidePriceGbp: guide ? guide.totalGbp : null,
    guideDistanceMiles: guide ? guide.distanceMiles : null,
    notes: v.notes,
  };
}

/** One-line journey summary for the sent page. */
export function journeySummary(v: QuoteFormValues): string {
  const one = v.horseCount === 1;
  const noun =
    v.horseType === "pony" ? (one ? "pony" : "ponies") : v.horseType === "mixed" && !one ? "horses and ponies" : one ? "horse" : "horses";
  const horses = `${v.horseCount} ${noun}`;
  const from = [v.collectionTown, v.collectionPostcode].filter(Boolean).join(" ");
  const to = [v.deliveryTown, v.deliveryPostcode].filter(Boolean).join(" ");
  return `${horses}, ${from} to ${to}, ${formatDate(v.preferredDate)}`;
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

/** Plain-text summary lines for the email fallback. */
export function quoteMailFields(
  v: QuoteFormValues,
  guide: { totalGbp: number; distanceMiles: number } | null,
): Array<[string, string | number | boolean | null | undefined]> {
  const col = contactFor(v, "collection");
  const del = contactFor(v, "delivery");
  return [
    ["Name", v.name],
    ["Email", v.email],
    ["Phone", v.phone],
    ["Reason", v.reason === "other" ? `Other: ${v.reasonOther}` : REASON_LABEL[v.reason]],
    ["Journey", v.journeyType === "return" ? `Return the same day, waiting ${v.waitingHours} hours` : "One way"],
    ["At collection", `${col.name}, ${col.phone}`],
    ["At delivery", `${del.name}, ${del.phone}`],
    ["Collection", [v.collectionAddressLine, v.collectionTown, v.collectionPostcode].filter(Boolean).join(", ")],
    ["Collection access", v.collectionAccessNotes],
    ["Delivery", [v.deliveryAddressLine, v.deliveryTown, v.deliveryPostcode].filter(Boolean).join(", ")],
    ["Delivery access", v.deliveryAccessNotes],
    ["Date", formatDate(v.preferredDate)],
    ["Time of day", label(TIMES_OF_DAY, v.timeOfDay)],
    ["Date flexible", label(FLEXIBILITY, v.flexibility)],
    ["Emergency today", isEmergencyApplicable(v) ? true : undefined],
    ["Horses", `${v.horseCount}, ${label(HORSE_TYPES, v.horseType)}`],
    ["Horse names", horseNamesFor(v).join(", ")],
    ["Vehicle", v.vehicleNeeded ? label(VEHICLES, v.vehicleNeeded) : ""],
    ["Guide price", guide ? `£${guide.totalGbp.toFixed(2)}` : ""],
    ["Notes", v.notes],
  ];
}
