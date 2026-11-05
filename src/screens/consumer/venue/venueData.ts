// SAMPLE DATA ONLY — fictional reviews, photos, availability and contact
// details for the Venue drafts. Keyed by venue id from src/data/fixtures.ts.
import type { PaymentMethod } from '@/data/types'

const img = (name: string) => `${import.meta.env.BASE_URL}img/${name}.webp`

export type PhotoCategory = 'Venue' | 'Tables' | 'Bottles' | 'Crowd'
export type VenuePhoto = { src: string; category: PhotoCategory; caption: string; by: 'Venue' | 'Guest'; tall?: boolean }

export type Review = {
  id: string
  author: string
  date: string // ISO
  rating: 1 | 2 | 3 | 4 | 5
  sub: SubRatings
  visit: string
  text: string
  helpful: number
  photos?: string[]
  reply?: string
}

export type SubRatings = { Music: number; Crowd: number; Service: number; Value: number }

export type VenueExtras = {
  bookedToday: number | null
  socialProof: string
  photos: VenuePhoto[]
  distribution: [number, number, number, number, number] // 5★ → 1★
  sub: SubRatings
  reviews: Review[]
  payments: PaymentMethod[]
  accessibility: string
  instagram: string
  /** Tables left tonight per tier id. */
  tablesLeft: Record<string, number>
  noteForTonight?: string
}

const photos = (main: string, extra: [string, PhotoCategory, string][]): VenuePhoto[] => [
  { src: img(main), category: 'Venue', caption: 'Main room', by: 'Venue' },
  ...extra.map(([n, category, caption], i) => ({ src: img(n), category, caption, by: (i % 3 === 1 ? 'Guest' : 'Venue') as 'Venue' | 'Guest', tall: i % 4 === 1 })),
]

export const venueExtras: Record<string, VenueExtras> = {
  vault: {
    bookedToday: 38,
    socialProof: 'Booked 38 times today',
    photos: photos('venue-vault', [
      ['venue-entrance', 'Venue', 'Oxford St entrance'],
      ['event-afrobeats', 'Crowd', 'Afrobeats Til Dawn, Nov'],
      ['bottles', 'Bottles', 'Bottle parade'],
      ['event-throwback', 'Crowd', 'Hiplife Throwback'],
      ['venue-vault', 'Tables', 'VIP booth B3'],
      ['event-amapiano', 'Crowd', 'Dance floor at 2am'],
      ['bottles', 'Bottles', 'Showpiece service'],
      ['venue-entrance', 'Venue', 'Queue on a Friday'],
      ['venue-vault', 'Tables', 'Lounge deck'],
      ['event-afrobeats', 'Crowd', 'Surprise PA'],
      ['event-afrohouse', 'Venue', 'Lights rig'],
    ]),
    distribution: [560, 170, 50, 18, 14],
    sub: { Music: 4.8, Crowd: 4.6, Service: 4.3, Value: 3.9 },
    payments: ['mtn-momo', 'telecel-cash', 'card', 'lightning'],
    accessibility: 'Stairs down to the club. Step-free entry by service lift — ask the door team.',
    instagram: '@thevault.accra',
    tablesLeft: { hightop: 2, booth: 1, lounge: 0 },
    noteForTonight: 'Tables are held until 11:30pm. Guest list closes at 11:30pm.',
    reviews: [
      {
        id: 'r1',
        author: 'Abena O.',
        date: '2026-12-13T02:10:00Z',
        rating: 5,
        sub: { Music: 5, Crowd: 5, Service: 4, Value: 4 },
        visit: 'VIP booth · party of 6',
        text: 'Booth B3 was perfect — right by the stage but we could still talk. The bottle parade at 1am had the whole room filming. Server checked on us all night.',
        helpful: 42,
        photos: [img('bottles'), img('event-afrobeats')],
        reply: 'Medaase Abena! See you at NYE. — The Vault team',
      },
      {
        id: 'r2',
        author: 'Kofi A.',
        date: '2026-12-06T03:30:00Z',
        rating: 4,
        sub: { Music: 5, Crowd: 4, Service: 4, Value: 3 },
        visit: 'Tickets · General admission',
        text: 'Music was unreal, DJ went back-to-back for three hours. Queue at the door was 25 minutes even with a ticket — come before 11.',
        helpful: 18,
      },
      {
        id: 'r3',
        author: 'Sena K.',
        date: '2026-11-29T01:45:00Z',
        rating: 5,
        sub: { Music: 5, Crowd: 5, Service: 5, Value: 4 },
        visit: 'Lounge deck · party of 10',
        text: 'Did my 30th on the lounge deck. Private host sorted the cake and sparklers. Worth it for a big group.',
        helpful: 27,
        photos: [img('venue-vault')],
      },
      {
        id: 'r4',
        author: 'Marcus T.',
        date: '2026-11-22T02:00:00Z',
        rating: 3,
        sub: { Music: 4, Crowd: 3, Service: 3, Value: 2 },
        visit: 'High-top · party of 4',
        text: 'Fun night but the high-tops are basically standing room. The minimum spend went quickly once we added mixers.',
        helpful: 31,
      },
      {
        id: 'r5',
        author: 'Efua D.',
        date: '2026-11-15T03:05:00Z',
        rating: 5,
        sub: { Music: 5, Crowd: 5, Service: 4, Value: 4 },
        visit: 'Tickets · VIP entry',
        text: 'Fast lane actually works. In within five minutes while the main queue went round the corner.',
        helpful: 9,
      },
      {
        id: 'r6',
        author: 'Yaw B.',
        date: '2026-11-08T04:20:00Z',
        rating: 1,
        sub: { Music: 3, Crowd: 2, Service: 1, Value: 1 },
        visit: 'VIP booth · party of 6',
        text: 'We arrived at 12:15 and our booth had been released. Got it back eventually but it took 40 minutes. Read the arrival time on your booking!',
        helpful: 56,
        reply: 'Sorry Yaw — tables are held until 2 hours after doors. We’ve added a WhatsApp reminder at 11pm so this doesn’t happen again.',
      },
    ],
  },
  skyline: {
    bookedToday: 21,
    socialProof: 'Booked 21 times today',
    photos: photos('venue-skyline', [
      ['event-afrohouse', 'Crowd', 'Sunset Sessions'],
      ['venue-skyline', 'Tables', 'Pool cabana C2'],
      ['bottles', 'Bottles', 'Champagne on ice'],
      ['event-amapiano', 'Crowd', 'Log Drum Sundays'],
      ['venue-skyline', 'Venue', 'Bar island'],
      ['event-afrohouse', 'Venue', 'Golden hour'],
    ]),
    distribution: [390, 100, 28, 9, 7],
    sub: { Music: 4.6, Crowd: 4.7, Service: 4.6, Value: 4.1 },
    payments: ['mtn-momo', 'card', 'lightning'],
    accessibility: 'Lift to the 14th floor. Step-free across the deck.',
    instagram: '@skyline14.accra',
    tablesLeft: { sofa: 3, cabana: 0, bar: 2 },
    reviews: [
      {
        id: 's1',
        author: 'Adjoa F.',
        date: '2026-12-13T19:00:00Z',
        rating: 5,
        sub: { Music: 5, Crowd: 5, Service: 5, Value: 4 },
        visit: 'Pool cabana · party of 8',
        text: 'The sunset from the cabana is the best view in Accra. Live sax over the house set gave me chills.',
        helpful: 22,
        photos: [img('venue-skyline')],
      },
      {
        id: 's2',
        author: 'Kwabena M.',
        date: '2026-12-06T21:30:00Z',
        rating: 4,
        sub: { Music: 4, Crowd: 5, Service: 4, Value: 4 },
        visit: 'Tickets · General admission',
        text: 'Great crowd, very relaxed. Gets windy after 9pm so bring a layer.',
        helpful: 11,
      },
      {
        id: 's3',
        author: 'Lara N.',
        date: '2026-11-28T20:15:00Z',
        rating: 5,
        sub: { Music: 5, Crowd: 4, Service: 5, Value: 4 },
        visit: 'Lounge sofa · party of 6',
        text: 'Our server remembered every order. Sofa on the glass edge is worth booking early.',
        helpful: 8,
      },
    ],
  },
  koko: {
    bookedToday: 12,
    socialProof: 'Booked 12 times today',
    photos: photos('venue-koko', [
      ['venue-koko', 'Tables', 'Stage booth S2'],
      ['bottles', 'Bottles', 'Champagne toast'],
      ['venue-koko', 'Venue', 'Private room'],
      ['event-throwback', 'Crowd', 'After the band'],
    ]),
    distribution: [240, 42, 9, 3, 2],
    sub: { Music: 4.9, Crowd: 4.7, Service: 4.8, Value: 4.2 },
    payments: ['mtn-momo', 'telecel-cash', 'at-money', 'card'],
    accessibility: 'Step-free throughout. Accessible restroom.',
    instagram: '@kokosupperclub',
    tablesLeft: { 'stage-booth': 2, 'private-room': 1 },
    reviews: [
      {
        id: 'k1',
        author: 'Nana Y.',
        date: '2026-12-11T00:30:00Z',
        rating: 5,
        sub: { Music: 5, Crowd: 5, Service: 5, Value: 4 },
        visit: 'Stage booth · party of 4',
        text: 'Jollof, then a seven-piece highlife band, then dancing until 2. My parents loved it as much as we did.',
        helpful: 19,
        photos: [img('venue-koko')],
      },
      {
        id: 'k2',
        author: 'Dede A.',
        date: '2026-12-04T23:45:00Z',
        rating: 5,
        sub: { Music: 5, Crowd: 4, Service: 5, Value: 5 },
        visit: 'Private room · party of 12',
        text: 'Company dinner in the private room. Own bartender, set menu, zero stress.',
        helpful: 7,
      },
    ],
  },
  tidal: {
    bookedToday: null,
    socialProof: '312 tickets sold today',
    photos: photos('venue-tidal', [
      ['event-amapiano', 'Crowd', 'Bonfire set'],
      ['venue-tidal', 'Venue', 'DJ canopy'],
      ['event-afrobeats', 'Crowd', 'Boxing Day 2025'],
      ['venue-tidal', 'Venue', 'Sunrise'],
    ]),
    distribution: [700, 300, 120, 48, 35],
    sub: { Music: 4.6, Crowd: 4.4, Service: 3.8, Value: 4.5 },
    payments: ['mtn-momo', 'telecel-cash', 'card'],
    accessibility: 'Boardwalk from the gate to the bar. The dance floor is sand.',
    instagram: '@tidalbeach.accra',
    tablesLeft: {},
    reviews: [
      {
        id: 't1',
        author: 'Kojo M.',
        date: '2026-12-14T05:00:00Z',
        rating: 5,
        sub: { Music: 5, Crowd: 5, Service: 4, Value: 5 },
        visit: 'Tickets · General admission',
        text: 'Danced barefoot until sunrise. Cashless bar was quick with MoMo.',
        helpful: 33,
      },
      {
        id: 't2',
        author: 'Priya S.',
        date: '2026-12-07T04:10:00Z',
        rating: 3,
        sub: { Music: 4, Crowd: 3, Service: 2, Value: 4 },
        visit: 'Tickets · General admission',
        text: 'Amazing vibe, but bar queues were long after midnight. Get your drinks early.',
        helpful: 14,
      },
    ],
  },
}

export const extrasForVenue = (id: string) => venueExtras[id]
export const reviewTotal = (x: VenueExtras) => x.distribution.reduce((a, b) => a + b, 0)
