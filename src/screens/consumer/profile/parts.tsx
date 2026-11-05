import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cx } from '@/lib/format'

/* Local settings-list pieces for the Profile screens. */

export function Group({ title, children, footer, className }: { title?: string; children: ReactNode; footer?: ReactNode; className?: string }) {
  return (
    <section className={cx('px-5 pb-6', className)}>
      {title && <h2 className="mb-2 px-1 text-xs font-semibold tracking-wider text-faint uppercase">{title}</h2>}
      <div className="divide-y divide-line rounded-card border border-line bg-surface px-4">{children}</div>
      {footer && <p className="mt-2 px-1 text-xs text-faint">{footer}</p>}
    </section>
  )
}

export function Row({
  icon,
  title,
  subtitle,
  value,
  trailing,
  chevron,
  danger,
  onClick,
}: {
  icon?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  /** Short right-aligned value, e.g. "English". */
  value?: ReactNode
  trailing?: ReactNode
  chevron?: boolean
  danger?: boolean
  onClick?: () => void
}) {
  const Tag = onClick || chevron ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className="flex w-full items-center gap-3 py-3.5 text-left">
      {icon && <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-full', danger ? 'bg-danger/15 text-danger' : 'bg-surface-2 text-dim')}>{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className={cx('block font-medium', danger && 'text-danger')}>{title}</span>
        {subtitle && <span className="block text-sm text-dim">{subtitle}</span>}
      </span>
      {value && <span className="shrink-0 text-sm text-dim">{value}</span>}
      {trailing}
      {chevron && <ChevronRight className="size-5 shrink-0 text-faint" />}
    </Tag>
  )
}
