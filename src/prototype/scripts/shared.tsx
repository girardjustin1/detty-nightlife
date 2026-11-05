import { FakeQR } from '@/components/app/domain'
import { FloorPlan } from '@/components/app/FloorPlan'
import { bottleById, eventById, me, tableTiers, venueById } from '@/data/fixtures'
import { floorPlans } from '@/data/floorplans'
import { cedis, dayShort, time } from '@/lib/format'
import { canonicalTable, RULES, tableQuote } from '@/lib/pricing'
import { WA } from '@/whatsapp/wa'

/** One canonical booking shared by all four prototypes, priced by the real rules. */
export const event = eventById(canonicalTable.eventId)
export const venue = venueById(canonicalTable.venueId)
export const tier = tableTiers.vault.find((t) => t.id === canonicalTable.tierId)!
export const quote = tableQuote(tier, canonicalTable.lines)
export const bottlesLine = canonicalTable.lines.map((l) => `${l.qty > 1 ? `${l.qty}× ` : ''}${bottleById(l.bottleId).name}`).join(', ')
export const when = `${dayShort(event.startsAt)} · ${time(event.startsAt)}`
export const arriveBy = time(new Date(Date.parse(event.doorsAt) + RULES.holdMinutesAfterDoors * 60_000).toISOString())
/** NOW is 14:00 on the night: the 6–48h band applies. */
export const refundNow = Math.round((quote.deposit * RULES.refund[1].pct) / 100)
export const refundCutoff = time(new Date(Date.parse(event.startsAt) - RULES.refund[1].hoursBefore * 3_600_000).toISOString())
export const momoNumber = '024 ••• 0142'
export const guestNames = ['Kojo', 'Efua', 'Yaw', 'Akosua', 'Adwoa']
export const ref = 'DTY-7Q4K'

export const summaryText = (brandName: string) =>
  [
    `*${tier.name} B3 · ${venue.name}*`,
    `${when} · arrive by ${arriveBy}`,
    `6 guests · ${bottlesLine}`,
    '',
    `Pre-order ${cedis(quote.preOrder)} (minimum ${cedis(quote.minimum)} ✓)`,
    `Deposit ${tier.depositPct}% ${cedis(quote.deposit)} + booking fee ${cedis(quote.fee)}`,
    `*Pay now: ${cedis(quote.dueNow)}*`,
    `Balance at the venue: ${cedis(quote.balanceAtVenue)}`,
    '',
    `_Cancel before ${refundCutoff} today: ${cedis(refundNow)} back. After that, no refund. The fee isn’t refundable._`,
    `_Prices from ${brandName}’s live system._`,
  ].join('\n')

/** The venue map as an image inside a chat bubble (static in WhatsApp; generated per request). */
export function MapImage({ selected = 'B3' }: { selected?: string }) {
  return (
    <div className="pointer-events-none -mx-[3px] -mt-[3px] mb-1 overflow-hidden rounded-md">
      <FloorPlan plan={floorPlans.vault} tiers={tableTiers.vault} selectedId={selected} className="rounded-none border-0" />
    </div>
  )
}

/** Booking confirmation card with the entry QR. */
export function ConfirmCard() {
  return (
    <div className="-mx-[3px] -mt-[3px] mb-1 rounded-md p-3" style={{ background: '#F5F6F6' }}>
      <div className="flex items-center gap-3">
        <FakeQR seed={ref} size={96} />
        <div className="min-w-0 text-[13px] leading-snug" style={{ color: WA.ink }}>
          <div className="text-[15px] font-semibold">{venue.name} · B3</div>
          <div style={{ color: WA.sub }}>{when}</div>
          <div style={{ color: WA.sub }}>Arrive by {arriveBy}</div>
          <div className="mt-1 font-mono text-[12px]">{ref}</div>
        </div>
      </div>
      <div className="mt-2 text-[12px]" style={{ color: WA.sub }}>
        Show this QR at the door. {me.firstName} is the host · 6 guests
      </div>
    </div>
  )
}
