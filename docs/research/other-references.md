# Other Mobbin references (iOS)

Source: Mobbin MCP, viewed 2026-11-05. Text notes only. No images are saved in this repo.

**Gaps:** Mobbin returned **no nightclub table / bottle-service / minimum-spend screens** and
**no restaurant or venue floor-plan table picker**. The closest matches were SeatGeek's seat map
(see `seatgeek.md`) and a novelty seat grid in FocusFlight
([screen](https://mobbin.com/screens/0f3b46f4-c2fd-4d8d-842c-47a51b32c5a7): dark seat grid with
one selected seat and a Confirm pill). The floor plan and minimum-spend UI will be our own
design, built from SeatGeek's map and list plus OpenTable's add-on steppers.

## 1. Phone / OTP sign-up

| App | What I saw | Link |
|---|---|---|
| Resy | Phone-first field with +1 prefix as the *single* log-in/sign-up entry, plus Apple / Email; searchable country-code list with A–Z index; 6-box OTP split 3-3; inline "Incorrect verification code"; "Need help?" | [Onboarding flow](https://mobbin.com/flows/69f31638-5343-4518-b373-0653ecdf8c23?tab=screens) |
| Tinder | "Can we get your number?" with a compact country prefix dropdown ("SG +65 ▾") and an underline input; explainer "We'll text you a code…"; link "What happens if your number changes?"; Next is disabled until valid; then email; then house rules with "I agree" | [Onboarding flow](https://mobbin.com/flows/f1af7bae-5348-4966-8e49-a1f7581ab3a8?tab=screens) |
| Pi | Social buttons (Google, Apple, Facebook) + "Use phone number"; Country/Region dropdown with the dial code in its label; SMS consent copy above Continue | [Logging in flow](https://mobbin.com/flows/a3e68508-96da-4b9c-8848-cd08ed0ca722?tab=screens) |

**Take:** a phone-first single field defaulting to **🇬🇭 +233**, a 6-digit OTP with autofill,
and inline errors. Offer WhatsApp as an OTP channel (our idea, not observed). Ask for email
later, Tinder-style, and only when it is needed for receipts.

## 2. Split the bill / invite friends to a booking

| App | What I saw | Link |
|---|---|---|
| Wise | "Bill splits" list (Active / Inactive); "SPLIT WITH ANYONE – if they're not on Wise, we'll create a **payment link**"; Split between: add people, **editable amount per person** ("Paid" / "Owes you"); Create; status card with **progress bar "1 SGD received … requested"** and a list of who has paid (✓ avatars) | [Adding a bill split flow](https://mobbin.com/flows/b482eb3b-5f10-494f-a4ef-18d1e629f91a?tab=screens) |
| Monzo | "Split payment" entry; pick a transaction; Split bill contact picker with search, **Nearby Friends**, "Split with people outside Monzo" + stepper, Favourites / Recent with checkboxes; result: per-person rows + "Cancel bill split" | [Splitting a payment flow](https://mobbin.com/flows/054c2a81-ed87-4ea9-88b9-3f8cd713f7a7?tab=screens) |
| PayPal | More options → "Split the bill"; amount keypad; "Split $1.00 – we automatically calculated these amounts. You can edit each person's share" (pencil per row); Review; "You requested a payment split" success + track in pending activity | [Requesting a split payment flow](https://mobbin.com/flows/ded54179-ef37-40ff-b209-83503b894743?tab=screens) |
| DICE | Event page has an **"Invite friends"** row (people icon) between the info rows, and a sticky price + BUY NOW bar | [screen](https://mobbin.com/screens/ae074cf0-3b1d-4718-bfa2-67d4c929c10b) |
| Apple Invites | Guest List: Host; **Pending approval** rows with ✓ / ✕; Going list; per-guest "Can add guests" permission | [screen](https://mobbin.com/screens/93e6c76c-c79b-4494-8cff-b61c72736251) |
| Resy | "Invite Your Party" avatars incl. "Unknown Guest" placeholder + share button on the booking | see `resy.md` |

**Take:** the host pays the deposit, then shares a **payment link** (WhatsApp first) so each
guest pays an equal or edited share. Show a Wise-style **"GH₵ X of Y collected"** progress bar,
plus guest rows with paid, pending, and invited states. Guests who don't pay are still on the
list if the host approves them (Apple Invites-style approval).

## 3. QR ticket wallet

| App | What I saw | Link |
|---|---|---|
| Posh (nightlife) | Upcoming / Past toggle; "Your Order" card with **QR + order #**, event name + date; action list: View Event, **Transfer Ticket**, Add to Calendar, Add to Apple Wallet, Get Directions | [screen](https://mobbin.com/screens/70c99608-be00-4a4a-8d05-48bc9e9697bb) |
| Eventbrite | Ticket-stub card (notched top), date/time, event thumb + name, large branded QR, "Alex Smith · Ticket 1 of 1 · GENERAL ADMISSION 21+ [TIER 1]", Add to Apple Wallet | [screen](https://mobbin.com/screens/9aa88ec6-82a1-46e0-ae92-df1a9c9f7306) |
| Live Nation | **Rotating barcode** with "Screenshots won't get you in." + refresh icon, over the event art; Add to Apple Wallet; Ticket Details page: seat (GA), entry info, barcode #, order #, ticket type, price + fee + grand total, T&Cs | [ticket](https://mobbin.com/screens/09fc694b-8ccc-4ba4-8a42-8000ebc67d3e), [details](https://mobbin.com/screens/72dd7a4f-b1e8-4439-b82b-1e04d473de0a) |
| Luma | Dark sheet, big QR, "Ticket · 1× Standard", Add to Apple Wallet | [screen](https://mobbin.com/screens/fd60dbd4-6f2f-43e8-a2a8-dbf6954b3f59) |
| Meetup | Ticket card with notch, QR, event, location, Name, Group, **Download** | [screen](https://mobbin.com/screens/427c632f-e3ad-471e-8652-1d95b622e4f3) |

**Take:** Posh's layout (QR plus an action list including Transfer) combined with Live Nation's
anti-screenshot rotating code. Add offline caching and a "Download" fallback (Meetup) for weak
signal at the door (inferred need). A table booking gets one host QR plus a QR per guest.

## 4. Ticket tiers / deposits (bonus)

| App | What I saw | Link |
|---|---|---|
| Eventbrite | Tier cards "GENERAL ADMISSION 21+ [TIER 2]" with a – 0 + stepper, "$17.85 incl. $2.85 fee", "Sales end on May 4", a **SOLD OUT** tier, "FREE WITH RSVP [FIRST 50 PEOPLE TO ARRIVE]"; footer total + Apple Pay + "Pay another way" | [screen](https://mobbin.com/screens/99d395c6-cf5b-4789-8aaa-aa3d6b8f6319) |
| Tock | Experience cards with "Party size 1-6", **"$40 deposit / person"**, Book | [screen](https://mobbin.com/screens/61c1d246-3ef4-4abb-9cc3-3b43f906d0f2) |
| Blackbird | "Reserve a Table" sheet: Start here → Reserve with Resy, *or* Full service → **Request a Reservation with Concierge** | [screen](https://mobbin.com/screens/84b30dfe-2ab8-41eb-8a10-c072f560166a) |
| Zomato | Grouped payment methods: Recommended, Cards, UPI apps, Wallets, Pay Later | [screen](https://mobbin.com/screens/7aa2b9c3-1437-40d2-88d8-d9fcabd22be3) |

**Take:** Eventbrite tier cards for tickets (early bird / GA / VIP, sold-out, sales-end).
Tock's "deposit / person" label. Blackbird's **concierge fallback** ("Request a table, the
promoter will WhatsApp you") for large or custom parties. Zomato's grouped payment list becomes
**Mobile Money (MTN MoMo, Telecel Cash, AT Money) / Card / Bitcoin Lightning**. The network
names are our assumption for Ghana and were not observed on Mobbin.

## 5. Business side: guest list and door check-in

| App | What I saw | Link |
|---|---|---|
| Luma | Scanner with **List / Scan** segmented toggle, search, torch, settings; success toast "✓ Guest checked in." | [screen](https://mobbin.com/screens/6f2ca8bd-8c6a-4bf5-9ac7-7e2336d30ef9) |
| Posh | "Scan Tickets": guest card (name, email, phone), Order #, ticket rows with **"SCANNED · Scanned Tonight at 10:01PM"**, "Show scanned ticket" checkbox, "No available tickets" state | [screen](https://mobbin.com/screens/d227b61a-b14b-4edc-a5e7-8ee8a8a81812) |
| Partiful | "Check In Guests": search, rows with RSVP status (Going / Maybe), **Check in** button, ✓ when done, **"Uncheck them?" undo sheet** | [screen](https://mobbin.com/screens/ea985466-4b63-4131-a55d-7f43a9985882) |
| Meetup | List / Scan tabs, camera frame, "Point the camera at a ticket QR code…" | [screen](https://mobbin.com/screens/31e93f37-6471-40fc-969c-e2396f9ad6a4) |
| Givingli | Manage Guests tabs **Attending / Can't Go / No Response (1)** + Invite More | [screen](https://mobbin.com/screens/5ac8407e-9bbe-49db-bc8d-9529f5f5f48f) |

No dedicated restaurant or club **reservation manager** (a host-stand floor view) came back.
The promoter-side table view will be our own design.
