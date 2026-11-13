/** sessionStorage helpers that never throw (private mode, blocked storage). */
export const QUOTE_DRAFT_KEY = "hozgo.quote.draft";
export const QUOTE_SENT_KEY = "hozgo.quote.sent";

export function readSession<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function removeSession(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}

export interface QuoteSentState {
  leadId: string | null;
  email: string;
  guidePriceGbp: number | null;
  summary: string;
}
