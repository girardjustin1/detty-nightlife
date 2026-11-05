import type { ReactNode } from 'react'
import { ChevronLeft, Compass, Ticket, Search, User, X } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { cx } from '@/lib/format'
import { IconButton } from '@/components/ui/primitives'

/**
 * A screen: fills the phone frame, scrolls its body, keeps optional header,
 * bottom CTA and tab bar fixed. Every screen story renders exactly one.
 */
export function Screen({
  header,
  footer,
  tabBar,
  children,
  className,
  bodyClassName,
}: {
  header?: ReactNode
  footer?: ReactNode
  tabBar?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div className={cx('relative flex h-full flex-col bg-bg text-text', className)}>
      {header}
      <div className={cx('no-scrollbar min-h-0 flex-1 overflow-y-auto', bodyClassName)}>{children}</div>
      {footer}
      {tabBar}
    </div>
  )
}

export function StatusBar({ tone = 'default' }: { tone?: 'default' | 'overlay' }) {
  return (
    <div className={cx('flex h-11 shrink-0 items-center justify-between px-7 text-[13px] font-semibold', tone === 'overlay' ? 'absolute inset-x-0 top-0 z-30 text-white' : 'text-text')}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5 text-[11px]">
        <span>4G</span>
        <span className="flex items-end gap-px">
          {[4, 6, 8, 10].map((h, i) => (
            <span key={h} className={cx('w-[3px] rounded-sm bg-current', i === 3 && 'opacity-30')} style={{ height: h }} />
          ))}
        </span>
        <span className="ml-1 inline-block h-[11px] w-[22px] rounded-[3px] border border-current p-px">
          <span className="block h-full w-3/5 rounded-[1px] bg-current" />
        </span>
      </span>
    </div>
  )
}

export function AppBar({
  title,
  subtitle,
  onBack,
  onClose,
  trailing,
  transparent,
  large,
}: {
  title?: ReactNode
  subtitle?: ReactNode
  onBack?: () => void
  onClose?: () => void
  trailing?: ReactNode
  transparent?: boolean
  large?: boolean
}) {
  const back = onBack ?? (() => {})
  return (
    <div className={cx('z-20 shrink-0', transparent ? 'absolute inset-x-0 top-0' : 'bg-bg')}>
      <StatusBar tone={transparent ? 'overlay' : 'default'} />
      <div className="flex h-12 items-center gap-2 px-3">
        {onClose ? (
          <IconButton label="Close" tone={transparent ? 'glass' : 'plain'} onClick={onClose}>
            <X className="size-5" />
          </IconButton>
        ) : (
          <IconButton label="Back" tone={transparent ? 'glass' : 'plain'} onClick={back}>
            <ChevronLeft className="size-6" />
          </IconButton>
        )}
        {!large && (
          <div className="min-w-0 flex-1 text-center">
            {title && <div className="truncate text-[15px] font-semibold">{title}</div>}
            {subtitle && <div className="truncate text-xs text-dim">{subtitle}</div>}
          </div>
        )}
        {large && <div className="flex-1" />}
        <div className="flex min-w-10 justify-end gap-2">{trailing}</div>
      </div>
      {large && title && <h1 className="display px-5 pt-1 pb-3 text-3xl">{title}</h1>}
    </div>
  )
}

export type Tab = 'discover' | 'search' | 'bookings' | 'profile'

export function TabBar({ active, onChange, bookingsBadge }: { active: Tab; onChange?: (t: Tab) => void; bookingsBadge?: number }) {
  const items: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: 'discover', label: 'Discover', icon: <Compass className="size-6" /> },
    { id: 'search', label: 'Search', icon: <Search className="size-6" /> },
    { id: 'bookings', label: 'Bookings', icon: <Ticket className="size-6" /> },
    { id: 'profile', label: 'Profile', icon: <User className="size-6" /> },
  ]
  return (
    <nav className="z-20 flex shrink-0 border-t border-line bg-bg/95 px-2 pt-1.5 pb-6 backdrop-blur">
      {items.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange?.(t.id)}
          aria-current={active === t.id ? 'page' : undefined}
          className={cx('relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium', active === t.id ? 'text-accent' : 'text-faint')}
        >
          {t.icon}
          {t.label}
          {t.id === 'bookings' && !!bookingsBadge && (
            <span className="absolute top-0 right-[calc(50%-20px)] flex size-4.5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-on-accent">
              {bookingsBadge}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}

/** Sticky bottom action area. `summary` sits left of the button (price context). */
export function BottomBar({ summary, children, className }: { summary?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cx('z-20 shrink-0 border-t border-line bg-bg/95 px-5 pt-3 pb-8 backdrop-blur', className)}>
      <div className="flex items-center gap-4">
        {summary && <div className="min-w-0 flex-1">{summary}</div>}
        <div className={cx(summary ? 'shrink-0' : 'flex-1')}>{children}</div>
      </div>
    </div>
  )
}

/** Bottom sheet rendered inside the phone frame (static for stories). */
export function Sheet({ title, children, onClose, open = true, footer }: { title?: ReactNode; children: ReactNode; onClose?: () => void; open?: boolean; footer?: ReactNode }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button aria-label="Close sheet" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative max-h-[88%] overflow-hidden rounded-t-[28px] border-t border-line bg-surface">
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line" />
        {title && (
          <div className="flex items-center justify-between px-5 pt-3 pb-2">
            <h3 className="display text-xl">{title}</h3>
            {onClose && (
              <IconButton label="Close" onClick={onClose}>
                <X className="size-5" />
              </IconButton>
            )}
          </div>
        )}
        <div className="no-scrollbar max-h-[60vh] overflow-y-auto px-5 pb-4">{children}</div>
        {footer && <div className="border-t border-line px-5 pt-3 pb-8">{footer}</div>}
      </div>
    </div>
  )
}

export function Logo({ variant = 'lockup', className }: { variant?: 'lockup' | 'mark' | 'appIcon'; className?: string }) {
  const brand = useBrand()
  return <img src={brand.logo[variant]} alt={brand.name} className={cx('block', className)} />
}

/** Thin banner shown when connectivity is poor. */
export function NetworkBanner({ state }: { state: 'offline' | 'slow' }) {
  return (
    <div className={cx('flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-semibold', state === 'offline' ? 'bg-danger text-white' : 'bg-warning text-black')}>
      {state === 'offline' ? 'You’re offline — tickets and QR codes still work' : 'Slow connection — data saver is on'}
    </div>
  )
}
