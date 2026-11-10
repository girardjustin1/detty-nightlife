import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { newBrands } from '@/brands/brands'
import data from './competitors.json'
import nameData from './names.json'

/**
 * Competitor landscape for Accra and the name screen for the rebrand round.
 * Desk research from public web pages on 10 Nov 2026; every profile links its
 * sources and the caveats are printed in full at the end. Update the JSON files
 * next to this story, not the text here.
 */

type Flag = boolean | string
type Competitor = (typeof data.competitors)[number]

const PAGE = 'min-h-screen bg-[#101014] p-10 text-white'

const categories: { id: string; label: string; note: string }[] = [
  { id: 'table-booking', label: 'Table booking', note: 'The closest to what we are building.' },
  { id: 'events-discovery', label: 'Events discovery', note: 'Where people find a night.' },
  { id: 'ticketing', label: 'Ticketing', note: 'Where people buy entry.' },
  { id: 'informal', label: 'The status quo', note: 'How most tables are booked today.' },
  { id: 'global-platform', label: 'Global platforms', note: 'Present by name, thin in Accra.' },
]

const features: { key: keyof Competitor['features']; label: string }[] = [
  { key: 'tickets', label: 'Tickets' },
  { key: 'tables', label: 'Tables' },
  { key: 'bottles', label: 'Bottles' },
  { key: 'guestList', label: 'Guest list' },
  { key: 'deposits', label: 'Deposits' },
  { key: 'mobileMoney', label: 'Mobile money' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'venueTools', label: 'Venue tools' },
  { key: 'nativeApp', label: 'App' },
]

const coverageTone: Record<string, string> = { strong: 'bg-emerald-400/15 text-emerald-300', some: 'bg-amber-400/15 text-amber-300', none: 'bg-white/10 text-white/50' }
const verdictTone: Record<string, string> = { 'clear-ish': 'bg-emerald-400/15 text-emerald-300', caution: 'bg-amber-400/15 text-amber-300', avoid: 'bg-rose-400/15 text-rose-300' }

const hexes = (s: string) => [...new Set(s.match(/#[0-9A-Fa-f]{6}/g) ?? [])]
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]

function Cell({ v }: { v: Flag }) {
  if (v === true) return <span className="font-bold text-emerald-300">✓</span>
  if (v === false) return <span className="text-white/30">–</span>
  return <span className="text-white/30">?</span>
}

function Sec({ n, title, lead, children }: { n: number; title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="mt-12 max-w-[1400px]">
      <div className="flex items-baseline gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">{n}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {lead && <p className="mt-2 max-w-3xl text-sm text-white/60">{lead}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Swatches({ list, size = 'h-5 w-5' }: { list: string[]; size?: string }) {
  return (
    <span className="inline-flex gap-1 align-middle">
      {list.map((c) => (
        <span key={c} title={c} className={`${size} rounded border border-white/20`} style={{ background: c }} />
      ))}
    </span>
  )
}

function Profile({ c }: { c: Competitor }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{c.name}</h3>
          <a href={c.url} target="_blank" rel="noreferrer" className="text-xs text-sky-300 hover:underline">
            {host(c.url)} ↗
          </a>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${coverageTone[c.accraCoverage.level]}`}>Accra: {c.accraCoverage.level}</span>
      </div>
      <p className="mt-3 text-sm text-white/80">{c.summary}</p>
      <dl className="mt-3 space-y-2 text-[13px]">
        <div>
          <dt className="font-semibold text-white/50">In Accra</dt>
          <dd className="text-white/70">{c.accraCoverage.evidence}</dd>
        </div>
        <div>
          <dt className="font-semibold text-white/50">Fees</dt>
          <dd className="text-white/70">{c.fees}</dd>
        </div>
        <div>
          <dt className="font-semibold text-white/50">
            Look <Swatches list={hexes(c.look)} size="h-3.5 w-3.5" />
          </dt>
          <dd className="text-white/70">{c.look}</dd>
        </div>
      </dl>
      <div className="mt-3 grid grid-cols-2 gap-4 text-[13px]">
        <div>
          <div className="font-semibold text-emerald-300/90">Strong at</div>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-white/70">
            {c.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold text-amber-300/90">Gaps next to us</div>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-white/70">
            {c.gaps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-white/10 pt-3 text-[11px] text-white/40">
        <span>Sources:</span>
        {c.sources.map((s, i) => (
          <a key={s} href={s} target="_blank" rel="noreferrer" className="text-sky-300/80 hover:underline">
            [{i + 1}] {host(s)}
          </a>
        ))}
      </div>
    </article>
  )
}

function Competitors() {
  const { competitors, synthesis, caveats, checkedOn } = data
  const ordered = categories.flatMap((cat) => competitors.filter((c) => c.category === cat.id))
  const counts = {
    total: competitors.length,
    accra: competitors.filter((c) => c.accraCoverage.level === 'strong').length,
    both: competitors.filter((c) => c.features.tickets === true && c.features.tables === true && c.category !== 'informal' && c.accraCoverage.level !== 'none').length,
    waTables: competitors.filter((c) => c.features.whatsapp === true && c.features.tables === true).length,
  }
  return (
    <div className={PAGE} style={{ minWidth: 1480 }}>
      <div className="text-xs font-semibold tracking-widest text-white/50 uppercase">Research · Competitors · checked {checkedOn}</div>
      <h1 className="mt-1 text-4xl font-bold">Who else is selling Accra’s night</h1>
      <p className="mt-3 max-w-3xl text-white/70">
        {counts.total} products and habits a person in Accra can use today to find a night out, buy a ticket or book a table. Desk research from each
        company’s public pages and store listings, read on {checkedOn}. Every profile links its sources. Treat it as a snapshot: listings, prices and
        features change, and “?” means not stated, not absent.
      </p>

      <div className="mt-8 grid max-w-[1400px] grid-cols-4 gap-4">
        {(
          [
            [String(counts.total), 'profiles', 'Ticketing, table booking, discovery, global platforms and the informal status quo.'],
            ['2', 'Accra table-booking apps', 'Accraaa and Resarvo. Both are new, and both lead with dining rather than clubs.'],
            [String(counts.waTables), 'state WhatsApp table booking', 'Tables are booked by DM and phone today, but no product checked says you can book and pay for one inside WhatsApp.'],
            ['4 of 160', 'Detty events in Accra', 'The existing Detty app is Lagos-heavy: 98 events there against 4 in Accra on the day checked.'],
          ] as [string, string, string][]
        ).map(([big, label, note]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-4xl font-bold">{big}</div>
            <div className="mt-1 font-semibold">{label}</div>
            <p className="mt-1 text-sm text-white/60">{note}</p>
          </div>
        ))}
      </div>

      <Sec n={1} title="Who does what" lead="✓ the company’s own page states it. – its page says the opposite, or it clearly does not apply. ? not stated on the pages read. The last row is what our Storybook designs cover; nothing of ours is built or live yet.">
        <div className="overflow-hidden rounded-2xl border border-white/10 text-sm">
          <div className="grid grid-cols-[260px_130px_90px_repeat(9,1fr)] items-center gap-2 bg-white/10 px-4 py-2 text-[11px] font-bold tracking-wider text-white/60 uppercase">
            <span>Product</span>
            <span>Type</span>
            <span>Accra</span>
            {features.map((f) => (
              <span key={f.key} className="text-center">
                {f.label}
              </span>
            ))}
          </div>
          {ordered.map((c, i) => (
            <div key={c.name} className={`grid grid-cols-[260px_130px_90px_repeat(9,1fr)] items-center gap-2 px-4 py-2 ${i % 2 ? 'bg-white/[0.03]' : ''}`}>
              <b className="truncate">{c.name}</b>
              <span className="text-white/55">{categories.find((x) => x.id === c.category)?.label}</span>
              <span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${coverageTone[c.accraCoverage.level]}`}>{c.accraCoverage.level}</span>
              </span>
              {features.map((f) => (
                <span key={f.key} className="text-center">
                  <Cell v={c.features[f.key]} />
                </span>
              ))}
            </div>
          ))}
          <div className="grid grid-cols-[260px_130px_90px_repeat(9,1fr)] items-center gap-2 border-t border-white/20 bg-emerald-400/10 px-4 py-2.5">
            <b>This project (designed, not built)</b>
            <span className="text-white/55">All in one</span>
            <span className="text-[11px] text-white/55">Accra only</span>
            {features.map((f) => (
              <span key={f.key} className="text-center font-bold text-emerald-300">
                ✓
              </span>
            ))}
          </div>
        </div>
      </Sec>

      <Sec n={2} title="What the market looks like">
        <div className="grid grid-cols-2 gap-3">
          {synthesis.patterns.map((p) => {
            const [first, ...rest] = p.split('. ')
            const head = first.replace(/\.$/, '')
            return (
              <div key={p} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                <b>{head}.</b> <span className="text-white/65">{rest.join('. ')}</span>
              </div>
            )
          })}
        </div>
      </Sec>

      <Sec n={3} title="The colours and words everyone already uses" lead="Colours are the hex values found in each site’s live styles. The cluster of gold on dark, and of orange on white, is why this round avoids both.">
        <div className="flex gap-6">
          <div className="w-[560px] shrink-0 space-y-1.5 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-2 text-[11px] font-bold tracking-wider text-white/50 uppercase">Them</div>
            {ordered
              .filter((c) => hexes(c.look).length > 0)
              .map((c) => (
                <div key={c.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-white/75">{c.name}</span>
                  <Swatches list={hexes(c.look)} size="h-6 w-12" />
                </div>
              ))}
            <div className="mt-4 mb-2 border-t border-white/10 pt-4 text-[11px] font-bold tracking-wider text-white/50 uppercase">Our six new directions</div>
            {newBrands.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-white/75">{b.name}</span>
                <Swatches list={[...new Set(b.palette.slice(0, 4).map((p) => p.hex))]} size="h-6 w-12" />
              </div>
            ))}
          </div>
          <ul className="flex-1 space-y-3 text-sm">
            {synthesis.overusedBrandPatterns.map((p) => {
              const [first, ...rest] = p.split('. ')
            const head = first.replace(/\.$/, '')
              return (
                <li key={p} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <b>{head}.</b> <span className="text-white/65">{rest.join('. ')}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </Sec>

      <Sec n={4} title="Where the gap is, and what it means for us">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-2 text-[11px] font-bold tracking-wider text-emerald-300/80 uppercase">Nobody does this well yet</div>
            <ul className="space-y-2 text-sm">
              {synthesis.whiteSpace.map((p) => (
                <li key={p} className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-white/80">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-[11px] font-bold tracking-wider text-sky-300/80 uppercase">So we should</div>
            <ol className="space-y-2 text-sm">
              {synthesis.implications.map((p, i) => (
                <li key={p} className="flex gap-3 rounded-xl border border-sky-300/20 bg-sky-300/5 p-4 text-white/80">
                  <b className="text-sky-300">{i + 1}</b>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Sec>

      <Sec n={5} title="Profiles">
        {categories.map((cat) => {
          const list = competitors.filter((c) => c.category === cat.id)
          if (!list.length) return null
          return (
            <div key={cat.id} className="mb-8">
              <div className="mb-3 flex items-baseline gap-3">
                <h3 className="text-xl font-bold">{cat.label}</h3>
                <span className="text-sm text-white/50">{cat.note}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {list.map((c) => (
                  <Profile key={c.name} c={c} />
                ))}
              </div>
            </div>
          )
        })}
      </Sec>

      <Sec n={6} title="Limits of this research" lead="Read these before quoting anything from this page.">
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-white/65">
          {caveats.map((c) => (
            <li key={c}>{c}</li>
          ))}
          <li>Phone numbers quoted in public posts and on club sites were removed from this page.</li>
        </ul>
      </Sec>
    </div>
  )
}

function Names() {
  const inUse = new Set(['Jama', 'Fiada', 'Kpanlogo', 'Harmattan', 'Anadwo'])
  const order = { 'clear-ish': 0, caution: 1, avoid: 2 } as Record<string, number>
  const list = [...nameData.names].sort((a, b) => Number(inUse.has(b.name)) - Number(inUse.has(a.name)) || order[a.verdict] - order[b.verdict])
  return (
    <div className={PAGE} style={{ minWidth: 1480 }}>
      <div className="text-xs font-semibold tracking-widest text-white/50 uppercase">Research · Name screening · checked {nameData.checkedOn}</div>
      <h1 className="mt-1 text-4xl font-bold">Name screening</h1>
      <p className="mt-3 max-w-3xl text-white/70">
        {nameData.names.length} candidate names, each checked for meaning, for existing apps and companies with the same name, for bigger brands that would
        own search, and for whether the obvious domains host a business. This is a knock-out screen to avoid obvious mistakes. It is not legal clearance.
      </p>
      <div className="mt-4 flex max-w-3xl gap-4 text-sm text-white/60">
        <span>
          <span className={`mr-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${verdictTone['clear-ish']}`}>clear-ish</span>no collision found
        </span>
        <span>
          <span className={`mr-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${verdictTone.caution}`}>caution</span>usable with care
        </span>
        <span>
          <span className={`mr-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${verdictTone.avoid}`}>avoid</span>knocked out
        </span>
      </div>
      <p className="mt-3 max-w-3xl rounded-xl border border-sky-300/20 bg-sky-300/5 p-3 text-sm text-white/75">
        <b>Akonnwa</b>, the sixth name in use, was added after this screen. It has had one quick web search (no collision found) and its meaning (“seat” or
        “stool” in Twi) has not been confirmed with a speaker. It is not in the table below.
      </p>

      <div className="mt-8 max-w-[1400px] overflow-hidden rounded-2xl border border-white/10 text-sm">
        <div className="grid grid-cols-[170px_100px_1.1fr_1.3fr_1fr] gap-4 bg-white/10 px-4 py-2 text-[11px] font-bold tracking-wider text-white/60 uppercase">
          <span>Name</span>
          <span>Verdict</span>
          <span>Meaning</span>
          <span>Why</span>
          <span>Same-name products found</span>
        </div>
        {list.map((n, i) => (
          <div key={n.name} className={`grid grid-cols-[170px_100px_1.1fr_1.3fr_1fr] gap-4 px-4 py-3 ${inUse.has(n.name) ? 'bg-emerald-400/[0.07]' : i % 2 ? 'bg-white/[0.03]' : ''}`}>
            <div>
              <b>{n.name}</b>
              {inUse.has(n.name) && <div className="mt-0.5 text-[11px] font-semibold text-emerald-300">in use this round</div>}
            </div>
            <span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${verdictTone[n.verdict]}`}>{n.verdict}</span>
            </span>
            <span className="text-white/65">
              {n.meaning}
              {!n.meaningVerified && <span className="ml-1 text-amber-300/80">(not confirmed)</span>}
            </span>
            <span className="text-white/80">{n.reason}</span>
            <span className="text-[13px] text-white/55">
              {n.collisions.length === 0
                ? 'None found.'
                : n.collisions.slice(0, 3).map((c, j) => (
                    <span key={j} className="block">
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noreferrer" className="text-sky-300/80 hover:underline">
                          {c.what}
                        </a>
                      ) : (
                        c.what
                      )}
                    </span>
                  ))}
              {n.collisions.length > 3 && <span className="block text-white/35">+{n.collisions.length - 3} more in names.json</span>}
            </span>
          </div>
        ))}
      </div>

      <section className="mt-10 max-w-[1400px]">
        <h2 className="text-2xl font-bold">Limits of this screen</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-white/65">
          {nameData.caveats.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const meta = {
  title: 'Research/Accra market',
  parameters: { frame: 'raw', layout: 'fullscreen' },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const CompetitorLandscape: Story = { name: 'Competitors', render: () => <Competitors /> }
export const NameScreening: Story = { name: 'Name screening', render: () => <Names /> }
