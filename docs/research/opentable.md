# OpenTable (iOS): reference notes

Source: Mobbin MCP, viewed 2026-11-05. App page:
https://mobbin.com/apps/open-table-ios-07683d82-6997-4898-a6c8-3311d92f14ee/9218db36-4a49-4f85-87d2-19b9e8cba9ec/screens

What we look at here: how a venue detail page is structured, plus OpenTable's "Experiences"
(ticketed, prepaid events with add-ons), which map closely to a club night with bottle packages.

**Not observed:** a "tags / vibe" chip section (for example "Good for groups", "Lively") did
not appear in any screen returned. I found no explicit "Hours" block either. Treat both as gaps
in what I saw, not proof that OpenTable lacks them.

These are text notes only. No images are saved in this repo.

## Screen inventory

| Screen | What's on it | Notable components | Link |
|---|---|---|---|
| Home | "Good evening, John", top tabs **Bookings / Experiences / Delivery & Takeaway**, filter pills "👤 2 · 7:00 PM Tonight" and "📍 Nearby", rows "Available for dinner now", "Most romantic spots for a date", each with View all | Cards have slot buttons under them, plus "Promoted" and bookmark | [Home flow](https://mobbin.com/flows/fe8e9a8b-86c9-4ef6-a580-ce032ae764aa?tab=screens), [screen](https://mobbin.com/screens/f3076469-c44f-4775-9205-5ada281285ed) |
| Experiences tab | Seasonal row ("Valentine's day"), experience cards: title, venue, **US$50.00**, area, "Multiple dates available", blurb | Events sold *as products* | same flow |
| Featured experiences list | Rows: title, venue · price, area, with a **date badge** (Feb / 11) on the right | Compact event list with date tiles | [Booking an experience flow](https://mobbin.com/flows/a3d61cfa-8a9c-42b3-b38e-1c5433744cfa?tab=screens) |
| Results list / map | Rows with thumb, stars + count, cuisine, area, price, distance, "Seating: High top, Outdoor, Standard", slot buttons, Takeaway/Delivery checks; floating **Map** button; map with numbered pins + bottom card | Seating types listed on the row | [View all restaurants flow](https://mobbin.com/flows/6bd65ced-c9b5-4bcf-8118-7a1c9948a7e2?tab=screens) |
| Venue detail (top) | Hero photo "See all 50 photos", Back / bookmark / share, name, stars + "60 reviews", "$30 and under", cuisine, address; **sticky section tabs** Bookings / Experiences / Delivery & Takeaway / Menu / Reviews / Details; party/time pill; slot row; "Find future availability"; Walk-in | The tabs are **scroll anchors**, not separate pages | [screen](https://mobbin.com/screens/f0d5847f-7fcc-48e3-9c3c-d3c8e153f0c5), [Restaurant detail flow](https://mobbin.com/flows/029ba1d6-9565-4d86-8e9c-fa640a028249?tab=screens) |
| Venue detail (busy) | **"Booked 38 times today"**, slots with a table icon, "Additional seating options", **"Notes for tonight"** (grace period / late policy) | Social proof + nightly note | [screen](https://mobbin.com/screens/c3625d03-b440-465c-890a-5d0bbe91e275) |
| Detail: Delivery / Menu | Restaurant options, delivery partners, "See full menu" button | Menu is an outbound link | Restaurant detail flow |
| Detail: Reviews | Overall 4.4 + 5-bar distribution, one review preview, "See all reviews" | | Restaurant detail flow |
| Reviews page | Overall + distribution; **sub-ratings Food 4.4 / Service 4.5 / Ambience 4.5 / Noise "Moderate"**; "Most recent reviews (60)" sort sheet (Most recent / Highest / Lowest); review cards with "Dined 3 days ago", helpful thumbs | Sub-ratings fit nightlife ("Music", "Crowd", "Service") (inferred) | [screen](https://mobbin.com/screens/f0704b1c-825d-4aff-bc4b-22a01d8be4be), [sort](https://mobbin.com/screens/f6ce0b7b-87ac-4ac1-8b3a-3dc6b9ca3de4) |
| Detail: Details | Address + map, "Additional information" list with icons: Safety precautions, **Payment options**, Owned/operated by, **Parking**, **Dress code ("Casual Dress")**, Accessibility, Description | **Icon + label + value** rows, easy to scan | Restaurant detail flow |
| Photo viewer | Full-screen, "1 of 1", attribution "OpenTable Diner", upvote | User photos | [screen](https://mobbin.com/screens/fd1e87cd-4f8c-4b86-9fb7-74a45411cab6) |
| Experience detail | Hero "See all 4 photos", title, venue, address, **US$50.00 per person**, **Party size stepper (– 1 person +)**, Date dropdown, "Select a time" slots, "Additional seating options", About this experience, **Hosted by** venue card | Party-size stepper inline on the page | [Experience detail flow](https://mobbin.com/flows/49fe8b35-dd75-4317-9511-9e1e28c9af17?tab=screens) |
| **Add-ons** | Summary (venue, 1 guest, date/time, experience, Outdoor seating); "Experience Add-ons": cards "Toast for Two · US$20.00" with description and **– 0 + stepper**, "Roses by candle light · US$15.00"; sticky **Continue** | **The closest pattern to "pre-select bottles"** | Booking an experience flow |
| Booking details form | "What's the occasion?" chips (Birthday, Anniversary, Date, Special Occasion, Business Meal), phone with country flag, "Booking text updates" toggle, restaurant emails toggle, legal line, **Book** | Occasion chips | Booking an experience flow |
| Booking confirmed | "✓ Booking Confirmed", 👤1 · date/time, **Manage booking** button, cards **Browse menu / Get directions**, photo grid, add-to-calendar + share icons in the header | | [screen](https://mobbin.com/screens/8a04f5e7-af30-4680-aa91-5875126d11a6) |
| Booking detail (lower) | Address map, restaurant full profile link, phone, **Dining points "100 points to be earned"**, Cancel booking button, "Plan your next meal" recommendations | Loyalty shown on the booking | [screen](https://mobbin.com/screens/0a72a01b-d3b6-4c28-919b-6b04d7690ff4), [screen](https://mobbin.com/screens/ef3a2375-196b-402c-9b69-6e114f9885df) |
| Manage action sheet | Modify booking / Cancel booking / Close | | [screen](https://mobbin.com/screens/e78d7b5f-696c-4c25-86e6-a7af99f71c06) |
| Modify booking | Blurred hero + avatar, summary (1 person · Wed 9 Mar · 3:00 PM), "Update your booking" pill, slots (current one highlighted), **Seating option: Standard**, notes field, **Change** CTA (disabled until something changes) | Modify in place, without rebooking | [screen](https://mobbin.com/screens/ee1060be-8b7d-4b03-9240-0b0ede4a3f7e), [enabled](https://mobbin.com/screens/1931fa36-2323-4d76-8ff7-5bd063d3b66b) |
| Cancel confirm | iOS alert "Cancel Booking – Are you sure?" No / Yes | Weaker than Resy: no policy restated | [screen](https://mobbin.com/screens/16f8a9bf-eec4-4fa4-886c-3f19400bab33) |

## How the detail content is structured

1. Hero media + "See all N photos" → 2. identity (name, rating, price tier, category, address) →
3. **booking module** (party/time pill, slots, future availability) → 4. sticky tab anchors for
Experiences, Menu, Reviews, Details → 5. Details = icon rows (payment, parking, dress code,
accessibility, description) → 6. recommendations.

Everything needed to *decide* sits above the booking module. Everything needed to *show up*
(dress code, parking, payment) is in Details.

## Key flows

**Book an experience:** Experiences tab → experience card → detail (party stepper, date, time) → Add-ons (steppers) → Continue → details form (occasion, phone, updates) → Book → Booking Confirmed.

**Modify:** Bookings → booking → Manage booking → Modify → pick a new slot or seating → Change.

**Cancel:** Manage booking → Cancel booking → alert → Yes.

## What we steal

- **Sticky anchor tabs** on venue detail: Tables · Events · Menu/Bottles · Reviews · Details.
- **Details as icon rows:** dress code, age policy, parking, payment methods accepted (MoMo / card / ₿ Lightning), hours, music genres, accessibility.
- **"Notes for tonight"** for door time cut-off, grace period, and guest-list close time.
- **"Booked N times today"** social proof on hot nights.
- **Experiences = ticketed events** with "from GH₵ per person" and date badges in lists.
- **Add-ons with steppers.** This becomes our bottle menu: cards with name, size, price, and – n + stepper, plus a sticky Continue. We add a minimum-spend progress bar on top (OpenTable has none).
- **Party-size stepper inline** on the detail page.
- **Occasion chips** (Birthday, Detty December, Anniversary, Corporate).
- **Modify in place** with a Change CTA that stays disabled until something changes.
- **Sub-ratings** on reviews (we would use Music / Crowd / Service / Value; inferred).

## What we skip

- Delivery & Takeaway.
- Loyalty "dining points". Maybe later.
- The bare iOS alert for cancel. We use Resy's sheet that restates the policy instead.
- Light, restaurant-style visual tone. Resy's dark tone fits nightlife better.
