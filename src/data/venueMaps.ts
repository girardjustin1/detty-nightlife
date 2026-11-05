// SAMPLE pricing on the SeatGeek-style venue maps. Tables carry their minimum
// spend; zones and arena sections carry a per-ticket price incl. fees.
// "rise" models dynamic pricing (time-based or after N more sell).
import type { MapSpot, VenueMapDef } from '@/components/app/venue-map/types'
import { arenaSvg, kokoSvg, skylineSvg, tidalSvg, vaultSvg } from '@/components/app/venue-map/svgs'

const t = (id: string, price: number, capacity: number, demand: MapSpot['demand'], extra: Partial<MapSpot> = {}, label?: string): MapSpot => ({
  id,
  label: label ?? id,
  kind: 'table',
  price,
  capacity,
  demand,
  ...extra,
})

export const vaultMap: VenueMapDef = {
  id: 'vault',
  name: 'The Vault',
  svg: vaultSvg,
  spots: [
    t('B1', 6000, 6, 'fair', { soldOut: true }, 'VIP booth B1'),
    t('B2', 6500, 6, 'fair', {}, 'VIP booth B2'),
    t('B3', 6000, 6, 'deal', { hot: true, left: 2, rise: { to: 6500, at: '10pm' }, note: 'Stage side, closest booth to the DJ.' }, 'VIP booth B3'),
    t('B4', 6000, 6, 'deal', {}, 'VIP booth B4'),
    t('B5', 6000, 6, 'fair', { held: true }, 'VIP booth B5'),
    t('B6', 7200, 8, 'high', {}, 'VIP booth B6'),
    t('H1', 2500, 4, 'deal', { soldOut: true }, 'High-top H1'),
    t('H2', 2500, 4, 'deal', { hot: true, left: 1, note: 'By the bar, standing + 2 stools.' }, 'High-top H2'),
    t('H3', 2800, 4, 'fair', {}, 'High-top H3'),
    t('H4', 3200, 4, 'high', { rise: { to: 3500, afterSold: 2 } }, 'High-top H4'),
    t('L1', 15000, 12, 'fair', { note: 'Raised deck: best view of the stage.' }, 'Lounge L1'),
    t('L2', 15000, 12, 'fair', { soldOut: true }, 'Lounge L2'),
    t('L3', 18000, 12, 'high', {}, 'Lounge L3'),
    { id: 'dance-floor', label: 'Dance floor (GA)', kind: 'zone', price: 250, demand: 'deal', left: 84, rise: { to: 350, at: '11pm' } },
  ],
}

export const skylineMap: VenueMapDef = {
  id: 'skyline',
  name: 'Skyline 14',
  svg: skylineSvg,
  spots: [
    t('C1', 7500, 8, 'fair', { soldOut: true }, 'Pool cabana C1'),
    t('C2', 7500, 8, 'deal', { hot: true, left: 1 }, 'Pool cabana C2'),
    t('C3', 8000, 8, 'fair', {}, 'Pool cabana C3'),
    t('C4', 9500, 8, 'high', { rise: { to: 10500, at: '6pm' } }, 'Pool cabana C4'),
    t('S1', 3000, 6, 'deal', {}, 'Lounge sofa S1'),
    t('S2', 3000, 6, 'deal', { soldOut: true }, 'Lounge sofa S2'),
    t('S3', 3400, 6, 'fair', {}, 'Lounge sofa S3'),
    t('S4', 3800, 6, 'fair', { hot: true, left: 2 }, 'Lounge sofa S4'),
    t('S5', 4200, 6, 'high', { note: 'Skyline edge, sunset side.' }, 'Lounge sofa S5'),
    t('S6', 3000, 6, 'deal', {}, 'Lounge sofa S6'),
    t('S7', 3000, 6, 'fair', { soldOut: true }, 'Lounge sofa S7'),
    t('S8', 3200, 6, 'fair', {}, 'Lounge sofa S8'),
    t('I1', 2000, 4, 'deal', {}, 'Bar island I1'),
    t('I2', 2000, 4, 'deal', { soldOut: true }, 'Bar island I2'),
    { id: 'standing', label: 'Standing (GA)', kind: 'zone', price: 300, demand: 'fair', left: 120 },
  ],
}

export const kokoMap: VenueMapDef = {
  id: 'koko',
  name: 'Kòkò Supper Club',
  svg: kokoSvg,
  spots: [
    ...[4000, 4500, 4000, 5500, 5500, 4000, 4500, 4000].map((p, i) =>
      t(`S${i + 1}`, p, 6, p === 4000 ? 'deal' : p === 4500 ? 'fair' : 'high', i === 3 ? { hot: true, left: 1, note: 'Front and centre for the band.' } : i === 1 ? { soldOut: true } : {}, `Stage booth S${i + 1}`),
    ),
    t('V1', 18000, 14, 'fair', { note: 'Glass-walled room with its own bar.', rise: { to: 20000, afterSold: 1 } }, 'Private room V1'),
    t('V2', 18000, 14, 'fair', { soldOut: true }, 'Private room V2'),
  ],
}

export const tidalMap: VenueMapDef = {
  id: 'tidal',
  name: 'Tidal Beach Club',
  svg: tidalSvg,
  spots: [
    { id: 'ga-sand', label: 'GA · on the sand', kind: 'zone', price: 180, demand: 'deal', hot: true, left: 140, rise: { to: 220, at: '8pm' } },
    { id: 'vip-deck', label: 'VIP deck', kind: 'zone', price: 540, demand: 'fair', left: 36, note: 'Raised deck, own bar, fast lane entry.' },
    ...[3500, 3500, 4000, 4000, 5000, 5000].map((p, i) =>
      t(`K${i + 1}`, p, 8, p === 3500 ? 'deal' : p === 4000 ? 'fair' : 'high', i === 4 ? { hot: true, left: 1 } : i === 0 ? { soldOut: true } : {}, `Beach cabana K${i + 1}`),
    ),
  ],
}

const sec = (id: string, price: number, demand: MapSpot['demand'], extra: Partial<MapSpot> = {}, label = `Section ${id}`): MapSpot => ({ id, label, kind: 'section', price, demand, ...extra })

/** Fictional arena for a big concert night (tickets only). */
export const arenaMap: VenueMapDef = {
  id: 'arena',
  name: 'Gold Coast Arena',
  svg: arenaSvg,
  spots: [
    sec('ga-pit', 950, 'fair', { hot: true, left: 18, rise: { to: 1200, afterSold: 10 } }, 'GA Pit'),
    sec('F1', 1450, 'fair', {}, 'Floor F1'),
    sec('F2', 1800, 'high', { soldOut: true }, 'Floor F2'),
    sec('F3', 1200, 'deal', { hot: true, left: 6 }, 'Floor F3'),
    sec('F4', 1350, 'fair', {}, 'Floor F4'),
    ...[680, 720, 850, 900, 900, 780, 650, 650, 780, 900, 850, 720].map((p, i) =>
      sec(String(101 + i), p, p <= 680 ? 'deal' : p <= 780 ? 'fair' : 'high', i === 4 ? { soldOut: true } : i === 7 ? { hot: true, left: 4 } : i === 9 ? { rise: { to: 1000, at: '6pm' } } : {}),
    ),
    ...[260, 300, 350, 350, 300, 220, 180, 180, 220, 300, 350, 300].map((p, i) =>
      sec(String(201 + i), p, p <= 220 ? 'deal' : p <= 300 ? 'fair' : 'high', i === 6 ? { hot: true, left: 9 } : i === 2 ? { soldOut: true } : {}),
    ),
  ],
}

export const venueMaps = { vault: vaultMap, skyline: skylineMap, koko: kokoMap, tidal: tidalMap, arena: arenaMap }

/** Fictional arena concert used by the ticket map stories. */
export const arenaEvent = {
  title: 'Afrobeats All-Stars Live',
  when: 'Sun 27 Dec · 7pm',
  venue: 'Gold Coast Arena, Accra',
}
