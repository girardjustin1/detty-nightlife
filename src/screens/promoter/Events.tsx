import { ChevronRight, Copy, Link2, Plus, Radio, Share2 } from 'lucide-react'
import { Screen } from '@/components/app/chrome'
import { DateBadge } from '@/components/app/domain'
import { Badge, Button, Img, ProgressBar, Segmented } from '@/components/ui/primitives'
import { cedis, cx, time } from '@/lib/format'
import { Label, PromoterHeader, PromoterTabBar, tight } from './PromoterChrome'
import { draftEvent, kpis, tonightEvent, vaultEvents } from './promoterData'

export function Events({ view = 'upcoming' }: { view?: 'upcoming' | 'past' }) {
  return (
    <Screen
      header={
        <PromoterHeader
          night={false}
          title="Events"
          trailing={
            <Button size="sm" className={tight} icon={<Plus className="size-4" />}>
              Create
            </Button>
          }
        >
          <div className="px-4 pb-2.5">
            <Segmented
              value={view}
              options={[
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'past', label: 'Past' },
              ]}
            />
          </div>
        </PromoterHeader>
      }
      tabBar={<PromoterTabBar active="events" />}
    >
      <div className="px-4 pt-3">
        <WhatsAppPromoCard />
      </div>

      <Label>The Vault · {vaultEvents.length + 1} nights</Label>
      <ul className="mx-4 space-y-2 pb-6">
        {vaultEvents.map(({ event, tickets, ticketCap, tables, tableCap, status }) => (
          <li key={event.id}>
            <button className="flex w-full gap-3 rounded-card border border-line bg-surface p-3 text-left">
              <DateBadge iso={event.startsAt} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate font-semibold">{event.title}</span>
                  {status === 'live' ? (
                    <Badge tone="live" className="px-2 py-0 text-[10.5px]">
                      <Radio className="size-3" /> Live
                    </Badge>
                  ) : (
                    <Badge tone="success" className="px-2 py-0 text-[10.5px]">
                      On sale
                    </Badge>
                  )}
                </span>
                <span className="block text-xs text-dim">
                  Doors {time(event.doorsAt)} · {event.genres.join(' · ')}
                </span>
                <span className="mt-2 grid grid-cols-2 gap-3">
                  <Meter label="Tickets" value={tickets} max={ticketCap} />
                  <Meter label="Tables" value={tables} max={tableCap} />
                </span>
                {event.id === tonightEvent.id && <span className="mt-1.5 block text-[11px] text-faint">{cedis(kpis.ticketRevenue + kpis.deposits)} collected online so far</span>}
              </span>
              <ChevronRight className="size-4 shrink-0 self-center text-faint" />
            </button>
          </li>
        ))}
        <li>
          <button className="flex w-full gap-3 rounded-card border border-dashed border-line bg-surface/50 p-3 text-left">
            <DateBadge iso={draftEvent.date} />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate font-semibold">{draftEvent.title}</span>
                <Badge className="px-2 py-0 text-[10.5px]">Draft</Badge>
              </span>
              <span className="block text-xs text-dim">Step 3 of 5 · ticket tiers</span>
              <span className="mt-2 block text-sm font-semibold text-accent">Continue setup</span>
            </span>
            <ChevronRight className="size-4 shrink-0 self-center text-faint" />
          </button>
        </li>
      </ul>
    </Screen>
  )
}

function Meter({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  return (
    <span className="block">
      <span className="flex justify-between gap-1 text-[11px]">
        <span className="text-faint">{label}</span>
        <span className={cx('font-semibold tabular-nums', pct >= 85 && 'text-accent')}>
          {value}/{max}
        </span>
      </span>
      <ProgressBar value={value} max={max} tone={pct >= 85 ? 'accent' : 'success'} className="mt-1 h-1" />
    </span>
  )
}

/** Promo card: post the night to WhatsApp Status or the venue’s Channel. */
export function WhatsAppPromoCard({ eventTitle = tonightEvent.title, photo = tonightEvent.photo }: { eventTitle?: string; photo?: string }) {
  return (
    <div className="overflow-hidden rounded-card border border-whatsapp/30 bg-surface">
      <div className="flex gap-3 p-3">
        <Img src={photo} alt="" className="aspect-[9/16] w-16 shrink-0 rounded-[10px]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-whatsapp uppercase">
            <Share2 className="size-3.5" /> Promote on WhatsApp
          </div>
          <div className="mt-1 text-sm font-semibold">{eventTitle}: tables are going</div>
          <p className="mt-0.5 line-clamp-2 text-xs text-dim">A 9:16 poster with a booking link. Each staff member’s link is tracked, so you see who sold what.</p>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-faint">
            <Link2 className="size-3" /> Booking link · code VAULT-ESI
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-line px-3 py-2.5">
        <Button size="sm" variant="whatsapp" className={cx(tight, 'flex-1')}>
          Post to Status
        </Button>
        <Button size="sm" variant="secondary" className={cx(tight, 'flex-1')}>
          Send to Channel
        </Button>
        <Button size="sm" variant="secondary" className={cx(tight, 'px-2.5')} aria-label="Copy link">
          <Copy className="size-4" />
        </Button>
      </div>
    </div>
  )
}
