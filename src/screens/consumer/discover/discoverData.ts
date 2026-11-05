// SAMPLE DATA ONLY — fictional searches, artists and copy for the Discover drafts.
// Prices and counts are derived from src/data/fixtures.ts wherever possible.
import { events, NOW, tableTiers, venues } from '@/data/fixtures'
import type { AccraEvent, Area, Artist, Genre, Venue } from '@/data/types'

export const recentSearches = ['Afrobeats Til Dawn', 'Rooftop Airport City', 'Nana Piano', 'Tables for 6 Saturday']

export const trendingGenres: Genre[] = ['Amapiano', 'Afrobeats', 'Afro House', 'Highlife']

export const areas: Area[] = ['Osu', 'East Legon', 'Airport City', 'Labone', 'Cantonments', 'Labadi']

export const allGenres: Genre[] = ['Afrobeats', 'Amapiano', 'Afro House', 'Hiplife', 'Highlife', 'Hip-Hop', 'R&B', 'Dancehall', 'Gqom', 'Live Band']

/** Every act in the fixtures, de-duplicated, with the events they play. */
export type ArtistResult = Artist & { events: AccraEvent[]; genres: Genre[] }
export const artists: ArtistResult[] = (() => {
  const map = new Map<string, ArtistResult>()
  for (const e of events) {
    for (const a of e.lineup) {
      const cur = map.get(a.name) ?? { ...a, events: [], genres: [] }
      cur.events.push(e)
      for (const g of e.genres) if (!cur.genres.includes(g)) cur.genres.push(g)
      map.set(a.name, cur)
    }
  }
  return [...map.values()]
})()

export const trendingArtists = ['Kwesi Wav', 'Nana Piano', 'Ama Selecta', 'Kofi Deep', 'Selecta Yaw'].map((n) => artists.find((a) => a.name === n)!)

export const upcoming = (list: AccraEvent[] = events) => list.filter((e) => e.endsAt > NOW).sort((a, b) => a.startsAt.localeCompare(b.startsAt))

/** Cheapest way in at a venue tonight (Fri 18 Dec): a ticket, else the lowest table minimum. */
export function tonightPrice(v: Venue): { label: string; amount: number | null; event?: AccraEvent } {
  const ev = events.find((e) => e.venueId === v.id && e.startsAt.startsWith(NOW.slice(0, 10)))
  const tableMin = tableTiers[v.id]?.reduce((m, t) => Math.min(m, t.minSpend), Infinity)
  if (ev?.ticketsFrom != null) return { label: 'Tickets', amount: ev.ticketsFrom, event: ev }
  if (tableMin != null && Number.isFinite(tableMin)) return { label: 'Tables', amount: tableMin, event: ev }
  return { label: 'No night listed', amount: null }
}

export function search(q: string) {
  const s = q.trim().toLowerCase()
  if (!s) return { events: [], venues: [], artists: [] }
  const hit = (...xs: string[]) => xs.some((x) => x.toLowerCase().includes(s))
  return {
    events: upcoming().filter((e) => {
      const v = venues.find((x) => x.id === e.venueId)!
      return hit(e.title, v.name, v.area, ...e.genres, ...e.lineup.map((a) => a.name))
    }),
    venues: venues.filter((v) => hit(v.name, v.area, v.kind, ...v.genres, ...v.vibe)),
    artists: artists.filter((a) => hit(a.name, ...a.genres)),
  }
}

export const genreCopy: Partial<Record<Genre, { title: string; blurb: string; soundsLike: string[]; photo: string }>> = {
  Amapiano: {
    title: 'Amapiano in Accra',
    blurb: 'Log drums, shakers and a slow-building groove. Accra’s Amapiano nights start late and finish at sunrise — Sundays are the big one.',
    soundsLike: ['Log-drum heavy', 'Private-school piano', 'Soulful vocals', 'Sunday sundowners'],
    photo: `${import.meta.env.BASE_URL}img/event-amapiano.webp`,
  },
  Highlife: {
    title: 'Highlife in Accra',
    blurb: 'Guitars, horns and seven-piece bands. Highlife nights here mean dinner first, then dancing until the band packs up.',
    soundsLike: ['Palm-wine guitar', 'Brass sections', 'Live band', 'Golden-era classics'],
    photo: `${import.meta.env.BASE_URL}img/venue-koko.webp`,
  },
  Afrobeats: {
    title: 'Afrobeats in Accra',
    blurb: 'The sound of Detty December. Big rooms, bigger singalongs, and at least one surprise guest every Friday.',
    soundsLike: ['Afro-pop anthems', 'Azonto throwbacks', 'Amapiano crossover', 'Singalong hooks'],
    photo: `${import.meta.env.BASE_URL}img/event-afrobeats.webp`,
  },
  'R&B': {
    title: 'R&B in Accra',
    blurb: 'Slow jams and late suppers. R&B nights are rarer — turn on alerts and we’ll tell you the moment one drops.',
    soundsLike: ['Slow jams', '2000s R&B', 'Neo-soul', 'Live vocals'],
    photo: `${import.meta.env.BASE_URL}img/venue-koko.webp`,
  },
}

/* ───────────────────────── Map geometry ─────────────────────────
 * A stylised Accra in a 400 × 560 viewBox (north up, Gulf of Guinea at the
 * bottom). Shapes are rough and not to scale — enough to orient, ~2 KB of SVG
 * instead of hundreds of KB of map tiles.
 */
export const MAP_W = 400
export const MAP_H = 560

export const mapAreas: { area: Area; d: string; label: [number, number] }[] = [
  { area: 'East Legon', d: 'M276 46 L388 40 L394 214 L284 226 Z', label: [336, 186] },
  { area: 'Airport City', d: 'M132 140 L262 128 L272 262 L154 276 Z', label: [200, 254] },
  { area: 'Cantonments', d: 'M176 290 L288 276 L292 356 L198 392 Z', label: [240, 318] },
  { area: 'Labone', d: 'M222 372 L292 364 L298 452 L228 466 Z', label: [262, 392] },
  { area: 'Osu', d: 'M112 398 L218 396 L224 478 L124 490 Z', label: [150, 418] },
  { area: 'Labadi', d: 'M300 356 L384 344 L392 424 L304 448 Z', label: [346, 432] },
]

export const mapRoads = [
  'M0 330 C 90 320, 180 300, 280 270 S 380 230, 400 226', // Ring Rd
  'M168 500 L184 400 L208 280 L222 120 L230 0', // Liberation Rd
  'M222 220 C 260 210, 300 160, 340 120 L 400 92', // to East Legon
  'M60 560 L96 420 L120 300 L130 160 L124 0', // west arterial
  'M224 468 C 260 440, 300 430, 400 400', // La Rd
]

export const coastline = 'M-300 500 L0 492 C 70 486, 130 512, 200 494 S 320 460, 400 432 L700 400 L700 1000 L-300 1000 Z'

export const venuePins: Record<string, [number, number]> = {
  vault: [170, 452],
  skyline: [214, 214],
  koko: [334, 150],
  tidal: [340, 400],
}
