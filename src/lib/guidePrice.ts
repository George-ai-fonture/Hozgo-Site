import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/site";
/** Client for the app's read-only booking-quote edge function. */

export type QuoteVehicleType = "standard" | "luxury" | "multi_horse" | "emergency";

/** Mirrors BookingQuoteRequestSchema in the app (strict, so no extra keys). */
export interface GuidePriceInput {
  pickupAddress: string;
  dropoffAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  horseCount: number;
  vehicleType: QuoteVehicleType;
  scheduledPickupDate: string;
  highPriorityRequested: boolean;
}

export interface GuidePriceFare {
  baseFee: number;
  distanceFee: number;
  pricingAdjustment?: number;
  additionalHorseFee: number;
  highPriorityFee?: number;
  minimumChargeFee?: number;
  onTheDayFee: number;
  outOfHoursFee: number;
  total: number;
}

export interface GuidePriceResponse {
  distanceMiles: number;
  pricingDistanceMiles?: number;
  quotePricePercentage?: number;
  etaMinutesEstimate?: number;
  fare: GuidePriceFare;
  vehicleType?: string;
  highPriorityRequested?: boolean;
  highPriorityFeePercentage?: number;
  warning?: string;
}

export type GuidePriceResult =
  | { ok: true; data: GuidePriceResponse }
  | { ok: false; status: number; message: string };

const GENERIC_ERROR = "We could not work out a guide price just now. Try again in a minute.";

export async function fetchGuidePrice(input: GuidePriceInput, signal?: AbortSignal): Promise<GuidePriceResult> {
  const base = SUPABASE_URL;
  const key = SUPABASE_ANON_KEY;
  if (!base || !key) return { ok: false, status: 0, message: GENERIC_ERROR };

  const body: GuidePriceInput = {
    pickupAddress: input.pickupAddress,
    dropoffAddress: input.dropoffAddress,
    pickupLat: input.pickupLat,
    pickupLng: input.pickupLng,
    dropoffLat: input.dropoffLat,
    dropoffLng: input.dropoffLng,
    horseCount: input.horseCount,
    vehicleType: input.vehicleType,
    scheduledPickupDate: input.scheduledPickupDate,
    highPriorityRequested: input.highPriorityRequested,
  };

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/functions/v1/booking-quote`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    const json = (await res.json().catch(() => null)) as (GuidePriceResponse & { error?: string }) | null;
    if (res.ok && json && json.fare && typeof json.fare.total === "number") {
      return { ok: true, data: json };
    }
    if (res.status === 429) {
      return { ok: false, status: 429, message: "Too many price checks in a minute. Wait a moment and try again." };
    }
    if (res.status === 400 && json?.error) {
      return { ok: false, status: 400, message: json.error };
    }
    return { ok: false, status: res.status, message: GENERIC_ERROR };
  } catch (err) {
    if ((err as Error)?.name === "AbortError") return { ok: false, status: 0, message: "Cancelled" };
    return { ok: false, status: 0, message: GENERIC_ERROR };
  }
}

export function formatGbp(amount: number, wholePounds = false): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: wholePounds ? 0 : 2,
    maximumFractionDigits: wholePounds ? 0 : 2,
  }).format(amount);
}
