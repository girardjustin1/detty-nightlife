import type { ReactNode } from 'react'
import { Bell, CalendarDays, ChevronDown, ClipboardList, Ellipsis, Moon, ScanLine, WifiOff } from 'lucide-react'
import { Logo, StatusBar } from '@/components/app/chrome'
import { IconButton, ProgressBar } from '@/components/ui/primitives'
import { cx } from '@/lib/format'
import type { PayState, ResStatus } from './promoterData'
import { tonightEvent, venue } from './promoterData'

/** Compact button sizing for dense rows (pairs with Button size="sm"). */
export const tight = 'h-8 px-3 text-[13px]'

export type PromoterTab = 'tonight' | 'bookings' | 'door' | 'events' | 'more'

/** The partner app's own tab bar. Badges are counts that need action. */
export function PromoterTabBar({ active, badges = {} }: { active: PromoterTab; badges?: Partial<Record<PromoterTab, number>> }) {
  const items: { id: PromoterTab; label: string; icon: ReactNode }[] = [
    { id: 'tonight', label: 'Tonight', icon: <Moon className="size-[22px]" /> },
    { id: 'bookings', label: 'Bookings', icon: <ClipboardList className="size-[22px]" /> },
    { id: 'door', label: 'Door', icon: <ScanLine className="size-[22px]" /> },
    { id: 'events', label: 'Events', icon: <CalendarDays className="size-[22px]" /> },
    { id: 'more', label: 'More', icon: <Ellipsis className="size-[22px]" /> },
  ]
  return (
    <nav className="z-20 flex shrink-0 border-t border-line bg-surface/95 px-1 pt-1.5 pb-6 backdrop-blur">
      {items.map((t) => (
        <button
          key={t.id}
          aria-current={active === t.id ? 'page' : undefined}
          className={cx('relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[10.5px] font-semibold', active === t.id ? 'text-accent' : 'text-faint')}
        >
          {active === t.id && <span className="absolute -top-1.5 h-0.5 w-8 rounded-full bg-accent" />}
          {t.icon}
          {t.label}
          {!!badges[t.id] && (
            <span className="absolute top-0 right-[calc(50%-20px)] flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-3 px-1 text-[10px] font-bold text-white">
              {badges[t.id]}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}

/** Logo + "Partner" tag. */
export function PartnerLogo({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <Logo className="h-6 w-auto" />
      <span className="rounded-[4px] border border-accent/60 px-1.5 py-px text-[10px] font-bold tracking-[0.12em] text-accent uppercase">Partner</span>
    </span>
  )
}

/**
 * Top of every tab screen: logo + Partner tag, venue/night switcher, alerts.
 * `title` renders a compact page title under it.
 */
export function PromoterHeader({
  title,
  trailing,
  offline,
  children,
  alerts = 3,
  night = true,
}: {
  title?: ReactNode
  trailing?: ReactNode
  offline?: boolean
  children?: ReactNode
  alerts?: number
  night?: boolean
}) {
  return (
    <div className="shrink-0 border-b border-line bg-bg">
      <StatusBar />
      {offline && <OfflineBanner />}
      <div className="flex items-center justify-between gap-2 px-4 pt-0.5 pb-2">
        <PartnerLogo />
        <div className="flex items-center gap-1.5">
          {trailing}
          <IconButton label="Alerts" className="relative size-9">
            <Bell className="size-[18px]" />
            {alerts > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent-3 ring-2 ring-surface-2" />}
          </IconButton>
        </div>
      </div>
      {night && (
        <button className="mx-4 mb-2 flex w-[calc(100%-2rem)] items-center gap-2 rounded-control border border-line bg-surface px-3 py-1.5 text-left">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[13px]">
            <b>{venue.name}</b> <span className="text-dim">· {tonightEvent.title} · Live</span>
          </span>
          <ChevronDown className="size-4 text-dim" />
        </button>
      )}
      {title && <h1 className="display px-4 pt-1 pb-2.5 text-2xl">{title}</h1>}
      {children}
    </div>
  )
}

export function OfflineBanner({ pending = 7 }: { pending?: number }) {
  return (
    <div className="flex items-center justify-center gap-2 bg-warning px-4 py-1.5 text-xs font-semibold text-black">
      <WifiOff className="size-3.5" /> Offline · {pending} scans saved, will sync
    </div>
  )
}

/** Dense KPI tile. */
export function Kpi({
  label,
  value,
  sub,
  progress,
  tone = 'accent',
  icon,
  className,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  progress?: { value: number; max: number }
  tone?: 'accent' | 'success' | 'warning'
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('rounded-card border border-line bg-surface p-3', className)}>
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-wider text-faint uppercase">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-[22px] leading-tight font-bold tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 truncate text-xs text-dim">{sub}</div>}
      {progress && <ProgressBar value={progress.value} max={progress.max} tone={tone} className="mt-2 h-1.5" />}
    </div>
  )
}

/** Small uppercase section label used across the dense screens. */
export function Label({ children, action, className }: { children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex items-center justify-between px-4 pt-5 pb-2', className)}>
      <h2 className="text-[11px] font-bold tracking-[0.14em] text-faint uppercase">{children}</h2>
      {action && <span className="text-[13px] font-semibold text-accent">{action}</span>}
    </div>
  )
}

const statusMeta: Record<ResStatus, { label: string; cls: string }> = {
  arrived: { label: 'Arrived', cls: 'bg-success/15 text-success' },
  booked: { label: 'Booked', cls: 'bg-surface-2 text-dim' },
  late: { label: 'Late', cls: 'bg-danger/15 text-danger' },
  held: { label: 'Held', cls: 'bg-warning/15 text-warning' },
  cancelled: { label: 'Cancelled', cls: 'bg-surface-2 text-faint line-through' },
  'no-show': { label: 'No-show', cls: 'bg-danger/10 text-danger' },
}

export function StatusPill({ status, className }: { status: ResStatus; className?: string }) {
  const m = statusMeta[status]
  return <span className={cx('inline-flex items-center rounded-[5px] px-1.5 py-px text-[11px] font-bold whitespace-nowrap', m.cls, className)}>{m.label}</span>
}

const payMeta: Record<PayState, { label: string; cls: string }> = {
  'deposit-paid': { label: 'Deposit paid', cls: 'text-dim' },
  'paid-in-full': { label: 'Paid in full', cls: 'text-success' },
  'momo-failed': { label: 'MoMo failed', cls: 'text-danger' },
  'awaiting-momo': { label: 'Awaiting MoMo', cls: 'text-warning' },
  'balance-due': { label: 'Balance due', cls: 'text-warning' },
}

export function PayLabel({ pay, className }: { pay: PayState; className?: string }) {
  const m = payMeta[pay]
  return <span className={cx('text-xs font-semibold whitespace-nowrap', m.cls, className)}>{m.label}</span>
}

/** Table label chip, e.g. "B3", tinted by status. */
export function TableChip({ id, status }: { id: string; status?: ResStatus | 'free' }) {
  const tone =
    status === 'arrived'
      ? 'border-success/60 text-success'
      : status === 'late'
        ? 'border-danger/60 text-danger'
        : status === 'held'
          ? 'border-warning/60 border-dashed text-warning'
          : status === 'free'
            ? 'border-accent/60 text-accent'
            : 'border-line text-text'
  return <span className={cx('inline-flex h-9 w-11 shrink-0 items-center justify-center rounded-[8px] border-2 bg-surface-2 text-sm font-extrabold', tone)}>{id}</span>
}

/** Key–value row for dense detail panes. */
export function Fact({ k, v, className }: { k: ReactNode; v: ReactNode; className?: string }) {
  return (
    <div className={cx('flex items-baseline justify-between gap-3 py-1.5 text-sm', className)}>
      <span className="text-dim">{k}</span>
      <span className="text-right font-semibold tabular-nums">{v}</span>
    </div>
  )
}
