import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { BrandProvider } from './BrandContext'
import { brands, newBrands, type Brand, type BrandId, type NewBrandId } from './brands'
import names from '@/research/names.json'
import { Discover } from '@/screens/consumer/discover/Discover'
import { Welcome } from '@/screens/consumer/onboarding/Welcome'
import { EventDetail } from '@/screens/consumer/event/EventDetail'
import { ConfirmedTable } from '@/screens/consumer/pay/Confirmed'
import { Badge, Button, Chip } from '@/components/ui/primitives'
import { MinSpendMeter } from '@/components/app/domain'

/**
 * Rebrand round (10 Nov 2026). The earlier look and name sat too close to an
 * existing events app, so these six directions start again from positioning:
 * each has its own idea, name, palette, type, voice and artwork, shown on the
 * unchanged product screens.
 */

const PAGE = 'min-h-screen bg-[#101014] p-10 text-white'

/** Name-screen verdicts for the six names in use (see Research / Name screening). */
const screen: Record<NewBrandId, { verdict: 'clear-ish' | 'caution' | 'light check'; note: string }> = {
  jama: { verdict: 'caution', note: 'No nightlife collision found in Ghana or Nigeria, but a medical journal owns the bare word in search. Needs a modifier, such as “Jama Accra”.' },
  fiada: { verdict: 'clear-ish', note: 'Only collision found is an unrelated US car-dealer association. Easy for visitors to say.' },
  akonnwa: { verdict: 'light check', note: 'One quick web search found no collision. Not screened to the same depth as the others, and the meaning needs a Twi speaker to confirm.' },
  kpanlogo: { verdict: 'caution', note: 'No app or company collision found. The risk is spelling and saying it: visitors will need “pan-LO-go”.' },
  harmattan: { verdict: 'caution', note: 'No nightlife app found, but the .com and .app domains are in use, it is a common party title, and it is seasonal.' },
  anadwo: { verdict: 'clear-ish', note: 'No app or tech collision found. Visitors need the pronunciation: “ah-NA-jo”.' },
}
const verdictTone = { 'clear-ish': 'bg-emerald-400/15 text-emerald-300', caution: 'bg-amber-400/15 text-amber-300', 'light check': 'bg-sky-400/15 text-sky-300', avoid: 'bg-rose-400/15 text-rose-300' } as const

function Verdict({ v }: { v: keyof typeof verdictTone }) {
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${verdictTone[v]}`}>{v}</span>
}

function Phone({ id, children, scale = 0.62 }: { id: BrandId; children: ReactNode; scale?: number }) {
  return (
    <div style={{ width: 390 * scale, height: 844 * scale }} className="shrink-0">
      <div style={{ width: 390, height: 844, zoom: scale, borderRadius: 44, overflow: 'hidden', boxShadow: '0 0 0 8px #1c1c22', transform: 'translateZ(0)' }}>
        <BrandProvider brand={id}>
          <div data-brand={id} className="h-full text-left">
            {children}
          </div>
        </BrandProvider>
      </div>
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <h4 className="mb-1.5 text-[11px] font-bold tracking-wider text-faint uppercase">{children}</h4>
}

function Board({ brand, n }: { brand: Brand; n: number }) {
  const s = screen[brand.id as NewBrandId]
  return (
    <section className="mt-10">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">{n}</span>
        <h2 className="text-2xl font-bold">{brand.name}</h2>
        <span className="text-white/60">{brand.idea}</span>
      </div>
      <div className="flex gap-6">
        <BrandProvider brand={brand.id}>
          <div data-brand={brand.id} className="grid w-[860px] shrink-0 grid-cols-[300px_1fr] overflow-hidden rounded-[20px] border border-line">
            <div className="relative min-h-[520px]">
              <img src={brand.keyArt} alt="" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
              <p className="display absolute inset-x-0 bottom-0 p-5 text-[26px] text-white">{brand.tagline}</p>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-4">
                <img src={brand.logo.lockup} alt={brand.name} className="h-10 w-auto max-w-[300px]" />
                <div className="flex items-center gap-3">
                  <img src={brand.logo.mark} alt="" className="h-10 w-auto" />
                  <img src={brand.logo.appIcon} alt="" className="size-14" />
                </div>
              </div>
              <p className="text-sm text-dim">
                <b className="text-text">The name.</b> {brand.nameOrigin}
              </p>
              <p className="text-sm text-dim">
                <b className="text-text">The promise.</b> {brand.promise}
              </p>
              <div>
                <Label>Palette</Label>
                <div className="grid grid-cols-5 gap-2">
                  {brand.palette.map((p, i) => (
                    <div key={i}>
                      <div className="h-10 rounded-control border border-line" style={{ background: p.hex }} />
                      <div className="mt-1 text-[11px] leading-tight font-semibold">{p.name}</div>
                      <div className="text-[10px] text-faint">{p.hex}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label>Type</Label>
                  <div className="display text-[26px]">Afrobeats Til Dawn</div>
                  <div className="mt-1 text-xs text-dim">{brand.type.display}</div>
                </div>
                <div>
                  <Label>Voice</Label>
                  <ul className="list-disc space-y-0.5 pl-4 text-[13px]">
                    {brand.voice.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-[13px] text-dim">
                <b className="text-text">For:</b> {brand.audience}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button>{brand.copy.reserveCta}</Button>
                <Button variant="secondary">Get tickets</Button>
                <Chip selected>Amapiano</Chip>
                <Badge tone="live">Selling fast</Badge>
              </div>
              <MinSpendMeter spent={4400} minimum={6000} />
              <div className="rounded-card bg-surface-2 p-3 text-[13px]">
                <b>Home:</b> {brand.copy.homeGreeting} · <b>Confirmed:</b> {brand.copy.confirmedTitle} · <b>Empty:</b> {brand.copy.emptyBookings}
              </div>
            </div>
          </div>
        </BrandProvider>
        <Phone id={brand.id}>
          <Welcome />
        </Phone>
        <Phone id={brand.id}>
          <Discover />
        </Phone>
        <Phone id={brand.id}>
          <EventDetail />
        </Phone>
      </div>
      <div className="mt-3 flex max-w-[1100px] items-start gap-2 text-[13px] text-white/60">
        <Verdict v={s.verdict} />
        <span>
          <b className="text-white/80">Name check:</b> {s.note}
        </span>
      </div>
    </section>
  )
}

function SixDirections() {
  return (
    <div className={PAGE} style={{ minWidth: 1700 }}>
      <div className="text-xs font-semibold tracking-widest text-white/50 uppercase">Brand · New directions · 10 Nov 2026</div>
      <h1 className="mt-1 text-4xl font-bold">Six new directions</h1>
      <p className="mt-3 max-w-3xl text-white/70">
        A fresh start on name and look. The product and every screen stay the same; each direction changes the idea, the name, the colours, the type, the
        voice and the artwork. None uses black and gold, and none uses the old name. Switch any screen with <b className="text-white">Toolbar → Brand</b>.
      </p>
      <p className="mt-2 max-w-3xl text-sm text-white/50">
        Logos: Higgsfield (Ideogram Vector). Key art: Higgsfield (GPT Image). Names were screened for obvious collisions only; none is legally cleared. Why
        we moved, and what I recommend, is on the <b className="text-white/70">Why we moved</b> page next to this one.
      </p>
      {newBrands.map((b, i) => (
        <Board key={b.id} brand={b} n={i + 1} />
      ))}
    </div>
  )
}

const flows: { label: string; render: () => ReactNode }[] = [
  { label: 'Welcome', render: () => <Welcome /> },
  { label: 'Discover', render: () => <Discover /> },
  { label: 'Event', render: () => <EventDetail /> },
  { label: 'Confirmed', render: () => <ConfirmedTable /> },
]

function SameScreens() {
  return (
    <div className={PAGE} style={{ minWidth: 1560 }}>
      <h1 className="text-3xl font-bold">The same four screens, six ways</h1>
      <p className="mt-2 max-w-3xl text-white/70">Read across a row to judge one direction; read down a column to compare them on the same screen.</p>
      <div className="mt-8 space-y-8">
        {newBrands.map((b) => (
          <div key={b.id} className="flex items-center gap-6">
            <div className="w-[150px] shrink-0">
              <div className="text-xl font-bold">{b.name}</div>
              <div className="mt-1 text-sm text-white/55">{b.tagline}</div>
            </div>
            {flows.map((f) => (
              <div key={f.label}>
                <div className="mb-2 text-[11px] font-semibold tracking-wider text-white/40 uppercase">{f.label}</div>
                <Phone id={b.id} scale={0.74}>
                  {f.render()}
                </Phone>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Why we moved ─────────────────────────────────────────────────────────── */

function Sec({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-12 max-w-[1280px]">
      <div className="flex items-baseline gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">{n}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function LookCard({ title, sub, bg, accent, text, rows }: { title: string; sub: string; bg: string; accent: string; text: string; rows: [string, string][] }) {
  return (
    <div className="flex-1 overflow-hidden rounded-2xl border border-white/10">
      <div className="p-6" style={{ background: bg, color: text }}>
        <div className="text-xs font-semibold tracking-widest uppercase opacity-60">{sub}</div>
        <div className="mt-1 text-3xl font-bold">{title}</div>
        <div className="mt-5 inline-block rounded-full px-5 py-2.5 text-sm font-semibold" style={{ background: accent, color: bg }}>
          Get tickets
        </div>
        <div className="mt-5 flex gap-2">
          {[bg, accent, text].map((c) => (
            <div key={c} className="text-[11px]">
              <div className="h-8 w-16 rounded border border-white/20" style={{ background: c }} />
              <div className="mt-1 opacity-70">{c}</div>
            </div>
          ))}
        </div>
      </div>
      <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 bg-white/5 p-5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-white/50">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Where each direction sits. x: calm (0) → loud (100). y: the host and the table (0) → the whole group (100). */
const territory: Record<NewBrandId, { x: number; y: number }> = {
  jama: { x: 80, y: 88 },
  fiada: { x: 30, y: 62 },
  akonnwa: { x: 14, y: 12 },
  kpanlogo: { x: 92, y: 52 },
  harmattan: { x: 44, y: 80 },
  anadwo: { x: 54, y: 26 },
}

const guardrails: [string, string][] = [
  ['No “Detty” in the name', 'An app is already listed as “Detty: Nightlife & Events”. The season keeps its everyday name in copy only where needed; the December shelf in the app now reads “December in Accra”.'],
  ['No black and gold', 'It is the default “premium Accra night” look: the existing Detty app, Accraaa, Ace Nightclub and Akwaaba all use gold on dark.'],
  ['No ticketing orange', 'eGotickets, Tix Africa and Eventbrite all use near-identical orange on white. One direction (Akonnwa) was moved from vermilion to rose for this reason.'],
  ['No luxury vocabulary', '“Finest”, “premier”, “exclusive” and “opulence” are everywhere. Say the price, the time and the rule instead.'],
  ['Nightlife first', 'The two Accra reservation apps read as restaurant apps. Lead with the night: tables, bottles, guest lists, the door.'],
  ['A name that is not the city or the function', 'Accraaa, Resarvo, Reisty, Ayatickets and eGotickets are all built from “Accra”, “reserve” or “ticket”.'],
]

function WhyWeMoved() {
  const used = new Set(['Jama', 'Fiada', 'Kpanlogo', 'Harmattan', 'Anadwo'])
  const dropped = names.names.filter((x) => ['Gbeke / Gbɛkɛ', 'Section', 'Vim'].includes(x.name))
  return (
    <div className={PAGE} style={{ minWidth: 1360 }}>
      <div className="text-xs font-semibold tracking-widest text-white/50 uppercase">Brand · New directions · Strategy</div>
      <h1 className="mt-1 text-4xl font-bold">Why we moved, and where to</h1>
      <p className="mt-3 max-w-3xl text-white/70">
        Our last look, Detty Gold, turned out to be a near twin of an app that already exists. This page shows the overlap, the rules the new round follows,
        how the six directions differ, and my recommendation.
      </p>

      <Sec n={1} title="The overlap">
        <div className="flex gap-5">
          <LookCard
            title="Detty"
            sub="Existing app · thedettyapp.com"
            bg="#050505"
            accent="#D4AF37"
            text="#F7F5EF"
            rows={[
              ['Name', 'Detty. App Store title: “Detty: Nightlife & Events”.'],
              ['Colours', 'Near-black with metallic gold.'],
              ['Shapes', 'Pill buttons, 22px card corners.'],
              ['Tone', 'Slangy and confident: “we’re outside”.'],
              ['Does', 'Event discovery, group plans, tickets, split-pay tables. Lagos-heavy: 4 of 160 listed events were in Accra on 10 Nov 2026.'],
            ]}
          />
          <LookCard
            title="Detty"
            sub="Ours until now · Detty Gold (archived)"
            bg="#0B0B0C"
            accent="#C9A45C"
            text="#F3EDE2"
            rows={[
              ['Name', 'Detty.'],
              ['Colours', 'Onyx with champagne gold.'],
              ['Shapes', 'Pill buttons, 16px card corners.'],
              ['Tone', 'Warm and cheeky: “Who’s outside tonight?”'],
              ['Does', 'Tickets, tables with a minimum spend, bottles, guests and deposits, plus a promoter app. Accra only.'],
            ]}
          />
        </div>
        <p className="mt-4 max-w-3xl text-sm text-white/60">
          Same name, same two colours, same button shape, similar slang. The product underneath is different, but nobody would be able to tell from the icon
          or the first screen. Their colours and details are from their public site, read on 10 Nov 2026; see Research / Competitors.
        </p>
      </Sec>

      <Sec n={2} title="Rules for this round">
        <div className="grid grid-cols-2 gap-3">
          {guardrails.map(([t, d]) => (
            <div key={t} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">{t}</div>
              <p className="mt-1 text-sm text-white/65">{d}</p>
            </div>
          ))}
        </div>
      </Sec>

      <Sec n={3} title="Six different bets">
        <div className="flex gap-8">
          <div className="relative h-[460px] w-[620px] shrink-0 rounded-2xl border border-white/10 bg-white/5">
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/15" />
            <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-white/15" />
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-semibold tracking-wider text-white/45 uppercase">About the whole group</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-semibold tracking-wider text-white/45 uppercase">About the host and the table</span>
            <span className="absolute top-1/2 left-2 -translate-y-1/2 text-[11px] font-semibold tracking-wider text-white/45 uppercase">Calm</span>
            <span className="absolute top-1/2 right-2 -translate-y-1/2 text-[11px] font-semibold tracking-wider text-white/45 uppercase">Loud</span>
            {newBrands.map((b) => {
              const t = territory[b.id as NewBrandId]
              return (
                <div key={b.id} className="absolute flex -translate-x-1/2 translate-y-1/2 flex-col items-center gap-1" style={{ left: `${8 + t.x * 0.84}%`, bottom: `${10 + t.y * 0.8}%` }}>
                  <img src={b.logo.appIcon} alt="" className="size-11 rounded-[10px] shadow-lg shadow-black/50" />
                  <span className="text-xs font-semibold">{b.name}</span>
                </div>
              )
            })}
          </div>
          <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 text-sm">
            <div className="grid grid-cols-[110px_1fr_1fr_90px] gap-3 bg-white/10 px-4 py-2 text-[11px] font-bold tracking-wider text-white/60 uppercase">
              <span>Direction</span>
              <span>The bet</span>
              <span>Looks like</span>
              <span>Name check</span>
            </div>
            {newBrands.map((b, i) => (
              <div key={b.id} className={`grid grid-cols-[110px_1fr_1fr_90px] gap-3 px-4 py-3 ${i % 2 ? 'bg-white/[0.03]' : ''}`}>
                <b>{b.name}</b>
                <span className="text-white/75">{b.idea}</span>
                <span className="text-white/60">
                  {b.palette
                    .slice(0, 3)
                    .map((p) => p.name)
                    .join(', ')}
                  . {b.type.display.split(' (')[0]}.{b.theme === 'light' ? ' The only light theme.' : ''}
                </span>
                <span>
                  <Verdict v={screen[b.id as NewBrandId].verdict} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-white/50">The map is my judgement of where each direction sits, not a measurement.</p>
      </Sec>

      <Sec n={4} title="Names that did not make it">
        <p className="max-w-3xl text-sm text-white/65">
          Three of my first six names were knocked out by the screen, so three directions were renamed. The full list of 30 screened names is on Research /
          Name screening.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {dropped.map((d) => (
            <div key={d.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <b className="line-through decoration-white/40">{d.name}</b>
                <Verdict v="avoid" />
              </div>
              <p className="mt-2 text-sm text-white/65">{d.reason}</p>
              <p className="mt-2 text-sm">
                → became <b>{d.name.startsWith('Gbeke') ? 'Fiada' : d.name === 'Section' ? 'Akonnwa' : 'Kpanlogo'}</b>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-3xl text-sm text-white/50">
          {used.size} of the six names in use went through the full screen. Akonnwa was added afterwards and has had only one quick search.
        </p>
      </Sec>

      <Sec n={5} title="My recommendation">
        <div className="grid grid-cols-3 gap-4">
          {(
            [
              ['jama', 'Lead with', 'It is the furthest from everyone else in Accra: light, bright and about the group, where the market is dark, gold and about status. It carries the warm Pidgin-friendly voice the first review liked, and it fits how nights are actually planned: in a WhatsApp group. The name needs a modifier, such as “Jama Accra”, because a medical journal owns the bare word in search.'],
              ['kpanlogo', 'Runner-up', 'The strongest Accra story, since the rhythm was born there, and it keeps the wide caps type you liked from Vybe. Electric blue is unclaimed locally. The cost is the name: visitors will misspell it and need to be taught “pan-LO-go”.'],
              ['anadwo', 'Cleanest name', 'The only original name that came back clear-ish, and it means exactly what we sell. The black-and-white look is the most timeless, but it is also the nearest to the dark look we are leaving, and the least warm.'],
            ] as [NewBrandId, string, string][]
          ).map(([id, role, why]) => (
            <div key={id} data-brand={id} className="overflow-hidden rounded-2xl border border-line">
              <div className="flex items-center gap-3 p-5">
                <img src={brands[id].logo.appIcon} alt="" className="size-12" />
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-faint uppercase">{role}</div>
                  <div className="display text-2xl">{brands[id].name}</div>
                </div>
              </div>
              <p className="px-5 pb-5 text-sm text-dim">{why}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 max-w-3xl space-y-2 text-sm text-white/70">
          <p>
            <b className="text-white">Name and look can be mixed.</b> Every direction is a set of tokens, so Anadwo’s name can wear Jama’s colours, or Kpanlogo’s
            type can sit on Harmattan’s palette. Use Toolbar → Brand and Toolbar → Type together to try it.
          </p>
          <p>
            <b className="text-white">Not recommended to lead:</b> Harmattan is the warmest of the six but seasonal, and its terracotta is close to Resarvo’s. Fiada
            is charming but ties the brand to one day of the week. Akonnwa is the best fit for the table-first product, but its name is the least checked.
          </p>
          <p>
            <b className="text-white">Before choosing:</b> a trademark search, a check of app-store and social handles, and a read by a Ga speaker and a Twi
            speaker. Jama is the default in Storybook and the prototype for now so there is one consistent look; that is easy to change.
          </p>
        </div>
      </Sec>
    </div>
  )
}

const meta = {
  title: 'Brand/New Directions',
  parameters: { frame: 'raw', layout: 'fullscreen' },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const SixNewDirections: Story = { render: () => <SixDirections /> }
export const WhyWeMovedAndWhereTo: Story = { name: 'Why we moved', render: () => <WhyWeMoved /> }
export const SameFourScreens: Story = { name: 'Same screens, six ways', render: () => <SameScreens /> }
