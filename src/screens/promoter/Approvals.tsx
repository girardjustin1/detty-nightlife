import { Armchair, Check, CircleCheck, Clock, Crown, MessageCircle, Users, X } from 'lucide-react'
import { AppBar, Screen, Sheet } from '@/components/app/chrome'
import { Avatar, Badge, Button, Chip } from '@/components/ui/primitives'
import { useBrand } from '@/brands/BrandContext'
import { BOOKING_WHATSAPP } from '@/config/contact'
import { eventById } from '@/data/fixtures'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { PromoterTabBar, tight } from './PromoterChrome'
import type { Approval } from './promoterData'
import { approvals, tierById, vaultPlan } from './promoterData'

export function Approvals({ declining, approved, empty }: { declining?: boolean; approved?: boolean; empty?: boolean }) {
  const list = empty ? [] : approved ? approvals.slice(1) : approvals
  const brand = useBrand()
  return (
    <Screen header={<AppBar title="Approvals" subtitle={`${list.length} waiting · The Vault`} />} tabBar={<PromoterTabBar active="bookings" badges={{ bookings: list.length }} />}>
      {approved && (
        <div className="mx-4 mt-2 flex items-center gap-2 rounded-card border border-success/40 bg-success/10 px-3 py-2.5 text-sm">
          <CircleCheck className="size-4 text-success" />
          <span className="flex-1">
            <b>Approved.</b> L3 held for Kwame Asiedu · deposit link sent on WhatsApp
          </span>
          <button className="text-xs font-semibold text-accent">Undo</button>
        </div>
      )}
      {list.length === 0 ? (
        <div className="px-8 py-20 text-center">
          <CircleCheck className="mx-auto size-10 text-success" />
          <p className="mt-3 font-semibold">No requests waiting</p>
          <p className="mt-1 text-sm text-dim">Parties over a table’s capacity and concierge requests land here for approval.</p>
        </div>
      ) : (
        <div className="space-y-3 px-4 pt-2 pb-6">
          {list.map((a, i) => (
            <ApprovalCard key={a.id} a={a} expanded={i === 0} />
          ))}
        </div>
      )}
      {declining && (
        <Sheet
          title="Decline request"
          footer={
            <Button block size="lg" variant="danger">
              Decline & send on WhatsApp
            </Button>
          }
        >
          <div className="space-y-3 pb-2">
            <p className="text-sm text-dim">Mansa Owusu-Ansah · party of 8 · tonight</p>
            <div className="flex flex-wrap gap-2">
              {['Fully booked', 'Party too large', 'Offer a different table', 'Other'].map((r, i) => (
                <Chip key={r} selected={i === 2} className="h-8 px-3 text-[13px]">
                  {r}
                </Chip>
              ))}
            </div>
            <div className="rounded-card bg-[#0b141a] p-3">
              <div className="ml-auto max-w-[85%] rounded-[10px] rounded-tr-none bg-[#005c4b] px-3 py-2 text-sm text-white">
                Hi Mansa, B4 only seats 6 so we can’t take 8 there tonight. The Lounge deck (L3) seats 12 from {cedis(tierById('lounge').minSpend)}. Want it? Reply YES and we’ll hold it 10 min.
                <div className="mt-1 text-right text-[10px] text-white/60">11:15pm ✓✓</div>
              </div>
            </div>
            <p className="text-xs text-faint">Sent from {brand.name} on WhatsApp ({BOOKING_WHATSAPP.display}). No charge to the guest.</p>
          </div>
        </Sheet>
      )}
    </Screen>
  )
}

function ApprovalCard({ a, expanded }: { a: Approval; expanded?: boolean }) {
  const ev = eventById(a.forEvent)
  const firstTable = a.suggestedTable.split(' + ')[0]
  const t = vaultPlan.tables.find((x) => x.id === firstTable)
  const tier = t ? tierById(t.tierId) : undefined
  const urgent = a.expiresInMin < 60
  return (
    <div className={cx('rounded-card border bg-surface', urgent ? 'border-warning/40' : 'border-line')}>
      <div className="flex items-start gap-3 p-3">
        <Avatar name={a.host} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm leading-snug font-semibold">{a.host}</span>
            <span className={cx('flex shrink-0 items-center gap-1 text-[11px] font-bold', urgent ? 'text-warning' : 'text-faint')}>
              <Clock className="size-3" />
              {a.expiresInMin < 60 ? `${a.expiresInMin} min` : `${Math.round(a.expiresInMin / 60)} h`}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-dim">
            <Badge tone={a.kind === 'Concierge' ? 'accent' : 'warning'} className="px-2 py-0 text-[10.5px]">
              {a.kind}
            </Badge>
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {a.partySize}
            </span>
            <span>
              · {ev.id === 'afrobeats-til-dawn' ? 'Tonight' : dayShort(ev.startsAt)} · {time(a.arriveBy)}
            </span>
          </div>
        </div>
      </div>
      <p className="mx-3 rounded-[10px] bg-surface-2 px-3 py-2 text-sm text-dim">“{a.message}”</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-3 pt-2 text-xs text-dim">
        {a.budget && (
          <span>
            Budget <b className="text-text">{cedis(a.budget)}</b>
          </span>
        )}
        <span>{a.via}</span>
        {a.vipNote && (
          <span className="flex items-center gap-1 text-accent-2">
            <Crown className="size-3" />
            {a.vipNote}
          </span>
        )}
      </div>
      {expanded && (
        <div className="mx-3 mt-3 rounded-[10px] border border-accent/40 bg-accent/5 p-3">
          <div className="flex items-center gap-2 text-sm">
            <Armchair className="size-4 text-accent" />
            <span className="font-semibold">Suggested: {a.suggestedTable}</span>
            {tier && <span className="text-dim">· {tier.name}</span>}
          </div>
          {tier && (
            <div className="mt-1 text-xs text-dim">
              Seats {tier.capacity} · min {cedis(tier.minSpend)} · {tier.depositPct}% deposit ({cedis((tier.minSpend * tier.depositPct) / 100)}) · free tonight
            </div>
          )}
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="text-faint">Or</span>
            {a.alternatives.map((x) => (
              <span key={x} className="rounded-[5px] border border-line px-1.5 py-px font-semibold">
                {x}
              </span>
            ))}
            <button className="ml-auto font-semibold text-accent">Pick on floor</button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 p-3">
        <Button size="sm" className={cx(tight, 'flex-1 whitespace-nowrap')} icon={<Check className="size-4" />}>
          Approve{expanded ? ` · hold ${a.suggestedTable}` : ''}
        </Button>
        <Button size="sm" variant="secondary" className={tight} aria-label="Message on WhatsApp">
          <MessageCircle className="size-4" />
        </Button>
        <Button size="sm" variant="danger" className={tight} icon={<X className="size-4" />}>
          Decline
        </Button>
      </div>
    </div>
  )
}
