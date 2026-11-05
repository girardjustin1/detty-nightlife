# SeatGeek (iOS): reference notes

Source: Mobbin MCP, viewed 2026-11-05. App page:
https://mobbin.com/apps/seat-geek-ios-b52107f2-768c-4ea9-9e7f-18b5527d5bf5/59d20aa6-ee82-4ec7-bf25-5850a5582f4f/screens

What we look at here: event discovery, event detail, the interactive seat map with listing
selection, ticket checkout, and the ticket wallet.

**Caveat:** the Mobbin capture of SeatGeek is old. It shows March 2022 dates and a COVID venue
banner. I found **no in-app QR/barcode ticket screen and no ticket-transfer screen**. In this
capture, tickets are delivered by "Mobile Transfer" or through AXS, outside SeatGeek. For the
wallet and transfer pattern, see `other-references.md` (Posh, Eventbrite, Live Nation).

These are text notes only. No images are saved in this repo.

## Screen inventory

| Screen | What's on it | Notable components | Link |
|---|---|---|---|
| Home (city) | "Los Angeles, CA · Mar 9 – 25" header + filter icon, featured hero banner, "Browse by category" illustrated tiles, then rows per category (Sports, Concerts, Comedy, Music Festivals) with "View All" | Event cards show a **"from" price badge** ($97+) and a heart on the image; one SF capture has "Not in San Francisco? Change Location" | [home](https://mobbin.com/screens/57e404c6-d821-4a87-9f7b-d593461bbb33), [rows](https://mobbin.com/screens/03bb1a25-c8af-4202-911f-4db41a290351), [SF](https://mobbin.com/screens/c40f059d-23c9-436c-a1ba-622eaef1b5c6) |
| Category / Popular list | Title + date range + city, category chips (Sports, Concerts, Broadway…), full-width image cards with price, name, date · venue | Large photo cards; the price sits on the image | [popular](https://mobbin.com/screens/e27055ce-3110-470e-82f1-e7c5c6481a2d) |
| Event: seat map + listings | Header: event name + date, INFO button. Top half: venue map with coloured **dots per listing** and a price bubble on the selected one. Bottom half: "Sort by Price ▾", quantity selector ("1 🎟"), filter icon, "Fees Included" banner, and listing rows (price pill, "Section 302, Row 15", **deal score** badge such as "8.7 Great Deal") | The map and list are linked: selecting a row highlights its dot. Pinch-zoom shows section labels. A floating "VIP Packages Available" banner and a star FAB appear | [map](https://mobbin.com/screens/78265bd1-cc71-4d25-91f7-0a65aa8c2a69), [theatre map](https://mobbin.com/screens/51c2ac1e-2cf3-4d2b-889f-b0e21fe06a84), [Sports event detail flow](https://mobbin.com/flows/2ac9fab2-42c2-4728-bad0-ac22bbde6173?tab=screens) |
| Filters sheet | Price range slider with a **price-distribution histogram** ("Average price $60"), Sort by, toggles: Show prices with fees, E-Tickets only, Supports Promo Codes, Accessible; "Premium Tickets" section; Done | Fee-inclusive toggle | [Filtering tickets flow](https://mobbin.com/flows/cd8b5beb-8a19-4db8-9516-2e656870c674?tab=screens) |
| Listing detail sheet | View-from-seat photo ("Section 302 · Row 15", expand icon), "$12/ea · Incl. $7 fees", mini venue map with the seat dot, list of facts with icons (Get in with your phone; Mobile Entry tickets; Sold by SeatGeek; date; Swaps not supported; **Buyer Guarantee Protected**), Quantity row, Continue | Trust and delivery facts sit **before** the CTA | [screen](https://mobbin.com/screens/be02075c-2915-455c-9e0e-d6cc947e31cd) |
| GA event (no map) | Hero image of the artist "Kaskade (18+)", date, venue; "General Admission" + Filters; **quantity chips: Any / 1 ticket / 2 tickets / 3 tickets**; "Prices include fees"; price rows "$109 /ea · 1 Ticket Available", BEST PRICE tag; a row expands to the facts list + **Proceed to Checkout** | When there is no seat map, it falls back to a GA list. Very close to a club night | [GA top](https://mobbin.com/screens/6aa8e608-bd80-463b-9cd1-3c26a8d528d3), [expanded](https://mobbin.com/screens/a34bcb66-92f8-48eb-9fa7-204095e099df), [list](https://mobbin.com/screens/7090051f-6c42-4980-994f-1cf6505515d3) |
| Checkout sheet | Event, date, venue; rows: Contact, Payment (card ••••4322), Quantity, Notes, Delivery ("Mobile Transfer… to your contact email"); sticky footer **Total 12.67 USD · View Details ⌃** + **Pay Now** | Single-sheet checkout; each row is tappable to edit | [screen](https://mobbin.com/screens/ed7b4794-a27f-46b5-a536-18f00d2a0d4e) |
| Checkout error | The Payment row turns red, "Invalid – We're having trouble processing your billing address…" | **Inline error on the row**, not a modal | [screen](https://mobbin.com/screens/acf95dd2-edfc-4d35-a0fd-8e19dfcfec0c) |
| Card entry | Card number, MM/YY, CVV, name, country, address | Standard form; Cancel / Done | [screen](https://mobbin.com/screens/c9a57c75-b3ee-47c6-a8cf-e4d18c8a5b70) |
| Add-on checkout (parking) | Same checkout sheet reused for a parking pass | One checkout component handles every product | [screen](https://mobbin.com/screens/6e31a98a-d63a-4ac2-a6cd-9c40667f9c41) |
| Order status | Event hero; status card **"● Confirming Order – waiting for the seller to confirm"**, which later becomes **"● Order confirmed – your ticket will be transferred via AXS"**; Read the FAQ; Order # row | Pending vs confirmed states are shown explicitly | [confirmed](https://mobbin.com/screens/fc1de08b-5999-4a7e-be27-db1cd0c0ad21), [Order detail flow](https://mobbin.com/flows/c32fd580-c0f2-49a0-bcc4-8687638f2683?tab=screens) |
| Order detail (lower) | **"Bring more friends – great deals still available in nearby rows"** (Row 14 · $18/ea…), Directions map, **Get a parking pass** card, Helpful Links (Get Directions, Add to Calendar, Contact Support) | Upsell after purchase: friends and add-ons | same flow |
| Price breakdown | Order ID, date, quantity, section, email; Price: Tickets $5, Fees $7.67, Delivery $0, Tax $0, **Total $12.67**; Terms & Policy | Fully itemised | [screen](https://mobbin.com/screens/f286aa19-23b8-424d-9c78-54b712d5105b) |
| Tickets tab | "Tickets" title + "…" (Add Tickets / Ticket History / Help & Support), info banner, big event image cards | Tab bar: Home, Search, Tickets, Saved, Profile | [Tickets flow](https://mobbin.com/flows/b218e4a9-3d52-406d-9483-14561cdf8e9b?tab=screens) |
| Ticket history | Timeline card "You purchased 1 ticket for 12.67 USD total · Order Confirmed", event thumb, card, market, order number, contact with phone and email icons | Receipt as a timeline | [screen](https://mobbin.com/screens/75fdd3e1-25db-44f8-9093-5d81dcb39e52) |
| Add Tickets | Import PDF tickets (Safari, Mail, computer), NFL barcode, screenshot tickets | Marketplace-specific; not relevant | [screen](https://mobbin.com/screens/e3574f6a-cb2e-4638-94d4-bdf78bb4c894) |

## Key flows

**Buy reserved seats:** Home → event card → map + listings → (filters) → tap a listing → listing detail sheet (quantity) → Continue → checkout sheet → Pay Now → order status (confirming, then confirmed).

**Buy GA:** event → quantity chip → expand the cheapest row → Proceed to Checkout → checkout sheet → Pay Now.

**After purchase:** Tickets tab → event card → order detail (status, "bring more friends", directions, parking, links).

## What we steal

- **Map on top, list underneath, kept in sync.** For our floor plan: tables as tappable shapes on top; a sorted list of tables below (name, capacity, minimum spend, availability), with a selected state shared between the two.
- **Price bubble on the selected item** on the map.
- **Quantity chips before the list** (Any / 1 / 2 / 3…). Use them for ticket count, and for party size on tables ("6–8 guests") to filter which tables suit the group.
- **"Fees included" banner and the "$12/ea incl. $7 fees" line.** Be honest about service charge and VAT/levies in GH₵.
- **Facts list with icons before the CTA** (how you get in, who sells it, refund guarantee, age 18+/21+).
- **Single-sheet checkout with editable rows** and a sticky "Total · View Details" expander plus Pay Now.
- **Inline payment errors on the row.** This matters for mobile-money prompts that fail or time out.
- **Explicit pending vs confirmed order state.** Mobile money is asynchronous (the customer approves a USSD/push prompt), so we need a "Waiting for your MoMo approval" state (inferred need).
- **Post-purchase "Bring more friends" upsell** and add-on cards. Use them for extra tickets, bottle top-ups, and a ride.
- **Itemised price breakdown** on the order.

## What we skip

- Resale marketplace concepts: deal score, seller confirmation, AXS transfer, importing PDF tickets.
- Deep category taxonomy (sports and so on). We only need a few nightlife genres.
- The full billing-address card form. Keep card entry minimal; card is a secondary method in Ghana (inferred).
