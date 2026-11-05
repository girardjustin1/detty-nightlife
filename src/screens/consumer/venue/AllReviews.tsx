import { useState } from 'react'
import { ArrowUpDown, Check, MessageSquareText } from 'lucide-react'
import { venueById } from '@/data/fixtures'
import { cx } from '@/lib/format'
import { AppBar, BottomBar, Screen, Sheet } from '@/components/app/chrome'
import { Button, Chip } from '@/components/ui/primitives'
import { RatingSummary, ReviewCard } from './parts'
import { extrasForVenue, reviewTotal } from './venueData'

export type ReviewSort = 'recent' | 'highest' | 'lowest'
export type ReviewFilter = 'all' | 'photos' | 'tables' | 'tickets'

const sortLabel: Record<ReviewSort, string> = { recent: 'Most recent', highest: 'Highest rated', lowest: 'Lowest rated' }

/** Full reviews page (OpenTable): summary, sort sheet, filter chips, review cards with venue replies. */
export function AllReviews({
  venueId = 'vault',
  sort: initialSort = 'recent',
  filter: initialFilter = 'all',
  sortSheet = false,
}: {
  venueId?: string
  sort?: ReviewSort
  filter?: ReviewFilter
  /** Show the sort sheet open. */
  sortSheet?: boolean
}) {
  const venue = venueById(venueId)
  const x = extrasForVenue(venueId)
  const [sort, setSort] = useState(initialSort)
  const [filter, setFilter] = useState(initialFilter)
  const [sheet, setSheet] = useState(sortSheet)

  const list = x.reviews
    .filter((r) => filter === 'all' || (filter === 'photos' ? !!r.photos?.length : filter === 'tickets' ? r.visit.startsWith('Tickets') : !r.visit.startsWith('Tickets')))
    .sort((a, b) => (sort === 'recent' ? b.date.localeCompare(a.date) : sort === 'highest' ? b.rating - a.rating || b.date.localeCompare(a.date) : a.rating - b.rating || b.date.localeCompare(a.date)))

  const filters: [ReviewFilter, string][] = [
    ['all', 'All'],
    ['photos', 'Photos'],
    ...(venueId === 'tidal' ? [] : ([['tables', 'Tables']] as [ReviewFilter, string][])),
    ['tickets', 'Tickets'],
  ]

  return (
    <Screen
      header={<AppBar title="Reviews" subtitle={venue.name} />}
      footer={
        <BottomBar summary={<div className="text-xs leading-snug text-dim">Only guests who booked through the app can review — so every review is a real visit.</div>}>
          <Button variant="secondary" size="sm" icon={<MessageSquareText className="size-4" />}>
            Write a review
          </Button>
        </BottomBar>
      }
    >
      <div className="px-5 pt-2 pb-4">
        <RatingSummary rating={venue.rating} distribution={x.distribution} sub={x.sub} />
      </div>
      <div className="sticky top-0 z-10 flex items-center gap-2 border-y border-line bg-bg/95 px-5 py-2.5 backdrop-blur">
        <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
          {filters.map(([k, l]) => (
            <Chip key={k} selected={filter === k} onClick={() => setFilter(k)} className="h-8 px-3">
              {l}
            </Chip>
          ))}
        </div>
        <button onClick={() => setSheet(true)} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent" aria-label={`Sort: ${sortLabel[sort]}`}>
          <ArrowUpDown className="size-4" />
          {sort === 'recent' ? 'Recent' : sort === 'highest' ? 'Highest' : 'Lowest'}
        </button>
      </div>
      <div className="px-5 pt-1 text-xs text-faint">
        Showing {list.length} of {reviewTotal(x).toLocaleString()} · {sortLabel[sort].toLowerCase()}
      </div>
      {list.length ? (
        <div className="divide-y divide-line px-5 pb-6">
          {list.map((r) => (
            <ReviewCard key={r.id} review={r} venueName={venue.name} />
          ))}
        </div>
      ) : (
        <div className="px-8 py-14 text-center">
          <div className="display text-xl">No reviews like that yet</div>
          <p className="mt-2 text-sm text-dim">Try another filter — or be the first after your night out.</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => setFilter('all')}>
            Show all reviews
          </Button>
        </div>
      )}

      <Sheet open={sheet} title="Sort reviews" onClose={() => setSheet(false)}>
        <div className="divide-y divide-line pb-4">
          {(Object.keys(sortLabel) as ReviewSort[]).map((k) => (
            <button
              key={k}
              onClick={() => {
                setSort(k)
                setSheet(false)
              }}
              className={cx('flex w-full items-center justify-between py-4 text-left', sort === k && 'font-semibold')}
            >
              {sortLabel[k]}
              {sort === k && <Check className="size-5 text-accent" />}
            </button>
          ))}
        </div>
      </Sheet>
    </Screen>
  )
}
