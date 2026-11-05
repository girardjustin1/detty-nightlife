# Synthesis: Detty Nightlife screen list

Built from Mobbin research (2026-11-05): `resy.md`, `seatgeek.md`, `opentable.md`,
`other-references.md`. "Ref" says where each pattern came from. **(new)** means Mobbin had no
direct reference: our own design, assembled from parts.

Key: R = Resy, SG = SeatGeek, OT = OpenTable, plus other apps by name.

---

## Consumer app

### A. Onboarding & auth
1. **Splash / value prop.** Brand, one line ("Tickets & tables in Accra"), a phone field right on it. *Ref: R auth landing.*
2. **Phone entry.** One field for log-in *and* sign-up, defaulting to 🇬🇭 +233 with a searchable country picker; Apple / Google secondary; SMS consent line. *Ref: R, Tinder, Pi.*
3. **OTP.** 6 boxes, SMS autofill, inline "Incorrect code", resend timer, "Send via WhatsApp instead" (new). *Ref: R.*
4. **Profile basics.** Name, date of birth (age gate for 18+/21+ venues), optional email for receipts. *Ref: Tinder (email after phone).*
5. **Preferences (skippable).** Genres (Afrobeats, Amapiano, Hip-hop, House), areas (Osu, East Legon, Labadi…), notifications permission. *(inferred)*

### B. Discover (one tab, two views: **Events | Venues** segmented toggle)
6. **Discover: Events view.** Location/date pill ("Accra · This weekend"), genre chips, hero "Featured", rows by night (Tonight / Fri / Sat / Detty December) as image cards with a "from GH₵" badge and a heart. *Ref: SG home + category rows; OT Experiences date badges.*
7. **Discover: Venues view.** Same filters; venue cards with photo, vibe tags, price tier, area, and a row of **table-tier chips with availability** under each card ("VIP Booth · from GH₵ 5,000", or "Notify" when full). *Ref: R slot chips on list cards; OT seating types on rows.*
8. **Map view.** A toggle from either view: dark map, pins, bottom-sheet card carousel. *Ref: R map search; OT map + bottom card.*
9. **Search & filters sheet.** Date, party size (chips 2 / 4 / 6 / 8 / 10+), genre, area, price range with histogram, "Tables available" and "Tickets available" toggles, "Prices incl. fees" toggle. *Ref: R availability sheet; SG filters.*

### C. Event detail
10. **Event detail.** Poster/hero, name, date, door time, venue link, lineup/DJs (with "Top track" preview like DICE), age policy; info rows; **Invite friends** row; sticky bottom bar "from GH₵ X · Get tickets | Book a table". *Ref: DICE event page; SG GA hero.*
11. **Event: info rows.** Icon facts: how you get in (QR on phone), who sells, refund/transfer policy, dress code, age, "Notes for tonight". *Ref: SG listing facts; OT "Notes for tonight".*

### D. Venue detail
12. **Venue detail.** Hero carousel "See all N photos", name, rating, price tier, area, vibe tags; **sticky anchor tabs: Tables · Events · Bottles · Reviews · Details**; "Booked N times tonight". *Ref: OT detail structure + social proof; R hero.*
13. **Venue: Tables module.** Party/date pill plus table-tier chips; "Find another night"; Notify chips when full. *Ref: R slot row + Notify; OT "Find future availability".*
14. **Venue: Events module.** Upcoming nights at this venue in a carousel. *Ref: R "Events on…" inside venue.*
15. **Venue: Bottles/Menu.** Preview of the bottle menu with prices; "See full menu". *Ref: OT Menu tab.*
16. **Venue: Reviews.** Overall score and distribution, sub-ratings (Music / Crowd / Service / Value), sort sheet, photos. *Ref: OT reviews.*
17. **Venue: Details.** Icon rows: hours, dress code, age, parking, payment accepted (MoMo / Card / ₿ Lightning), accessibility, address + map, Instagram/WhatsApp. *Ref: OT Details; R contact card.*

### E. Booking flow: tickets path
18. **Ticket tiers.** Quantity chips (1 / 2 / 3 / 4+), tier cards (Early bird / GA / VIP) each with a stepper, "GH₵ X incl. GH₵ Y fee", sales-end date, SOLD OUT state; sticky total + Continue. *Ref: Eventbrite tiers; SG GA quantity chips + "fees included".*
19. **Checkout (shared component).** One sheet: event summary; rows Contact, Payment, Quantity, Promo; sticky "Total GH₵ · View details ⌃" plus **Pay**. *Ref: SG checkout sheet.*
→ continues at **Pay** (screen 27).

### F. Booking flow: table path
20. **Floor plan.** The venue map is on top, with tables as shapes coloured by tier/availability and a price/minimum bubble on the selected one. A synced list below it ("Booth 4 · 6–8 guests · Min GH₵ 6,000 · Stage-side"), with sort and party-size filter chips. *Ref: SG seat map + listing list. Table shapes are (new).*
21. **Table detail sheet.** View-from-table photo, mini map, capacity, minimum spend, deposit due now, what's included (mixers, sparklers, host), facts list (arrival cut-off, dress code, age), **Select table** CTA. *Ref: SG listing detail sheet.*
22. **Bottles (toward minimum).** Category tabs (Champagne / Cognac / Vodka / Tequila / Packages), bottle cards with a – n + stepper; a **sticky progress bar "GH₵ 4,200 of 6,000 minimum"** that turns ✓ when the minimum is met; "Decide later at the venue" option if the venue allows it. *Ref: OT Add-ons steppers; Wise progress bar. The minimum-spend meter is (new).*
23. **Guests.** Host plus N slots shown as avatars; add from contacts, or share a WhatsApp link; "Unknown guest" placeholders; choose who pays (host pays the deposit / split the deposit). *Ref: R Invite Your Party; Monzo contact picker.*
24. **Occasion & requests (optional).** Chips (Birthday, Detty December, Anniversary, Corporate) and a note. Can also be done after booking. *Ref: OT occasion chips; R post-booking prompts.*
25. **Review & commit.** **Policy block first:** deposit amount, what's refundable and until when (exact date, time, GH₵), arrival cut-off, minimum-spend rules, no-show terms. Then table, bottles, guests, then the price breakdown (subtotal, service charge, VAT/levies, deposit now, balance at venue), then **Confirm & pay deposit**. *Ref: R Complete Order + policy; SG itemised breakdown.*
26. **Venue-rules confirm sheet.** Shown only when the venue has hard rules (21+, strict dress code, ID required): "Are you sure?" with **I understand · Pay deposit** / Go back. *Ref: R "Are You Sure?".*
27. **Pay.** Grouped methods: **Mobile Money** (network + number, saved numbers), **Card**, **Bitcoin Lightning** (invoice QR + copy + timer); hold/consent copy. *Ref: Zomato grouped methods; R card-hold consent. MoMo and Lightning detail is (new).*
28. **Payment pending.** "Approve the GH₵ X prompt on your phone" (MoMo) or "Waiting for payment" (Lightning), with a countdown, resend, change method, and an inline error on failure. *Ref: SG "Confirming order" state + inline payment error. (new for MoMo.)*
29. **Confirmation.** "✓ Booked" over a hero image, date, table, guests; **QR**; Add to Calendar · Get Directions · Share with guests; optional prompts (occasion/requests); "Bring more friends" upsell (extra tickets, top-up bottles). *Ref: R confirmed sheet; OT confirmed; SG "Bring more friends".*

### G. My bookings & management
30. **Bookings tab.** Upcoming / Past toggle; cards for tickets and tables (thumb, venue/event, date, party, status chip: Confirmed, Pending payment, Waitlist); "…" quick actions. *Ref: Posh Upcoming/Past; R reservations list + action sheet.*
31. **Ticket wallet / QR.** Ticket-stub card, rotating QR ("Screenshots won't get you in"), "Ticket 1 of 2 · VIP", brightness boost, works offline; actions: Transfer, Add to Wallet, Directions, View event. *Ref: Posh, Eventbrite, Live Nation.*
32. **Table booking detail.** Status, QR for the host, guests and payment progress, bottles pre-ordered, deposit paid and balance due, **policy repeated**, Modify / Cancel, map + address. *Ref: R booking detail; OT booking detail.*
33. **Modify booking.** Change party size, bottles, or arrival time in place; **Save changes** is disabled until something changes; any price difference is shown before saving. *Ref: OT modify.*
34. **Cancel sheet.** Booking summary, policy restated with the exact refund amount, "Cancel booking". *Ref: R cancel sheet (better than OT's bare alert).*
35. **Transfer ticket.** Pick a contact or phone number, confirm, show transferred state. *Ref: Posh "Transfer Ticket" row. Flow detail inferred; SG capture had none.*
36. **Waitlist / Notify list.** Tables or nights you asked to be notified about, with time window and party size. *Ref: R Notify.*
37. **Receipts / history.** Timeline of payments and refunds with an itemised breakdown. *Ref: SG ticket history + price breakdown.*

### H. Guest invite flow (guest's side)
38. **Invite landing (deep link / web).** "Kwame invited you to Booth 4 at [Venue] · Sat 11pm". Your share is GH₵ X. **Accept & pay** / Accept without paying (if the host allows). *Ref: Wise payment link for non-users. (new layout.)*
39. **Guest share payment.** Same Pay component (MoMo-first), with an editable or fixed share. *Ref: PayPal editable split.*
40. **Host: collection status.** Progress bar "GH₵ 3,000 of 6,000 collected"; guest rows Paid ✓ / Pending / Invited; nudge via WhatsApp; approve or remove guests. *Ref: Wise split status; Apple Invites pending approval.*

### I. Profile & settings
41. **Profile.** Avatar, name, upcoming booking, saved venues/events, notify list. *Ref: R Account.*
42. **Payment methods.** Saved MoMo numbers, cards, Lightning preference. *(inferred)*
43. **Account & privacy.** Phone (verified), email, notifications, delete account with honest copy ("deleting does not cancel upcoming bookings"). *Ref: R Account settings.*
44. **Help.** FAQ, chat with the venue or promoter on WhatsApp, report an issue. *Ref: SG Help & Support. Concierge fallback per Blackbird.*

---

## Promoter / venue companion app (short list)
1. **Tonight dashboard.** Bookings, guests expected, arrived count, deposits collected, minimum spend sold. *(new)*
2. **Floor view.** The same floor plan, with tables coloured booked / arrived / free / held; tap a table for its booking. *(new; consumer floor plan reused)*
3. **Reservations list.** Filter by night and status; open a booking: host, guests, bottles, payments, notes, occasion. *(new)*
4. **Booking requests / approvals.** Approve or decline concierge requests and large parties. *Ref: Apple Invites pending ✓/✕; Blackbird concierge.*
5. **Guest list.** Tabs Attending / Pending / No-show, search, add a guest manually, "+1" permissions. *Ref: Givingli tabs; Apple Invites "Can add guests"; Partiful.*
6. **Door check-in.** **List | Scan** toggle; camera scanner; result card (name, ticket/table, "Scanned 10:01 PM", already-scanned warning); success toast; manual check-in button with undo. *Ref: Luma, Posh, Partiful, Meetup.*
7. **Inventory & pricing.** Table tiers, minimums, deposits, bottle menu, ticket tiers, sales windows. *(new)*
8. **Payouts & reports.** *(new)*

---

## Cross-cutting patterns
- **Sticky bottom CTA bar** with price context ("from GH₵ X", "Total · View details ⌃") on every booking-path screen. *(SG, DICE, R)*
- **Sticky context pill** ("6 guests · Sat 23 Dec · 11 PM") that opens one sheet to edit party, date, and time. *(R, OT)*
- **Minimum-spend progress meter.** Always visible on the bottles step; carried into review and booking detail; turns into "✓ Minimum met". *(new; Wise progress bar as the visual reference)*
- **Policy disclosure, three times:** on review (first block), on the booking detail, and in the cancel sheet. Always concrete: date, time, GH₵ amount. *(R)*
- **Fees shown up front.** "incl. fees" on prices, a fee toggle in filters, an itemised breakdown at checkout and on receipts. *(SG, Eventbrite)*
- **Async payment states.** Explicit pending, confirmed, and failed states with inline row errors; never a dead spinner. *(SG confirming state; new for MoMo/Lightning)*
- **Empty state = Notify / waitlist** wherever availability shows. *(R)*
- **Commit first, enrich later.** Occasion, requests, and guest details are optional after payment. *(R)*
- **Map and list stay in sync** for floor plans and venue maps. *(SG)*
- **Icon + label + value fact rows** for venue rules and ticket delivery facts. *(OT, SG)*
- **Share by link, WhatsApp first** for guest invites, split payments, and tickets. *(Wise payment link; channel is our assumption)*
- **Offline-capable QR** with an anti-screenshot rotating code. *(Live Nation; offline is an inferred need)*
- **Dark UI** suits nightlife, and Resy shows a premium dark booking UI working well. *(R)*

## Open gaps (no Mobbin reference found)
- Table floor-plan picker and bottle minimum-spend UI.
- Mobile Money prompt and approval states; Bitcoin Lightning invoice screen.
- A promoter floor or host-stand view.
- Ticket transfer flow detail (only Posh's entry row was seen).
