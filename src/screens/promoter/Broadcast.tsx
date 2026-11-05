import { CalendarClock, Check, CheckCheck, ExternalLink, Info, ShieldCheck, Ticket } from 'lucide-react'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Button, Chip, Img, ProgressBar, Segmented } from '@/components/ui/primitives'
import { useBrand } from '@/brands/BrandContext'
import { BOOKING_WHATSAPP } from '@/config/contact'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { Label, PromoterTabBar } from './PromoterChrome'
import { audience, tierById, vaultEvents, VENUE_TERMS } from './promoterData'

type Segment = (typeof audience.segments)[number]['id']

export function Broadcast({ segment = 'amapiano', state = 'compose' }: { segment?: Segment; state?: 'compose' | 'sent' }) {
  const seg = audience.segments.find((s) => s.id === segment)!
  const nye = vaultEvents.find((v) => v.event.id === 'nye-countdown')!.event
  const cost = seg.count * VENUE_TERMS.waMessageCost
  const brand = useBrand()

  return (
    <Screen
      header={<AppBar title="Broadcast" subtitle="WhatsApp · marketing template" />}
      footer={
        state === 'compose' ? (
          <BottomBar
            summary={
              <>
                <div className="text-xs text-dim">{seg.count.toLocaleString()} recipients</div>
                <div className="text-sm font-semibold">≈ {cedis(cost)}</div>
              </>
            }
          >
            <div className="flex gap-2">
              <Button variant="secondary" aria-label="Schedule" className="px-3">
                <CalendarClock className="size-5" />
              </Button>
              <Button variant="whatsapp">Send now</Button>
            </div>
          </BottomBar>
        ) : undefined
      }
      tabBar={<PromoterTabBar active="more" />}
    >
      {state === 'sent' ? (
        <Sent count={seg.count} cost={cost} label={`${nye.title} · ${seg.label}`} />
      ) : (
        <>
          <Label>Audience</Label>
          <div className="mx-4 rounded-card border border-line bg-surface p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm">
                <b className="text-lg tabular-nums">{audience.optedIn.toLocaleString()}</b>
                <span className="text-dim"> of {audience.pastGuests.toLocaleString()} past guests opted in</span>
              </span>
            </div>
            <ProgressBar value={audience.optedIn} max={audience.pastGuests} tone="success" className="mt-2 h-1.5" />
            <p className="mt-2 flex items-start gap-1.5 text-xs text-faint">
              <ShieldCheck className="mt-px size-3.5 shrink-0 text-success" />
              Marketing opt-ins only. {(audience.pastGuests - audience.optedIn).toLocaleString()} guests who didn’t tick “Send me nights like this” are never messaged.
            </p>
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pt-2.5">
            {audience.segments.map((s) => (
              <Chip key={s.id} selected={s.id === segment} className="h-8 px-3 text-[13px]">
                {s.label} <span className="opacity-70 tabular-nums">{s.count.toLocaleString()}</span>
              </Chip>
            ))}
          </div>

          <Label action="Templates">Message</Label>
          <div className="px-4">
            <Segmented
              value="announce"
              className="[&>button]:h-8 [&>button]:text-[12px]"
              options={[
                { value: 'announce', label: 'New night' },
                { value: 'last', label: 'Last tables' },
                { value: 'thanks', label: 'Thank you' },
              ]}
            />
            <div className="mt-2 space-y-2 rounded-card border border-line bg-surface p-3 text-sm">
              <Var k="Event" v={`${nye.title} · ${dayShort(nye.startsAt)}`} />
              <Var k="{{1}} Name" v="Guest’s first name" faint />
              <Var k="Offer" v={`Early tables · booth from ${cedis(tierById('booth').minSpend)}`} />
              <Var k="Button" v="Book a table → event link" />
            </div>
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-faint">
              <Check className="size-3 text-success" /> Template approved by WhatsApp · variables only, the wording is fixed
            </p>
          </div>

          <div className="mx-4 mt-4 flex items-center gap-2 rounded-card border border-line bg-surface px-3 py-2.5 text-sm">
            <span className="size-2 rounded-full bg-whatsapp" />
            <span className="text-dim">Sending from</span>
            <span className="ml-auto font-semibold">
              {brand.name} · <span className="tabular-nums">{BOOKING_WHATSAPP.display}</span>
            </span>
          </div>

          <Label>Preview</Label>
          <div className="mx-4 rounded-card bg-[#0b141a] p-3">
            <div className="max-w-[88%] overflow-hidden rounded-[10px] rounded-tl-none bg-[#202c33] text-[#e9edef]">
              <Img src={nye.photo} alt="" rounded={false} className="aspect-[16/9] w-full" />
              <div className="px-2.5 pt-2 pb-1 text-[13.5px] leading-snug">
                Hi Ama 👋 <b>{nye.title}</b> is on at The Vault, {dayShort(nye.startsAt)} from {time(nye.doorsAt)}. Kwesi Wav, Nana Piano and Ama Selecta. Booths from {cedis(tierById('booth').minSpend)} and they go fast.
                <div className="mt-1.5 text-[11px] text-[#8696a0]">Reply STOP to unsubscribe</div>
                <div className="text-right text-[10px] text-[#8696a0]">{time('2026-12-19T12:00:00Z')}</div>
              </div>
              <div className="flex items-center justify-center gap-1.5 border-t border-white/10 py-2 text-[13.5px] font-medium text-[#53bdeb]">
                <ExternalLink className="size-3.5" /> Book a table
              </div>
              <div className="flex items-center justify-center gap-1.5 border-t border-white/10 py-2 text-[13.5px] font-medium text-[#53bdeb]">
                <Ticket className="size-3.5" /> Get tickets
              </div>
            </div>
          </div>

          <div className="mx-4 mt-3 mb-6 flex gap-2 rounded-card border border-line bg-surface p-3 text-xs text-dim">
            <Info className="size-4 shrink-0 text-faint" />
            <span>
              Estimated {cedis(cost, { decimals: true })} for {seg.count.toLocaleString()} messages at a sample rate of {cedis(VENUE_TERMS.waMessageCost, { decimals: true })} each. WhatsApp bills per delivered message; it comes off your next payout.
            </span>
          </div>
        </>
      )}
    </Screen>
  )
}

function Var({ k, v, faint }: { k: string; v: string; faint?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-xs font-semibold text-faint">{k}</span>
      <span className={cx('truncate text-right', faint ? 'text-dim italic' : 'font-medium')}>{v}</span>
    </div>
  )
}

function Sent({ count, cost, label }: { count: number; cost: number; label: string }) {
  const delivered = Math.round(count * 0.94)
  const read = Math.round(count * 0.61)
  const clicks = Math.round(count * 0.08)
  return (
    <div className="px-4 pt-4 pb-6">
      <div className="flex items-center gap-2 rounded-card border border-success/40 bg-success/10 px-3 py-2.5 text-sm">
        <CheckCheck className="size-4 text-success" /> <b>Sent</b> <span className="truncate text-dim">· {time('2026-12-19T12:00:00Z')} · {label}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ['Delivered', delivered],
          ['Read', read],
          ['Tapped', clicks],
        ].map(([k, v]) => (
          <div key={k} className="rounded-card border border-line bg-surface p-3 text-center">
            <div className="text-[10.5px] font-bold text-faint uppercase">{k}</div>
            <div className="text-xl font-bold tabular-nums">{(v as number).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-card border border-line bg-surface p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-dim">Bookings from this message</span>
          <b>7 tables · 38 tickets</b>
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="text-dim">Cost (delivered only)</span>
          <b>{cedis((cost * delivered) / count, { decimals: true })}</b>
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="text-dim">Opted out</span>
          <b>12</b>
        </div>
      </div>
      <p className="mt-2 text-xs text-faint">Sample numbers for the draft.</p>
    </div>
  )
}
