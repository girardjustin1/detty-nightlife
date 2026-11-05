import type { ReactNode } from 'react'
import { Armchair, Banknote, CircleAlert, Clock, Gift, Megaphone, MessageCircle, ScanLine, Smartphone, Ticket, UserPlus, Users, Wine } from 'lucide-react'
import { Screen } from '@/components/app/chrome'
import { Button, Skeleton } from '@/components/ui/primitives'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { Kpi, Label, PromoterHeader, PromoterTabBar, tight } from './PromoterChrome'
import {
  approvals,
  arrivals,
  guestsArrived,
  guestsExpected,
  kpis,
  minutesBetween,
  PROMO_NOW,
  releaseAt,
  reservations,
  ticketSales,
  tonightEvent,
} from './promoterData'

export function Tonight({ loading, offline, noAlerts }: { loading?: boolean; offline?: boolean; noAlerts?: boolean }) {
  const late = reservations.find((r) => r.status === 'late')!
  const failed = reservations.find((r) => r.pay === 'momo-failed')!
  const approval = approvals[0]
  const releaseIn = minutesBetween(PROMO_NOW, releaseAt)

  return (
    <Screen header={<PromoterHeader offline={offline} alerts={noAlerts ? 0 : 3} />} tabBar={<PromoterTabBar active="tonight" badges={{ bookings: approvals.length }} />}>
      <div className="flex items-center justify-between px-4 pt-3 text-xs text-dim">
        <span>
          {dayShort(tonightEvent.startsAt)} · now {time(PROMO_NOW)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> Doors {time(tonightEvent.doorsAt)} · close {time(tonightEvent.endsAt)}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-2 px-4 pt-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
          <Skeleton className="col-span-2 h-20" />
          <Skeleton className="col-span-2 mt-4 h-40" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 px-4 pt-3">
            <Kpi
              icon={<Armchair className="size-3.5" />}
              label="Tables"
              value={
                <>
                  {kpis.tablesBooked}
                  <span className="text-base text-faint">/{kpis.tablesTotal}</span>
                </>
              }
              sub={`${kpis.tablesHeld} held · ${kpis.tablesTotal - kpis.tablesBooked - kpis.tablesHeld} free`}
              progress={{ value: kpis.tablesBooked, max: kpis.tablesTotal }}
            />
            <Kpi
              icon={<Users className="size-3.5" />}
              label="Guests in"
              value={
                <>
                  {guestsArrived}
                  <span className="text-base text-faint">/{guestsExpected}</span>
                </>
              }
              sub={`Tables ${kpis.tableGuestsArrived}/${kpis.tableGuestsExpected} · tickets ${kpis.ticketsScanned}`}
              progress={{ value: guestsArrived, max: guestsExpected }}
              tone="success"
            />
            <Kpi icon={<Banknote className="size-3.5" />} label="Collected online" value={cedis(kpis.deposits)} sub="Table deposits + prepaid" />
            <Kpi
              icon={<Wine className="size-3.5" />}
              label="Min spend sold"
              value={cedis(kpis.minimumCommitted)}
              sub={
                <>
                  <span className="text-warning">{cedis(kpis.balanceToCollect)}</span> to collect
                </>
              }
            />
            <div className="col-span-2 rounded-card border border-line bg-surface p-3">
              <div className="flex items-baseline justify-between">
                <span className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-wider text-faint uppercase">
                  <Ticket className="size-3.5" /> Tickets sold
                </span>
                <span className="text-xs text-dim">
                  Venue capacity <b className="text-text">{kpis.capacity}</b>
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[22px] font-bold tabular-nums">
                  {kpis.ticketsSold}
                  <span className="text-base text-faint">/{kpis.ticketAllocation}</span>
                </span>
                <span className="text-xs text-dim">{cedis(kpis.ticketRevenue)} gross</span>
              </div>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-surface-2">
                {ticketSales.map((t, i) => (
                  <span key={t.id} className={cx('h-full', ['bg-accent-3', 'bg-accent', 'bg-accent-2'][i])} style={{ width: `${(t.sold / kpis.ticketAllocation) * 100}%` }} />
                ))}
              </div>
              <div className="mt-2 flex gap-3 text-[11px] text-dim">
                {ticketSales.map((t, i) => (
                  <span key={t.id} className="flex items-center gap-1">
                    <span className={cx('size-2 rounded-full', ['bg-accent-3', 'bg-accent', 'bg-accent-2'][i])} />
                    {t.name.replace('General admission', 'GA')} {t.sold}/{t.allocation}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Label action={!noAlerts && 'All alerts'}>Needs you {!noAlerts && <span className="ml-1 rounded-full bg-accent-3 px-1.5 text-white">3</span>}</Label>
          {noAlerts ? (
            <div className="mx-4 rounded-card border border-line bg-surface p-4 text-center text-sm text-dim">All clear. Late tables, approvals and failed payments show up here.</div>
          ) : (
            <div className="space-y-2 px-4">
              <Alert
                tone="danger"
                icon={<Clock className="size-4" />}
                title={`${late.tableId} · ${late.host} is late`}
                meta={`Releases in ${releaseIn} min`}
                body={`0 of ${late.partySize} arrived · was due ${time(late.arriveBy)} · ${cedis(late.depositPaid)} deposit paid`}
                actions={
                  <>
                    <Button size="sm" className={tight} variant="whatsapp" icon={<MessageCircle className="size-4" />}>
                      Message
                    </Button>
                    <Button size="sm" className={tight} variant="secondary">
                      +30 min
                    </Button>
                    <Button size="sm" variant="ghost" className={`${tight} text-danger`}>
                      Release
                    </Button>
                  </>
                }
              />
              <Alert
                tone="warning"
                icon={<Users className="size-4" />}
                title={`Approve party of ${approval.partySize} · ${approval.host}`}
                meta={`${approval.expiresInMin} min left`}
                body={`${approval.kind} · suggested ${approval.suggestedTable} · budget ${cedis(approval.budget!)}`}
                actions={
                  <>
                    <Button size="sm" className={tight}>Review</Button>
                    <span className="text-xs text-dim">+{approvals.length - 1} more pending</span>
                  </>
                }
              />
              <Alert
                tone="danger"
                icon={<Smartphone className="size-4" />}
                title={`MoMo payment failed · ${failed.tableId} ${failed.host}`}
                meta="Held 10 min"
                body={`${cedis(failed.quote.deposit)} deposit declined (insufficient balance). Table is held while they retry.`}
                actions={
                  <>
                    <Button size="sm" className={tight} variant="secondary">
                      Resend prompt
                    </Button>
                    <Button size="sm" className={tight} variant="ghost">
                      Pay at door
                    </Button>
                  </>
                }
              />
            </div>
          )}

          <Label>Quick actions</Label>
          <div className="grid grid-cols-4 gap-2 px-4">
            {[
              { icon: <ScanLine className="size-5" />, label: 'Scan' },
              { icon: <UserPlus className="size-5" />, label: 'Add guest' },
              { icon: <Armchair className="size-5" />, label: 'Walk-in table' },
              { icon: <Megaphone className="size-5" />, label: 'Broadcast' },
            ].map((a) => (
              <button key={a.label} className="flex flex-col items-center gap-1.5 rounded-card border border-line bg-surface px-1 py-3 text-[11px] font-semibold">
                <span className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-accent">{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>

          <Label action="Door log">Live arrivals</Label>
          <div className="mx-4 mb-6 divide-y divide-line rounded-card border border-line bg-surface">
            {arrivals.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-3 py-2.5">
                <span className="w-13 shrink-0 text-xs text-faint tabular-nums">{time(a.at)}</span>
                <span className={cx('flex size-7 shrink-0 items-center justify-center rounded-full', a.kind === 'table' ? 'bg-success/15 text-success' : a.kind === 'comp' ? 'bg-accent-2/15 text-accent-2' : 'bg-surface-2 text-dim')}>
                  {a.kind === 'table' ? <Armchair className="size-3.5" /> : a.kind === 'comp' ? <Gift className="size-3.5" /> : <Ticket className="size-3.5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{a.name}</span>
                  <span className="block truncate text-xs text-dim">
                    {a.what} · by {a.by}
                  </span>
                </span>
                {a.count && <span className="shrink-0 rounded-[5px] bg-success/15 px-1.5 py-px text-[11px] font-bold text-success">{a.count}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </Screen>
  )
}

function Alert({ tone, icon, title, meta, body, actions }: { tone: 'danger' | 'warning'; icon: ReactNode; title: string; meta: string; body: string; actions: ReactNode }) {
  return (
    <div className={cx('rounded-card border bg-surface p-3', tone === 'danger' ? 'border-danger/40' : 'border-warning/40')}>
      <div className="flex items-start gap-2.5">
        <span className={cx('mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full', tone === 'danger' ? 'bg-danger/15 text-danger' : 'bg-warning/15 text-warning')}>{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm leading-snug font-semibold">{title}</span>
            <span className={cx('flex shrink-0 items-center gap-1 text-[11px] font-bold', tone === 'danger' ? 'text-danger' : 'text-warning')}>
              <CircleAlert className="size-3" />
              {meta}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-dim">{body}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">{actions}</div>
        </div>
      </div>
    </div>
  )
}
