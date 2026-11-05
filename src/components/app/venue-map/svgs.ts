// SeatGeek-style venue map art, generated in code so every bookable shape has
// an id (B3, C2, 104, ga-sand…). Swap any of these for Higgsfield SVGs later:
// VenueMap only needs shapes whose ids match the spot ids.
// Size budget: each map is ~4–9 KB of markup.

const C = {
  canvas: '#EEF0F4',
  venue: '#FFFFFF',
  outline: '#C9C8DA',
  stage: '#4D4D4D',
  stageText: '#CFCFD4',
  ga: '#C2CCBC',
  gaStroke: '#AEB9A8',
  table: '#E6E6E9',
  tableStroke: '#B5B5BD',
  text: '#6B6B75',
  water: '#CFE3EA',
  deck: '#F6F6F8',
}
const font = `font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"`

const label = (x: number, y: number, t: string, size = 22, fill = C.text, extra = '') =>
  `<text x="${x}" y="${y}" ${font} font-size="${size}" fill="${fill}" text-anchor="middle" dominant-baseline="central" ${extra}>${t}</text>`

const rect = (id: string, x: number, y: number, w: number, h: number, t = id, r = 8, fill = C.table, stroke = C.tableStroke) =>
  `<g id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>${t ? label(x + w / 2, y + h / 2, t) : ''}</g>`

const circle = (id: string, cx: number, cy: number, r: number, t = id) =>
  `<g id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.table}" stroke="${C.tableStroke}" stroke-width="2"/>${label(cx, cy, t, 20)}</g>`

const zone = (id: string, d: string, t: string, lx: number, ly: number) =>
  `<g id="${id}"><path d="${d}" fill="${C.ga}" stroke="${C.gaStroke}" stroke-width="2"/>${label(lx, ly, t, 24)}</g>`

const stage = (x: number, y: number, w: number, h: number, t = 'STAGE', r = 4) =>
  `<g id="stage"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${C.stage}"/>${label(x + w / 2, y + h / 2, t, 18, C.stageText, 'letter-spacing="2"')}</g>`

const box = (x: number, y: number, w: number, h: number, t: string, size = 16) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${C.table}"/>${label(x + w / 2, y + h / 2, t, size)}`

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${C.canvas}"/>${body}</svg>`

const venue = (d: string) => `<path d="${d}" fill="${C.venue}" stroke="${C.outline}" stroke-width="8" stroke-linejoin="round"/>`

/* ───────── The Vault — basement nightclub ───────── */
export const vaultSvg = svg(
  800,
  1000,
  [
    venue('M60 60 H740 V940 H60 Z'),
    stage(230, 90, 340, 110, 'DJ'),
    zone('dance-floor', 'M200 235 H600 V650 H200 Z', 'DANCE FLOOR', 400, 445),
    `<rect x="82" y="250" width="40" height="420" rx="6" fill="${C.table}"/>${label(102, 460, 'BAR', 18, C.text, 'transform="rotate(-90 102 460)"')}`,
    ...[0, 1, 2, 3].map((i) => circle(`H${i + 1}`, 158, 305 + i * 100, 30)),
    ...[0, 1, 2, 3, 4, 5].map((i) => rect(`B${i + 1}`, 628, 240 + i * 70, 92, 58)),
    `<rect x="150" y="700" width="500" height="190" rx="14" fill="${C.deck}" stroke="${C.tableStroke}" stroke-width="2" stroke-dasharray="6 6"/>`,
    label(400, 868, 'LOUNGE DECK', 16),
    ...[0, 1, 2].map((i) => rect(`L${i + 1}`, 172 + i * 160, 722, 136, 110)),
    box(80, 880, 120, 40, 'ENTRANCE', 14),
  ].join(''),
)

/* ───────── Skyline 14 — L-shaped rooftop ───────── */
export const skylineSvg = svg(
  800,
  1000,
  [
    venue('M60 60 H740 V560 H470 V940 H60 Z'),
    `<rect x="190" y="240" width="90" height="520" rx="10" fill="${C.water}"/>${label(235, 500, 'POOL', 18, '#5d7b86', 'transform="rotate(-90 235 500)"')}`,
    ...[0, 1, 2, 3].map((i) => rect(`C${i + 1}`, 86, 250 + i * 128, 84, 106)),
    zone('bar-island', 'M440 205 a95 95 0 1 0 0.1 0 Z', 'BAR', 440, 300),
    circle('I1', 372, 430, 26),
    circle('I2', 508, 430, 26),
    ...([[110, 100], [260, 100], [410, 100], [560, 100], [660, 250], [660, 400], [500, 640], [300, 840]] as const).map(([x, y], i) => rect(`S${i + 1}`, x - 45, y - 32, 90, 64)),
    stage(620, 470, 90, 60, 'DJ'),
    zone('standing', 'M300 560 H450 V780 H300 Z', 'STANDING', 375, 670),
    box(110, 870, 120, 44, 'STAIRS', 14),
  ].join(''),
)

/* ───────── Kòkò — supper club ───────── */
const arcBooth = (i: number) => {
  const a = Math.PI * (0.98 - (i * 0.96) / 7) // left → right across the top of the arc
  const cx = 360 + Math.cos(a) * 250
  const cy = 700 - Math.sin(a) * 330
  const deg = 90 - (a * 180) / Math.PI
  return `<g id="S${i + 1}" transform="rotate(${deg.toFixed(1)} ${cx.toFixed(0)} ${cy.toFixed(0)})"><rect x="${(cx - 48).toFixed(0)}" y="${(cy - 30).toFixed(0)}" width="96" height="60" rx="26" fill="${C.table}" stroke="${C.tableStroke}" stroke-width="2"/>${label(cx, cy, `S${i + 1}`, 20, C.text, `transform="rotate(${(-deg).toFixed(1)} ${cx.toFixed(0)} ${cy.toFixed(0)})"`)}</g>`
}
export const kokoSvg = svg(
  800,
  1000,
  [
    venue('M60 60 H560 V60 H740 V780 H440 V940 H280 V780 H60 Z'),
    `<rect x="120" y="90" width="380" height="54" rx="8" fill="${C.table}"/>${label(310, 117, 'BAR', 18)}`,
    ...Array.from({ length: 8 }, (_, i) => arcBooth(i)),
    zone('dance-floor', 'M220 560 Q360 470 500 560 L500 650 H220 Z', 'DANCE FLOOR', 360, 600),
    `<g id="stage"><path d="M180 690 Q360 610 540 690 V760 H180 Z" fill="${C.stage}"/>${label(360, 722, 'STAGE', 18, C.stageText, 'letter-spacing="2"')}</g>`,
    `<rect x="580" y="90" width="138" height="660" rx="10" fill="${C.deck}" stroke="${C.outline}" stroke-width="4"/>${label(649, 120, 'PRIVATE ROOM', 13)}`,
    rect('V1', 606, 160, 86, 240, 'V1', 18),
    rect('V2', 606, 440, 86, 240, 'V2', 18),
    box(300, 880, 120, 44, 'ENTRANCE', 14),
  ].join(''),
)

/* ───────── Tidal — beach club, mostly GA ───────── */
export const tidalSvg = svg(
  800,
  1000,
  [
    venue('M90 120 Q60 60 160 60 H660 Q740 60 730 160 L720 760 Q600 820 400 800 Q200 780 80 820 Z'),
    `<path d="M40 840 Q200 790 400 820 T760 790 V1000 H40 Z" fill="${C.water}"/>${label(400, 900, 'OCEAN', 18, '#5d7b86', 'letter-spacing="4"')}`,
    stage(260, 80, 280, 90),
    zone('ga-sand', 'M150 200 H560 Q600 420 520 600 Q360 680 170 600 Q110 420 150 200 Z', 'GA SAND', 350, 400),
    box(330, 470, 70, 40, 'MIX', 14),
    zone('vip-deck', 'M590 220 H700 V560 H600 Q630 400 590 220 Z', 'VIP DECK', 648, 390),
    ...[0, 1, 2, 3, 4, 5].map((i) => rect(`K${i + 1}`, 140 + i * 92, 680, 76, 56)),
    box(90, 300, 44, 140, 'BAR', 14),
    box(90, 470, 44, 110, 'BAR', 14),
    box(84, 160, 100, 36, 'ENTRANCE', 13),
  ].join(''),
)

/* ───────── Gold Coast Arena — concert bowl ───────── */
const ring = (prefix: number, n: number, rIn: number, rOut: number, cx: number, cy: number, from: number, to: number) =>
  Array.from({ length: n }, (_, i) => {
    const gap = 0.012
    const a0 = from + ((to - from) * i) / n + gap
    const a1 = from + ((to - from) * (i + 1)) / n - gap
    const p = (a: number, r: number) => `${(cx + Math.sin(a) * r).toFixed(1)} ${(cy - Math.cos(a) * r).toFixed(1)}`
    const id = String(prefix + i + 1)
    const mid = (a0 + a1) / 2
    const lr = (rIn + rOut) / 2
    return `<g id="${id}"><path d="M${p(a0, rIn)} L${p(a0, rOut)} L${p(a1, rOut)} L${p(a1, rIn)} Z" fill="${C.table}" stroke="${C.tableStroke}" stroke-width="2"/>${label(cx + Math.sin(mid) * lr, cy - Math.cos(mid) * lr, id, 18)}</g>`
  }).join('')
export const arenaSvg = svg(
  800,
  1000,
  [
    venue('M250 50 H550 L760 260 V740 L550 950 H250 L40 740 V260 Z'),
    stage(290, 170, 220, 90),
    zone('ga-pit', 'M320 275 H480 V345 H320 Z', 'GA PIT', 400, 310),
    zone('F1', 'M270 360 H395 V490 H270 Z', 'F1', 332, 425),
    zone('F2', 'M405 360 H530 V490 H405 Z', 'F2', 467, 425),
    zone('F3', 'M270 500 H395 V630 H270 Z', 'F3', 332, 565),
    zone('F4', 'M405 500 H530 V630 H405 Z', 'F4', 467, 565),
    box(365, 650, 70, 34, 'MIX', 13),
    ring(100, 12, 250, 296, 400, 500, Math.PI * 0.2, Math.PI * 1.8),
    ring(200, 12, 304, 350, 400, 500, Math.PI * 0.16, Math.PI * 1.84),
  ].join(''),
)
