import { Armchair, Ticket, Wine } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { events, venueById, venues } from '@/data/fixtures'
import { Logo, Screen, StatusBar } from '@/components/app/chrome'
import { Button, Img } from '@/components/ui/primitives'
import { cedis, dayShort, time } from '@/lib/format'
import type { AccraEvent } from '@/data/types'

const pills = [
  { icon: <Ticket className="size-3.5" />, label: 'Tickets' },
  { icon: <Armchair className="size-3.5" />, label: 'Tables' },
  { icon: <Wine className="size-3.5" />, label: 'Bottles' },
]

/**
 * First launch. One promise, one way in: your phone number.
 *
 * `stack` (default): the headline leads at the top; the key art drops to an
 * ambient backdrop cropped to the crowd; a fanned stack of real upcoming
 * nights fills the middle, so the first screen already shows the product.
 * `poster`: the original full-bleed key art with the headline at the bottom.
 */
export function Welcome({ onStart, variant = 'stack' }: { onStart?: () => void; variant?: 'stack' | 'poster' }) {
  return variant === 'poster' ? <PosterWelcome onStart={onStart} /> : <StackWelcome onStart={onStart} />
}

function StackWelcome({ onStart }: { onStart?: () => void }) {
  const brand = useBrand()
  const fan = [events[1], events[0], events[2]] // centre card = tonight
  const nights = events.filter((e) => e.startsAt < '2026-12-25').length

  return (
    <Screen bodyClassName="relative flex flex-col overflow-hidden">
      {/* Backdrop: crowd only, low and dim — supporting the headline, not competing with it. */}
      <div className="absolute inset-x-0 bottom-0 h-[64%]">
        <Img src={brand.keyArt} alt="" rounded={false} className="absolute inset-0 [&>img]:scale-110 [&>img]:object-[center_88%] [&>img]:opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/40 to-bg/95" />
      </div>
      <div
        className="pointer-events-none absolute -top-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 65%)' }}
      />

      <StatusBar />
      <div className="relative z-10 px-6 pt-2">
        <Logo className="h-8 w-auto" />
        <h1 className="display mt-6 text-[38px] leading-[1.02]">{brand.copy.welcomeTitle}</h1>
        <p className="mt-3 text-[15px] text-dim">{brand.copy.welcomeBody}</p>
      </div>

      {/* Fanned stack of real nights. */}
      <div className="relative z-10 mx-auto mt-5 h-[232px] w-full max-w-[360px]" aria-label="Upcoming nights">
        {fan.map((e, i) => (
          <FanCard key={e.id} event={e} position={(['left', 'centre', 'right'] as const)[i]} />
        ))}
      </div>
      <div className="relative z-10 mt-3 text-center text-xs font-semibold text-dim">
        <span className="mr-1.5 inline-block size-2 animate-pulse rounded-full bg-accent align-middle" />
        {nights} nights this week · {venues.length} venues in Accra
      </div>

      <div className="relative z-10 mt-auto px-6 pb-9">
        <div className="mb-4 flex justify-center gap-2">
          {pills.map((p) => (
            <span key={p.label} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              {p.icon}
              {p.label}
            </span>
          ))}
        </div>
        <Button size="lg" block onClick={onStart}>
          Get started
        </Button>
        <p className="mt-4 text-center text-sm text-dim">
          Been here before? <b className="text-text">Use the same number</b> to log in.
        </p>
      </div>
    </Screen>
  )
}

function FanCard({ event, position }: { event: AccraEvent; position: 'left' | 'centre' | 'right' }) {
  const venue = venueById(event.venueId)
  const from = Math.min(event.ticketsFrom ?? Infinity, event.tablesFrom ?? Infinity)
  const pos = {
    left: 'left-[4%] top-6 -rotate-[9deg] scale-[0.9] z-0',
    centre: 'left-1/2 -translate-x-1/2 top-0 z-10',
    right: 'right-[4%] top-6 rotate-[9deg] scale-[0.9] z-0',
  }[position]
  return (
    <div className={`absolute w-[150px] overflow-hidden rounded-card border border-line bg-surface shadow-2xl shadow-black/60 ${pos}`}>
      <div className="relative">
        <Img src={event.photo} alt={event.title} rounded={false} className="aspect-[4/5] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        {position === 'centre' && (
          <span className="absolute top-2 left-2 rounded-full bg-accent-3 px-2 py-0.5 text-[10px] font-bold text-white">Tonight</span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
          <div className="text-[10px] font-semibold tracking-wide text-white/75 uppercase">
            {dayShort(event.startsAt)} · {time(event.startsAt)}
          </div>
          <div className="display mt-0.5 text-[15px] leading-tight">{event.title}</div>
          <div className="mt-0.5 truncate text-[11px] text-white/75">{venue.name}</div>
        </div>
      </div>
      <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px]">
        <span className="text-dim">from</span>
        <b>{cedis(from)}</b>
      </div>
    </div>
  )
}

function PosterWelcome({ onStart }: { onStart?: () => void }) {
  const brand = useBrand()
  return (
    <Screen bodyClassName="relative flex flex-col">
      <Img src={brand.keyArt} alt="" rounded={false} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

      <StatusBar tone="overlay" />
      <div className="relative z-10 px-6 pt-14">
        <Logo className="h-9 w-auto" />
      </div>

      <div className="relative z-10 mt-auto px-6 pb-10 text-white">
        <div className="mb-4 flex gap-2">
          {pills.map((p) => (
            <span key={p.label} className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              {p.icon}
              {p.label}
            </span>
          ))}
        </div>
        <h1 className="display text-[40px] leading-[1.05]">{brand.copy.welcomeTitle}</h1>
        <p className="mt-3 text-base text-white/80">{brand.copy.welcomeBody}</p>
        <Button size="lg" block className="mt-7" onClick={onStart}>
          Get started
        </Button>
        <p className="mt-4 text-center text-sm text-white/70">
          Been here before? <b className="text-white">Use the same number</b> to log in.
        </p>
      </div>
    </Screen>
  )
}
