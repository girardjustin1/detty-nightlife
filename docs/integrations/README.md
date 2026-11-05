# Detty Nightlife: integration recommendations

Researched 2026-11-05. One-page summary. The details and sources are in the files linked below. Items marked **unverified** in those files need a primary-source check, a vendor quote or legal review before we commit to them.

| Area | Recommendation | Details |
|---|---|---|
| **Auth** | Phone number first. One-time codes go by **WhatsApp authentication template** (copy-code button) and fall back to **SMS** (formatted for WebOTP). Email magic link and Google sign-in are optional. **There is no consumer "Sign in with WhatsApp".** | [delivery-and-auth.md](delivery-and-auth.md), [whatsapp.md](whatsapp.md) |
| **WhatsApp** | Use the Meta **Cloud API directly** (no messaging-provider markup). Utility templates for confirmations, receipts, reminders, changes and refunds. Marketing templates for event drops, opt-in only. Guest invites go through **`wa.me` share links** sent from the host's own WhatsApp. | [whatsapp.md](whatsapp.md) |
| **Payments** | **Paystack Ghana** as the single primary rail. 1.95% flat on MoMo (MTN, Telecel, AirtelTigo), cards and Apple Pay, including international cards. Venues paid by subaccount split or by transfer (GHS 1 to MoMo). Hubtel as the v2 fallback. | [payments.md](payments.md) |
| **Deposits** | **Charge now, refund under a published policy.** The deposit counts toward the table's minimum spend. Card holds are not possible in Ghana. | [payments.md](payments.md) |
| **Email** | **Resend** with React Email templates, previewed as Storybook stories. SPF, DKIM and DMARC from day one. Email is the record; WhatsApp is the nudge. | [email.md](email.md) |
| **Delivery** | **PWA** in v1 for both the guest app and the door app. Signed QR passes that verify offline. First load at most 150 KB. AVIF/WebP images of 15–25 KB per card. | [delivery-and-auth.md](delivery-and-auth.md) |
| **18+** | The user declares a date of birth and confirms 18+ in the app; door staff check ID. Optional Ghana Card check (Smile ID) in v2. **Never store ID images.** | [delivery-and-auth.md](delivery-and-auth.md) |
| **Bitcoin** | **Not in v1.** v2 adds a feature-flagged Lightning deposit through a partner that settles to us in cedis, after a legal opinion. | [bitcoin-and-bitchat.md](bitcoin-and-bitchat.md) |
| **bitchat** | **Don't integrate.** It has no third-party SDK, and Cashu tokens received offline aren't final ("first redeemer wins"). Signed offline QR passes solve the "no signal at the door" problem. | [bitcoin-and-bitchat.md](bitcoin-and-bitchat.md) |

## Surprises and constraints

1. **WhatsApp charges more since 2026-10-01.** Utility templates sent inside the 24-hour window are now charged, and so are service replies beyond 1,000 free per number per month. Ghana is billed in "Rest of Africa": about $0.0046 per utility or authentication message and about $0.0259 per marketing message (third-party copy of the rate card, to verify on Meta's CSV). That works out to about **$0.018 per booking** in WhatsApp fees (our arithmetic).
2. **An unverified WhatsApp business can message only 250 new users a day.** This cap applies across the whole Meta business account. **Start Meta Business Verification now** so we reach 2,000 before Detty December.
3. **MTN Ghana blocks SMS from unregistered sender IDs** since 2026-07-08. Registration takes about 2–3 weeks. **Register our sender ID now.**
4. **WhatsApp's one-tap and zero-tap code autofill are Android-native-app only.** A PWA gets the copy-code button, and on iOS 26+ the keyboard suggests the code from the notification.
5. **Payments inside WhatsApp aren't available in Ghana** (only India, Brazil and Singapore). WhatsApp Flows can collect a booking or RSVP but must hand off to a Paystack link.
6. **WhatsApp groups created through the API max out at 8 participants**, and they need the verified blue-tick business badge. That's too small for most tables.
7. **Paystack card holds ("preauthorization") work only in South Africa**, and mobile money can't be held at all.
8. **Ghana's crypto law (Act 1154) is passed, but licensing hasn't opened.** The central bank's page is still marked "available by end of Q3 2026". Regulators have **banned public crypto advertising** and treat crypto "advocacy" as a regulated activity.
9. **Ghana's identity agency (NIA) regulations from 2026 forbid keeping copies of Ghana Cards.**
10. **Data costs** about $0.40–0.96 per GB. Ghana's mobile web traffic is about 70% Android and 30% iOS.

## Phased roadmap

### v1: launch (target: before Detty December 2026)

- **Now, blocking:**
  - Meta Business Verification and display name.
  - WhatsApp Cloud API number and templates.
  - SMS sender ID registration (MTN).
  - Paystack Ghana account through go-live.
  - Data Protection Commission registration.
  - Resend Pro plan.
  - Legal question: may we collect deposits and pay venues out after the event (Act 987)?
- **Guest and host PWA:**
  - Phone OTP: WhatsApp first, SMS fallback.
  - Browse events and venues.
  - Buy tickets.
  - Reserve a table with a deposit toward the minimum spend.
  - Invite guests by `wa.me` share and RSVP link (with 18+ confirmation).
  - My bookings, with offline passes.
- **Payments:**
  - Paystack MoMo, card and Apple Pay.
  - Tickets: split to the promoter's subaccount.
  - Table deposits: collect, then pay the venue by transfer after the event, if counsel approves. Otherwise split by subaccount at payment.
  - Refunds through the API, following a cancellation policy configured per venue.
- **Notifications:**
  - WhatsApp utility templates: confirmed and receipt, reminder, changed, cancelled and refund, ticket ready, guest joined.
  - Matching transactional emails.
- **Promoter and venue PWA:**
  - Reservations list.
  - Table map and minimum spends.
  - Guest lists.
  - **Door check-in**: QR scan, verified offline, "ID checked" toggle, sync when back online.
- **Engineering:**
  - A `PaymentProvider` and `Notifier` abstraction in front of each vendor.
  - Idempotent webhooks.
  - Bundle-size budgets in CI.
  - Every state built as a Storybook story.

### v2: next 1–2 quarters

- WhatsApp **marketing** event drops, opt-in only, handling Meta's per-user cap errors (131049).
- **WhatsApp Flows** for guest RSVP and "rebook the same table".
- **Split deposits**: each guest pays their share, with a deadline.
- **Hubtel** as a second payment rail, and GHQR.
- Apple Wallet `.pkpass`. Google Wallet once Ghana availability is confirmed.
- Optional **Ghana Card verification** for VIP and high-value tables.
- **Lightning deposits**, feature-flagged: a partner that settles in cedis, refunds by Lightning withdraw or MoMo, and only after a legal opinion.
- Post-event receipt (minimum spend vs actual spend) and review requests.

### Later

- **Native app** (Expo): zero-tap OTP, reliable iOS push, background sync between door devices, native Wallet. Build it only if the numbers from the PWA justify it.
- WhatsApp groups through the API for small tables, if the 8-person cap rises.
- **Offline sync between door devices** at large venues, over a local network or Bluetooth.
- Revisit Bitcoin and Cashu, and bitchat, once Ghana's crypto licensing is live and bitchat offers an SDK or embedded wallet.
