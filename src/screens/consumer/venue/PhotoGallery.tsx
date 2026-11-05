import { useState } from 'react'
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react'
import { useDataSaver } from '@/brands/BrandContext'
import { venueById } from '@/data/fixtures'
import { cx } from '@/lib/format'
import { AppBar, Screen, StatusBar } from '@/components/app/chrome'
import { Chip, IconButton, Img } from '@/components/ui/primitives'
import { extrasForVenue, type PhotoCategory } from './venueData'

type Filter = 'All' | PhotoCategory

/** "See all photos" from the venue hero: category chips, two-column grid, full-screen viewer. */
export function PhotoGallery({ venueId = 'vault', category = 'All', viewer }: { venueId?: string; category?: Filter; /** Index of the photo open in the viewer. */ viewer?: number }) {
  const venue = venueById(venueId)
  const x = extrasForVenue(venueId)
  const dataSaver = useDataSaver()
  const [filter, setFilter] = useState<Filter>(category)
  const [open, setOpen] = useState<number | undefined>(viewer)
  const list = x.photos.filter((p) => filter === 'All' || p.category === filter)
  const cats: Filter[] = ['All', 'Venue', 'Tables', 'Bottles', 'Crowd']

  return (
    <Screen
      header={
        <div className="shrink-0 bg-bg">
          <AppBar title={venue.name} subtitle={`${x.photos.length} photos`} />
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
            {cats.map((c) => {
              const n = c === 'All' ? x.photos.length : x.photos.filter((p) => p.category === c).length
              return (
                <Chip key={c} selected={filter === c} onClick={() => setFilter(c)} disabled={n === 0} className="disabled:opacity-40">
                  {c} <span className={cx('text-xs', filter === c ? 'opacity-70' : 'text-faint')}>{n}</span>
                </Chip>
              )
            })}
          </div>
        </div>
      }
    >
      {dataSaver && (
        <div className="mx-5 mb-3 flex items-center gap-2 rounded-card bg-surface-2 px-3 py-2.5 text-xs text-dim">
          <ImageOff className="size-4 shrink-0" /> Data saver is on — photos load one at a time when you tap them (about 60 KB each).
        </div>
      )}
      <div className="columns-2 gap-2 px-5 pb-8">
        {list.map((p, i) => (
          <button key={i} onClick={() => setOpen(i)} className="relative mb-2 block w-full break-inside-avoid text-left">
            <Img src={p.src} alt={p.caption} className={cx('w-full', p.tall ? 'aspect-[3/4]' : 'aspect-square')} />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-card bg-gradient-to-t from-black/60 to-transparent px-2.5 pt-6 pb-2 text-[11px] font-medium text-white">{p.caption}</span>
          </button>
        ))}
      </div>

      {open != null && list[open] && (
        <div className="absolute inset-0 z-50 flex flex-col bg-black text-white">
          <StatusBar tone="overlay" />
          <div className="flex items-center justify-between px-3 pt-11">
            <IconButton label="Close" tone="glass" onClick={() => setOpen(undefined)}>
              <X className="size-5" />
            </IconButton>
            <span className="text-sm font-semibold tabular-nums">
              {open + 1} of {list.length}
            </span>
            <span className="w-10" />
          </div>
          <div className="relative flex flex-1 items-center">
            <Img src={list[open].src} alt={list[open].caption} rounded={false} className="aspect-[4/5] w-full" />
            <IconButton label="Previous photo" tone="glass" className="absolute left-3" onClick={() => setOpen(Math.max(0, open - 1))} disabled={open === 0}>
              <ChevronLeft className="size-5" />
            </IconButton>
            <IconButton label="Next photo" tone="glass" className="absolute right-3" onClick={() => setOpen(Math.min(list.length - 1, open + 1))} disabled={open === list.length - 1}>
              <ChevronRight className="size-5" />
            </IconButton>
          </div>
          <div className="px-5 pt-3">
            <div className="font-semibold">{list[open].caption}</div>
            <div className="text-xs text-white/60">
              {list[open].category} · {list[open].by === 'Guest' ? 'Photo by a guest' : `Photo by ${venue.name}`}
            </div>
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pt-3 pb-8">
            {list.map((p, i) => (
              <button key={i} onClick={() => setOpen(i)} className={cx('shrink-0 rounded-lg ring-2 transition', i === open ? 'ring-white' : 'opacity-50 ring-transparent')}>
                <Img src={p.src} alt="" className="size-12 rounded-lg" />
              </button>
            ))}
          </div>
        </div>
      )}
    </Screen>
  )
}
