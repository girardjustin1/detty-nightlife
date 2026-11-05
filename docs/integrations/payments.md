# Payments in Ghana

Researched 2026-11-05. Fees change. Confirm every rate on the provider's live pricing page or with an account manager before launch. Anything marked **unverified** could not be confirmed from a primary source.

## TL;DR

- **Primary: Paystack Ghana.** It charges a flat **1.95%** on local *and* international payments. That covers mobile money (MTN, Telecel, AirtelTigo), cards and Apple Pay. It also gives us subaccounts and splits, a refunds API, transfers to MoMo at **GHS 1** and to bank at **GHS 8**, and next-working-day settlement. Paystack is a Stripe company.
- **Secondary or fallback: Hubtel.** It's local, strong on MoMo and GHQR, and its card rate is also around 1.95%. Its MoMo rate is unclear from public sources.
- **Flutterwave** is licensed in Ghana (Enhanced PSP, 2024), but third-party sources put it at about 2% MoMo and 2.6% local cards, with international cards at **4.8%**. That's worse for diaspora visitors paying by card.
- **You cannot "hold" a deposit in Ghana with Paystack.** Card preauthorization (hold, then capture) is **South Africa only**, and mobile money has no hold concept at all. Design deposits as **charge now, refund under a clear policy**.
- The **E-Levy was repealed** with effect from 2 April 2025, so there's no 1% MoMo tax on top.

---

## 1. Provider comparison

| | **Paystack Ghana** | **Hubtel** | **Flutterwave Ghana** |
|---|---|---|---|
| Local collection fee | **1.95%** (MoMo and card) | Card about 1.95%. MoMo reported anywhere from about 1.5% to about 1.95% (**unverified**) | MoMo 2%, local card 2.6% (third-party) |
| International cards | **1.95%** (charged and settled in GHS) | **unverified** | 4.8% (third-party) |
| MoMo networks | MTN, AirtelTigo, Telecel | MTN, Telecel, AT, plus G-Money, ZeePay, GHQR | MTN, Telecel (Vodafone), AT |
| Apple Pay | Yes (listed on the Ghana pricing page) | **unverified** | **unverified** |
| Payout / transfer fees | MoMo **GHS 1**, bank **GHS 8** per transfer | **unverified** | MoMo 1.5%, bank GHS 10 (third-party) |
| Settlement | T+1 to a bank *or* MoMo wallet. Bank minimum is GHS 50; MoMo has no minimum | **unverified** | **unverified** |
| Split payments | Subaccounts plus Multi-split | **unverified** (no public docs found) | Subaccounts (not checked for Ghana) |
| Refunds API | Yes, full and partial | A community SDK has a Refund class; official docs not found | Yes (not checked for Ghana) |
| Card hold / preauth | **No (South Africa only)** | **unverified** | **unverified** |
| Licence | PSP (via Paystack Ghana) | BoG-licensed PSP (**unverified**) | BoG Enhanced PSP, August 2024 |

Sources:
- Paystack Ghana fees, transfers and settlement: [paystack.com/gh/pricing](https://paystack.com/gh/pricing) (fetched with a Ghana location). Local and international are both 1.95%. Transfers to MoMo cost GHS 1 and to bank GHS 8. Settlement is T+1 to bank or MoMo, and the minimum bank payout is GHS 50.
- Paystack MoMo networks and UX: [Paystack: Pay with Mobile Money](https://support.paystack.com/en/articles/2128386).
- Paystack preauthorization: [Paystack docs](https://paystack.com/docs/payments/card-preauthorization/). Quote: "This feature is only available to registered businesses in **South Africa**." The hold lasts 5 days by default, 7 at most.
- Paystack splits: [Split payments](https://paystack.com/docs/payments/split-payments/), [Multi-split blog](https://paystack.com/blog/product/multisplits). Multi-split can pay out to "bank accounts or mobile money accounts".
- Paystack refunds: [Refunds](https://paystack.com/docs/payments/refunds/).
- Hubtel: the card rate comes from Hubtel's [service-fees page](https://explore.hubtel.com/legal/service-fees/) as summarised in search results; its table did not render when fetched. MoMo figures come from vendor blogs ([Kolonell](https://kolonell.com/en/blog/mtn-momo-vs-hubtel-fees-accra-ghana-2026)). Checkout docs: [Hubtel Online Checkout](https://dev-docs.hubtel.com/frontend/tools-and-sdks/checkout/getting-started.html).
- Flutterwave: rates from [LearnWithHasan](https://learnwithhasan.com/payment-gateways/country/ghana/) and [Kolonell](https://kolonell.com/en/blog/flutterwave-vs-paystack-fees-comparison-ghana-2026), which disagree with each other (**unverified**). Licence: [Techpoint](https://techpoint.africa/news/flutterwave-gets-ghana-psp-licence/), [Nairametrics](https://nairametrics.com/2024/08/01/flutterwave-gains-ground-in-ghana-with-enhanced-payment-service-provider-license).
- E-Levy repeal (Act 1128, effective 2 April 2025): [EY](https://globaltaxnews.ey.com/news/2025-0844), [3News / GRA](https://3news.com/news/no-more-e-levy-from-midnight-of-april-2-gra).

### Recommendation: Paystack as the single primary rail

- **One flat 1.95% for everyone.** That includes the diaspora visitor paying with a UK or US card during Detty December, who would pay about 4.8% elsewhere.
- **All three MoMo networks**, plus card and Apple Pay, through one checkout and one webhook model.
- **Subaccounts and splits** pay venues automatically, and **Transfers** to MoMo at GHS 1 make post-event venue payouts cheap.
- A mature **refunds API** with webhooks (`refund.pending`, `refund.processing`, `refund.processed`, `refund.failed`, `refund.needs-attention`).
- Keep **Hubtel as a v2 fallback**, for example if Paystack's MoMo success rate dips during peak nights, or if a venue insists on GHQR. Wrap payments behind our own `PaymentProvider` interface from day one so we can switch.

---

## 2. Mobile money UX (what the user sees)

On Paystack, the user enters their MoMo number and picks a provider. They then get a **prompt on their phone**, confirm with an OTP, and authorise with their **PIN**. ([Paystack](https://support.paystack.com/en/articles/2128386))

Design implications:
- The user leaves our screen to approve on the phone's own MoMo prompt. Show a **"Waiting for approval on your phone…"** state, poll or verify every few seconds, and time out after about 2 to 3 minutes with a retry option.
- **Pre-fill the MoMo number** from the login phone and **auto-detect the network from the prefix**, but let the user change it, because people port numbers between networks.
- **MoMo can't do recurring charges** on Paystack ("It's currently not possible…recurring"), so there's no saved-MoMo "charge balance later". Every payment needs a fresh prompt.
- Cards: Paystack returns an authorization code we can reuse for later charges on cards (not MoMo). That makes it possible to charge a balance later on card only. The exact behaviour for Ghana cards is **unverified**.

---

## 3. Deposits and minimum spend: hold vs charge

### What's possible

| Approach | Possible in Ghana? |
|---|---|
| Card auth hold, capture later | **No.** Paystack preauth is South Africa only |
| MoMo hold | **No.** MoMo is push-and-settle |
| **Charge the deposit now, refund if the booking is cancelled within policy** | **Yes** |
| Charge the deposit now, then charge the remaining minimum spend later on a saved card | Card only, and the Ghana details are **unverified**. In practice the venue settles the balance on the night with its own POS |

### Recommended model

1. **The table has a minimum spend** (for example GHS 10,000), and the **deposit** is a percentage or fixed amount (for example GHS 3,000). This lives in venue config, not code.
2. **Charge the deposit at booking.** The **deposit counts toward the minimum spend**, and the venue settles the remainder at the table on the night.
3. **Cancellation policy**, configurable per venue and shown before payment and in every confirmation:
   - full refund up to T-72h
   - 50% (or credit) up to T-24h
   - no refund after that or for a no-show
   - automatic full refund if the *venue* cancels
4. **Guests can chip in** (v2). Each guest pays their share through their own Paystack link, tied to the booking, until the deposit is covered. If the deposit isn't covered by the deadline, the host covers the rest or the hold lapses. This is our own **logical hold**: we keep the table reserved for N minutes or hours while payments come in, which is not a payment-network hold.

### Where the money sits

| Option | How | Pros | Cons |
|---|---|---|---|
| **A. Split at payment** | Each venue is a Paystack **subaccount**, and the transaction is initialised with `subaccount` + `transaction_charge` (our commission) | The venue is paid T+1 automatically. We never "hold" funds, which is simpler for compliance | Refunds after the venue has been settled come out of *our* balance, and we have to claw them back from the venue. Exactly how Paystack handles refunds on split transactions is **unverified** |
| **B. Collect, then pay out after the event** | Money lands in our main account. After check-in or the event date, pay the venue via **Transfers** (GHS 1 to MoMo, GHS 8 to bank) | Full control for refunds, no-shows and disputes. Reconciliation is easy | We're effectively holding customer money for days or weeks. Under Ghana's Payment Systems and Services Act, 2019 (Act 987), whether that needs its own licence is **unverified**. **Ask Ghana counsel before choosing B** |

**v1 recommendation:**
- For **tickets**, use **A (split)**. Tickets are mostly non-refundable and simple.
- For **table deposits**, use **B (collect, then transfer after the event)**, subject to legal sign-off. If counsel says no, fall back to **A**. In that case, add a contractual clawback with each venue and keep a small reserve per venue.

### Refunds

- Use the Paystack Refund API: full by default, partial with `amount`. Statuses arrive by webhook, and the customer may take **up to 10 business days** to see the money after `processed`. ([Paystack refunds](https://paystack.com/docs/payments/refunds/))
- I found no official Paystack documentation for MoMo refund timing. A third-party guide says refunds return to the source wallet ([mctaba](https://mctaba.com/learn/paystack/accepting-mobile-money-payments-through-paystack)), so that is **unverified**. Fallback: refund by **Transfer to the same MoMo number** (GHS 1) when the refund status is `needs-attention`.
- Whether the original 1.95% fee is returned on a refund is **unverified**. Assume it isn't, and price the cancellation policy with that in mind.

---

## 4. Tickets

- Tickets use Paystack checkout. Each ticket is a row with a signed QR payload (see `delivery-and-auth.md` for offline QR).
- Split to the promoter's subaccount, with our fee as `transaction_charge` or a percentage.
- Decide whether **the buyer pays the fee or it's absorbed**. On Paystack splits, `bearer` controls who pays the processing fee ([Paystack split payments](https://paystack.com/docs/payments/split-payments/)).

---

## 5. Integration notes

- **Always verify server-side** with `GET /transaction/verify/:reference`, plus the `charge.success` webhook (check the signature). Never trust the client redirect.
- **Idempotency:** our own `booking_id` becomes the Paystack `reference`. A retried webhook must never double-confirm.
- **Currency:** price in **GHS**. For diaspora users, show an approximate USD or GBP equivalent if useful, but charge in GHS (Paystack settles international cards in cedis).
- **Low bandwidth:** the Paystack popup / inline JS is a third-party payload. Load it **only on the pay step**, never on first paint. Payment-page weight is **unverified**; measure it.
- **Peak-night load:** Detty December brings traffic spikes. Watch the [Paystack status page](https://status.paystack.com/) and degrade gracefully, for example "MoMo is slow right now, try card".

## 6. Compliance checklist (Ghana)

- A Paystack Ghana account needs a **Ghana-registered business** (third-party, [mctaba](https://mctaba.com/learn/paystack/paystack-in-ghana-complete-developer-guide)).
- Register as a **data controller** with the Data Protection Commission (Act 843). The DPC says 2026 is a year of enforcement. ([GNA](https://gna.org.gh/2026/01/2026-will-be-a-year-of-enforcement-data-protection-commission-warns/))
- Legal review of Option B fund holding under Act 987 (**unverified** whether a licence is needed).
- Ask for volume discounts: Paystack says merchants with large volumes get one ([pricing page](https://paystack.com/gh/pricing)).
