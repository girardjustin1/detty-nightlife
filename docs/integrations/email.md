# Transactional email

Researched 2026-11-05.

## TL;DR

- In Ghana, **WhatsApp is the primary notification channel and email is the record**: receipts, tickets, refunds, and anything a user might need to forward or find later. Diaspora visitors and corporate bookers are more email-first.
- **Provider: Resend.**
  - **Free:** 3,000 emails a month, capped at 100 a day.
  - **Pro:** $20 a month for 50,000. Overage is $0.90 per 1,000.
  - Templates are written in **React Email**, which matches our React + Storybook stack, so email templates can be built and reviewed as Storybook stories.
- **Alternatives:** **Postmark** has excellent deliverability, starts at $15 a month for 10,000, and keeps transactional and broadcast traffic in separate streams. **Amazon SES** is cheapest at scale at $0.10 per 1,000. SendGrid is no longer a default pick because it **retired its free plan in May 2025**.
- Authenticate the sending domain with **SPF, DKIM and DMARC** from day one. Gmail and Yahoo require it for bulk senders, and **Outlook has required it since 5 May 2025**. Send transactional mail from `mail.detty.app` and marketing from a separate subdomain.

## 1. Provider comparison

| | **Resend** | **Postmark** | **Amazon SES** |
|---|---|---|---|
| Free tier | 3,000 a month, 100 a day | 100 a month | Covered by AWS Free Tier credits, up to $200 for new accounts |
| Entry plan | $20 a month for 50k; $35 for 100k | $15 a month for 10k (Basic) | $0.10 per 1,000 |
| Overage | $0.90 per 1,000 | $1.20–1.80 per 1,000 | – |
| Dedicated IP | $30 a month add-on (Scale plan, over 3,000 a day) | add-on | $24.95 a month |
| Templates | **React Email** (JSX) | Mustachio templates, or your own HTML | Your own HTML |
| Marketing / broadcast | Separate, priced per contact (free up to 1,000 contacts) | Separate broadcast stream | Your own setup |
| Retention | 30 days | 45 days (customisable on Pro) | Event publishing (DIY) |

Sources: [Resend pricing](https://resend.com/pricing), [Postmark pricing](https://postmarkapp.com/pricing), [Amazon SES pricing](https://aws.amazon.com/ses/pricing/), [Twilio: SendGrid free plan retired](https://www.twilio.com/en-us/changelog/sendgrid-free-plan).

**Recommendation:** start on **Resend** and move to Pro before the Detty December peak. The free tier's 100-a-day cap will break the first busy night. If deliverability to Outlook or corporate inboxes becomes a problem, Postmark is the fallback. Hide the provider behind a `Mailer` interface.

## 2. Deliverability setup

- **SPF, DKIM and DMARC.** Start DMARC at `p=none` with reporting, then move to `quarantine` once reports are clean. Outlook's May 2025 rule requires all three for senders of more than 5,000 emails a day. Sources disagree on whether failing mail goes to Junk or is rejected. ([EasyDMARC](https://easydmarc.com/blog/outlook-new-email-sender-policy-update/), [Mailgun](https://www.mailgun.com/blog/deliverability/microsoft-sender-requirements/), [Spam Resource](https://www.spamresource.com/2025/04/microsoft-joins-club-top-four-b2c-mbps.html))
- **One-click unsubscribe (RFC 8058)** on all *marketing* email. Gmail and Yahoo require it, and Microsoft requires a working unsubscribe link. Transactional email doesn't need one.
- Use a separate subdomain for each stream, for example `mail.detty.app` (transactional) and `news.detty.app` (marketing).
- Use a real, monitored Reply-To address (`support@`), so replies reach a person.

## 3. Low-bandwidth email rules

- Keep each email under **about 100 KB** total. This is our own budget, not a provider limit. Avoid hero images. Use a small logo (an SVG isn't safe everywhere, so a PNG of about 5 KB or less) and text-first layouts.
- **Ticket and pass QR codes:** use a small PNG (2–6 KB), placed inline as a CID attachment or a hosted image. Always include a **text booking code** as well (for example `X7K2-B4`), so door staff can look it up if the image won't load.
- Optional attachments: an **.ics** calendar file (a few KB), and later an Apple Wallet **.pkpass**. Never attach PDFs over about 100 KB.
- Make it readable with images off. Link to the web pass (`detty.app/b/X7K2`), which works offline once it has been opened.

## 4. Emails a user should receive

**T** stands for the event start time.

| # | Email | Trigger | Key content | Also via WhatsApp? |
|---|---|---|---|---|
| 1 | **Verify email** | User adds an email address | Magic link or code | No |
| 2 | **Booking confirmed** | Deposit `charge.success` | Venue, date and time, table, minimum spend, deposit paid, balance due on the night, cancellation policy, door policy (18+, ID, dress code), link to the pass, .ics | Yes (utility) |
| 3 | **Deposit receipt** | Payment success. Can be combined with #2 | Amount (GHS), method (MoMo or card, last 4 digits or masked number), Paystack reference, our business details, how the deposit is applied to the minimum spend | Yes (utility), or combined |
| 4 | **Ticket delivery** | Ticket purchase succeeds | One QR and code per ticket, transferable rules, gate time, .ics, Wallet pass (later) | Yes (utility) |
| 5 | **Guest invite** (for guests who gave an email) | Host adds a guest by email | Host name, venue and date, one-tap RSVP link, age 18+ notice | Mainly the host's own `wa.me` share. Email is the fallback |
| 6 | **Guest RSVP update** (to host) | A guest accepts or declines | n of m confirmed, prompt to reassign spots | Yes (utility) |
| 7 | **Reminder** | T-24h and/or T-3h | Time, address with a map link, door policy, pass link, guests confirmed | Yes (utility). Email is optional at T-3h |
| 8 | **Booking changed** | Venue or user changes time, table, guest count or minimum spend | What changed (old to new), any payment difference, updated pass | Yes (utility) |
| 9 | **Payment needed** (v2: split deposits) | Deposit not fully covered by the deadline | Amount left, deadline, pay link | Yes (utility) |
| 10 | **Cancellation confirmed** | User or venue cancels | Who cancelled, refund amount under the policy, method, expected timing ("up to 10 business days" for card per Paystack), reference | Yes (utility) |
| 11 | **Refund processed** | Paystack `refund.processed` | Amount, method, reference | Yes (utility) |
| 12 | **Post-event receipt** | After the venue closes out the table (v2, needs a venue POS export or manual entry) | Minimum spend vs actual spend, deposit applied, balance paid at the venue | Optional |
| 13 | **Review request** | T+12h to 24h | 1-tap rating, short review | No. It's marketing-adjacent, so keep it on email or in-app |
| 14 | **Account / security** | New login, phone number or email change | Device, time, "not you?" link | Phone change: yes (utility) |

Marketing email (event drops, newsletters) needs its own opt-in, the marketing subdomain, and one-click unsubscribe.

## 5. Building it

- Build every template as a **React Email component with a Storybook story** for each state: paid with MoMo vs card, deposit vs full payment, with and without guests, venue-cancelled vs user-cancelled. Use the same story fixtures as the app's booking cards.
- Send from a server-side job queue. Use an idempotency key per `(booking_id, email_type)`, so a retried webhook never sends a second "Booking confirmed".
- Track bounces and complaints through provider webhooks, and stop sending to hard-bounced addresses.
