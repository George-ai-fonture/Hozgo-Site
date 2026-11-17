export const SITE_NAME = "HOZGO";
export const SITE_URL = "https://hozgo.uk";
export const APP_URL: string = import.meta.env.VITE_APP_URL ?? "https://hozgo.co.uk";
export const APP_AUTH_URL = `${APP_URL}/auth`;
export const APP_STORE_URL = "https://apps.apple.com/gb/app/hozgo/id6763544013";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.hubermyhorse.app";
export const CONTACT_EMAIL = "info@hozgo.co.uk";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61577652297761";

// Supabase project the site talks to (booking-quote for the guide price, website-lead for forms).
// The publishable key is a public client credential by design; env vars override it.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://bomdpymtwdzrqsmitwse.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_-u06JpMtdx5iEt02SliuuQ_3tg90ptU";
