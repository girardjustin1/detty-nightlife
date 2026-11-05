# Resy (iOS): reference notes

Source: Mobbin MCP (`search_flows`, `search_screens`), viewed 2026-11-05. App page:
https://mobbin.com/apps/resy-ios-a3cb8708-6969-4aeb-ae6d-e2cdf2faa3c6/a4d639dd-c528-4ddb-8271-6aa8055ce5ed/screens

What we look at here: how Resy gets you to commit. You pick a slot, set party size, review the
policy, put a card on file, and then manage or cancel the booking. The UI is dark, which suits
nightlife too.

These are text notes only. No Mobbin images are saved in this repo. Where a flow link is given
instead of a screen link, the MCP returned the screens for that flow but did not label which
screen ID matched which image.

## Screen inventory

| Screen | What's on it | Notable components | Link |
|---|---|---|---|
| Venue detail (top) | Full-bleed photo carousel ("View All (10)"), name, rating + count, cuisine, price tier, neighbourhood, "Why We Like It" blurb with "More", a horizontal row of time slots per service (LUNCH / DINNER) | Slot chips show both time and **seating area** ("5:00 PM · DINING ROOM", "1:30 PM · BAR TABLE"); a sticky bottom pill shows "2 · Sat Oct 12 · 9:00 PM" | [Restaurant detail flow](https://mobbin.com/flows/84491685-d675-454f-9b2c-509c3905a4bd?tab=screens) |
| Venue detail (lower) | "Events on Thu. November 28" carousel, "Need To Know" (policies and notes), "About", map + address, website / phone / Instagram card, "You Might Also Like" list | Events live *inside* the venue page; contact card has social handle | same flow |
| Search / list | Search bar + city, filter chips (Available, Collections, Lists, Events…), venue cards with photo, rating, and a slot row under each card; floating map toggle | **Slots right on the list cards**, so you can book without opening the venue; a "Notify" chip shows where nothing is available | [Reserving flow](https://mobbin.com/flows/87e21b63-0454-4143-a52a-ee12e5024af3?tab=screens) |
| Map search | Dark map with pins, a bottom sheet with a venue card carousel | Map and list are the same results, toggled | [Cancel flow](https://mobbin.com/flows/6657f27d-719f-4051-beff-9fa6f3082e6b?tab=screens) (shown in results) |
| Search availability sheet | Guests 2 / 3 / 4 / 5 / 6 / 7+ chips, month calendar with unavailable days struck through, Time ("All Day"), Search CTA | One sheet edits party, date, and time together | [Editing guests and time](https://mobbin.com/flows/5d773cc2-0502-4d90-b698-ac22164ac58d?tab=screens) |
| Notify (waitlist) | Notify chips in the slot row ("Notify · LUNCH"); confirmation sheet "Notify On", venue, time window "8:30 PM – 10:00 PM", guests, Done | Waitlist is the **empty state of the slot row**, not a separate feature | [Setting a notify](https://mobbin.com/flows/8ff79740-dd30-431a-b55a-5f5cd81f04b9?tab=screens) |
| Complete Order (review) | Venue, date/time, party, then a **Cancellation Policy** block ("no fee if you cancel before Fri Oct 11 1:00pm… after that, $288.00 per guest"), "Need To Know" policies, dress code text, marketing-consent toggle, "ADD PAYMENT METHOD" row, big **Reserve Now** CTA | Policy comes *first*, above the fold; the CTA is sticky | [screen](https://mobbin.com/screens/3dc5d30c-7c9d-49a6-bf38-eff3c26757be), [bottom](https://mobbin.com/screens/b2607662-d0ab-4a81-ac45-90a2ece38d31), [card set](https://mobbin.com/screens/4cf4e039-400d-42fa-8d77-d940ef94bcae) |
| "Are You Sure?" sheet | Venue-specific caveat (fixed tasting menus, allergies 48h ahead) + **Complete Booking** / Go Back | An extra confirm step, used only when the venue has hard rules | [Reserving flow](https://mobbin.com/flows/87e21b63-0454-4143-a52a-ee12e5024af3?tab=screens) |
| Add payment sheet | Card number, MM/YY, CVC, "Scan card", billing country, consent line "you allow [venue] to charge your card for future payments", Set up | The card is held, not charged; the consent wording explains why | [screen](https://mobbin.com/screens/288d0930-de49-490a-99b6-5fe8d1a0a2f4) |
| Post-booking prompts | Step sheets: "Any allergies or restrictions?" with **For You / Your Party** segmented tabs, tag chips, optional note, "None, continue"; dot pager (3 steps) | Optional enrichment comes *after* the commit, so it never blocks the booking | [Reserving flow](https://mobbin.com/flows/87e21b63-0454-4143-a52a-ee12e5024af3?tab=screens) |
| Confirmed sheet | "CONFIRMED ✓" over a hero photo, date/time, guests; rows: What's the occasion? / Any allergies? / Any special requests?; payment method; Invite Your Party; footer **Add to Calendar · Get Directions** | Confirmation doubles as the booking-management page | [screen](https://mobbin.com/screens/dfb9fa4b-9d6c-49c1-8181-3b7a0ec8cfed) |
| Booking detail (lower) | Payment Method "Card ending in 0687", **Invite Your Party** (avatars incl. "Unknown Guest" placeholder + share icon), Cancellation Policy repeated, Change Reservation / Cancel Reservation, map + address | Guest slots shown as avatars, with placeholders for invites not yet accepted | [screen](https://mobbin.com/screens/51d3d6d3-64de-4cff-8915-10de47b2697f) |
| Reservations list + action sheet | Upcoming list (thumb, venue, date, guests, "…" menu); sheet: Add Allergies, Invite Your Party, Change Reservation, Cancel Reservation | Quick actions without opening the booking | [screen](https://mobbin.com/screens/1fc8e93f-980d-4a56-a77b-749ca4d2f771) |
| Cancel confirm sheet | "Are you sure you want to cancel your reservation?", booking summary card, **policy text repeated**, "Cancel This Reservation" | The fee terms are shown again at the moment of cancelling | [Canceling flow](https://mobbin.com/flows/6657f27d-719f-4051-beff-9fa6f3082e6b?tab=screens) |
| Account | Avatar, Edit Profile, Recent Bookings (See all), Notify list ("Multiple times · 2 guests"), settings cog | Notifies live next to bookings | [screen](https://mobbin.com/screens/a98d941d-c0ca-4b2e-8f56-92034aadda4c) |
| Account settings | Email, mobile number + Verify, SMS consent copy, password, Delete Account + privacy link; delete alert says upcoming reservations are *not* cancelled | Honest delete copy | [Deleting an account](https://mobbin.com/flows/90048a51-9789-4a74-8e2c-1f026f03369f?tab=screens) |
| Auth landing | "Discover Restaurants to Love", **phone-first** field (+1 prefix) "Log In or Sign Up", or Continue with Apple / Email | One field handles both log-in and sign-up | [Onboarding](https://mobbin.com/flows/69f31638-5343-4518-b373-0653ecdf8c23?tab=screens) |
| Country code picker | Searchable list with A–Z index, dial codes | | same |
| OTP entry | "Enter the code we sent to (650) 213-7379", 6 boxes split 3-3, inline "Incorrect verification code", "Need help?" | Numeric keypad | same / [Logging in](https://mobbin.com/flows/746ca00d-cb80-465a-b849-2b5610c3252e?tab=screens) |
| Email entry | Domain suggestion chips (@gmail.com, @yahoo.com…) above the keyboard | Nice small touch | same |
| Discover home | "Near Hong Kong" location pill, Recommended for You list, editorial "World of Resy" | Tabs: Discover / Search / Account | same |

## Key flows

**Reserve:** search list or venue → tap a slot chip → Complete Order (policy, need to know,
payment) → optional "Are You Sure?" sheet for venue rules → Reserve Now → Confirmed sheet →
optional prompts (occasion, allergies, requests).

**Change party / time:** tap the sticky "2 · Today · All Day" pill → availability sheet → Search → new slots.

**Notify:** no slot available → tap the Notify chip → pick a window → "Notify On" confirmation → it shows on the Account page.

**Cancel:** Account / Reservations → "…" → Cancel Reservation → sheet repeats the policy → Cancel This Reservation.

**Sign up:** phone number (or Apple / Email) → OTP → profile → Discover.

## What we steal

- **Slot chips with an area label** ("BAR TABLE", "DINING ROOM"). For us: table-tier chips ("VIP Booth · GH₵ min", "Stage-side").
- **Sticky "party · date · time" pill** that opens one sheet to edit all three.
- **Notify as the empty state** of the availability row. This becomes our waitlist for sold-out tables.
- **Policy first on review.** The cancellation and deposit terms are the top section, with concrete date, time and amount. They are shown again on the booking and again in the cancel sheet.
- **Card-hold consent wording** next to the payment field.
- **Venue-rule confirm sheet** ("Are You Sure?") when a venue has hard rules: dress code, age 21+, arrival cut-off.
- **Enrichment after the commit:** occasion and requests come after booking, so they never block it.
- **Invite Your Party avatars** with placeholder slots, plus a share button.
- **Phone-first auth** with a country picker and 6-box OTP. This matches Ghana, where people are mobile-money and phone-first.
- **Confirmation = management page**, with Add to Calendar and Get Directions as a footer.

## What we skip

- Allergy and dietary prompts. They are restaurant-specific; we use "occasion" and "requests" instead.
- Marketing-consent toggle on the review screen. We would keep it in settings, not in the commit moment (our judgement).
- Editorial "Why We Like It" long copy. Nightlife needs vibe tags and photos more than prose (inferred).
- Email/password as a primary path.
