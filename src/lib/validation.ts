import { z } from "zod";

/** UK postcode, loose enough for real input, strict enough to stop typos. */
export const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;

/** Uppercase, collapse spaces, and put a single space before the inward code. */
export function normalisePostcode(input: string): string {
  const compact = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (compact.length < 5) return compact;
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

/** Today's date as YYYY-MM-DD in Europe/London, which is what the booking functions use. */
export function todayLondon(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateOnly(value: string): boolean {
  if (!DATE_ONLY_REGEX.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

export const ukPhone = z
  .string()
  .trim()
  .min(1, "Enter a phone number")
  .refine((v) => /^[\d\s+]+$/.test(v), "Use digits, spaces and + only")
  .refine((v) => {
    const n = countDigits(v);
    return n >= 10 && n <= 15;
  }, "Enter a full UK phone number");

export const optionalUkPhone = z
  .string()
  .trim()
  .refine((v) => v === "" || /^[\d\s+]+$/.test(v), "Use digits, spaces and + only")
  .refine((v) => {
    if (v === "") return true;
    const n = countDigits(v);
    return n >= 10 && n <= 15;
  }, "Enter a full UK phone number");

export const ukPostcode = z
  .string()
  .trim()
  .min(1, "Enter a postcode")
  .refine((v) => UK_POSTCODE_REGEX.test(v), "Enter a full UK postcode, for example CV35 9EE");

export const email = z.string().trim().min(1, "Enter your email").email("Enter a valid email address");

export const personName = z.string().trim().min(2, "Enter a name").max(120, "Keep this under 120 characters");

export const dateNotInPast = z
  .string()
  .min(1, "Choose a date")
  .refine(isValidDateOnly, "Choose a valid date")
  .refine((v) => v >= todayLondon(), "Choose today or a later date");

/** Characters the booking-quote function accepts in an address string. */
export function cleanAddressText(value: string): string {
  return value
    .replace(/[^\p{L}\p{N}\s.,'\-#&/()]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}
