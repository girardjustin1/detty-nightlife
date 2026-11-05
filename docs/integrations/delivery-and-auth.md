# Low-bandwidth delivery and authentication

Researched 2026-11-05. Anything marked **unverified** could not be confirmed from a primary source.

## TL;DR

- **v1 is an installable PWA** built from the same React components we are building in Storybook. Reasons:
  - It needs no app-store install, which saves 20 MB or more of data.
  - Links shared on WhatsApp open straight into a booking.
  - Code is reused directly.
- **Door check-in is also a PWA**: camera QR scanning, plus a guest list stored offline. **Go native with Expo later**, and only if we need things the web can't do well: zero-tap WhatsApp OTP, rich push on iOS, background BLE sync, or Wallet integration.
- **Devices and data in Ghana:**
  - Android is about **70%** of mobile web traffic and iOS about **30%** (StatCounter, October 2026).
  - The installed base leans budget: Samsung, Tecno, Infinix and Itel.
  - Data costs somewhere between **about $0.40 and $0.96 per GB**, depending on whose figure you trust.
  - **Treat every kilobyte as the user's money.**
- **Offline tickets:** each pass is a **signed QR** (Ed25519 signature over booking id, event, valid-from and valid-to). Both the guest's phone and the door app cache it, and the door app **verifies it offline** against a cached guest list. Check-ins sync when the signal comes back.
- **Auth:**
  - **Phone number first**, with the one-time code sent by **WhatsApp authentication template** and **SMS fallback**.
  - Email magic link and Google sign-in are optional extras. Sign in with Apple is only needed if we ship a native iOS app with Google login.
  - **18+ is enforced at the door**. In the app, the user declares a date of birth and confirms they are 18 or older. Optional **Ghana Card verification** (for example via Smile ID) for high-value bookings, **without storing images of the card**, which NIA's 2026 regulations forbid.

---

## 1. Context: devices, OS share, data cost

| Fact | Value | Source |
|---|---|---|
| Mobile OS share, Ghana | **Android 70.36%, iOS 29.6%** (October 2026) | [StatCounter Ghana](https://gs.statcounter.com/os-market-share/mobile/ghana) |
| Vendor share (devices in use) | Samsung 26.4%, Tecno 17.7%, Apple 17.4%, Infinix 10.5%, Itel 5.2% (July 2025). Transsion's three brands together are over 33% | [Intelpoint, citing StatCounter](https://intelpoint.co/insights/samsung-leads-ghanas-smartphone-market-with-26-4-share-followed-by-tecno-17-7-and-apple-17-4/) |
| Cost of 1 GB of mobile data | Cable.co.uk: **$0.40** (2023 dataset). The National Communications Authority's own estimate: **$0.96** | [Citi Newsroom, February 2025](https://citinewsroom.com/2025/02/data-cost-in-ghana-remains-high-despite-low-cost-ranking/), [NCA report](https://www.nca.org.gh/wp-content/uploads/2024/07/The-Cost-of-1GB-of-Data-in-Ghana.pdf) |

How to read these numbers:
- StatCounter measures **web traffic**, not phones sold. Our audience (Accra nightlife, plus diaspora visitors in December) probably leans more iPhone than the national average, but that is **unverified**. Measure it from our own analytics once we launch.
- Typical RAM and Android versions on Ghana's budget phones are **unverified**. Plan for a 2–3 GB RAM Android Go-class device on a slow 3G/4G connection as the worst case, and test on a real Tecno or Itel handset.
- A native app download of 25–40 MB would cost a user roughly $0.01–0.04 at those data prices. That is small in money but large as friction, especially for a guest who only got an invite link. That is the main reason v1 is a PWA.

## 2. PWA vs native (Expo / React Native)

| | **PWA** (Vite or Next + service worker) | **Native** (Expo SDK 55+, React Native 0.83, New Architecture only) |
|---|---|---|
| Reuse of the React + Storybook UI | **Direct.** Same components and stories | Partial. React Native primitives (`View`, `Text`), so components need porting or `react-native-web` |
| Install cost for guests | **Zero.** A link opens the page | App-store install, tens of MB |
| Invite link to booking | **Direct** | Needs deep-link setup, and a store detour if the app isn't installed |
| WhatsApp OTP | Copy-code button. iOS 26 keyboard suggestion is **unverified** on the web | **One-tap and zero-tap autofill on Android**, plus the iOS 26 keyboard suggestion |
| SMS OTP autofill | WebOTP on Android Chrome 84+; `autocomplete="one-time-code"` on Safari | SMS Retriever / iOS autofill |
| Push notifications | Android: good. **iOS: only when added to the Home Screen (iOS 16.4+)** | Full |
| Offline storage | IndexedDB + Cache Storage. Eviction is "best-effort" unless `navigator.storage.persist()` is granted, and Safari grants it based on signals such as "opened as a Home Screen Web App" | Durable |
| Camera QR scanning (door) | `getUserMedia` + `BarcodeDetector` (**not Baseline**, missing in Safari) → fall back to a WASM decoder (zxing-wasm or similar) | Native camera with vision-based scanning |
| Wallet passes | Apple `.pkpass` download works from the web. Google Wallet save-link (JWT) works from the web. **Google Wallet availability in Ghana is unverified** | Same, plus native APIs |
| Distribution | URL. Optionally a Play Store listing as a Trusted Web Activity wrapper (**unverified** effort) | Both stores, with review cycles |

Sources:
- iOS web push is Home Screen only on 16.4+, and iOS 26 opens Home Screen sites as web apps by default: [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide), [Webscraft 2026](https://webscraft.org/blog/pwa-pushspovischennya-na-ios-u-2026-scho-realno-pratsyuye?lang=en). Third-party sources, **unverified** against Apple.
- WebKit storage policy: [WebKit blog, "Updates to Storage Policy"](https://webkit.org/blog/14403/updates-to-storage-policy/).
- BarcodeDetector support: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector).
- WebOTP: [Chrome docs](https://developer.chrome.com/docs/identity/web-apis/web-otp).
- Expo SDK 55: [Expo changelog](https://expo.dev/changelog/sdk-55).
- Google Wallet save links: [Google Wallet docs](https://developers.google.com/wallet/generic/resources/terminology).
- WhatsApp OTP button types: see `whatsapp.md`.

**Recommendation: ship the PWA in v1.** Plan for native in "later", triggered by any one of:
- iOS push being critical for retention
- zero-tap OTP being worth the install cost
- door staff needing background BLE sync between devices

## 3. Recommended v1 architecture

```
Guest / host phone (PWA)                Door phone (PWA, "staff" role)
 ├─ App shell (≤ 150 KB JS gz)           ├─ Event guest list cached in IndexedDB
 ├─ Service worker: shell + passes        │   (booking id, names, n guests, ticket ids, status)
 ├─ IndexedDB: my bookings + signed QR    ├─ QR scan → verify Ed25519 signature offline
 └─ Paystack JS loaded only on Pay step   ├─ Check-in log (append-only) → sync when online
            │                             └─ Conflict rule: first check-in wins, flag duplicates
            ▼
API (edge/serverless, region near West Africa)
 ├─ Auth (phone OTP via WhatsApp Cloud API → SMS fallback)
 ├─ Bookings / tables / minimum spends / guest lists
 ├─ Paystack webhooks (charge.success, refund.*) → idempotent
 ├─ WhatsApp webhooks (statuses, inbound, opt-outs)
 ├─ Notifier: WhatsApp templates + Resend email
 └─ Signing key (KMS) for passes; public key shipped to door app
```

### Offline tickets and passes

- **QR payload:** a compact token of about 100–200 bytes, such as a signed CBOR or JWT with an EdDSA signature. It carries `{ bid, eid, seat|table, guests, vf, vt, kid }` plus the signature. It contains **no personal data**: names come from the door app's cached list. This is our design, not a vendor requirement.
- **Guest phone:** once a pass has been viewed, it's cached by the service worker and in IndexedDB, so the page `detty.app/b/X7K2` opens with no signal. Call `navigator.storage.persist()` after the first booking. Also prompt **"Add to Home Screen"** right after payment, because on iOS that improves the chance of persistent storage and enables push.
- **Fallbacks:**
  - Show a text code (`X7K2-B4`) under every QR.
  - Put the pass link in the WhatsApp confirmation, so the pass also lives in WhatsApp's own chat cache. Whether WhatsApp caches the link preview is **unverified**; the text code always works.
- **Door app:**
  - Downloads the guest list and the signing public key while it still has Wi-Fi or signal before doors open.
  - Verifies signatures offline.
  - Keeps an append-only check-in log and syncs it when online.
  - If several door devices are offline at once, double entry can't be prevented in real time. Mitigate by keeping one device per entrance in v1, adding local-network sync later, and catching duplicates when devices sync.
- **Wallet passes (v2):** offer an Apple `.pkpass`. Add a Google Wallet event-ticket save link once Ghana availability is confirmed.

### Bandwidth budgets

These are our targets, to enforce in CI with a bundle-size check and Lighthouse.

| Asset | Budget |
|---|---|
| First load (HTML + critical CSS + JS, gzipped/brotli) | **≤ 150 KB**. JS ≤ 100 KB gzipped |
| Event list page, including 6 thumbnails | ≤ 250 KB |
| Event card thumbnail | ≤ 15–25 KB (AVIF, with WebP fallback), roughly 320–480 px wide |
| Event hero | ≤ 60–80 KB, lazy-loaded, at most one per screen |
| Venue gallery | Thumbnails first; full images only on tap |
| Fonts | System font stack, or one subset variable font of at most 30 KB |
| Video | **None** autoplaying. Show a poster image with tap-to-play, and only on Wi-Fi or when the user asks |
| Third-party scripts | Paystack only on the pay step. No analytics SDK over 10 KB; use a tiny self-hosted beacon |

Techniques:
- `<picture>` with AVIF, then WebP, then JPEG. Use an image CDN that resizes on the fly to the width each card needs.
- Respect `Save-Data` / `navigator.connection.saveData`: blurred placeholders, no hero images.
- Cache API responses with stale-while-revalidate, and pre-cache the next likely screen only on Wi-Fi.
- Pick a CDN or edge provider with points of presence in West Africa (Accra or Lagos). Check the specific provider; this is **unverified** for any one vendor.

### Storybook-first fit

Build every booking, pass and checkout state as a story:
- *Waiting for MoMo approval*, *MoMo timeout*, *Paid*, *Refund pending*
- *Pass (offline)*
- *Door: valid*, *Door: already checked in*, *Door: wrong event*

Then the PWA, the email templates (React Email) and the door app share the same fixtures.

---

## 4. Authentication

### Recommended flow

1. **Enter phone number.** Default the country to +233, and accept international numbers for diaspora users.
2. Send the code through a **WhatsApp authentication template** (copy-code button).
3. Watch the delivery status. **Send by SMS** automatically if delivery fails or there's no `delivered` status within about 20–30 seconds, and always show a "Send by SMS" link. Format the SMS for WebOTP (`@detty.app #123456`).
4. Verify the code and issue a session. Use long-lived refresh tokens so people aren't asked to log in again at the door.
5. **Profile:**
   - name
   - **date of birth**, with "I confirm I am 18+" checked
   - optional email for receipts
   - WhatsApp consent checkboxes: booking updates, and separately event drops
6. **Optional linked logins:** email magic link (Resend) and Google. Add **Sign in with Apple** (or another privacy-preserving login) **only if** we ship a native iOS app that offers Google sign-in. App Store Guideline 4.8 requires an equivalent privacy-focused login option in that case, but our own phone-OTP accounts are exempt as "your company's own account setup". ([Apple Review Guidelines 4.8](https://developer.apple.com/app-store/review/guidelines/))

Notes:
- There's **no "Sign in with WhatsApp"** for consumers (see `whatsapp.md`).
- Rate-limit OTP sends: about 1 per 60 seconds per number, and a daily cap per number, per IP and per device. Add a CAPTCHA if abuse shows up. SMS pumping fraud is real. Supabase defaults to 1 OTP per 60 seconds, and Supabase's built-in WhatsApp option only works through Twilio, but its **Send SMS Hook** lets us use the Meta Cloud API directly. ([Supabase phone login](https://supabase.com/docs/guides/auth/phone-login), [Send SMS Hook](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook))
- Store `phone_e164`, the WhatsApp BSUID if we get one, email, and consent records with timestamps.
- **Promoter and venue staff accounts** use the same phone login, plus a role (owner, manager, door) per venue. Door devices get a **time-limited event-scoped session**, so a lost door phone can't see other events.

### Age 18+ verification

- **Law:** the legal drinking age in Ghana is reported as **18** under the **Liquor Licensing Act, 1970 (Act 331)**. Section 15 is titled "Young Persons to be Excluded". The text of that section was not retrieved, so the exact entry rules are **unverified**. ([GhanaLegal: Act 331](https://ghanalegal.com/laws_subdomain/acts/id/87/liquor-licensing-act), [Wikipedia: legal drinking age](https://en.wikipedia.org/wiki/Legal_drinking_age)) Stricter alcohol rules are being discussed, but the 2026 reports are mostly about advertising. ([EUCAM, February 2026](https://eucam.info/2026/02/06/ghana-aims-to-tighten-rules-on-the-advertisement-and-marketing-of-alcohol/))
- **v1 model: declare in the app, check at the door.**
  - Collect the date of birth and an 18+ confirmation from the booker *and from every guest who RSVPs*.
  - Show "**ID checked at the door. Ghana Card, passport or driver's licence**" on the booking, the invite, the reminder and the pass.
  - The door app gives staff an "ID checked" toggle per guest. This is the real control. Venues can also set a higher minimum age, such as 21+, in config.
- **v2, optional:** verify the Ghana Card for high-value tables or for promoters' VIP lists.
  - Smile ID supports Ghana Card checks, either by ID number alone or by ID number plus selfie. ([Smile ID supported IDs](https://docs.usesmileid.com/general/supported-id-types)) Pricing is **unverified**; ask sales.
  - **NIA's National Identity Register (Amendment) Regulations, 2026** prohibit institutions from photocopying or keeping copies of Ghana Cards. Verification is supposed to go through NIA's systems or the card chip. **Never store ID images.** Store only the verification result and a timestamp. ([Ghanaian Times](https://ghanaiantimes.com.gh/nia-begins-enforcement-of-ghana-card-biometric-verification-rules-warns-institutions-of-fines/), [Graphic](https://www.graphic.com.gh/news/general-news/nia-develops-mobile-app-for-individuals-and-small-businesses-to-verify-ghana-card-identities.html))
- **Data protection:**
  - Register with Ghana's **Data Protection Commission** under Act 843, which the Commission says it will enforce in 2026.
  - Keep date-of-birth and ID data to the minimum needed.
  - Whether Act 843 restricts cross-border data transfers is disputed among sources (**unverified**). Confirm with counsel before hosting user data outside Ghana.
  - ([GNA](https://gna.org.gh/2026/01/2026-will-be-a-year-of-enforcement-data-protection-commission-warns/), [B&FT](https://thebftonline.com/?p=218850))
