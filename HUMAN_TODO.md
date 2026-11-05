# HUMAN_TODO

Things only the owner can decide or do. The build keeps going with sensible defaults meanwhile.

## REQUIRED (decide soon)
- [ ] **Confirm the brand**: Detty Gold (the blend) or one of Detty / Aurum / Vybe. See Brand / Evolution. See Storybook → Brand / Directions.
  Also run a trademark search on the chosen name for Ghana and the main diaspora markets.
- [ ] **Share the "previous experience"** you mentioned (screens, links or a deck). It wasn't attached,
  so these drafts don't build on it yet.
- [ ] **Deposit & refund policy**: the drafts use 30–50% deposits, a 3% booking fee, and refunds of
  100% more than 48h before, 50% at 6–48h, 0% after (`src/lib/pricing.ts`). Confirm or replace.
- [ ] **Start Meta Business Verification + WhatsApp Cloud API number** (250/day cap until verified).
- [ ] **Register an SMS sender ID with MTN Ghana** (needed for the SMS code fallback; about 2–3 weeks).
- [ ] **Open a Paystack Ghana account** (MoMo + card) and start go-live KYC.
- [ ] **Legal questions for counsel**: holding deposits and paying venues later (Act 987); Bitcoin
  acceptance under Act 1154 plus the crypto advertising ban; Data Protection Commission registration.

### Product rules the drafts assumed (confirm or change)
- [ ] Venue cancels → booking fee refunded too? *(draft: yes)*
- [ ] After the night: is an unspent minimum charged, and is service charged on the billed amount? *(draft: yes, yes)*
- [ ] Making a booking smaller: the unrefunded part of the deposit stays as credit toward the bar tab? *(draft: yes)*
- [ ] Split deposit: the share is (deposit + fee) ÷ party size, and the host absorbs rounding? *(draft: yes; the Pay screens have the host pay the fee)*
- [ ] Lock guest invite links to the invited phone number, so a forwarded link can't take the spot? *(draft: not locked)*
- [ ] Promoter broadcasts send from our one booking number, so they affect its WhatsApp quality rating. OK, or give venues their own numbers?
- [ ] When does a large party need venue approval? *(draft: the 12-guest lounge tier)*
- [ ] Venue terms: platform fee 5%, promoter commission 10%, 2-day settlement *(all draft, in `promoter/promoterData.ts`)*
- [ ] Ticket rules: max 6 per order, promo DETTYDEC 10% *(draft)*
- [ ] Draft promises in the copy: replies within an hour at night, at most one promo a week, deletion undoable for 30 days.
- [ ] Confirm the USSD help codes for a missed MoMo prompt with each network *(only MTN `*170#` is known)*.

## LATER
- [ ] Real venue partners: floor plans, table tiers, minimums, bottle menus.
- [ ] Decide on English-only vs adding Twi or Pidgin copy.
- [ ] Whether the promoter app is the same PWA with a role switch (recommended) or a separate app.
- [x] GitHub: the repo `girardjustin1/detty-nightlife` and its Pages site are **public** (owner asked to deploy
  on 5 Nov). The booking WhatsApp line (`src/config/contact.ts`) is visible there. Everything else is sample data.
- [ ] Pick the booking channel to lead with: WhatsApp menu bot, Flows, AI concierge, or the app. Compare them in the prototype.
- [ ] Ticket wallet in the app prototype shows a different sample booking than the one just bought (screen has no booking prop yet).

## OPTIONAL
- [ ] Higgsfield: more venue art, per-venue floor plans, and motion key art for the promo site.
- [ ] Smile ID for Ghana Card checks on VIP tables (v2).
