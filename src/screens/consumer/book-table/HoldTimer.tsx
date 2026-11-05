import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'
import { RULES } from '@/lib/pricing'
import { cx } from '@/lib/format'
import { Button, ProgressBar } from '@/components/ui/primitives'

const TOTAL = RULES.checkoutHoldMinutes * 60
/** Default draft state: 19 s into the hold → "9:41", matching the status-bar clock. */
export const HOLD_DEFAULT = TOTAL - 19

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/**
 * "Table held for 9:41". The table is held for RULES.checkoutHoldMinutes while the
 * guest reviews and pays (MoMo approval can take a minute). Used on review and pay.
 *   pill — compact, for the app bar
 *   bar  — full-width card with progress, for the top of review / pay
 */
export function HoldTimer({
  seconds = HOLD_DEFAULT,
  live,
  variant = 'pill',
  tableLabel,
  onRetry,
}: {
  seconds?: number
  /** Count down in real time (off by default so screenshots are stable). */
  live?: boolean
  variant?: 'pill' | 'bar'
  tableLabel?: string
  onRetry?: () => void
}) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => setLeft(seconds), [seconds])
  useEffect(() => {
    if (!live) return
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [live])

  const expired = left <= 0
  const low = !expired && left < 120
  const label = `${tableLabel ? `Table ${tableLabel}` : 'Table'} held for ${fmt(left)}`

  if (variant === 'pill') {
    return (
      <span
        role="timer"
        aria-label={expired ? 'Hold expired' : label}
        className={cx(
          'inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-sm font-semibold tabular-nums',
          expired ? 'bg-danger/15 text-danger' : low ? 'bg-warning/15 text-warning' : 'bg-surface-2 text-text',
        )}
      >
        <Timer className="size-4" />
        {expired ? 'Expired' : fmt(left)}
      </span>
    )
  }

  return (
    <div
      role="timer"
      aria-live={low ? 'polite' : 'off'}
      className={cx('rounded-card border p-3.5', expired ? 'border-danger/40 bg-danger/5' : low ? 'border-warning/40 bg-warning/5' : 'border-line bg-surface')}
    >
      <div className="flex items-center gap-2.5">
        <Timer className={cx('size-5 shrink-0', expired ? 'text-danger' : low ? 'text-warning' : 'text-accent')} />
        <div className="min-w-0 flex-1 text-sm">
          {expired ? (
            <b className="text-danger">Hold expired — {tableLabel ?? 'the table'} is back on the map</b>
          ) : (
            <>
              <b>{tableLabel ? `Table ${tableLabel}` : 'Table'} held for </b>
              <b className={cx('tabular-nums', low ? 'text-warning' : 'text-accent')}>{fmt(left)}</b>
            </>
          )}
          <div className="text-xs text-dim">
            {expired
              ? 'Your bottles and guests are saved. Grab it again if it’s still free.'
              : `Nobody else can book it for ${RULES.checkoutHoldMinutes} minutes while you pay.`}
          </div>
        </div>
        {expired && (
          <Button size="sm" onClick={onRetry}>
            Hold again
          </Button>
        )}
      </div>
      {!expired && <ProgressBar value={left} max={TOTAL} tone={low ? 'warning' : 'accent'} className="mt-2.5 h-1" />}
    </div>
  )
}
