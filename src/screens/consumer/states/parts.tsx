import type { ReactNode } from 'react'
import { cx } from '@/lib/format'

/** Centred full-screen state: icon, title, body, actions. Used by error, update and maintenance. */
export function StateBlock({
  icon,
  tone = 'neutral',
  title,
  children,
  actions,
  className,
}: {
  icon: ReactNode
  tone?: 'neutral' | 'danger' | 'warning' | 'accent'
  title: ReactNode
  children?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('flex min-h-full flex-col items-center justify-center px-8 py-10 text-center', className)}>
      <span
        className={cx(
          'flex size-20 items-center justify-center rounded-full',
          tone === 'neutral' && 'bg-surface-2 text-dim',
          tone === 'danger' && 'bg-danger/15 text-danger',
          tone === 'warning' && 'bg-warning/15 text-warning',
          tone === 'accent' && 'bg-accent text-on-accent',
        )}
      >
        {icon}
      </span>
      <h1 className="display mt-6 text-[28px] leading-tight">{title}</h1>
      {children && <div className="mt-3 space-y-3 text-[15px] text-dim">{children}</div>}
      {actions && <div className="mt-8 w-full space-y-2.5">{actions}</div>}
    </div>
  )
}
