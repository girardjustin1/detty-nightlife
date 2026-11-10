import type { ReactNode } from 'react'
import { brands, DEFAULT_BRAND, newBrands } from '@/brands/brands'

/**
 * Visual blocks for the Start Here page. Screens are real screenshots of the
 * stories in this Storybook, taken in the default direction; the atmosphere
 * photos and the floor-plan art were made with Higgsfield. The screenshots are
 * static: after a look change, retake them with scripts/start-here-shots.mjs.
 */

const base = import.meta.env.BASE_URL
const img = (name: string) => `${base}docs/${name}.webp`
const story = (id: string) => `./?path=/story/${id}`
const LIVE = 'https://girardjustin1.github.io/detty-nightlife/'

function Phone({ name, alt, className = '' }: { name: string; alt: string; className?: string }) {
  return (
    <div className={`shrink-0 overflow-hidden rounded-[28px] border-[5px] border-[#1c1c22] bg-black shadow-[0_18px_40px_rgb(0_0_0/0.45)] ${className}`}>
      <img src={img(name)} alt={alt} loading="lazy" className="block h-auto w-full" />
    </div>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-dim">{children}</span>
}

function StoryLink({ id, children }: { id: string; children: ReactNode }) {
  return (
    <a href={story(id)} target="_top" className="font-semibold text-accent underline-offset-2 hover:underline">
      {children}
    </a>
  )
}

/** Dark, on-brand panel. Every visual block sits in one so the page reads like the app. */
function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div data-brand={DEFAULT_BRAND} className={`sb-unstyled my-6 overflow-hidden rounded-[20px] ${className}`}>
      {children}
    </div>
  )
}

export function Hero() {
  const brand = brands[DEFAULT_BRAND]
  return (
    <Panel className="relative">
      <img src={img('hero')} alt="" className="absolute inset-0 h-full w-full -scale-x-100 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/10" />
      <div className="relative grid grid-cols-[1fr_auto] items-center gap-6 px-9 py-10">
        <div className="max-w-[360px]">
          <img src={brand.logo.lockup} alt={brand.name} className="h-8 w-auto" />
          <h1 className="display mt-5 text-[34px] leading-[1.05] text-text">Accra’s night out, booked in a minute.</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-dim">
            Tickets, VIP tables, bottles toward the table minimum, your squad and the deposit. In an app or right inside WhatsApp, built for slow
            networks and mobile money.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Pill>4 clickable prototypes</Pill>
            <Pill>400+ screen stories</Pill>
            <Pill>6 brand directions</Pill>
            <Pill>Consumer + promoter apps</Pill>
            <Pill>Sample data only</Pill>
          </div>
        </div>
        <div className="relative h-[400px] w-[420px]">
          <Phone name="discover" alt="Discover" className="absolute top-12 left-0 w-[150px] -rotate-[8deg]" />
          <Phone name="confirmed" alt="Booking confirmed" className="absolute top-12 right-2 w-[150px] rotate-[8deg]" />
          <Phone name="map" alt="Pick a table on the map" className="absolute top-0 left-1/2 z-10 w-[170px] -translate-x-1/2" />
        </div>
      </div>
      <div className="relative border-t border-line/60 bg-bg/80 px-9 py-2.5 text-[11px] text-faint">
        Real screens from this Storybook, shown in {brand.name}, one of six brand directions being compared. Photos and floor-plan art made with Higgsfield.
      </div>
    </Panel>
  )
}

const prototypes = [
  {
    shot: 'proto-wa-menu',
    title: 'WhatsApp · Menu bot',
    what: 'Buttons and lists. The bot asks, you tap.',
    point: 'Cheapest to build and works on every phone. Tests whether tapping through a chat feels fast enough.',
    href: `${LIVE}#/wa-menu/chat`,
  },
  {
    shot: 'proto-wa-flows',
    title: 'WhatsApp · Flows',
    what: 'Native forms that open inside the chat.',
    point: 'Feels like an app without installing one. Tests whether forms in a chat beat back-and-forth messages.',
    href: `${LIVE}#/wa-flows/chat`,
  },
  {
    shot: 'proto-wa-ai',
    title: 'WhatsApp · AI concierge',
    what: 'Just type it: “table for 6 Friday at The Vault”.',
    point: 'The most natural to use and the hardest to get right. Tests how much a booker trusts a bot with money.',
    href: `${LIVE}#/wa-ai/chat`,
  },
  {
    shot: 'welcome',
    title: 'Consumer app',
    what: 'The full app, from welcome screen to QR at the door.',
    point: 'The richest version: maps, bottles, guests and wallet. Tests what an app adds that a chat can’t.',
    href: `${LIVE}#/app/welcome`,
  },
]

export function Prototypes() {
  return (
    <Panel className="bg-bg p-6">
      <div className="grid grid-cols-4 gap-4">
        {prototypes.map((p) => (
          <a key={p.title} href={p.href} target="_blank" rel="noreferrer" className="group flex flex-col rounded-card border border-line bg-surface p-3 transition hover:border-accent">
            <Phone name={p.shot} alt={p.title} className="mx-auto w-[150px] transition group-hover:-translate-y-1" />
            <div className="display mt-3 text-[13px] text-text">{p.title}</div>
            <p className="mt-1 text-[12px] leading-snug text-text">{p.what}</p>
            <p className="mt-1.5 text-[11.5px] leading-snug text-dim">{p.point}</p>
            <span className="mt-auto pt-2 text-[12px] font-semibold text-accent">Open ↗</span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-center text-[12px] text-dim">
        All four book the <b className="text-text">same night</b> (The Vault, Afrobeats Til Dawn, booth B3 for 6) at the same prices, so you’re comparing
        the experience, not the deal.{' '}
        <a href={LIVE} target="_blank" rel="noreferrer" className="font-semibold text-accent">
          Open the menu of all four ↗
        </a>
      </p>
    </Panel>
  )
}

const journey = [
  { shot: 'welcome', label: 'Welcome', note: 'One way in: your phone number, verified by a WhatsApp code.' },
  { shot: 'discover', label: 'Discover', note: 'Tonight, this weekend and the December run, by event or by club.' },
  { shot: 'event', label: 'Event', note: 'Lineup, music, dress code and entry, then tickets or a table.' },
  { shot: 'map', label: 'Pick a table', note: 'A map with prices on every table. 🔥 marks the ones going fast.' },
  { shot: 'bottles', label: 'Bottles', note: 'Pre-order until the minimum-spend meter fills, or decide at the venue.' },
  { shot: 'guests', label: 'Your squad', note: 'Add guests from your contacts. They get a WhatsApp invite.' },
  { shot: 'review', label: 'Review', note: 'Policy first: the exact refund in cedis, by the exact time.' },
  { shot: 'momo', label: 'Pay', note: 'A mobile money prompt on your phone. Card and Lightning (beta) too.' },
  { shot: 'confirmed', label: 'Confirmed', note: 'A QR that works offline, plus one tap to invite the squad.' },
  { shot: 'invite', label: 'Guest view', note: 'What a friend sees from the WhatsApp link, with their share to pay.' },
]

export function Journey() {
  return (
    <Panel className="bg-bg py-6">
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-6 pb-2">
        {journey.map((s, i) => (
          <div key={s.shot} className="w-[168px] shrink-0">
            <Phone name={s.shot} alt={s.label} />
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-accent-2">{String(i + 1).padStart(2, '0')}</span>
              <span className="display text-[12px] text-text">{s.label}</span>
            </div>
            <p className="mt-1 text-[11.5px] leading-snug text-dim">{s.note}</p>
          </div>
        ))}
      </div>
      <p className="px-6 pt-2 text-[11px] text-faint">Scroll sideways → · Every step is a story under Consumer / 01–09, with its empty, loading and error states.</p>
    </Panel>
  )
}

type Feature = {
  banner: string
  kicker: string
  title: string
  what: string
  point: string
  shots: { name: string; alt: string }[]
  links: { id: string; label: string }[]
}

const features: Feature[] = [
  {
    banner: 'booth',
    kicker: 'Consumer app',
    title: 'Book the table, not just the door',
    what: 'Every screen for finding a night and committing to it: events and clubs, venue pages with reviews, table booking with bottles and guests, payment, and a wallet of bookings to change, cancel or transfer.',
    point:
      'Borrows Resy’s commit model: you see the rules and the exact refund before paying a deposit. The aim is that promoters can trust a booking and guests can trust the price.',
    shots: [
      { name: 'venue', alt: 'Venue detail' },
      { name: 'review', alt: 'Review and commit' },
      { name: 'wallet', alt: 'Ticket wallet' },
    ],
    links: [
      { id: 'consumer-04-venue-venue-detail--the-vault', label: 'Venue' },
      { id: 'consumer-06-book-a-table-review-commit--standard', label: 'Review & commit' },
      { id: 'consumer-08-my-bookings-ticket-wallet--first-ticket', label: 'Wallet' },
    ],
  },
  {
    banner: 'floorplan',
    kicker: 'Venue maps',
    title: 'Choose by where you’ll stand',
    what: 'SeatGeek-style maps for clubs, rooftops, beach clubs and arenas. Each table or section shows its price. Tap one for a listing sheet with the minimum spend, the deposit and what’s included.',
    point:
      'People pick a spot, then a price. 🔥 going-fast badges and price-rise warnings appear only when they’re true, so the urgency is honest. The art is built in code, so a map is a few kilobytes on a slow network.',
    shots: [
      { name: 'map', alt: 'Club map' },
      { name: 'listing', alt: 'Listing with a price-rise warning' },
      { name: 'arena', alt: 'Arena map' },
    ],
    links: [
      { id: 'components-venue-map-seatgeek-style--all-tooltips', label: 'Map component' },
      { id: 'consumer-06-book-a-table-map-picker-seatgeek-style--b-3-selected-going-fast', label: 'Table picker' },
      { id: 'consumer-05-book-tickets-map-picker-seatgeek-style--arena-floor-selected', label: 'Arena tickets' },
    ],
  },
  {
    banner: 'whatsapp-bar',
    kicker: 'WhatsApp',
    title: 'Meet bookers where they already are',
    what: 'The messages the business sends (login codes, confirmations, reminders, guest invites, split payments, refunds), the full template catalogue, and the three booking bots in the prototype.',
    point:
      'In Accra, bookings already happen on WhatsApp. These screens test how much of the booking can live there, and what has to hand off to the app or a payment page.',
    shots: [
      { name: 'wa-invite', alt: 'Guest invite in WhatsApp' },
      { name: 'wa-flow', alt: 'WhatsApp Flow form' },
      { name: 'wa-confirmed', alt: 'Booking confirmed in WhatsApp' },
    ],
    links: [
      { id: 'whatsapp-template-catalogue--all-templates', label: 'Template catalogue' },
      { id: 'whatsapp-guest-invite--guest-view', label: 'Guest invite' },
      { id: 'whatsapp-flow-rsvp-to-paystack--step-2-form-sheet', label: 'Flow form' },
    ],
  },
  {
    banner: 'door-scan',
    kicker: 'Promoter app',
    title: 'Run the night from one phone',
    what: 'For venue managers, promoters and door staff: tonight’s numbers, a live floor of who has arrived, reservations with balances to collect, approvals, broadcasts, payouts, and a door scanner that works offline.',
    point:
      'Bookings only mean something if the venue honours them. This is the side that makes the deposit, the minimum spend and the guest list real at the door.',
    shots: [
      { name: 'pro-tonight', alt: 'Tonight dashboard' },
      { name: 'pro-floor', alt: 'Live floor' },
      { name: 'pro-door', alt: 'Door check-in' },
    ],
    links: [
      { id: 'promoter-tonight--default', label: 'Tonight' },
      { id: 'promoter-live-floor--default', label: 'Live floor' },
      { id: 'promoter-door--valid-table', label: 'Door' },
    ],
  },
]

export function Features() {
  return (
    <>
      {features.map((f) => (
        <Panel key={f.kicker} className="bg-bg">
          <div className="relative h-[170px]">
            <img src={img(f.banner)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <div className="text-[11px] font-bold tracking-widest text-accent-2 uppercase">{f.kicker}</div>
              <div className="display mt-1 text-[24px] text-text">{f.title}</div>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-6 px-6 pt-3 pb-6">
            <div>
              <div className="text-[11px] font-bold tracking-wider text-faint uppercase">What it is</div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-text">{f.what}</p>
              <div className="mt-4 text-[11px] font-bold tracking-wider text-faint uppercase">The point</div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-dim">{f.point}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px]">
                {f.links.map((l) => (
                  <StoryLink key={l.id} id={l.id}>
                    {l.label} →
                  </StoryLink>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              {f.shots.map((s) => (
                <Phone key={s.name} name={s.name} alt={s.alt} className="w-[128px]" />
              ))}
            </div>
          </div>
        </Panel>
      ))}
    </>
  )
}


export function EmailsAndBrand() {
  return (
    <div className="sb-unstyled my-6 grid grid-cols-[1fr_1.35fr] gap-4">
      <div data-brand={DEFAULT_BRAND} className="flex flex-col overflow-hidden rounded-[20px] bg-bg p-5">
        <div className="text-[11px] font-bold tracking-widest text-accent-2 uppercase">Emails</div>
        <div className="display mt-1 text-[20px] text-text">The receipt is the contract</div>
        <p className="mt-2 text-[13px] leading-relaxed text-dim">
          Confirmations, deposit and balance receipts, changes, cancellations and guest invites. They put the refund policy in writing, in the words
          the app used. Built as React components, ready to port to React Email.
        </p>
        <div className="mt-4 h-[230px] overflow-hidden rounded-xl border border-line">
          <img src={img('email')} alt="Booking confirmed email" loading="lazy" className="block w-full" />
        </div>
        <div className="mt-3 text-[12.5px]">
          <StoryLink id="emails-booking-confirmed--paid-with-mo-mo">Booking confirmed email →</StoryLink>
        </div>
      </div>
      <div data-brand={DEFAULT_BRAND} className="flex flex-col overflow-hidden rounded-[20px] bg-bg p-5">
        <div className="text-[11px] font-bold tracking-widest text-accent-2 uppercase">Brand</div>
        <div className="display mt-1 text-[20px] text-text">Six new directions, one to choose</div>
        <p className="mt-2 text-[13px] leading-relaxed text-dim">
          The first look and name turned out too close to an existing events app, so the brand started again: six directions, each with its own idea,
          name, colours, type, voice and Higgsfield artwork. Switch any screen with <b className="text-text">Toolbar → Brand</b>.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {newBrands.map((b) => (
            <div key={b.id} data-brand={b.id} className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5">
              <img src={b.logo.appIcon} alt="" className="size-9 shrink-0" />
              <div className="min-w-0">
                <div className="display truncate text-[13px] text-text">{b.name}</div>
                <div className="truncate text-[10.5px] text-dim">{b.tagline}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 text-[11px] font-bold tracking-wider text-faint uppercase">Still to decide</div>
        <ul className="mt-2 space-y-1.5 text-[12.5px] leading-snug text-dim">
          <li>
            <b className="text-text">Which direction.</b> The recommendation and the reasoning are on Brand / New Directions / Why we moved.
          </li>
          <li>
            <b className="text-text">The name.</b> All six were screened for obvious clashes only. None is legally cleared.
          </li>
        </ul>
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-[12.5px]">
          <StoryLink id="brand-new-directions--six-new-directions">Six directions →</StoryLink>
          <StoryLink id="brand-new-directions--why-we-moved-and-where-to">Why we moved →</StoryLink>
          <StoryLink id="research-accra-market--competitor-landscape">Competitors →</StoryLink>
        </div>
      </div>
    </div>
  )
}

const storyMap: [string, string][] = [
  ['Brand / New Directions', 'Six new brand directions on the real screens, why we moved, and the recommendation'],
  ['Brand / Archive', 'The earlier directions and how they evolved, kept for reference'],
  ['Research / Accra market', 'Competitor landscape for Accra, and the screening of 30 candidate names'],
  ['Components', 'Floor plan, SeatGeek-style venue map, cards, meters'],
  ['Consumer / 01 Onboarding', 'Welcome, phone number with a WhatsApp code, profile, preferences'],
  ['Consumer / 02 Discover', 'Events and Clubs & lounges views, search, filters, map'],
  ['Consumer / 03 Event', 'Lineup, music and vibe, entry, ticket and table buttons'],
  ['Consumer / 04 Venue', 'Tables, events, bottles, reviews, details'],
  ['Consumer / 05 Book Tickets', 'Tiers, checkout, arena and beach maps'],
  ['Consumer / 06 Book a Table', 'Party and time → map → bottles → guests → review and commit'],
  ['Consumer / 07 Pay', 'MoMo, card, Lightning (beta), pending and failed states, confirmation'],
  ['Consumer / 08 My Bookings', 'Wallet, booking detail, modify, cancel, transfer, receipts'],
  ['Consumer / 09 Guests', 'Invite page from WhatsApp, guest pass, paying your share'],
  ['Consumer / 10 Profile', 'Profile, payment methods, account, help'],
  ['Promoter', 'Tonight, live floor, reservations, door check-in, events, payouts'],
  ['Prototype', 'The clickable four-way comparison'],
  ['Emails', 'Transactional emails'],
  ['WhatsApp', 'Message mockups and the template catalogue'],
  ['Planning', 'Product plan, tech, integrations, open questions'],
]

export function StoryMap() {
  return (
    <div className="sb-unstyled my-4 overflow-hidden rounded-xl border border-[#e3e3e8]">
      {storyMap.map(([section, what], i) => (
        <div key={section} className={`grid grid-cols-[230px_1fr] gap-4 px-4 py-2 text-[13.5px] ${i % 2 ? 'bg-[#f7f7f9]' : 'bg-white'}`}>
          <b className="text-[#16161a]">{section}</b>
          <span className="text-[#4a4a55]">{what}</span>
        </div>
      ))}
    </div>
  )
}
