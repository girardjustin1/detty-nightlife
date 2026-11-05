import type { ReactNode } from 'react'
import { Check, ChevronDown, ChevronUp, CircleExclamationPoint, Clock, CreditCard, Plus, ShieldCheck, Zap } from 'lucide-react'
import type { PaymentMethod } from '@/data/types'
import { PaymentMark, PriceLines } from '@/components/app/domain'
import { Badge, Chip, ProgressBar, TextField } from '@/components/ui/primitives'
import { cedis, cx } from '@/lib/format'
import { RULES } from '@/lib/pricing'
import { detectNetwork, mmss, payErrors, savedMethods, useCountdown, type PayError, type PaySummary } from './payData'

export function BetaBadge() {
  return <Badge tone="warning">Beta</Badge>
}

/** Amount due now, prominently. Tables also show what is left to settle at the venue. */
export function AmountDue({ pay, open, onToggle, compact }: { pay: PaySummary; open?: boolean; onToggle?: () => void; compact?: boolean }) {
  const label = pay.kind === 'tickets' ? 'Total to pay' : pay.kind === 'split' ? 'You pay now' : 'Deposit due now'
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold tracking-wide text-dim uppercase">{label}</div>
          <div className={cx('display tabular-nums', compact ? 'text-3xl' : 'text-[40px] leading-tight')}>{cedis(pay.dueNow)}</div>
          <div className="truncate text-sm text-dim">{pay.title}</div>
        </div>
        {onToggle && (
          <button onClick={onToggle} className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent">
            Details {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        )}
      </div>
      {pay.balanceAtVenue != null && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-control bg-surface-2 px-3 py-2">
            <div className="text-[11px] font-semibold tracking-wide text-dim uppercase">Now</div>
            <div className="font-semibold tabular-nums">{cedis(pay.dueNow)}</div>
          </div>
          <div className="rounded-control bg-surface-2 px-3 py-2">
            <div className="text-[11px] font-semibold tracking-wide text-dim uppercase">At the venue</div>
            <div className="font-semibold tabular-nums">{cedis(pay.balanceAtVenue)}</div>
          </div>
        </div>
      )}
      {open && (
        <div className="mt-3 border-t border-line pt-3">
          <PriceLines lines={pay.lines} total={pay.dueNow} totalLabel="Due now" />
          {pay.balanceAtVenue != null && (
            <p className="mt-2 text-xs text-dim">
              {cedis(pay.balanceAtVenue)} of the minimum is settled at the table on the night, plus the venue’s {RULES.venueServicePct}% service charge ({cedis(pay.serviceAtVenue ?? 0)}).
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/** "We're holding it for you" timer — a logical hold, not a payment hold. */
export function HoldTimer({ what }: { what: string }) {
  const total = RULES.checkoutHoldMinutes * 60
  const left = useCountdown(total - 47)
  return (
    <div className="flex items-center gap-3 rounded-card bg-surface-2 px-4 py-2.5">
      <Clock className="size-4 shrink-0 text-accent-2" />
      <div className="min-w-0 flex-1 text-sm">
        {what} held for <b className="tabular-nums">{mmss(left)}</b>
        <ProgressBar value={left} max={total} tone="warning" className="mt-1.5 h-1" />
      </div>
    </div>
  )
}

export function Radio({ on }: { on: boolean }) {
  return (
    <span className={cx('flex size-5 shrink-0 items-center justify-center rounded-full border-2', on ? 'border-accent bg-accent text-on-accent' : 'border-line')}>
      {on && <Check className="size-3" strokeWidth={3} />}
    </span>
  )
}

function MethodRow({ mark, title, detail, selected, error, onClick, trailing }: { mark: ReactNode; title: ReactNode; detail?: ReactNode; selected?: boolean; error?: PayError; onClick?: () => void; trailing?: ReactNode }) {
  const err = error ? payErrors[error] : undefined
  return (
    <div className={cx('rounded-card border bg-surface transition', err ? 'border-danger bg-danger/5' : selected ? 'border-accent' : 'border-line')}>
      <button onClick={onClick} className="flex w-full items-center gap-3 px-3.5 py-3 text-left">
        {mark}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{title}</span>
          {detail && <span className="block truncate text-sm text-dim">{detail}</span>}
        </span>
        {trailing ?? <Radio on={!!selected} />}
      </button>
      {err && (
        <div className="flex gap-2 border-t border-danger/30 px-3.5 py-2.5" role="alert">
          <CircleExclamationPoint className="mt-0.5 size-4 shrink-0 text-danger" />
          <div className="text-sm">
            <div className="font-semibold text-danger">{err.title}</div>
            <div className="text-dim">{err.body}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function Group({ title, note, badge, children }: { title: string; note?: ReactNode; badge?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 pt-2">
        <h3 className="text-sm font-semibold tracking-wide text-dim uppercase">{title}</h3>
        {badge}
      </div>
      {children}
      {note && <div className="flex items-start gap-1.5 px-1 text-xs text-faint">{note}</div>}
    </section>
  )
}

const networks: PaymentMethod[] = ['mtn-momo', 'telecel-cash', 'at-money']

export function AddNumberForm({ phone = '', network }: { phone?: string; network?: PaymentMethod }) {
  const detected = detectNetwork(phone)
  const net = network ?? detected
  return (
    <div className="space-y-3 rounded-card border border-accent bg-surface p-3.5">
      <TextField label="MoMo number" prefix="🇬🇭 +233" placeholder="24 000 0000" defaultValue={phone.replace(/^\+233\s?/, '')} inputMode="tel" />
      <div>
        <div className="mb-1.5 text-sm font-medium text-dim">Network</div>
        <div className="flex flex-wrap gap-2">
          {networks.map((n) => (
            <Chip key={n} selected={net === n} icon={<PaymentMark method={n} size={20} />}>
              {n === 'mtn-momo' ? 'MTN' : n === 'telecel-cash' ? 'Telecel' : 'AT'}
            </Chip>
          ))}
        </div>
        {detected && <div className="mt-1.5 text-xs text-faint">Picked from the number. Ported your number? Change it.</div>}
      </div>
    </div>
  )
}

export type MethodChoice = string // saved method id, 'new-momo', 'new-card', 'lightning'

/** Grouped method picker: Mobile Money · Card · Bitcoin Lightning (Beta). Errors show inline on the row. */
export function MethodList({
  selected,
  error,
  addingNumber,
  newNumber,
  onSelect,
}: {
  selected: MethodChoice
  error?: PayError
  addingNumber?: boolean
  newNumber?: string
  onSelect?: (m: MethodChoice) => void
}) {
  const momo = savedMethods.filter((m) => m.method !== 'card')
  const cards = savedMethods.filter((m) => m.method === 'card')
  const errFor = (id: string) => (selected === id ? error : undefined)
  return (
    <div className="space-y-3">
      <Group title="Mobile Money" note="You’ll approve with your MoMo PIN on your phone. Each payment sends a fresh prompt.">
        {momo.map((m) => (
          <MethodRow key={m.id} mark={<PaymentMark method={m.method} />} title={m.label} detail={m.detail} selected={selected === m.id} error={errFor(m.id)} onClick={() => onSelect?.(m.id)} />
        ))}
        {addingNumber ? (
          <AddNumberForm phone={newNumber} />
        ) : (
          <MethodRow
            mark={
              <span className="flex size-9 items-center justify-center rounded-lg border border-dashed border-line text-dim">
                <Plus className="size-4" />
              </span>
            }
            title="Add a MoMo number"
            detail="MTN MoMo · Telecel Cash · AT Money"
            onClick={() => onSelect?.('new-momo')}
            trailing={<span />}
          />
        )}
      </Group>

      <Group
        title="Card"
        note={
          <>
            <ShieldCheck className="size-3.5 shrink-0" /> Visa / Mastercard. 3-D Secure may open your bank’s page to confirm.
          </>
        }
      >
        {cards.map((m) => (
          <MethodRow key={m.id} mark={<PaymentMark method="card" />} title={m.label} detail={m.detail} selected={selected === m.id} error={errFor(m.id)} onClick={() => onSelect?.(m.id)} />
        ))}
        <MethodRow
          mark={
            <span className="flex size-9 items-center justify-center rounded-lg border border-dashed border-line text-dim">
              <CreditCard className="size-4" />
            </span>
          }
          title="Add a card"
          detail="Charged in Ghana cedis"
          selected={selected === 'new-card'}
          onClick={() => onSelect?.('new-card')}
        />
      </Group>

      <Group
        title="Bitcoin · Lightning"
        badge={<BetaBadge />}
        note={
          <>
            <Zap className="size-3.5 shrink-0" /> Lightning only, no on-chain. Priced in cedis, quoted in sats for {RULES.checkoutHoldMinutes} minutes.
          </>
        }
      >
        <MethodRow mark={<PaymentMark method="lightning" />} title="Pay a Lightning invoice" detail="Scan or open in your wallet" selected={selected === 'lightning'} onClick={() => onSelect?.('lightning')} />
      </Group>
    </div>
  )
}

/** CTA label for the chosen method. */
export function payCta(selected: MethodChoice, amount: number) {
  if (selected === 'lightning') return 'Get Lightning invoice'
  if (selected.startsWith('momo') || selected === 'new-momo') return `Send ${cedis(amount)} prompt`
  return `Pay ${cedis(amount)}`
}

/* ───────────── Step list for async states ───────────── */

export type StepState = 'done' | 'active' | 'todo' | 'failed'

export function Steps({ steps }: { steps: { title: string; body?: ReactNode; state: StepState }[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-3 pb-4 last:pb-0">
          {i < steps.length - 1 && <span className={cx('absolute top-7 left-[13px] h-[calc(100%-24px)] w-0.5', s.state === 'done' ? 'bg-success' : 'bg-line')} />}
          <span className="relative mt-0.5 flex size-7 shrink-0 items-center justify-center">
            {s.state === 'active' && <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />}
            <span
              className={cx(
                'relative flex size-7 items-center justify-center rounded-full text-xs font-bold',
                s.state === 'done' && 'bg-success text-bg',
                s.state === 'active' && 'bg-accent text-on-accent',
                s.state === 'todo' && 'border-2 border-line text-faint',
                s.state === 'failed' && 'bg-danger text-white',
              )}
            >
              {s.state === 'done' ? <Check className="size-4" strokeWidth={3} /> : s.state === 'failed' ? '!' : i + 1}
            </span>
          </span>
          <div className="min-w-0 pt-0.5">
            <div className={cx('font-semibold', s.state === 'todo' && 'text-dim')}>{s.title}</div>
            {s.body && <div className="text-sm text-dim">{s.body}</div>}
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Big countdown with a draining bar. */
export function CountdownBar({ left, total, label, tone = 'accent' }: { left: number; total: number; label: string; tone?: 'accent' | 'warning' }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-dim">{label}</span>
        <b className={cx('tabular-nums', left < 30 && 'text-danger')}>{mmss(left)}</b>
      </div>
      <ProgressBar value={left} max={total} tone={left < 30 ? 'warning' : tone} className="mt-1.5" />
    </div>
  )
}

export function ChargeNote() {
  return (
    <p className="px-1 text-xs leading-relaxed text-faint">
      Charged now in Ghana cedis. Deposits can’t be held on a card or MoMo wallet in Ghana, so we take payment now and refund under the venue’s policy.
    </p>
  )
}

export function SecondaryActions({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>
}

