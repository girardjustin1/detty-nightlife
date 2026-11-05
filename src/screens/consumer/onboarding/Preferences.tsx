import { useState } from 'react'
import { Feather, MapPin, Music2 } from 'lucide-react'
import type { Area, Genre } from '@/data/types'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Button, Chip, Toggle } from '@/components/ui/primitives'
import { StepProgress, Title, WhatsAppGlyph } from './parts'

const genreOptions: Genre[] = ['Afrobeats', 'Amapiano', 'Afro House', 'Hiplife', 'Highlife', 'Hip-Hop', 'R&B', 'Dancehall', 'Gqom', 'Live Band']
const areaOptions: Area[] = ['Osu', 'East Legon', 'Airport City', 'Labone', 'Cantonments', 'Labadi']

/** Skippable taste + settings step. Everything here can be changed later in Profile. */
export function Preferences({
  genres: initialGenres = [],
  areas: initialAreas = [],
  whatsAppUpdates: initialWa = true,
  dataSaver: initialSaver = false,
}: {
  genres?: Genre[]
  areas?: Area[]
  whatsAppUpdates?: boolean
  dataSaver?: boolean
}) {
  const [genres, setGenres] = useState(initialGenres)
  const [areas, setAreas] = useState(initialAreas)
  const [wa, setWa] = useState(initialWa)
  const [saver, setSaver] = useState(initialSaver)
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const picked = genres.length + areas.length

  return (
    <Screen
      header={
        <>
          <AppBar trailing={<button className="px-2 text-sm font-semibold text-dim">Skip</button>} />
          <StepProgress step={4} total={5} />
        </>
      }
      footer={
        <BottomBar>
          <Button block size="lg">
            {picked ? `Save ${picked} ${picked === 1 ? 'pick' : 'picks'}` : 'Continue'}
          </Button>
        </BottomBar>
      }
    >
      <Title body="We’ll put these nights first. Change them any time in Profile.">What’s your sound?</Title>

      <section className="px-5 pb-6">
        <h2 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-dim">
          <Music2 className="size-4" /> Genres
        </h2>
        <div className="flex flex-wrap gap-2">
          {genreOptions.map((g) => (
            <Chip key={g} selected={genres.includes(g)} onClick={() => setGenres(toggle(genres, g))}>
              {g}
            </Chip>
          ))}
        </div>
      </section>

      <section className="px-5 pb-6">
        <h2 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-dim">
          <MapPin className="size-4" /> Areas you go out in
        </h2>
        <div className="flex flex-wrap gap-2">
          {areaOptions.map((a) => (
            <Chip key={a} selected={areas.includes(a)} onClick={() => setAreas(toggle(areas, a))}>
              {a}
            </Chip>
          ))}
        </div>
      </section>

      <section className="mx-5 mb-8 divide-y divide-line rounded-card border border-line bg-surface px-4">
        <div className="flex items-center gap-3 py-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp">
            <WhatsAppGlyph className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-medium">Booking updates on WhatsApp</div>
            <div className="text-sm text-dim">Confirmations, receipts, guest RSVPs</div>
          </div>
          <Toggle checked={wa} onChange={setWa} label="Booking updates on WhatsApp" />
        </div>
        <div className="flex items-center gap-3 py-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-dim">
            <Feather className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-medium">Data saver</div>
            <div className="text-sm text-dim">Hide photos, load lighter pages on mobile data</div>
          </div>
          <Toggle checked={saver} onChange={setSaver} label="Data saver" />
        </div>
      </section>
    </Screen>
  )
}
