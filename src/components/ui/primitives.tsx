import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { useDataSaver } from '@/brands/BrandContext'
import { cx, initials } from '@/lib/format'

/* ───────────────────────── Buttons ───────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export function Button({
  variant = 'primary',
  size = 'md',
  block,
  icon,
  iconRight,
  loading,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  loading?: boolean
}) {
  const v: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-on-accent hover:brightness-110',
    secondary: 'bg-surface-2 text-text border border-line hover:border-dim',
    ghost: 'text-text hover:bg-surface-2',
    whatsapp: 'bg-whatsapp text-[#06260f] hover:brightness-105',
    danger: 'bg-transparent text-danger border border-danger/50 hover:bg-danger/10',
  }
  const s: Record<ButtonSize, string> = {
    sm: 'h-9 px-3.5 text-sm gap-1.5',
    md: 'h-11 px-5 text-[15px] gap-2',
    lg: 'h-14 px-6 text-base gap-2.5',
  }
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center rounded-control font-semibold transition select-none',
        'disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]',
        v[variant],
        s[size],
        block && 'w-full',
        className,
      )}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : icon}
      {children}
      {iconRight}
    </button>
  )
}

export function IconButton({
  label,
  children,
  className,
  tone = 'surface',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: 'surface' | 'glass' | 'plain' }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full transition active:scale-95',
        tone === 'surface' && 'bg-surface-2 text-text',
        tone === 'glass' && 'bg-black/40 text-white backdrop-blur-md',
        tone === 'plain' && 'text-text',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ───────────────────────── Chips & badges ───────────────────────── */

export function Chip({
  selected,
  icon,
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean; icon?: ReactNode }) {
  return (
    <button
      aria-pressed={selected}
      className={cx(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-control border px-3.5 text-sm font-medium transition',
        selected ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface text-text hover:border-dim',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'live' | 'glass'

export function Badge({ tone = 'neutral', children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  const t: Record<BadgeTone, string> = {
    neutral: 'bg-surface-2 text-dim',
    accent: 'bg-accent text-on-accent',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-danger/15 text-danger',
    live: 'bg-accent-3 text-white',
    glass: 'bg-black/50 text-white backdrop-blur-md',
  }
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap', t[tone], className)}>
      {children}
    </span>
  )
}

/* ───────────────────────── Surfaces ───────────────────────── */

export function Card({ className, children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cx('rounded-card border border-line bg-surface', onClick && 'cursor-pointer active:scale-[0.99] transition', className)}
    >
      {children}
    </div>
  )
}

export function SectionHeader({ title, action, onAction, className }: { title: string; action?: string; onAction?: () => void; className?: string }) {
  return (
    <div className={cx('flex items-end justify-between px-5 pb-3', className)}>
      <h2 className="display text-xl">{title}</h2>
      {action && (
        <button onClick={onAction} className="text-sm font-semibold text-accent">
          {action}
        </button>
      )}
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cx('border-0 border-t border-line', className)} />
}

export function ListRow({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  className?: string
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className={cx('flex w-full items-center gap-3 py-3 text-left', className)}>
      {icon && <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-dim">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{title}</span>
        {subtitle && <span className="block truncate text-sm text-dim">{subtitle}</span>}
      </span>
      {trailing}
    </Tag>
  )
}

/* ───────────────────────── Media ───────────────────────── */

/**
 * Data-saver-aware image. With data saver on (or before load), shows the
 * brand gradient instead of downloading the photo — a few hundred bytes of CSS
 * instead of ~30 KB per card.
 */
export function Img({ src, alt, className, rounded = true }: { src: string; alt: string; className?: string; rounded?: boolean }) {
  const dataSaver = useDataSaver()
  const [failed, setFailed] = useState(false)
  return (
    <div className={cx(!className?.includes('absolute') && 'relative', 'overflow-hidden bg-surface-2', rounded && 'rounded-card', className)} style={{ backgroundImage: 'var(--placeholder)' }}>
      {!dataSaver && !failed && (
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />
      )}
      {(dataSaver || failed) && (
        <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white/80">
          <ImageOff className="size-3" /> {failed ? 'Offline' : 'Data saver'}
        </span>
      )}
    </div>
  )
}

export function Avatar({ name, src, size = 40, ring }: { name: string; src?: string; size?: number; ring?: boolean }) {
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return (
    <span
      className={cx('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white', ring && 'ring-2 ring-bg')}
      style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${hue} 45% 38%)` }}
      aria-label={name}
    >
      {src ? <img src={src} alt="" className="size-full object-cover" /> : initials(name)}
    </span>
  )
}

export function AvatarStack({ names, max = 4, size = 28 }: { names: string[]; max?: number; size?: number }) {
  const extra = names.length - max
  return (
    <span className="inline-flex items-center">
      {names.slice(0, max).map((n, i) => (
        <span key={n} style={{ marginLeft: i ? -size * 0.3 : 0 }}>
          <Avatar name={n} size={size} ring />
        </span>
      ))}
      {extra > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-dim ring-2 ring-bg"
          style={{ width: size, height: size, marginLeft: -size * 0.3 }}
        >
          +{extra}
        </span>
      )}
    </span>
  )
}

/* ───────────────────────── Inputs ───────────────────────── */

export function TextField({
  label,
  hint,
  error,
  prefix,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string; prefix?: ReactNode }) {
  return (
    <label className={cx('block', className)}>
      {label && <span className="mb-1.5 block text-sm font-medium text-dim">{label}</span>}
      <span
        className={cx(
          'flex h-13 items-center gap-2 rounded-control border bg-surface px-4 focus-within:border-accent',
          error ? 'border-danger' : 'border-line',
        )}
      >
        {prefix && <span className="shrink-0 text-dim">{prefix}</span>}
        <input className="h-full min-w-0 flex-1 bg-transparent text-base text-text outline-none placeholder:text-faint" {...rest} />
      </span>
      {(error || hint) && <span className={cx('mt-1.5 block text-xs', error ? 'text-danger' : 'text-faint')}>{error ?? hint}</span>}
    </label>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: ReactNode }[]
  value: T
  onChange?: (v: T) => void
  className?: string
}) {
  return (
    <div role="tablist" className={cx('flex rounded-control bg-surface-2 p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange?.(o.value)}
          className={cx(
            'flex h-9 flex-1 items-center justify-center gap-1.5 rounded-control text-sm font-semibold transition',
            value === o.value ? 'bg-bg text-text shadow' : 'text-dim',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Stepper({ value, min = 0, max = 99, onChange, size = 'md' }: { value: number; min?: number; max?: number; onChange?: (v: number) => void; size?: 'sm' | 'md' }) {
  const b = size === 'sm' ? 'size-8 text-lg' : 'size-10 text-xl'
  return (
    <span className="inline-flex items-center gap-1 rounded-control border border-line bg-surface">
      <button aria-label="Decrease" disabled={value <= min} onClick={() => onChange?.(value - 1)} className={cx(b, 'rounded-control text-text disabled:opacity-30')}>
        −
      </button>
      <span className="min-w-6 text-center font-semibold tabular-nums">{value}</span>
      <button aria-label="Increase" disabled={value >= max} onClick={() => onChange?.(value + 1)} className={cx(b, 'rounded-control text-accent disabled:opacity-30')}>
        +
      </button>
    </span>
  )
}

export function ProgressBar({ value, max, tone = 'accent', className }: { value: number; max: number; tone?: 'accent' | 'success' | 'warning'; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={cx('h-2 overflow-hidden rounded-full bg-surface-2', className)} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div
        className={cx('h-full rounded-full transition-all duration-500', tone === 'accent' && 'bg-accent', tone === 'success' && 'bg-success', tone === 'warning' && 'bg-warning')}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('animate-pulse rounded-card bg-surface-2', className)} />
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange?: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange?.(!checked)}
      className={cx('relative h-7 w-12 shrink-0 rounded-full transition', checked ? 'bg-accent' : 'bg-surface-2 border border-line')}
    >
      <span className={cx('absolute top-0.5 size-6 rounded-full bg-white shadow transition-all', checked ? 'left-5.5' : 'left-0.5')} />
    </button>
  )
}
