import { ChevronLeft, Flame, QrCode, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { cedis, cx } from '@/lib/format'
import { Button } from '@/components/ui/primitives'
import type { MapSpot, VenueMapDef } from './types'
import { VenueMap, demandDot } from './VenueMap'

const score = { deal: { n: '9.6', word: 'Amazing' }, fair: { n: '7.8', word: 'Good' }, high: { n: '5.9', word: 'Premium' } } as const

export function ValueBadge({ spot }: { spot: MapSpot }) {
  const s = score[spot.demand]
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: demandDot[spot.demand] === '#e5484d' ? '#c33' : '#2f7d32' }}>
      <span className="rounded-[5px] px-1.5 py-px text-[11px] font-bold text-white" style={{ background: demandDot[spot.demand] }}>
        {s.n}
      </span>
      {s.word}
    </span>
  )
}

/** Due-now line for a table (deposit % of the minimum + 3% fee) or a ticket count. */
export const dueNow = (spot: MapSpot, depositPct: number, qty = 1) =>
  spot.kind === 'table' ? Math.round((spot.price * depositPct) / 100) + Math.round(spot.price * 0.03) : Math.round(spot.price * qty * 1.05)

/**
 * SeatGeek-style listing detail, adapted to a phone bottom sheet: overview
 * thumbnail, value score, price incl. fees, the "best deal" nudge, price-rise
 * warning, delivery + protection facts, and similar listings with mini maps.
 */
export function ListingSheet({
  map,
  spot,
  similar,
  depositPct = 30,
  qty,
  onBack,
  onContinue,
  onPickSimilar,
}: {
  map: VenueMapDef
  spot: MapSpot
  similar: MapSpot[]
  depositPct?: number
  /** Party size (tables) or ticket count. */
  qty: number
  onBack?: () => void
  onContinue?: () => void
  onPickSimilar?: (s: MapSpot) => void
}) {
  const table = spot.kind === 'table'
  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-bg pb-6">
      <div className="relative m-4 overflow-hidden rounded-card">
        <VenueMap map={map} focusId={spot.id} zoomable={false} pins={false} className="aspect-[4/3]" />
        <button type="button" aria-label="Back" onClick={onBack} className="absolute top-3 left-3 flex size-10 items-center justify-center rounded-full bg-white text-[#111] shadow">
          <ChevronLeft className="size-5" />
        </button>
      </div>
      <div className="px-5">
        <ValueBadge spot={spot} />
        <h2 className="display mt-1.5 text-2xl">{spot.label}</h2>
        <div className="mt-1 text-lg">
          <b>{cedis(spot.price)}</b> <span className="text-dim">{table ? 'minimum spend' : 'each incl. fees'}</span>
        </div>
        <div className="mt-0.5 text-sm text-dim">
          {table ? (
            <>
              {cedis(dueNow(spot, depositPct))} due now · {depositPct}% deposit + 3% fee · up to {spot.capacity} guests
            </>
          ) : (
            <>
              {qty} × {cedis(spot.price)} = {cedis(dueNow(spot, depositPct, qty))} incl. fees
            </>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <span className="inline-flex h-12 items-center gap-2 rounded-control border border-line px-4 text-sm font-semibold">
            <Users className="size-4" /> {qty} {table ? 'guests' : qty === 1 ? 'ticket' : 'tickets'}
          </span>
          <Button size="lg" className="h-12 flex-1" onClick={onContinue}>
            Continue
          </Button>
        </div>

        {(spot.hot || spot.demand === 'deal') && (
          <div className="mt-5 flex items-start gap-3 rounded-card bg-surface p-3.5 text-sm">
            <Flame className="mt-0.5 size-4 shrink-0 fill-[#ff7a1a] text-[#ff5a00]" />
            <div>
              {spot.hot ? (
                <>
                  <b>Going fast.</b> {spot.left != null ? `Only ${spot.left} left` : 'Selling quickly'} for this night.
                </>
              ) : (
                <>
                  <b>Best deal!</b> The best value for {table ? 'a table this size' : 'this night'} based on price and view of the stage.
                </>
              )}
            </div>
          </div>
        )}
        {spot.rise && (
          <div className="mt-2 flex items-start gap-3 rounded-card border border-warning/40 bg-warning/5 p-3.5 text-sm">
            <TrendingUp className="mt-0.5 size-4 shrink-0 text-warning" />
            <div>
              <b>Price goes up to {cedis(spot.rise.to)}</b> {spot.rise.at ? `at ${spot.rise.at}` : `after ${spot.rise.afterSold} more sell`}. Book now to lock in {cedis(spot.price)}.
            </div>
          </div>
        )}
        {spot.note && <p className="mt-3 text-sm text-dim">{spot.note}</p>}

        <div className="mt-5 space-y-4">
          <div className="flex gap-3">
            <QrCode className="mt-0.5 size-5 shrink-0" />
            <div>
              <div className="font-semibold">Mobile pass</div>
              <div className="text-sm text-dim">Your QR lands in the app and on WhatsApp. Works offline at the door.</div>
            </div>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0" />
            <div>
              <div className="font-semibold">Every booking protected</div>
              <div className="text-sm text-dim">Refund rules in cedis before you pay. If the venue cancels, you get everything back.</div>
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <>
          <h3 className="display mt-7 px-5 text-lg">Similar {table ? 'tables' : 'listings'}</h3>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5">
            {similar.map((s) => (
              <button key={s.id} type="button" onClick={() => onPickSimilar?.(s)} className="w-40 shrink-0 text-left">
                <VenueMap map={map} focusId={s.id} zoomable={false} pins={false} className={cx('aspect-[4/3] rounded-control border border-line')} />
                <div className="mt-2 font-semibold">{s.label}</div>
                <div className="text-sm text-dim">
                  {cedis(s.price)} {table ? 'min' : 'incl. fees'}
                </div>
                <div className="mt-1">
                  <ValueBadge spot={s} />
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
