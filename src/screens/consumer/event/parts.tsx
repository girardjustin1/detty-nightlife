import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronRight, Copy, MessageCircle, Navigation, Pause, Play } from 'lucide-react'
import type { Venue } from '@/data/types'
import { useBrand, useDataSaver } from '@/brands/BrandContext'
import { BOOKING_WHATSAPP, whatsappLink } from '@/config/contact'
import { cx } from '@/lib/format'
import { Button, Card } from '@/components/ui/primitives'
import { AccraMap } from '../discover/AccraMap'

/** OpenTable / SeatGeek-style fact row: icon, label, value that may wrap. */
export function InfoRow({ icon, label, children, className }: { icon: ReactNode; label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx('flex gap-3 py-3', className)}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-dim">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold tracking-wide text-faint uppercase">{label}</div>
        <div className="mt-0.5 text-[15px] leading-snug">{children}</div>
      </div>
    </div>
  )
}

/**
 * 30-second preview stub (DICE "Top track"). Never autoloads: audio is only
 * fetched on tap, and with data saver on the button states the size first.
 */
export function TrackPreview({ title, kb, playing: initial = false }: { title: string; kb: number; playing?: boolean }) {
  const dataSaver = useDataSaver()
  const [playing, setPlaying] = useState(initial)
  return (
    <button
      onClick={() => setPlaying(!playing)}
      className={cx('flex w-full items-center gap-2.5 rounded-control border px-2.5 py-1.5 text-left transition', playing ? 'border-accent bg-accent/10' : 'border-line bg-surface')}
      aria-label={playing ? `Pause ${title}` : `Play 30 second preview of ${title}`}
    >
      <span className={cx('flex size-7 shrink-0 items-center justify-center rounded-full', playing ? 'bg-accent text-on-accent' : 'bg-surface-2 text-text')}>
        {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 translate-x-px" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        {playing ? (
          <span className="mt-1 flex h-2.5 items-end gap-[2px]" aria-hidden>
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} className={cx('w-[3px] rounded-sm', i < 9 ? 'bg-accent' : 'bg-line')} style={{ height: `${30 + ((i * 37) % 70)}%` }} />
            ))}
          </span>
        ) : (
          <span className="block text-xs text-dim">{dataSaver ? `Tap to load · ${kb} KB` : '30s preview'}</span>
        )}
      </span>
      <span className="shrink-0 text-xs text-faint tabular-nums">{playing ? '0:09' : '0:30'}</span>
    </button>
  )
}

/** Location card with the in-app SVG map (no tiles, no data) and hand-off to the phone's maps app. */
export function LocationCard({ venue, note }: { venue: Venue; note?: ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[2/1]">
        <AccraMap focus={venue.id} zoom={2.4} pins={[{ id: venue.id, label: venue.name, selected: true }]} />
        <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur">Drawn in-app · no map data used</span>
      </div>
      <div className="p-4">
        <div className="font-semibold">{venue.name}</div>
        <div className="text-sm text-dim">{venue.address}</div>
        {note && <div className="mt-1 text-sm text-dim">{note}</div>}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" icon={<Navigation className="size-4" />}>
            Directions
          </Button>
          <Button variant="secondary" size="sm" icon={<Copy className="size-4" />}>
            Copy address
          </Button>
        </div>
      </div>
    </Card>
  )
}

/** Five-step energy meter for the Music & vibe block. */
export function EnergyMeter({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-end gap-1" aria-label={`Energy ${value} of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={cx('w-2 rounded-sm', n <= value ? 'bg-accent' : 'bg-surface-2')} style={{ height: 6 + n * 3 }} />
        ))}
      </span>
      <span className="text-sm">{label}</span>
    </div>
  )
}

/**
 * The one booking line (src/config/contact.ts), shown under the brand name —
 * never a venue's or a person's. Opens WhatsApp with a prefilled message.
 */
export function WhatsAppRow({ message, className }: { message: string; className?: string }) {
  const brand = useBrand()
  return (
    <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={cx('flex items-center gap-3 py-3', className)}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp text-[#06260f]">
        <MessageCircle className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">Book or ask on WhatsApp</span>
        <span className="block truncate text-sm text-dim">
          {brand.name} · {BOOKING_WHATSAPP.display}
        </span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-faint" />
    </a>
  )
}
