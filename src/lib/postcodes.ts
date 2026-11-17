import { normalisePostcode, UK_POSTCODE_REGEX } from "./validation";

export interface PostcodeResult {
  postcode: string;
  town: string;
  lat: number;
  lng: number;
}

export type PostcodeLookup =
  | { ok: true; result: PostcodeResult }
  | { ok: false; reason: "invalid" | "not_found" | "network" };

const cache = new Map<string, PostcodeResult | null>();

interface PostcodesIoResult {
  postcode: string;
  latitude: number | null;
  longitude: number | null;
  admin_district: string | null;
  parish: string | null;
  post_town?: string | null;
}

function pickTown(r: PostcodesIoResult): string {
  const parish = r.parish?.replace(/,?\s*unparished area$/i, "").trim();
  return parish || r.admin_district || "";
}

/** Look up a UK postcode on postcodes.io. Results (including "not found") are cached in memory. */
export async function lookupPostcodeDetailed(input: string): Promise<PostcodeLookup> {
  const pc = normalisePostcode(input);
  if (!UK_POSTCODE_REGEX.test(pc)) return { ok: false, reason: "invalid" };

  if (cache.has(pc)) {
    const hit = cache.get(pc);
    return hit ? { ok: true, result: hit } : { ok: false, reason: "not_found" };
  }

  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
    if (res.status === 404) {
      cache.set(pc, null);
      return { ok: false, reason: "not_found" };
    }
    if (!res.ok) return { ok: false, reason: "network" };
    const json = (await res.json()) as { result?: PostcodesIoResult };
    const r = json.result;
    if (!r || typeof r.latitude !== "number" || typeof r.longitude !== "number") {
      cache.set(pc, null);
      return { ok: false, reason: "not_found" };
    }
    const result: PostcodeResult = { postcode: r.postcode, town: pickTown(r), lat: r.latitude, lng: r.longitude };
    cache.set(pc, result);
    return { ok: true, result };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export async function lookupPostcode(input: string): Promise<PostcodeResult | null> {
  const r = await lookupPostcodeDetailed(input);
  return r.ok ? r.result : null;
}
