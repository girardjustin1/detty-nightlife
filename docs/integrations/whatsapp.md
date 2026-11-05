# WhatsApp integration

Researched 2026-11-05. Meta changes WhatsApp pricing and policy every quarter (Jan 1, Apr 1, Jul 1, Oct 1), so check every number here against the live docs before you budget or ship. Anything marked **unverified** could not be confirmed from a primary source.

## TL;DR

- There is **no consumer "Sign in with WhatsApp" / OAuth**. Login means an **authentication template** carrying a one-time code, with SMS as the fallback.
- Ghana is billed at Meta's **"Rest of Africa"** regional rate. Per message (USD): marketing about **$0.0259**, utility **$0.0046**, authentication **$0.0046**, service **$0.0046**.
- **Since 2026-10-01, utility templates sent inside the 24-hour window are charged**, and so are service (free-form) replies once you pass 1,000 free per number per month. Older blog posts that say these are free are out of date.
- Use **utility templates** for booking confirmed, deposit receipt, reminder, booking changed, and cancellation/refund. Use **marketing templates** only for event drops, and only to users who opted in.
- **Guest invites should go through `wa.me` share links sent from the host's own WhatsApp, not the API.** A guest whose number the host typed in has *not* opted in to messages from us. The share link is free and needs no approval.
- WhatsApp **Flows** can run a booking or RSVP form inside WhatsApp, but **in-chat payments do not exist in Ghana** (only India, Brazil and Singapore). Payment has to hand off to a Paystack link.
- Go **direct to the Meta Cloud API**. It has no BSP markup and the docs are good. **Start Meta Business Verification now**: an unverified portfolio can only start conversations with 250 unique users per 24 hours, which is not enough for Detty December.

---

## 1. Login and authentication

### Is there "Sign in with WhatsApp"?

No, not for consumers. What does exist:

- **WhatsApp Business App Login / Embedded Signup.** This lets *businesses* onboard their WhatsApp number to a Tech Provider's platform. It is OAuth-based, but it onboards businesses and does not log in end users. ([360dialog: WhatsApp Login (open beta)](https://docs.360dialog.com/partner/get-started/alphas-and-betas/whatsapp-login), [Chatwoot: Embedded Signup](https://developers.chatwoot.com/self-hosted/configuration/features/integrations/whatsapp-embedded-signup))
- **OTP over WhatsApp.** You send a one-time code in an **authentication template**. Meta requires that "Mobile apps that offer OTP delivery via WhatsApp **must use an authentication template**." ([Meta: Authentication templates](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/authentication-templates/authentication-templates/))

### How authentication templates work

The body text is fixed by Meta ("<code> is your verification code."). You can't customise it. You can optionally add a security disclaimer and an expiry warning (1 to 90 minutes). Each template has exactly one OTP button type ([Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/authentication-templates/authentication-templates/)):

| Button | What the user does | Platforms | Fits our app? |
|---|---|---|---|
| **Copy code** | Taps "Copy code", switches back to the app, pastes | All | **Yes. Works for a PWA.** |
| **One-tap autofill** | Taps the button and WhatsApp hands the code to your Android app | Android native app (needs `package_name` + `signature_hash`). On iOS 26+ the keyboard suggests the code from the notification, with no integration needed | Native Android only |
| **Zero-tap** | Nothing. WhatsApp broadcasts the code to your app's broadcast receiver | **Android only.** Non-Android devices see a copy-code button instead | Native Android only |

Two things to know:

- **iOS:** On iOS 26 and later, "keyboard suggestions are enabled by default for all authentication templates": iOS reads the code from the WhatsApp notification and offers it above the keyboard. Earlier iOS versions get no autofill, so use copy code. ([Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/authentication-templates/authentication-templates/)) Whether that suggestion also fills a **web** `<input autocomplete="one-time-code">` in Safari is **unverified**. Test it on a real device.
- **Linked-device security** is on by default for authentication templates on Cloud API and can't be configured. Expect the code to show on the phone, possibly not on WhatsApp Desktop or Web. (Same Meta page. What exactly it hides is **unverified**.)

**For a PWA, one-tap and zero-tap are out of reach** because they need an installed Android app with a signing hash. A PWA gets copy code, plus the iOS 26 keyboard suggestion if it works on the web.

### SMS fallback

Send WhatsApp first. Fall back to SMS when:

1. the status webhook reports `failed` (for example, the number isn't on WhatsApp), or
2. there is no `delivered` status within about 20 to 30 seconds, or
3. the user taps "Send by SMS instead". Always show this link after about 20 seconds.

Ghana SMS specifics:

- **MTN Ghana blocks unregistered sender IDs.** Twilio: "Starting on July 8, 2026, messages with unregistered Sender IDs to these networks will be blocked." An alphanumeric sender ID needs pre-registration, which takes about 3 weeks (international) or about 2 weeks (domestic). Twilio also lists no two-way SMS and no short codes for Ghana. ([Twilio Ghana SMS guidelines](https://www.twilio.com/en-us/guidelines/gh/sms), [Arkesel](https://arkesel.com/?p=9902)) **Register a sender ID (for example `DETTY`) this week.**
- Local aggregators: Arkesel, mNotify, Hubtel SMS. I found no current per-SMS prices (**unverified**). Get quotes. One 2025 vendor blog cites GHS 0.05–0.08 per SMS ([Celcom Africa](https://celcomafrica.com/blog/?p=3074)), which is likely stale.
- **On the web**, format the SMS for **WebOTP** so Android Chrome 84+ can autofill it, and use `autocomplete="one-time-code"` for Safari:
  ```
  Your Detty code is 482913.

  @detty.app #482913
  ```
  ([Chrome: WebOTP](https://developer.chrome.com/docs/identity/web-apis/web-otp))
- Managed option: Twilio Verify charges $0.05 per successful verification plus channel fees. Its automatic WhatsApp-to-SMS fallback is described as a pilot with limited availability ([Twilio Verify pricing](https://twilio.com/verify/pricing)). At our volumes, sending through Meta directly and keeping a local SMS aggregator as the fallback is much cheaper.

If we use Supabase Auth: its built-in WhatsApp channel only works through Twilio or Twilio Verify. The **Send SMS Hook** lets us send `sms.otp` to `user.phone` through any provider, including a direct Cloud API call ([Supabase phone login](https://supabase.com/docs/guides/auth/phone-login), [Supabase Send SMS Hook](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook)).

---

## 2. Pricing for Ghana

### Model

Since 2025-07-01, Meta charges **per delivered message**. The price depends on the category (marketing, utility, authentication, service) and on the **recipient's country calling code**. Meta never charges for messages users send to us. ([Meta pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing.md))

### Ghana's rate card

Ghana (+233) sits in **"Rest of Africa"**, a 40-country region that also includes Kenya, Senegal, Côte d'Ivoire and others. Nigeria and South Africa have their own rates. On 2026-07-01 and 2026-10-01 Meta moved 15 markets out of "Rest of" regions; Ghana was not one of them. ([Meta pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing.md))

| Category (USD per delivered message) | Rest of Africa (Ghana) | Nigeria | South Africa |
|---|---|---|---|
| Marketing | **0.0259** | 0.0593 | 0.0436 |
| Utility | **0.0046** | 0.0077 | 0.0109 |
| Authentication | **0.0046** | 0.0077 | 0.0109 |
| Service (from 2026-10-01) | **0.0046** | 0.0077 | 0.0109 |

The rates are effective 2026-10-01, from [Gallabox's copy of the Meta rate card](https://docs.gallabox.com/pricing-and-billing/whatsapp-pricing/rate-card.md). Treat them as **unverified until checked against Meta's official CSV**, which you can download from the pricing page. Meta's own page lists the rate-card currencies but its rate table didn't come through as text. Older third-party sources give similar numbers: about $0.0252–0.027 for marketing and $0.0045–0.0048 for utility/auth ([Sleekflow](https://help.sleekflow.io/en_US/whatsapp/pricing), [Chatalog](https://chatalog.ai/en/pricing-whatsapp-conversation-fees-2025/)). **Utility and authentication have volume tiers**, so the rate per message falls as monthly volume grows.

**Diaspora users are billed by their own country code.** A Detty December visitor with a +1 or +44 number is charged North America or UK rates, not Ghana's.

**Authentication-international:** this higher authentication rate applies in specific listed markets. Ghana is not among them, including the nine added on 2026-10-01 (Bangladesh, Iraq, Kazakhstan, Kuwait, Morocco, Nepal, Oman, Sri Lanka, Ukraine). ([Meta pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing.md))

### Changes on 2026-10-01

From [Meta's pricing changelog](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing.md):

- **Service messages (free-form replies inside the 24-hour window) are now charged.** Each business phone number gets **1,000 free per month**, and unused ones don't roll over. Meta's warning: without a payment method on file, it "will stop delivering service messages."
- **Utility templates sent inside an open customer-service window are no longer free.** They had been free since 2025-07-01.
- The **Free Entry Point** still applies. When a user messages us from a Click-to-WhatsApp ad or Page CTA, everything we send for up to **7 days** is free (except Meta Business Agent tokens).

### Cost per booking

This is our own arithmetic from the Ghana rates above, not a Meta figure.

| Message | Category | USD |
|---|---|---|
| Login OTP | authentication | 0.0046 |
| Booking confirmed | utility | 0.0046 |
| Deposit receipt (can merge into "confirmed") | utility | 0.0046 |
| Reminder (day of) | utility | 0.0046 |
| **Total per Ghana-number booking** | | **≈ $0.018** |
| Event drop to 10,000 opted-in users | marketing | ≈ $259 |

Combining "confirmed" and "receipt" into one template saves about 25% on utility spend per booking.

---

## 3. Sending messages to users

### The 24-hour customer-service window

When a user messages us, a 24-hour window opens, and every new user message resets it. Inside the window we can send free-form (non-template) messages. Outside it, **only approved templates** are allowed. ([Meta pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing.md))

### Template plan

| Template | Category | Variables (sketch) | Button |
|---|---|---|---|
| `booking_confirmed` | Utility | name, venue, date, table, deposit paid, balance due | URL → `/b/{ref}` |
| `deposit_receipt` | Utility | amount GHS, method, ref, date | URL → receipt |
| `booking_reminder` | Utility | venue, time, door policy, guests confirmed n/m | URL → pass (QR) |
| `booking_changed` | Utility | what changed, new value | URL |
| `booking_cancelled` | Utility | refund amount, method, ETA | URL |
| `ticket_ready` | Utility | event, qty | URL → tickets |
| `guest_joined` (to host) | Utility | guest name, n/m confirmed | URL |
| `otp_login` | Authentication | code | Copy code |
| `event_drop` | Marketing | event, date, headline, image header | URL |

Keep utility templates strictly transactional. Meta reviews the category, and anything promotional in a utility template can get it re-categorised as marketing and billed at the marketing rate (**unverified** detail of how strictly this is enforced). Keep every link short (`detty.app/b/X7K2`) so the landing page is light.

### Opt-in rules

- Before sending business-initiated messages outside the window, the business must have **opt-in**. The opt-in must make clear the person is agreeing to messages *from this business*. Since November 2024 it doesn't have to mention WhatsApp by name. Meta recommends **separate opt-ins per category** (order updates vs promotions). ([Meta "Get opt-in" mirror](https://support.chatarchitect.com/books/meta-whatsapp/page/get-opt-in-for-whatsapp-developer-documentation/export/pdf), [cm.com](https://www.cm.com/blog/whatsapp-opt-in/))
- How we implement it:
  - At signup, show two checkboxes. *Booking updates on WhatsApp* is pre-ticked; the user can untick it. *Event drops & offers* is unticked by default.
  - Store `consent_type`, `timestamp`, `source` and `ip/ua` so we can show Meta proof if asked.
  - Handle "STOP" and a quick-reply "Stop promotions".

### Frequency limits

- **Per-user marketing caps.** Meta throttles how many marketing templates a single user receives *from all businesses combined*, based on that person's engagement. Messages over the cap fail with **error 131049**. The threshold isn't published and changes per user. Wait at least 24 hours before retrying. **Utility and authentication templates are not capped.** ([Meta: per-user marketing limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/marketing-templates/per-user-limits/))
- **Portfolio messaging limits.** These cap the number of *unique users we start conversations with* outside the window in any rolling 24 hours, **summed across the whole business portfolio** ([Meta: messaging limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits)):
  - A new portfolio starts at **250**.
  - It reaches **2,000** after Business Verification, or after sending 2,000 high-quality messages outside the window within 30 days.
  - It then scales automatically to 10,000, 100,000 and unlimited. Each step needs good quality and at least half the current limit used in the last 7 days, and happens within about 6 hours of qualifying.
- A drop in quality no longer automatically lowers the tier (third-party claim, [Chatarmin](https://chatarmin.com/en/blog/whats-app-messaging-limits), **unverified**).

### Usernames and BSUIDs (from June 2026)

WhatsApp users can now adopt **usernames**. When a user with a username messages a business first, the webhook carries a **Business-Scoped User ID (`user_id`)** and may omit the phone number. **Store a BSUID column** next to `phone_e164` on users, and match on BSUID first. ([WATI](https://www.wati.io/en/blog/whatsapp-business-usernames/), [Chatwoot issue](https://github.com/chatwoot/chatwoot/issues/13837). These are third-party; Meta's docs were not checked, so **unverified**.) Because we collect the phone number in our own signup flow, our sending isn't affected.

---

## 4. WhatsApp Flows: booking or RSVP inside WhatsApp?

**A booking or RSVP is technically possible; payment inside WhatsApp is not.**

- Flows are native multi-screen forms inside WhatsApp. A Flow with an **endpoint** (`data_exchange`) calls our server on each screen, so we can return live data such as available tables and minimum spends. Requests arrive encrypted (RSA-signed key pair plus AES payload). ([Meta: Implementing your Flow endpoint](https://developers.facebook.com/documentation/business-messaging/whatsapp/flows/guides/implementingyourflowendpoint)) One third-party guide says the endpoint must answer within about 10 seconds ([baat.ai](https://baat.ai/knowledge-base/integrating-whatsapp-flows-with-dialogflow), **unverified**).
- **Payments in WhatsApp are only available in India (UPI), Brazil (PIX) and Singapore.** Ghana is not supported, and I found no announced launch. ([Infobip](https://infobip.com/blog/whatsapp-payments), [360dialog Brazil](https://docs.360dialog.com/partner/commerce-and-payments/payments-api-brazil)) A Flow therefore has to end with a **CTA-URL button that opens a Paystack checkout link**.
- Good uses of Flows for us (v2):
  1. **Guest RSVP.** "Kofi invited you to his table at Labadi Beach Club Sat 20 Dec. Coming? [Yes/No] + name + age 18+ confirm." This only works once the guest has a session with us, so the guest must message us first. A `wa.me/<our number>?text=RSVP%20X7K2` deep link opens the window, then we reply with the Flow inside it.
  2. **Re-book / "same table next week"** for returning users who message us.
  3. **Door-policy acknowledgement** (dress code, ID).
- Not for v1. The web checkout already exists, and a Flow adds encryption plumbing plus template review.

### Groups API

Since mid-2026, businesses with an Official Business Account can create **WhatsApp groups** via the Cloud API. The catch is **a maximum of 8 participants per group**, and people join only through invite links. That's too small for many club tables. Groups need an **Official Business Account** (the blue-tick badge). ([Meta: Groups API](https://developers.facebook.com/documentation/business-messaging/whatsapp/groups/)) Revisit later for small tables (≤7 guests plus our number).

### AI chatbots

From 2026-01-15, the WhatsApp Business Solution Terms ban *general-purpose* AI assistants. Booking and support bots are still allowed. ([TechCrunch](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform/)) An AI "concierge" is fine if it stays scoped to bookings.

---

## 5. Click-to-chat and share-to-WhatsApp (no API needed)

The free, zero-approval channel, and the right one for **guest invites**:

- **Share to any contact:** `https://wa.me/?text=<urlencoded>`. WhatsApp opens the contact picker with the text pre-filled, and the host sends it from their own account.
- **Chat with us:** `https://wa.me/233XXXXXXXXX?text=<urlencoded>`. Use the full international number with no `+`, no leading 0, and no spaces.
- Encode with `encodeURIComponent`. Spaces become `%20` and newlines `%0A`.
- Sources: [WhatsApp Help Center: "How to use click to chat"](https://faq.whatsapp.com/5913398998672934) (the page body was not readable, so the format comes from [Unipile](https://www.unipile.com/tr/?p=275019)).
- Limits: the link is **stateless**. We never learn whether it was sent or opened. Track this with the per-guest token in the URL (`detty.app/i/{token}`): when the guest opens the RSVP page, mark them "opened".
- On Android, also offer `navigator.share()` (Web Share API) so the host can pick Telegram, SMS, Instagram and so on.

**Invite message sketch (host to guest):**
```
Kofi added you to his table at Labadi Beach Club 🎉
Sat 20 Dec · 11pm · Table B4
Tap to confirm your spot (takes 10s): https://detty.app/i/k9QpZ
```

**Why not send invites via the API?** The guest never opted in to messages from us; the host typing their number is not the guest's consent. Sending templates to them risks quality-rating hits, blocks, and policy enforcement. After the guest RSVPs on our page and ticks the WhatsApp updates box, we can send them utility reminders.

---

## 6. BSP vs direct Cloud API

| Option | Cost on top of Meta | Notes |
|---|---|---|
| **Meta Cloud API (direct)** | **$0** | Meta-hosted. Create the app at developers.facebook.com, add the WhatsApp product, and generate a system-user token. The On-Premises API was retired in October 2025 ([360dialog](https://docs.360dialog.com/docs/waba-messaging/flows)), so the Cloud API is the only path. |
| 360dialog | about €49 per number per month license, Meta fees passed through with no markup | Good if we want their tooling. ([360dialog docs](https://docs.360dialog.com/docs/~/revisions/syoLocQFO08QYJ1hYSkE/first-steps/why-you-should-use-360dialog-as-business-solution-provider-bsp/prices-plans-and-payment-options), [EZContact](https://ezcontact.ai/en/blog/whatsapp-api-pricing-comparison-meta-twilio-360dialog-ezcontact/)) |
| Twilio | about $0.005 per message (in or out) on top of Meta | Handy if we also use Twilio for SMS or Verify. ([green-api](https://green-api.com/articles/en/blog/how-much-is-twilio-whatsapp-api-and-what-can-replace-it/)) Third-party figure, **unverified**. |

**Recommendation:** go **direct to the Cloud API**. Our messaging is template-heavy and simple, and a BSP mainly adds an inbox UI, which we don't need in v1.

### What you need

1. A **Meta Business portfolio** for the Ghana entity, with **Business Verification** completed: registration certificate, and address or utility bill matching the entity. Verification is the fastest way to move from 250 to 2,000 unique users per 24 hours ([Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits)). Budget days to a couple of weeks (**unverified**), and start now.
2. A **dedicated phone number** that isn't registered on the consumer WhatsApp app (or use Coexistence, if we want to keep it on the Business app too).
3. A **display name** that matches the brand on the website and the verified business. Meta reviews it. Approved or rejected status arrives by webhook; a name can be changed at most 10 times per 30 days; after an approved change, re-register the number within 14 days. ([Meta: Display names](https://developers.facebook.com/documentation/business-messaging/whatsapp/display-names)) No special characters, and no URLs as names ([Rasayel](https://learn.rasayel.io/en/blog/whatsapp-display-name/)).
4. A **payment method** on the WhatsApp Business Account. This is required for service messages from 2026-10-01.
5. **Templates submitted for approval** (utility and auth templates are usually approved quickly).
6. A webhook endpoint for `messages` and `statuses`, used for delivery tracking, SMS fallback, 131049 handling and opt-outs.
7. Optional, later: an **Official Business Account** (blue tick). It's needed for the Groups API and helps trust.

---

## Open questions and unverified items

- The exact Rest of Africa rates on Meta's official 2026-10-01 CSV. The table above comes from a third-party copy.
- Whether the iOS 26 OTP keyboard suggestion works in Safari web inputs.
- Ghana SMS aggregator prices, and how long sender-ID registration takes with local aggregators versus Twilio.
- How long Business Verification takes for a new Ghana entity.
