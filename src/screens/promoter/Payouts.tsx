import { ArrowDownToLine, Check, ChevronRight, Clock, Download, Landmark, Lock } from 'lucide-react'
import { AppBar, Screen, Sheet } from '@/components/app/chrome'
import { PaymentMark } from '@/components/app/domain'
import { Avatar, Badge, Button, Segmented } from '@/components/ui/primitives'
import { RULES } from '@/lib/pricing'
import { cedis, cx, dayShort } from '@/lib/format'
import { Fact, Label, PromoterTabBar } from './PromoterChrome'
import type { Night } from './promoterData'
import { kpis, momoAccounts, nightNet, nights, promoterCommission, VENUE_TERMS } from './promoterData'

const statusBadge: Record<Night['status'], { tone: 'success' | 'warning' | 'neutral'; label: string }> = {
  settled: { tone: 'success', label: 'Settled' },
  processing: { tone: 'warning', label: 'Processing' },
  pending: { tone: 'neutral', label: 'Pending' },
}

export function Payouts({ withdrawing, role = 'owner' }: { withdrawing?: boolean; role?: 'owner' | 'manager' }) {
  const settled = nights.filter((n) => n.status === 'settled').reduce((s, n) => s + nightNet(n).net, 0)
  const pending = nights.filter((n) => n.status !== 'settled').reduce((s, n) => s + nightNet(n).net, 0)
  const processing = nights.find((n) => n.status === 'processing')!
  const tonight = nights[0]
  const t = nightNet(tonight)

  return (
    <Screen
      header={
        <div className="shrink-0 border-b border-line bg-bg">
          <AppBar
            title="Payouts & reports"
            subtitle="The Vault Ent. Ltd"
            trailing={
              <button aria-label="Export CSV" className="flex size-9 items-center justify-center rounded-full bg-surface-2">
                <Download className="size-4" />
              </button>
            }
          />
          <div className="px-4 pb-2.5">
            <Segmented
              value="dec"
              options={[
                { value: 'week', label: 'This week' },
                { value: 'dec', label: 'December' },
                { value: 'custom', label: 'Custom' },
              ]}
            />
          </div>
        </div>
      }
      tabBar={<PromoterTabBar active="more" />}
    >
      <div className="grid grid-cols-2 gap-2 px-4 pt-3">
        <div className="rounded-card border border-line bg-surface p-3">
          <div className="text-[10.5px] font-bold tracking-wider text-faint uppercase">Settled</div>
          <div className="mt-1 text-[22px] font-bold text-success tabular-nums">{cedis(settled)}</div>
          <div className="text-xs text-dim">{nights.filter((n) => n.status === 'settled').length} nights paid out</div>
        </div>
        <div className="rounded-card border border-line bg-surface p-3">
          <div className="text-[10.5px] font-bold tracking-wider text-faint uppercase">Pending</div>
          <div className="mt-1 text-[22px] font-bold tabular-nums">{cedis(pending)}</div>
          <div className="text-xs text-dim">Pays out {VENUE_TERMS.settleDays} days after each night</div>
        </div>
      </div>

      <div className="mx-4 mt-2 flex items-center gap-3 rounded-card border border-line bg-surface p-3">
        <PaymentMark method="mtn-momo" size={36} />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">
            Next: {cedis(nightNet(processing).net)} on {dayShort(new Date(new Date(processing.date).getTime() + VENUE_TERMS.settleDays * 86_400_000).toISOString())}
          </div>
          <div className="truncate text-xs text-dim">To {momoAccounts[0].label} · {momoAccounts[0].detail}</div>
        </div>
        {role === 'owner' ? (
          <Button size="sm" variant="secondary" className="h-8 px-3 text-[13px]">
            Change
          </Button>
        ) : (
          <span className="flex items-center gap-1 text-xs text-faint">
            <Lock className="size-3" /> Owner
          </span>
        )}
      </div>

      <Label action="All nights">By night</Label>
      <ul className="mx-4 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
        {nights.map((n) => {
          const x = nightNet(n)
          const b = statusBadge[n.status]
          return (
            <li key={n.id} className="flex items-center gap-3 px-3 py-2.5">
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-semibold">{n.title}</span>
                  <Badge tone={b.tone} className="px-1.5 py-0 text-[10.5px]">
                    {b.label}
                  </Badge>
                </span>
                <span className="block truncate text-xs text-dim">
                  {dayShort(n.date)} · gross {cedis(x.gross)}
                  {n.paidTo && ` · ${n.paidTo}`}
                </span>
              </span>
              <span className="shrink-0 text-right text-sm font-semibold tabular-nums">{cedis(x.net)}</span>
              <ChevronRight className="size-4 shrink-0 text-faint" />
            </li>
          )
        })}
      </ul>

      <Label>Tonight · {tonight.title}</Label>
      <div className="mx-4 rounded-card border border-line bg-surface px-3 py-1.5">
        <Fact k="Table deposits & prepaid" v={cedis(tonight.tables)} />
        <Fact k="Tickets sold online" v={cedis(tonight.tickets)} />
        <Fact k="Gross" v={cedis(t.gross)} className="border-t border-line" />
        <Fact k={`Platform fee (${VENUE_TERMS.platformPct}%)`} v={<span className="text-danger">−{cedis(t.fee)}</span>} />
        <Fact k={`Promoter commission (${VENUE_TERMS.promoterPct}%)`} v={<span className="text-danger">−{cedis(t.promo)}</span>} />
        <Fact k="Net payout" v={<span className="text-lg">{cedis(t.net)}</span>} className="border-t border-line" />
        <p className="pb-1.5 text-[11px] text-faint">
          Guests pay the {RULES.tableFeePct}% table and {RULES.ticketFeePct}% ticket booking fees on top; they are not taken from your payout. Balances collected at the venue ({cedis(kpis.balanceToCollect)} due tonight) go straight to you.
        </p>
      </div>

      <Label>Promoter commission · tonight</Label>
      <div className="mx-4 mb-6 overflow-hidden rounded-card border border-line bg-surface">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 bg-surface-2 px-3 py-1.5 text-[10.5px] font-bold text-faint uppercase">
          <span>Promoter</span>
          <span className="text-right">Tables</span>
          <span className="text-right">Sales</span>
          <span className="text-right">Owed</span>
        </div>
        {promoterCommission.map((p) => (
          <div key={p.promoter.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 border-t border-line px-3 py-2 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <Avatar name={p.promoter.name} size={24} />
              <span className="min-w-0">
                <span className="block truncate font-semibold">{p.promoter.name.split(' ')[0]}</span>
                <span className="block truncate text-[11px] text-faint">{p.promoter.company}</span>
              </span>
            </span>
            <span className="text-right tabular-nums">{p.tables}</span>
            <span className="text-right text-dim tabular-nums">{cedis(p.sales)}</span>
            <span className={cx('text-right font-semibold tabular-nums', !p.commission && 'text-faint')}>{cedis(p.commission)}</span>
          </div>
        ))}
        <div className="border-t border-line px-3 py-2 text-[11px] text-faint">Paid to each promoter’s MoMo with the venue payout.</div>
      </div>

      {withdrawing && (
        <Sheet
          title="Payout account"
          footer={
            <Button block size="lg" icon={<ArrowDownToLine className="size-5" />}>
              Save · confirm with WhatsApp code
            </Button>
          }
        >
          <div className="space-y-2 pb-2">
            {momoAccounts.map((a, i) => (
              <button key={a.id} className={cx('flex w-full items-center gap-3 rounded-card border p-3 text-left', i === 0 ? 'border-accent bg-accent/10' : 'border-line bg-bg')}>
                {a.id === 'momo' ? <PaymentMark method="mtn-momo" size={36} /> : <span className="flex size-9 items-center justify-center rounded-lg bg-surface-2 text-dim"><Landmark className="size-5" /></span>}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{a.label}</span>
                  <span className="block truncate text-xs text-dim">{a.detail}</span>
                </span>
                <span className="text-xs text-faint">{a.id === 'momo' ? 'Same day' : '1–2 working days'}</span>
                {i === 0 && <Check className="size-4 text-accent" />}
              </button>
            ))}
            <p className="flex items-center gap-1.5 pt-1 text-xs text-faint">
              <Clock className="size-3.5" /> Changes take effect after a 24-hour security hold. Owner only.
            </p>
          </div>
        </Sheet>
      )}
    </Screen>
  )
}
