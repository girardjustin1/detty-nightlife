// Retake the screenshots used on the Storybook Start Here page (public/docs/*.webp).
// Needs Storybook on :6026, the prototype on :5330, Playwright and cwebp.
// usage: PLAYWRIGHT=/path/to/playwright/index.mjs node scripts/start-here-shots.mjs [brand]
import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const { chromium } = await import(process.env.PLAYWRIGHT ?? 'playwright')
const brand = process.argv[2] ?? 'jama'
const tmp = mkdtempSync(join(tmpdir(), 'start-here-'))
const SB = `http://localhost:6026/iframe.html?viewMode=story&globals=brand:${brand}&id=`
const phone = {
  welcome: 'consumer-01-onboarding-welcome--default',
  discover: 'consumer-02-discover-home--events',
  event: 'consumer-03-event-event-detail--default',
  venue: 'consumer-04-venue-venue-detail--the-vault',
  map: 'consumer-06-book-a-table-map-picker-seatgeek-style--b-3-selected-going-fast',
  listing: 'consumer-06-book-a-table-map-picker-seatgeek-style--listing-sheet-price-rise',
  arena: 'consumer-05-book-tickets-map-picker-seatgeek-style--arena-floor-selected',
  bottles: 'consumer-06-book-a-table-bottles--minimum-met',
  guests: 'consumer-06-book-a-table-guests--full',
  review: 'consumer-06-book-a-table-review-commit--standard',
  momo: 'consumer-07-pay-momo--prompt-sent',
  confirmed: 'consumer-07-pay-confirmed--table',
  wallet: 'consumer-08-my-bookings-ticket-wallet--first-ticket',
  invite: 'consumer-09-guests-invite-landing--landing',
  'pro-tonight': 'promoter-tonight--default',
  'pro-floor': 'promoter-live-floor--default',
  'pro-reservations': 'promoter-reservations--list',
  'pro-door': 'promoter-door--valid-table',
  'wa-confirmed': 'whatsapp-booking-confirmed--default',
  'wa-flow': 'whatsapp-flow-rsvp-to-paystack--step-2-form-sheet',
  'wa-invite': 'whatsapp-guest-invite--guest-view',
}
const webp = (png, name, width) => execFileSync('cwebp', ['-quiet', '-q', '78', '-resize', String(width), '0', png, '-o', `public/docs/${name}.webp`])

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 440, height: 900 }, deviceScaleFactor: 2 })
for (const [name, id] of Object.entries(phone)) {
  await p.goto(SB + id, { waitUntil: 'networkidle' })
  await p.waitForTimeout(600)
  const clip = await p.locator('div[style*="width: 390px"]').first().boundingBox()
  await p.screenshot({ path: `${tmp}/${name}.png`, clip })
  webp(`${tmp}/${name}.png`, name, 480)
}
await p.setViewportSize({ width: 680, height: 1100 })
await p.goto(SB + 'emails-booking-confirmed--paid-with-mo-mo', { waitUntil: 'networkidle' })
await p.waitForTimeout(600)
await p.screenshot({ path: `${tmp}/email.png` })
webp(`${tmp}/email.png`, 'email', 680)

// The three WhatsApp prototypes, a few taps in.
const q = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await q.addInitScript((br) => localStorage.setItem('proto-brand', br), brand)
for (const [route, taps] of [['wa-menu', 4], ['wa-flows', 2], ['wa-ai', 2]]) {
  await q.goto(`http://localhost:5330/#/${route}/chat`, { waitUntil: 'networkidle' })
  await q.waitForTimeout(2500)
  for (let i = 0; i < taps; i++) {
    const hot = q.locator('[data-hot]:not([data-hot="false"]), [data-hot-auto]:not([data-hot-auto="false"])').last()
    if (await hot.count()) await hot.click({ force: true }).catch(() => {})
    await q.waitForTimeout(3000)
  }
  await q.screenshot({ path: `${tmp}/proto-${route}.png` })
  webp(`${tmp}/proto-${route}.png`, `proto-${route}`, 480)
}
await b.close()
console.log(`retook ${Object.keys(phone).length + 4} shots in ${brand}`)
