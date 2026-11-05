import { Bell, MessageCircle, Share2 } from 'lucide-react'
import { events, venues } from '@/data/fixtures'
import type { Genre } from '@/data/types'
import { cedis } from '@/lib/format'
import { Screen } from '@/components/app/chrome'
import { DetailHeader, useScrollParent } from '../event/DetailHeader'
import { EventCard, priceLevel, Rating } from '@/components/app/domain'
import { Avatar, Badge, Button, Chip, IconButton, Img, SectionHeader, Skeleton } from '@/components/ui/primitives'
import { artists, genreCopy, tonightPrice, upcoming } from './discoverData'

/** "Amapiano in Accra": one genre, its nights, DJs and rooms. Entry from genre chips and Search. */
export function GenreLanding({ genre = 'Amapiano', alertsOn, loading }: { genre?: Genre; alertsOn?: boolean; loading?: boolean }) {
  const copy = genreCopy[genre] ?? {
    title: `${genre} in Accra`,
    blurb: `Every ${genre} night we know about in Accra, in one place.`,
    soundsLike: [],
    photo: `${import.meta.env.BASE_URL}img/detty-keyart.webp`,
  }
  const nights = upcoming(events.filter((e) => e.genres.includes(genre)))
  const rooms = venues.filter((v) => v.genres.includes(genre))
  const djs = artists.filter((a) => a.genres.includes(genre) && a.role !== 'Host' && upcoming(a.events).length > 0)
  const { ref, scrolled } = useScrollParent<HTMLDivElement>(220)
  const from = nights.reduce((m, e) => Math.min(m, e.ticketsFrom ?? Infinity), Infinity)

  return (
    <Screen
      header={
        <DetailHeader
          title={copy.title}
          solid={scrolled}
          trailing={(tone) => (
            <IconButton label="Share" tone={tone}>
              <Share2 className="size-5" />
            </IconButton>
          )}
        />
      }
    >
      <div ref={ref}>
        <div className="relative">
          <Img src={copy.photo} alt={copy.title} rounded={false} className="aspect-[5/4] w-full" />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-4 text-white">
            <Badge tone="glass">Genre</Badge>
            <h1 className="display mt-2 text-4xl">{copy.title}</h1>
            <div className="mt-1 text-sm text-white/80">
              {nights.length} {nights.length === 1 ? 'night' : 'nights'} coming up · {rooms.length} {rooms.length === 1 ? 'venue' : 'venues'}
              {Number.isFinite(from) && <> · tickets from {cedis(from)}</>}
            </div>
          </div>
        </div>

        <div className="px-5 pt-4 pb-5">
          <p className="text-[15px] leading-relaxed text-dim">{copy.blurb}</p>
          {copy.soundsLike.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {copy.soundsLike.map((s) => (
                <span key={s} className="rounded-full bg-surface-2 px-3 py-1 text-xs text-dim">
                  {s}
                </span>
              ))}
            </div>
          )}
          <Button variant={alertsOn ? 'secondary' : 'primary'} block className="mt-4" icon={alertsOn ? <Bell className="size-4" /> : <MessageCircle className="size-4" />}>
            {alertsOn ? `Alerts on · we’ll WhatsApp you new ${genre} nights` : `Get ${genre} alerts on WhatsApp`}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3 px-5">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <section className="pb-6">
              <SectionHeader title="Coming up" action={nights.length > 3 ? 'See all' : undefined} />
              {nights.length ? (
                <div className="divide-y divide-line px-5">
                  {nights.map((e) => (
                    <EventCard key={e.id} event={e} variant="row" />
                  ))}
                </div>
              ) : (
                <div className="mx-5 rounded-card border border-dashed border-line p-5 text-center">
                  <div className="font-semibold">No {genre} nights listed yet</div>
                  <p className="mt-1 text-sm text-dim">Promoters usually announce 1–2 weeks out. Turn on alerts and you’ll hear first.</p>
                </div>
              )}
            </section>

            {djs.length > 0 && (
              <section className="pb-6">
                <SectionHeader title={`${genre} DJs to know`} />
                <div className="no-scrollbar flex gap-4 overflow-x-auto px-5">
                  {djs.map((a) => (
                    <button key={a.name} className="flex w-20 shrink-0 flex-col items-center gap-1.5 text-center">
                      <Avatar name={a.name} size={64} />
                      <span className="line-clamp-2 text-xs leading-tight font-medium">{a.name}</span>
                      <span className="text-[11px] text-faint">{a.role}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="pb-8">
              <SectionHeader title={`Where to hear it`} />
              <div className="no-scrollbar flex gap-3 overflow-x-auto px-5">
                {rooms.map((v) => {
                  const p = tonightPrice(v)
                  return (
                    <button key={v.id} className="w-56 shrink-0 text-left">
                      <Img src={v.photo} alt={v.name} className="aspect-[4/3] w-full" />
                      <div className="mt-2 truncate font-semibold">{v.name}</div>
                      <div className="truncate text-sm text-dim">
                        {v.kind} · {v.area} · {priceLevel(v.priceLevel)}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-sm">
                        <Rating value={v.rating} />
                        {p.amount != null && (
                          <span className="truncate text-dim">
                            · {p.label} {cedis(p.amount)}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="px-5 pb-10">
              <div className="mb-2 text-sm font-semibold text-dim">Also try</div>
              <div className="flex flex-wrap gap-2">
                {(['Afro House', 'Gqom', 'Afrobeats', 'Highlife'] as Genre[])
                  .filter((g) => g !== genre)
                  .map((g) => (
                    <Chip key={g}>{g}</Chip>
                  ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Screen>
  )
}
