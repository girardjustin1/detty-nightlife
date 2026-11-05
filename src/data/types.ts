// Domain model for the drafts. All money is in Ghana cedis (GHS), stored in
// whole pesewas-free cedis for readability in fixtures.

export type Genre =
  | 'Afrobeats'
  | 'Amapiano'
  | 'Afro House'
  | 'Hiplife'
  | 'Highlife'
  | 'Hip-Hop'
  | 'R&B'
  | 'Dancehall'
  | 'Gqom'
  | 'Live Band'

export type Area = 'Osu' | 'East Legon' | 'Airport City' | 'Labone' | 'Cantonments' | 'Labadi'

export type Venue = {
  id: string
  name: string
  kind: 'Nightclub' | 'Rooftop lounge' | 'Supper club' | 'Beach club'
  area: Area
  address: string
  photo: string
  rating: number
  reviewCount: number
  priceLevel: 1 | 2 | 3 | 4
  genres: Genre[]
  vibe: string[]
  about: string
  hours: string
  dressCode: string
  minAge: number
  parking: string
  floorPlanId?: FloorPlanId
  /** Fictional venue for drafts. */
  sample: true
}

export type FloorPlanId = 'vault' | 'skyline' | 'koko'

export type TableTier = {
  id: string
  name: string
  capacity: number
  minSpend: number
  depositPct: number
  perks: string[]
}

export type TableStatus = 'available' | 'held' | 'booked' | 'unavailable'

export type Table = {
  id: string
  label: string
  tierId: string
  status: TableStatus
  /** Centre in the floor-plan viewBox (880 × 1168). */
  x: number
  y: number
  shape: 'round' | 'booth' | 'long' | 'cabana'
  w?: number
  h?: number
}

export type TicketTier = {
  id: string
  name: string
  price: number
  description: string
  remaining: number | null
  status: 'on-sale' | 'sold-out' | 'coming-soon'
}

export type Artist = { name: string; role: 'Headliner' | 'Support' | 'DJ' | 'Host' | 'Live'; avatar?: string }

export type AccraEvent = {
  id: string
  title: string
  venueId: string
  photo: string
  startsAt: string // ISO, Africa/Accra (UTC+0)
  endsAt: string
  doorsAt: string
  genres: Genre[]
  lineup: Artist[]
  description: string
  dressCode: string
  minAge: number
  ticketsFrom: number | null
  tablesFrom: number | null
  tags: string[]
  ticketTiers: TicketTier[]
  hot?: boolean
  sellingFast?: boolean
}

export type BottleCategory = 'Champagne' | 'Cognac' | 'Tequila' | 'Vodka' | 'Whisky' | 'Gin' | 'Rum' | 'Wine' | 'Mixers' | 'Shisha' | 'Food'

export type Bottle = {
  id: string
  name: string
  category: BottleCategory
  size: string
  price: number
  popular?: boolean
  showpiece?: boolean // arrives with sparklers / parade
}

export type Guest = {
  id: string
  name: string
  phone: string
  status: 'host' | 'accepted' | 'invited' | 'declined' | 'checked-in'
  paidShare?: number
}

export type PaymentMethod = 'mtn-momo' | 'telecel-cash' | 'at-money' | 'card' | 'lightning'

export type BookingStatus =
  | 'awaiting-payment'
  | 'confirmed'
  | 'paid-in-full'
  | 'checked-in'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type Booking = {
  id: string
  ref: string
  kind: 'table' | 'tickets'
  eventId: string
  venueId: string
  tableId?: string
  tierId?: string
  partySize: number
  bottles: { bottleId: string; qty: number }[]
  tickets?: { tierId: string; qty: number }[]
  guests: Guest[]
  subtotal: number
  serviceFee: number
  depositPaid: number
  balanceDue: number
  status: BookingStatus
  paymentMethod: PaymentMethod
  arriveBy?: string
  createdAt: string
}
