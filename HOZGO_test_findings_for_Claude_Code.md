# HOZGO: Issues from live end-to-end test (11 Oct 2026)

## Context for Claude Code

This is a list of issues found during a full live test of the HOZGO app (horse transport marketplace: customer books, price is shown, card is held, job is broadcast to transporters, transporter accepts, completes the job, transporter gets paid).

Who tested:
- Michelle Hale: transporter account (michellehale17@icloud.com, Equine Rescue Services, Type 2, flagged "Legacy (grandfathered)"), on her phone. Also used an iPad logged in as admin.
- Tom: customer account (thomasjamesha...) on his phone.
- David: observer, raised the priority-fee point.

Test booking: #ACE4328D, Smeaton Lane CV23 0PS Rugby to Weston Lawns, Bedworth Road CV12 9JA Bedworth, same-day, marked high priority. Original quote £120.00, driver counter-offer £125.00 (+£5), platform fee £6.25, transporter net £118.75.

Source material: 22 voice notes from Michelle and 8 screenshots. Each issue below says where it came from. Items marked "Question" need an answer from George before building. Before changing anything, read the relevant code and confirm the actual current behaviour, because some of these come from a tester's interpretation of what she saw.

Priority key: P1 = money or trust breaks, fix first. P2 = core flow broken or confusing. P3 = polish and copy.

---

## P1: Payments and payouts

### 1. Payout to transporter fails with HTTP 500 (E300)
- What happened: In admin, booking finance panel showed Paid (customer side) and Payout Status Unpaid. Admin clicked "Pay via Stripe", confirm modal said "This will transfer £118.75 directly to the driver's connected Stripe account", clicked Send Payment, got: `Payment processing error. Please try again. | HTTP 500 | code E300 | request req_mv45iiuq_yk2kng`. The error showed briefly then disappeared.
- Michelle's guess: she only set up her Stripe Connect account that day, so it may not be fully onboarded / payouts not enabled.
- To do:
  - Find what E300 maps to in the codebase and check server logs for request `req_mv45iiuq_yk2kng`.
  - Before attempting a transfer, check the connected account state (`charges_enabled`, `payouts_enabled`, `requirements.currently_due`) and block with a clear message if it isn't ready, e.g. "This transporter hasn't finished Stripe setup. Ask them to complete verification."
  - Never return a raw 500 for a known Stripe error. Map Stripe errors to readable admin messages.
  - The error toast should stay on screen until dismissed (it vanished before she could screenshot it).
  - Check that a failed transfer leaves the payout status as Unpaid and is safe to retry (idempotency key on the transfer so a retry can't double pay).
  - Also show the transporter, in their own app, if their Stripe account is incomplete and what's missing.
- Source: voice notes 20:21, 20:22, 20:23, 20:23; screenshots 20:20, 20:22, 20:23.

### 2. Transporter payment depends on the customer pressing "confirm delivery"
- What happens now: the job goes to "Awaiting your confirmation" and the customer has to press delivery confirmed before the job completes and payment is released. In the test, Tom pressed it about 2 minutes after the status changed.
- Problem: if the customer isn't there at drop-off, or just doesn't press it, or doesn't want to pay, the transporter never gets paid. Michelle's words: "they could just walk away and not pay us. We need to take control of that."
- Michelle's suggestion: take/capture payment once the horse is loaded (horse secured), which she thinks is fairer.
- Options to evaluate and propose (don't pick one without George):
  - Capture the card hold at "horse secured" / "on board".
  - Keep customer confirmation but auto-confirm after a set window (e.g. X hours after transporter marks delivered) unless the customer raises a dispute.
  - Transporter proof of delivery (photo at drop-off + GPS location at drop-off + timestamp) counts as completion.
- Question: Which model does George want? Is a dispute window needed?
- Source: voice notes 20:14, 20:15, 20:16.

### 3. Card hold timing (for Claude Code to check, not raised by the testers)
- The timeline shows "Card authorized via checkout - Hold successful" at booking. Stripe card authorisations expire (normally about 7 days). If a customer books further ahead than that, the hold will drop before the job happens.
- To do: check how the code handles bookings more than a few days out (re-authorise, save card and charge closer to the date, etc.). Tie this into whatever is decided for item 2.

### 4. Tell transporters payouts take 2 to 3 business days
- The admin payout modal says funds arrive in 2 to 3 business days. Transporters don't see this anywhere.
- To do: show it to the transporter on the job completion screen and in their earnings/payout area, with the payout status (pending, sent, failed).
- Source: voice note 20:22.

### 5. Confirm how payouts are meant to work
- Michelle saw that payouts to transporters are triggered manually by admin ("Pay via Stripe" / "Mark Paid Manually" / "Refund").
- Question: Is manual admin payout the intended process for now, or should payout happen automatically on completion? (The original idea was drivers are paid on completion.)

---

## P2: Job broadcast and transporter availability

### 6. Job only went to 3 of 6 verified transporters
- Booking was auto-broadcast "to all eligible online transporters". It went to Finn McGrory, Joeanne Baker and Nikki Armitage. Michelle expected 6 fully verified transporters including herself, and she is in the next street to the pickup, but she didn't get it.
- Cause found during the test: Michelle (and presumably the other 2) were set to Offline. Once she went online she received it.
- To do:
  - Confirm the eligibility rules in code (verified + online + vehicle/equipment match + distance?) and document them.
  - When a transporter is offline, make that really obvious in their app (persistent banner: "You're offline. You won't receive new jobs.").
  - Admin view: when a booking is broadcast, show how many transporters were eligible, and why others were excluded (offline, not verified, too far, wrong vehicle). That would have answered this in seconds.
- Question: Michelle said "obviously not Finn", as if Finn shouldn't count among the verified ones. Is Finn verified? Should unverified transporters ever receive a broadcast?
- Question: Should a job broadcast later to transporters who come online after the first broadcast? (Michelle got it after going online, so it looks like yes. Confirm this is deliberate.)
- Source: voice notes 16:08, 16:10, 16:11, 16:13, 16:42, 16:45; screenshot 16:19 / 16:41 (her profile shows Availability: Offline, circled).

### 7. Transporter is switched to Offline automatically after completing a job
- After the job completed and Michelle went to the payment screen, her online toggle switched to Offline by itself. She had to turn it back on.
- Problem: transporters will end up offline without knowing and miss jobs (same root cause as item 6).
- Michelle's request: stay online permanently unless the transporter turns it off, or remove the toggle.
- To do: find what sets availability to offline on job completion and stop it. Availability should only change when the transporter changes it.
- Question: Does George want to keep the online/offline toggle at all?
- Source: voice note 20:12.

### 8. No email or SMS for new job offers
- Michelle got an in-app notification for the new job but no email and no text message.
- To do: check if email/SMS notifications for new job offers exist and are firing. If they exist, find out why they didn't send (could be because she was offline at broadcast time, then only got in-app when she came online). If they don't exist, add them.
- Question: Should offline transporters still get an email/SMS for new jobs near them (as a nudge to go online), or nothing?
- Source: voice notes 16:08, 16:45, 16:49.

### 9. Customer sign-in problem at the start
- They tried to set up David's phone as the customer and couldn't sign in as a customer. They switched to Tom's phone and it worked.
- Not enough detail to know the cause. Possible causes to check: David's account already exists with a different role (transporter/admin), so it can't act as a customer; a login error; email not verified.
- Question: George, do you know what account David was using? Should one account be able to be both customer and transporter?
- Source: voice notes 15:49, 15:52.

---

## P2: Customer updates during the job

### 10. Customer didn't get live status updates (pickup and in transit)
- Transporter side worked: Michelle stepped through arrived, horse secured / on board, in transit, with GPS tracking on.
- Customer side: Tom got no notification that the horse had been picked up or was in transit. The statuses only appeared for Tom later, around delivery. Michelle: "the transporter bit is fine, it's just not getting to the customer."
- The customer timeline screenshot later shows: Driver Arrived 4:19 PM, Horse Secured 4:20 PM, In Transit 4:20 PM, Awaiting Your Confirmation 6:15 PM, Completed 6:17 PM. So the events were saved but the customer wasn't notified at the time.
- To do:
  - Push notification (and email/SMS if enabled) to the customer on each transporter status change.
  - Make sure the customer booking screen updates live (realtime subscription or polling) without needing a refresh.
  - Find the cause of the delay: were the events written late, or written on time and just not pushed/refreshed?
- Source: voice notes 17:23, 17:28, 18:29, 19:20; screenshot 19:19.

### 11. "Horse on board" message to the customer with photo and ETA
- Michelle's normal practice: as soon as she loads, she messages the owner with a photo, an ETA and a "horse is on board, on my way".
- Request: when the transporter marks horse secured / on board, automatically send the customer the loading photo, the ETA, and a short friendly message.
- Source: voice note 17:28.

### 12. Customer status display stops at "Driver Assigned"
- On Tom's booking screen the status section ends at "Driver Assigned" and the Driver Details section just says "Driver 1 Accepted". It reads as if the status is only about finding a driver, not the whole job.
- Request: continue the customer-facing status after driver assigned: driver on the way, picked up, in transit, delivered, completed. Or a separate "Journey" section that tracks the job itself.
- Note: the later screenshot shows these statuses do appear once the events come through, so this may be mostly fixed by item 10. Check what the customer sees between "Driver Assigned" and the first transporter update.
- Source: voice note 17:52; screenshots 17:25, 19:19.

---

## P2: Pricing

### 13. "High priority" 15% charge needs renaming and defining
- Booking was same-day and marked high priority, which added a 15% charge. Michelle was fine with the charge.
- David's point: every customer thinks their job is high priority. Someone booking for tomorrow will tick it and then be annoyed at the 15%.
- Request: rename "High priority" to "Emergency" and say clearly what it means and that it adds a 15% emergency charge.
- Question: What's the definition of an emergency? Options: same-day / within X hours only, or customer-declared. Should it only be selectable for pickups within a set time window?
- Source: voice note 16:45.

---

## P2: Bugs

### 14. App crashes when the transporter takes a photo with the camera
- At the horse photo step, choosing a photo from the library works. Taking a new photo with the camera crashes the app. She said "it crashes again", so this has happened before.
- To do: check camera permissions (iOS `NSCameraUsageDescription` / Android camera permission in the manifest), the image picker config for camera source, and image size/memory handling on capture.
- Question: Which phone and OS was Michelle using (iPhone or Android, and version)?
- Source: voice note 19:20.

---

## P3: Copy and display issues (from screenshots)

### 15. Raw status codes shown to the customer
- Customer timeline shows text like "Status updated to horse_secured", "Status updated to in_transit", "Status updated to awaiting_customer_confirmation". Replace with plain English, e.g. "Your horse is loaded and secure", "On the way", "Delivered. Please confirm".
- Source: screenshot 19:19.

### 16. Timeline events labelled "Finding Transporter" when they aren't
- Customer timeline shows "Finding Transporter" as the label on "Card authorized via checkout", "Offer accepted by customer" and "Counter-offer top-up completed (5.00)". These are payment/offer events, not finding a transporter. Each event should have its own label.
- "Counter-offer top-up completed (5.00)" is missing the £ sign.
- "Auto-broadcasted to all eligible online transporters" reads like internal language. Suggest "We've sent your job to available transporters near you."
- Order check: "Auto-broadcasted" is listed above "Card authorized" at the same minute (3:01 PM). Confirm the card hold always succeeds before the job is broadcast.
- Source: screenshot 17:25.

### 17. Customer sees "Driver 1" and "Completed trips: 0"
- Driver details show "Driver 1" rather than a name, and "Completed trips: 0" for Michelle, who is an experienced, grandfathered (legacy) transporter. "0 trips" will put customers off.
- Question: Should customers see the transporter's name once assigned? Should legacy transporters show a different badge instead of a trip count of 0 (e.g. "Established transporter", or hide the count below a threshold)?
- Source: screenshots 17:25, 17:25.

### 18. Timestamp mismatch between screens
- Customer view says the offer was "Offered Oct 11, 2026 at 3:43 PM". Admin Offer History says Michelle's quote was "Submitted 11 Oct 2026 at 16:10". These may be two different events (offer received vs counter-offer submitted), but they're labelled as if they're the same thing. Also check that all times are shown in UK local time consistently and use the same 12h/24h format across customer, transporter and admin.
- Source: screenshots 17:25, 20:20.

---

## Non-code actions (for George, not Claude Code)

- Tell all transporters they must be set to Online to receive jobs (until item 7 and the offline banner are fixed). Michelle said she'll make a list of things to tell transporters once everyone is verified.
- Tell transporters payouts take 2 to 3 business days.
- Make sure every transporter has completed Stripe Connect onboarding before their first job.

## Open questions summary

1. Payment release model: capture at loading, auto-confirm after a window, or proof of delivery? (item 2)
2. Manual admin payouts or automatic on completion? (item 5)
3. Is Finn verified, and should unverified transporters ever get broadcasts? (item 6)
4. Keep the online/offline toggle? (item 7)
5. Should offline transporters get email/SMS job alerts? (item 8)
6. What account was David using, and can one account be both customer and transporter? (item 9)
7. How is "Emergency" defined and when can it be selected? (item 13)
8. Michelle's phone model and OS for the camera crash. (item 14)
9. Show transporter names to customers? How to handle trip count for legacy transporters? (item 17)

## Positive feedback (don't break these)

- Customer booking flow worked well end to end.
- Card hold on booking worked.
- Driver counter-offer (+£5) and second card payment for the top-up worked smoothly.
- Transporter job steps and GPS tracking worked.
- Admin board was easy to follow and useful ("it's very good actually what is built here").
