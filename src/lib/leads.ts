import { CONTACT_EMAIL } from "./site";

export type LeadKind = "quote" | "transporter_setup" | "enquiry";

export interface LeadFields {
  name: string;
  email: string;
  phone?: string;
  /** Honeypot. Real people never fill it. */
  website?: string;
  payload: Record<string, unknown>;
}

export type LeadResult = { ok: true; leadId: string | null } | { ok: false; status: number; message: string };

export const LEAD_FAILURE_MESSAGE =
  "We could not send that just now. Email us at info@hozgo.co.uk and we will sort it.";

const TIMEOUT_MS = 15_000;

function leadEndpoint(): string | null {
  const explicit = import.meta.env.VITE_LEAD_ENDPOINT;
  if (explicit) return explicit;
  const base = import.meta.env.VITE_SUPABASE_URL;
  return base ? `${base.replace(/\/$/, "")}/functions/v1/website-lead` : null;
}

/** Drop undefined values (and empty strings) so only real answers are sent. */
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = typeof v === "string" ? v.trim() : v;
  }
  return out as Partial<T>;
}

export async function submitLead(kind: LeadKind, fields: LeadFields): Promise<LeadResult> {
  const url = leadEndpoint();
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url) return { ok: false, status: 0, message: LEAD_FAILURE_MESSAGE };

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (key) {
    headers.apikey = key;
    headers.Authorization = `Bearer ${key}`;
  }

  const body = {
    kind,
    name: fields.name.trim(),
    email: fields.email.trim(),
    ...(fields.phone && fields.phone.trim() ? { phone: fields.phone.trim() } : {}),
    website: fields.website ?? "",
    payload: fields.payload,
  };

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: controller.signal });
    const json = (await res.json().catch(() => null)) as { ok?: boolean; leadId?: string | null; error?: string } | null;
    if (res.ok && json?.ok === true) {
      return { ok: true, leadId: typeof json.leadId === "string" ? json.leadId : null };
    }
    return { ok: false, status: res.status, message: LEAD_FAILURE_MESSAGE };
  } catch {
    return { ok: false, status: 0, message: LEAD_FAILURE_MESSAGE };
  } finally {
    window.clearTimeout(timer);
  }
}

const SUBJECTS: Record<LeadKind, string> = {
  quote: "Journey request",
  transporter_setup: "Transporter set-up request",
  enquiry: "Website enquiry",
};

/**
 * Build a mailto: link to info@hozgo.co.uk with a plain-text summary,
 * for when the lead endpoint is down. `fields` is an ordered list of label/value pairs.
 */
export function buildMailtoFallback(
  kind: LeadKind,
  fields: Array<[label: string, value: string | number | boolean | null | undefined]>,
): string {
  const lines = fields
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([label, v]) => `${label}: ${typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)}`);
  const name = fields.find(([l]) => l === "Name")?.[1];
  const subject = `${SUBJECTS[kind]}${name ? ` from ${String(name)}` : ""}`;
  const body = `${lines.join("\n")}\n\nSent from the HOZGO website form.`;
  // Keep under typical mail client limits.
  const trimmed = body.length > 1800 ? `${body.slice(0, 1800)}\n...` : body;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(trimmed)}`;
}
