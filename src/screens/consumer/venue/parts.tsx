import { useState } from 'react'
import { MessageSquareReply, Star, ThumbsUp } from 'lucide-react'
import { cx } from '@/lib/format'
import { Avatar, Img, ProgressBar } from '@/components/ui/primitives'
import type { Review, SubRatings } from './venueData'

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} style={{ width: size, height: size }} className={cx(n <= Math.round(value) ? 'fill-accent-2 text-accent-2' : 'fill-surface-2 text-surface-2')} />
      ))}
    </span>
  )
}

const ago = (iso: string, now = '2026-12-18T14:00:00Z') => {
  const d = Math.round((Date.parse(now) - Date.parse(iso)) / 864e5)
  if (d < 1) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 14) return `${d} days ago`
  return `${Math.round(d / 7)} weeks ago`
}

/** OpenTable reviews header: overall, 5-bar distribution, nightlife sub-ratings. */
export function RatingSummary({ rating, distribution, sub }: { rating: number; distribution: number[]; sub: SubRatings }) {
  const total = distribution.reduce((a, b) => a + b, 0)
  return (
    <div>
      <div className="flex gap-5">
        <div className="shrink-0 text-center">
          <div className="display text-5xl">{rating.toFixed(1)}</div>
          <Stars value={rating} />
          <div className="mt-1 text-xs text-dim">{total.toLocaleString()} reviews</div>
        </div>
        <div className="flex-1 space-y-1">
          {distribution.map((n, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-2 text-dim tabular-nums">{5 - i}</span>
              <ProgressBar value={n} max={total} tone="accent" className="h-1.5 flex-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {(Object.keys(sub) as (keyof SubRatings)[]).map((k) => (
          <div key={k} className="rounded-card bg-surface-2 px-2 py-2.5 text-center">
            <div className="text-lg font-bold tabular-nums">{sub[k].toFixed(1)}</div>
            <div className="text-[11px] text-dim">{k}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReviewCard({ review, compact, venueName }: { review: Review; compact?: boolean; venueName: string }) {
  const [helpful, setHelpful] = useState(false)
  return (
    <article className="py-4">
      <div className="flex items-center gap-3">
        <Avatar name={review.author} size={36} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{review.author}</div>
          <div className="truncate text-xs text-dim">{review.visit}</div>
        </div>
        <div className="shrink-0 text-right">
          <Stars value={review.rating} size={13} />
          <div className="text-[11px] text-faint">{ago(review.date)}</div>
        </div>
      </div>
      {!compact && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-dim">
          {(Object.keys(review.sub) as (keyof SubRatings)[]).map((k) => (
            <span key={k}>
              {k} <b className="text-text">{review.sub[k]}</b>
            </span>
          ))}
        </div>
      )}
      <p className={cx('mt-2 text-[15px] leading-relaxed', compact && 'line-clamp-3')}>{review.text}</p>
      {!compact && review.photos && (
        <div className="mt-2 flex gap-2">
          {review.photos.map((p, i) => (
            <Img key={i} src={p} alt="Guest photo" className="size-20" />
          ))}
        </div>
      )}
      {!compact && review.reply && (
        <div className="mt-3 rounded-card bg-surface-2 px-3.5 py-2.5 text-sm">
          <div className="mb-0.5 flex items-center gap-1 text-xs font-semibold text-accent">
            <MessageSquareReply className="size-3.5" /> Reply from {venueName}
          </div>
          {review.reply}
        </div>
      )}
      {!compact && (
        <button onClick={() => setHelpful(!helpful)} className={cx('mt-3 inline-flex items-center gap-1.5 text-xs', helpful ? 'text-accent' : 'text-dim')}>
          <ThumbsUp className={cx('size-3.5', helpful && 'fill-current')} /> Helpful · {review.helpful + (helpful ? 1 : 0)}
        </button>
      )}
    </article>
  )
}
