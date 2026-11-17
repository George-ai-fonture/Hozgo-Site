# HOZGO for Professionals, one-page marketing piece

Audience: dealers, sales yards, livery yards, trainers, studs, vet referrals. Separate from the app and the main site.

## Files
- `index.html`: the whole page, self-contained (logo, photo and QR code are embedded, Montserrat loads from Google Fonts).
- `qr-hozgo-uk.svg`: QR to https://hozgo.uk (the one used on the page).
- `qr-app-store.svg`, `qr-google-play.svg`: alternatives if you want the QR to go straight to a store.

## Put it in GHL
1. Sites > Funnels or Websites > new page, blank template.
2. Add one full-width Custom JS/HTML element and paste the contents of `index.html` into it.
3. Publish. Point a domain or slug at it (for example hozgo.uk/professionals) and use that in print.

## Put it on the new site instead
Copy `index.html` to `public/professionals.html` on `feat/new-site`. Vite serves it as-is at `/professionals.html`.

## Change the QR target
Replace the `<svg ...>` blocks under "Scan to get the app" and in the closing section with one of the other SVGs, and change the `hozgo.uk` label under it.

## Facts used
Everything on the page is from the agreed site copy: six checks, held-not-charged, RAMP steps, founders, store links, info@hozgo.co.uk. No counts, prices or testimonials were invented.
