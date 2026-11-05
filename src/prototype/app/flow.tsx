// The consumer app, wired start to finish from the real Storybook screens.
// Every step renders one screen with its prefilled story state; taps are routed
// by the screen's own button labels (see ../hotspots.tsx).
import { Fragment, type ReactNode } from 'react'
import { events, me } from '@/data/fixtures'
import { canonicalTable } from '@/lib/pricing'
import { Welcome } from '@/screens/consumer/onboarding/Welcome'
import { PhoneEntry } from '@/screens/consumer/onboarding/PhoneEntry'
import { CodeChannel } from '@/screens/consumer/onboarding/CodeChannel'
import { OtpEntry } from '@/screens/consumer/onboarding/OtpEntry'
import { ProfileBasics } from '@/screens/consumer/onboarding/ProfileBasics'
import { Preferences } from '@/screens/consumer/onboarding/Preferences'
import { NotificationOptIn } from '@/screens/consumer/onboarding/NotificationOptIn'
import { Discover } from '@/screens/consumer/discover/Discover'
import { Search } from '@/screens/consumer/discover/Search'
import { EventDetail } from '@/screens/consumer/event/EventDetail'
import { VenueDetail } from '@/screens/consumer/venue/VenueDetail'
import { PartyTime } from '@/screens/consumer/book-table/PartyTime'
import { PickTable } from '@/screens/consumer/book-table/PickTable'
import { Bottles } from '@/screens/consumer/book-table/Bottles'
import { Guests } from '@/screens/consumer/book-table/Guests'
import { OccasionRequests } from '@/screens/consumer/book-table/Occasion'
import { Review } from '@/screens/consumer/book-table/Review'
import { guestSets } from '@/screens/consumer/book-table/data'
import { TicketTiers } from '@/screens/consumer/book-tickets/TicketTiers'
import { Checkout } from '@/screens/consumer/book-tickets/Checkout'
import { MethodPicker, MomoConfirm } from '@/screens/consumer/pay/MethodPicker'
import { MomoPending } from '@/screens/consumer/pay/MomoPending'
import { ConfirmedTable, ConfirmedTickets } from '@/screens/consumer/pay/Confirmed'
import { tablePay } from '@/screens/consumer/pay/payData'
import { BookingsTab } from '@/screens/consumer/bookings/BookingsTab'
import { TableBookingDetail } from '@/screens/consumer/bookings/TableBookingDetail'
import { CancelledBooking, CancelSheet } from '@/screens/consumer/bookings/CancelBooking'
import { DayOfMode } from '@/screens/consumer/bookings/DayOfMode'
import { TicketWallet } from '@/screens/consumer/bookings/TicketWallet'
import { HostGuests } from '@/screens/consumer/guests/HostGuests'
import { ProfileHome } from '@/screens/consumer/profile/ProfileHome'
import { MapPicker } from '@/components/app/venue-map/MapPicker'
import { vaultMap } from '@/data/venueMaps'
import { eventById as evById, venueById as vById } from '@/data/fixtures'
import { dayShort, time } from '@/lib/format'
import { AutoAdvance, BACK, Finish, Mark, Tappable, Proto, lastButton, toastTo, type AppRule } from './helpers'

const mapEv = evById('afrobeats-til-dawn')
const mapEvent = { title: mapEv.title, when: `${dayShort(mapEv.startsAt)} · ${time(mapEv.startsAt)}`, venue: vById(mapEv.venueId).name, photo: mapEv.photo }

export type AppStep = { id: string; title: string; render: () => ReactNode }

/** How long the MoMo prompt / approval screens wait before moving on by themselves. */
const MOMO_AUTO_MS = 2500

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** Any event card (hero, tile, row): its label carries the event title. */
const anyEventTitle = new RegExp(events.map((e) => esc(e.title)).join('|'))

/** The four tabs, wherever `TabBar` shows. Quiet: the main path never runs through them. */
const tabs: AppRule[] = [
  { match: /^Discover$/, to: 'discover', quiet: true },
  { match: /^Search$/, to: 'search', quiet: true },
  { match: /^Bookings( \d+)?$/, to: 'bookings', quiet: true },
  { match: /^Profile$/, to: 'profile', quiet: true },
]

const WA = toastTo('Would open WhatsApp')
const momoSend = /^Send .+ prompt$/
/** The phone art on the MoMo pending/approved screen (the screen has no "next" button). */
const momoArt = (root: HTMLElement) => root.querySelector('.size-28')

const steps: AppStep[] = [
  /* ───────────── 1. Onboarding ───────────── */
  {
    id: 'welcome',
    title: 'Welcome',
    render: () => (
      <Proto rules={[{ match: /^Get started$/, to: 'phone' }]}>
        <Welcome />
      </Proto>
    ),
  },
  {
    id: 'phone',
    title: 'Phone number',
    render: () => (
      <Proto rules={[{ match: /^Continue$/, to: 'code' }]}>
        <PhoneEntry number="24 555 0142" />
      </Proto>
    ),
  },
  {
    id: 'code',
    title: 'Code channel',
    render: () => (
      <Proto
        rules={[
          { match: /^Send code on WhatsApp$/, to: 'otp' },
          { match: /^Send by SMS$/, to: 'otp', quiet: true },
        ]}
      >
        <CodeChannel />
      </Proto>
    ),
  },
  {
    id: 'otp',
    title: 'Code (autofilled)',
    render: () => (
      <Proto rules={[{ match: /^Verify and continue$/, to: 'profile-basics' }]}>
        <OtpEntry state="autofilled" />
      </Proto>
    ),
  },
  {
    id: 'profile-basics',
    title: 'About you (21+)',
    render: () => (
      <Proto rules={[{ match: /^Continue$/, to: 'preferences' }]}>
        <ProfileBasics name={me.name} dob={{ day: '14', month: '03', year: '1998' }} email={me.email} />
      </Proto>
    ),
  },
  {
    id: 'preferences',
    title: 'Preferences',
    render: () => (
      <Proto
        rules={[
          { match: /^(Save \d+ picks?|Continue)$/, to: 'notifications' },
          { match: /^Skip$/, to: 'notifications', quiet: true },
        ]}
      >
        <Preferences genres={['Afrobeats', 'Amapiano', 'Highlife']} areas={['Osu', 'East Legon']} />
      </Proto>
    ),
  },
  {
    id: 'notifications',
    title: 'Notifications',
    render: () => (
      <Proto
        rules={[
          { match: /^Turn on notifications$/, to: 'discover' },
          { match: /^Not now$/, to: 'discover', quiet: true },
        ]}
      >
        <NotificationOptIn />
      </Proto>
    ),
  },

  /* ───────────── 2–3. Discover & event ───────────── */
  {
    id: 'discover',
    title: 'Discover',
    render: () => (
      <Proto
        rules={[
          // Venue cards first: their label also carries tonight's event title.
          { match: /^The Vault/, to: 'venue' },
          { match: /Afrobeats Til Dawn/, to: 'event' },
          { match: anyEventTitle, to: 'event', quiet: true },
          ...tabs,
        ]}
      >
        <Discover />
      </Proto>
    ),
  },
  {
    id: 'event',
    title: 'Event detail',
    render: () => (
      <Proto
        rules={[
          { match: /^Book a table$/, to: 'party' },
          { match: /^Get tickets$/, to: 'tickets', quiet: true },
          { match: /^The Vault/, to: 'venue', quiet: true },
        ]}
      >
        <EventDetail />
      </Proto>
    ),
  },
  {
    id: 'venue',
    title: 'Venue · The Vault',
    render: () => (
      <Proto
        rules={[
          { match: /^Book a table$/, to: 'party' },
          { match: /^Choose$/, to: 'party', quiet: true },
        ]}
      >
        <VenueDetail />
      </Proto>
    ),
  },

  /* ───────────── 4. Table path ───────────── */
  {
    id: 'party',
    title: 'Table · Party & time',
    render: () => (
      <Proto rules={[{ match: /^See tables$/, to: 'map' }]}>
        <PartyTime />
      </Proto>
    ),
  },
  {
    id: 'map',
    title: 'Table · Map (SeatGeek style)',
    render: () => (
      <Proto
        rules={[
          { match: /^View VIP booth B3/, to: 'map-sheet' },
          { match: /^Back$/, to: BACK, quiet: true },
        ]}
      >
        <MapPicker map={vaultMap} event={mapEvent} qty={6} selectedId="B3" />
      </Proto>
    ),
  },
  {
    id: 'map-sheet',
    title: 'Table · B3 listing',
    render: () => (
      <Proto rules={[{ match: /^Continue$/, to: 'bottles' }]}>
        <MapPicker map={vaultMap} event={mapEvent} qty={6} selectedId="B3" sheetOpen />
      </Proto>
    ),
  },
  {
    id: 'table',
    title: 'Table · Floor plan (original)',
    render: () => (
      <Proto
        rules={[
          { match: /^Choose [A-Z]+\d+$/, to: 'table-sheet' },
          { match: /^Details for /, to: 'table-sheet', quiet: true },
        ]}
      >
        <PickTable selectedId="B3" />
      </Proto>
    ),
  },
  {
    id: 'table-sheet',
    title: 'Table · B3 detail',
    render: () => (
      <Proto
        rules={[
          { match: /^Select B3/, to: 'bottles' },
          { match: /^Close sheet$/, to: BACK, quiet: true },
        ]}
      >
        <PickTable selectedId="B3" detailOpen />
      </Proto>
    ),
  },
  {
    id: 'bottles',
    title: 'Table · Bottles',
    render: () => (
      <Proto rules={[{ match: /^Continue/, to: 'guests' }]}>
        <Bottles lines={canonicalTable.lines} />
      </Proto>
    ),
  },
  {
    id: 'guests',
    title: 'Table · Guests',
    render: () => (
      <Proto
        rules={[
          { match: /^(Continue|Skip for now)$/, to: 'occasion' },
          { match: /WhatsApp/, to: WA, quiet: true },
        ]}
      >
        <Guests guests={guestSets.partial} />
      </Proto>
    ),
  },
  {
    id: 'occasion',
    title: 'Table · Occasion',
    render: () => (
      <Proto
        rules={[
          { match: /^Save & review$/, to: 'review' },
          { match: /^Skip to review$/, to: 'review', quiet: true },
        ]}
      >
        <OccasionRequests occasion="Birthday" note="Kojo’s 30th! Please bring the Moët out with sparklers at midnight." />
      </Proto>
    ),
  },
  {
    id: 'review',
    title: 'Table · Review & commit',
    render: () => (
      <Proto rules={[{ match: /^Confirm & pay/, to: 'rules' }]}>
        <Review occasion="Birthday" />
      </Proto>
    ),
  },
  {
    id: 'rules',
    title: 'Table · Venue rules',
    render: () => (
      <Proto
        rules={[
          { match: /^I understand/, to: 'pay' },
          { match: /^Go back$/, to: BACK, quiet: true },
        ]}
      >
        <Review occasion="Birthday" rulesOpen />
      </Proto>
    ),
  },
  {
    id: 'pay',
    title: 'Pay · Method (MTN MoMo)',
    render: () => (
      <Proto rules={[{ match: momoSend, to: 'momo-confirm' }]}>
        <MethodPicker pay={tablePay()} showDetails />
      </Proto>
    ),
  },
  {
    id: 'momo-confirm',
    title: 'Pay · Confirm number',
    render: () => (
      // The picker underneath has the same "Send … prompt" label, so ring the sheet's button by hand.
      <Proto
        rules={[
          { match: momoSend, to: 'momo-prompt', quiet: true },
          { match: /^Use a different number$/, to: BACK, quiet: true },
        ]}
      >
        <MomoConfirm pay={tablePay()} />
        <Mark find={(root) => lastButton(root, momoSend)} />
      </Proto>
    ),
  },
  {
    id: 'momo-prompt',
    title: 'Pay · MoMo prompt sent',
    render: () => (
      <Proto rules={[{ match: /^Approve on your phone$/, to: 'approved' }]}>
        <MomoPending pay={tablePay()} stage="sent" elapsed={4} />
        <Tappable round find={momoArt} label="Approve on your phone" />
        <AutoAdvance to="approved" ms={MOMO_AUTO_MS} />
      </Proto>
    ),
  },
  {
    id: 'approved',
    title: 'Pay · Approved',
    render: () => (
      <Proto
        rules={[
          { match: /^Open your booking$/, to: 'confirmed' },
          { match: /^Close$/, to: 'confirmed', quiet: true },
        ]}
      >
        <MomoPending pay={tablePay()} stage="approved" />
        <Tappable round find={momoArt} label="Open your booking" />
        <AutoAdvance to="confirmed" ms={MOMO_AUTO_MS} />
      </Proto>
    ),
  },
  {
    id: 'confirmed',
    title: 'Confirmed · Table',
    render: () => (
      <Proto
        rules={[
          // No "View booking" on this screen: closing it lands in Bookings.
          { match: /^Close$/, to: 'bookings' },
          { match: /WhatsApp/, to: WA, quiet: true },
        ]}
      >
        <ConfirmedTable occasion="Birthday" />
        <Finish />
      </Proto>
    ),
  },

  /* ───────────── 5. Tickets path ───────────── */
  {
    id: 'tickets',
    title: 'Tickets · Tiers',
    render: () => (
      <Proto
        rules={[
          { match: /^Continue$/, to: 'checkout' },
          { match: /^Book a table from/, to: 'party', quiet: true },
        ]}
      >
        <TicketTiers selection={{ ga: 2 }} />
      </Proto>
    ),
  },
  {
    id: 'checkout',
    title: 'Tickets · Checkout',
    render: () => (
      <Proto
        rules={[
          { match: /^Pay ₵/, to: 'ticket-pay' },
          { match: /WhatsApp/, to: WA, quiet: true },
        ]}
      >
        <Checkout />
      </Proto>
    ),
  },
  {
    id: 'ticket-pay',
    title: 'Tickets · Pay (MoMo)',
    render: () => (
      <Proto rules={[{ match: momoSend, to: 'ticket-approved' }]}>
        <MethodPicker />
      </Proto>
    ),
  },
  {
    id: 'ticket-approved',
    title: 'Tickets · Approved',
    render: () => (
      <Proto
        rules={[
          { match: /^Open your tickets$/, to: 'ticket-confirmed' },
          { match: /^Close$/, to: 'ticket-confirmed', quiet: true },
        ]}
      >
        <MomoPending stage="approved" />
        <Tappable round find={momoArt} label="Open your tickets" />
        <AutoAdvance to="ticket-confirmed" ms={MOMO_AUTO_MS} />
      </Proto>
    ),
  },
  {
    id: 'ticket-confirmed',
    title: 'Confirmed · Tickets',
    render: () => (
      <Proto
        rules={[
          { match: /^View tickets$/, to: 'wallet' },
          { match: /^Close$/, to: 'bookings', quiet: true },
          { match: /^Make it a table/, to: 'party', quiet: true },
          { match: /WhatsApp/, to: WA, quiet: true },
        ]}
      >
        <ConfirmedTickets />
        <Finish />
      </Proto>
    ),
  },
  {
    id: 'wallet',
    title: 'Ticket wallet',
    render: () => (
      <Proto rules={[]}>
        <TicketWallet />
      </Proto>
    ),
  },

  /* ───────────── 6. After booking ───────────── */
  {
    id: 'bookings',
    title: 'Bookings',
    render: () => (
      <Proto
        rules={[
          { match: /^Open booking$/, to: 'booking' },
          { match: /^Show QR$/, to: 'day-of', quiet: true },
          { match: /^Booking actions$/, to: 'booking', quiet: true },
          ...tabs,
        ]}
      >
        <BookingsTab />
        {/* Tonight's card has no button of its own: the whole card opens it (its buttons keep their own routes). */}
        <Tappable find={(root) => root.querySelector('.border-2.border-accent')} label="Open booking" />
      </Proto>
    ),
  },
  {
    id: 'booking',
    title: 'Booking detail · Table',
    render: () => (
      <Proto
        rules={[
          { match: /^Manage$/, to: 'guest-list' },
          { match: /invites pending/, to: 'guest-list', quiet: true },
          { match: /^Full screen$/, to: 'day-of', quiet: true },
          { match: /^Cancel booking$/, to: 'cancel', quiet: true },
        ]}
      >
        <TableBookingDetail />
      </Proto>
    ),
  },
  {
    id: 'guest-list',
    title: 'Guests (host)',
    render: () => (
      <Proto rules={[{ match: /WhatsApp/, to: WA, quiet: true }]}>
        <HostGuests />
      </Proto>
    ),
  },
  {
    id: 'day-of',
    title: 'Day-of mode',
    render: () => (
      <Proto
        rules={[
          { match: /^Close day-of mode$/, to: BACK, quiet: true },
          { match: /^Guests$/, to: 'guest-list', quiet: true },
        ]}
      >
        <DayOfMode />
      </Proto>
    ),
  },
  {
    id: 'cancel',
    title: 'Cancel booking',
    render: () => (
      <Proto
        rules={[
          { match: /^Cancel booking · /, to: 'cancelled' },
          { match: /^Keep my booking$/, to: BACK, quiet: true },
        ]}
      >
        <CancelSheet reason="Plans changed" />
      </Proto>
    ),
  },
  {
    id: 'cancelled',
    title: 'Booking cancelled',
    render: () => (
      <Proto rules={[{ match: /^Find a night$/, to: 'discover' }]}>
        <CancelledBooking />
      </Proto>
    ),
  },
  {
    id: 'profile',
    title: 'Profile',
    render: () => (
      <Proto
        rules={[
          { match: /^Booking details$/, to: 'booking', quiet: true },
          { match: /^Show QR$/, to: 'day-of', quiet: true },
          ...tabs,
        ]}
      >
        <ProfileHome />
      </Proto>
    ),
  },
  {
    id: 'search',
    title: 'Search',
    render: () => (
      <Proto rules={[{ match: anyEventTitle, to: 'event', quiet: true }, ...tabs]}>
        <Search />
      </Proto>
    ),
  },
]

export const appFlow = {
  start: 'welcome',
  steps,
  // Keyed by step so each screen mounts fresh (its own state, timers, finish()).
  render: (id: string) => {
    const step = steps.find((s) => s.id === id) ?? steps[0]
    return <Fragment key={step.id}>{step.render()}</Fragment>
  },
}
