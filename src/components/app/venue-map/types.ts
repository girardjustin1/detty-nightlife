export type Demand = 'deal' | 'fair' | 'high'

/** One bookable thing on a venue map: a table, a cabana, a GA zone or an arena section. */
export type MapSpot = {
  /** Must equal the id of the shape in the venue SVG. */
  id: string
  label: string
  kind: 'table' | 'zone' | 'section'
  /** Table: minimum spend. Zone/section: price per ticket. */
  price: number
  capacity?: number
  /** How good the price is for what you get (drives the dot colour). */
  demand: Demand
  /** Units left (tables of this kind, or tickets). Low numbers show 🔥. */
  left?: number
  hot?: boolean
  /** Price goes up later: at a time or after N more sell. */
  rise?: { to: number; at?: string; afterSold?: number }
  soldOut?: boolean
  held?: boolean
  /** Short perk line for the listing sheet. */
  note?: string
}

export type VenueMapDef = {
  id: string
  name: string
  /** Inline SVG markup (Higgsfield-generated, ~10–25 KB). */
  svg: string
  spots: MapSpot[]
}
