# Accra nightlife booking (working title)

> **Name:** the project started as “Detty Nightlife”. That name and its black + gold look turned out to be too close
> to an existing events app, so the brand is being reworked (see below). The repository and its URLs keep the old
> name until a new one is chosen.

Mobile-first nightlife booking for Accra, Ghana: event tickets, VIP tables, bottle pre-orders toward a
table minimum, guests, and deposits paid by mobile money. There is also a companion app for promoters
and venues.

Phase 1 is **design in Storybook**: every screen and state is a story, and a clickable prototype
compares four ways to book. Nothing talks to a server yet, and every venue, artist, person and price
is **fictional sample data**.

## Try it

| | Link |
|---|---|
| **Clickable prototype** (menu of 4 experiences) | https://girardjustin1.github.io/detty-nightlife/ |
| ↳ WhatsApp · Menu bot (buttons and lists) | https://girardjustin1.github.io/detty-nightlife/#/wa-menu/chat |
| ↳ WhatsApp · Flows (in-chat forms) | https://girardjustin1.github.io/detty-nightlife/#/wa-flows/chat |
| ↳ WhatsApp · AI concierge (just type it) | https://girardjustin1.github.io/detty-nightlife/#/wa-ai/chat |
| ↳ Consumer app, start to finish | https://girardjustin1.github.io/detty-nightlife/#/app/welcome |
| **Storybook** (all screens, brands, emails, WhatsApp, promoter app) | https://girardjustin1.github.io/detty-nightlife/storybook/ |
| ↳ Six brand directions | https://girardjustin1.github.io/detty-nightlife/storybook/?path=/story/brand-new-directions--six-new-directions |
| ↳ Why we moved, and the recommendation | https://girardjustin1.github.io/detty-nightlife/storybook/?path=/story/brand-new-directions--why-we-moved-and-where-to |
| ↳ Competitor research (Accra) | https://girardjustin1.github.io/detty-nightlife/storybook/?path=/story/research-accra-market--competitor-landscape |

In the prototype every input is prefilled: tap whatever glows. On a laptop, a side panel shows taps,
time, a brand switch and "Jump to". On a phone, use the **☰ Menu** pill at the top.

## What's inside

- **Six brand directions** (10 Nov rebrand round): Jama, Fiada, Akonnwa, Kpanlogo, Harmattan and Anadwo. Each
  has its own idea, name, colours, type, voice, logo and key art, shown on the same screens. The **Brand** menu in
  the Storybook toolbar switches any screen between them; Jama is the default for now. See **Brand / New
  Directions**, including the reasoning and a recommendation on **Why we moved**. The earlier directions are kept
  under **Brand / Archive**.
- **Competitor research:** 14 products and habits people in Accra use today to find a night, buy a ticket or book a
  table, with sources, plus the screening of 30 candidate names. See **Research / Accra market**.
- **Consumer app:**
  - Onboarding (phone number with a WhatsApp code)
  - Discover, with an events view and a clubs view
  - Event and venue pages
  - Table booking: map → table → bottles → guests → review → pay
  - Tickets and payment: MTN MoMo, Telecel, AT Money, card, and Lightning as a beta
  - My bookings and the guest invite flow
  - Profile, plus offline and low-data states
- **Venue maps:**
  - The original floor plans, with art generated in Higgsfield
  - SeatGeek-style maps with price pins, 🔥 "going fast" and price-rise tooltips
- **Promoter app:** tonight dashboard, live floor, reservations, door check-in (works offline), events,
  payouts, WhatsApp broadcasts.
- **Emails and WhatsApp:** transactional emails and WhatsApp template mockups.
- **Research and plans:**
  - [`docs/research/`](docs/research/): Mobbin research on Resy, SeatGeek and OpenTable
  - [`docs/integrations/`](docs/integrations/): WhatsApp, payments, Bitcoin, email, delivery
  - [`HUMAN_TODO.md`](HUMAN_TODO.md): open decisions

## Run it locally

Needs Node 24+ and pnpm 9.

```bash
pnpm install
pnpm storybook        # Storybook → http://localhost:6026
pnpm dev              # Prototype → http://localhost:5330 (also on your Wi-Fi, for phones)
```

Checks (the same ones CI runs):

```bash
pnpm typecheck        # TypeScript
pnpm lint             # oxlint
pnpm test             # vitest: pricing, sample-data integrity, venue maps, WhatsApp bot scripts
pnpm build:pages      # builds dist/ (prototype) + dist/storybook/
```

## Deployment (GitHub Pages)

Every push to `main` runs [`.github/workflows/pages.yml`](.github/workflows/pages.yml):

1. `pnpm build:pages` builds the prototype with `VITE_BASE=/detty-nightlife/` into `dist/`.
2. The same command builds Storybook into `dist/storybook/` and adds `.nojekyll`.
3. The workflow uploads `dist/` and deploys it to Pages. In the repo's Pages settings, the source is
   **GitHub Actions**.

The prototype uses hash routes (`#/app/...`), so deep links work on Pages without a server.
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs typecheck, lint, tests and the Pages build
on every pull request.

To preview the Pages build locally:

```bash
pnpm build:pages
mkdir -p /tmp/pages && ln -sfn "$PWD/dist" /tmp/pages/detty-nightlife
python3 -m http.server 5399 -d /tmp/pages   # → http://localhost:5399/detty-nightlife/
```

## Stack

Vite 8, React 19, TypeScript 7, Tailwind v4, Storybook 10 and lucide icons. The project deliberately
uses no UI kit, to keep it light on metered mobile data. Brand tokens are CSS variables in
`src/styles/index.css`. See [`CLAUDE.md`](CLAUDE.md) for code conventions.
