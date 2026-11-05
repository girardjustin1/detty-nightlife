import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { BrandProvider } from './BrandContext'
import { brands, type BrandId } from './brands'
import { Discover } from '@/screens/consumer/discover/Discover'
import { Badge, Button, Chip } from '@/components/ui/primitives'
import { MinSpendMeter } from '@/components/app/domain'

/** What each original direction contributed to the consolidated look. */
const ledger: { from: BrandId; kept: string[]; dropped: string[] }[] = [
  { from: 'detty', kept: ['Voice: warm, a little cheeky, Pidgin-friendly', '“Celebrates the group, not the spend”', 'Warm earth tones (coral/sun → terracotta)'], dropped: ['Aubergine / purple background', 'Loud rounded display type'] },
  { from: 'aurum', kept: ['Onyx background', 'Champagne as the primary action', 'Elegant serif display (Playfair)', 'Precise about money and policies'], dropped: ['Fully understated voice', 'Square, formal controls'] },
  { from: 'vybe', kept: ['Lime for live energy: “tonight”, “minimum met”', 'Music-first details (DJs, genres)'], dropped: ['Void + violet palette', 'All-caps wide display type'] },
]

const feedback = [
  'The Pidgin, local hybrid English on Detty is a really good feature to have.',
  'Detty’s warm, earth-tone feel is close to what you see on the continent — but the purple background isn’t winning.',
  'Aurum reads elegant, regal, VIP — loving that colour scheme.',
  'Vybe’s colour scheme looks great too.',
]

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <div className="flex items-baseline gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">{n}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Swatches({ id }: { id: BrandId }) {
  return (
    <div className="flex gap-1.5">
      {brands[id].palette.map((p) => (
        <span key={p.hex} title={`${p.name} ${p.hex}`} className="h-6 w-8 rounded border border-white/10" style={{ background: p.hex }} />
      ))}
    </div>
  )
}

function MiniBrand({ id, dim }: { id: BrandId; dim?: boolean }) {
  const b = brands[id]
  return (
    <BrandProvider brand={id}>
      <div data-brand={id} className={`rounded-card border border-line p-5 transition ${dim ? 'opacity-60' : ''}`}>
        <img src={b.logo.lockup} alt={b.name} className="h-8 w-auto" />
        <p className="display mt-3 text-lg">{b.tagline}</p>
        <div className="mt-3">
          <Swatches id={id} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm">{b.copy.reserveCta}</Button>
          <Chip selected className="h-8">
            Amapiano
          </Chip>
          <Badge tone="live">Selling fast</Badge>
        </div>
      </div>
    </BrandProvider>
  )
}

function Phone({ id }: { id: BrandId }) {
  return (
    <BrandProvider brand={id}>
      <div style={{ width: 390, height: 844, borderRadius: 44, overflow: 'hidden', boxShadow: '0 0 0 8px #1c1c22', transform: 'translateZ(0)' }}>
        <div data-brand={id} className="h-full text-left">
          <Discover />
        </div>
      </div>
    </BrandProvider>
  )
}

function Evolution() {
  const gold = brands.gold
  return (
    <div className="min-h-screen bg-[#0d0d10] p-10 text-white" style={{ minWidth: 1200 }}>
      <div className="text-xs font-semibold tracking-widest text-white/50 uppercase">Brand · Evolution</div>
      <h1 className="mt-1 text-4xl font-bold">From three directions to one look</h1>
      <p className="mt-3 max-w-3xl text-white/70">
        We explored three directions, reviewed them (5 Nov 2026), and consolidated the best of each into <b className="text-white">Detty Gold</b>. Use the <b>Brand</b> toolbar menu to see any screen in any direction.
      </p>

      <Section n={1} title="Three directions">
        <div className="grid grid-cols-3 gap-5">
          {(['detty', 'aurum', 'vybe'] as BrandId[]).map((id) => (
            <MiniBrand key={id} id={id} />
          ))}
        </div>
      </Section>

      <Section n={2} title="Review feedback">
        <div className="grid grid-cols-2 gap-3">
          {feedback.map((f) => (
            <blockquote key={f} className="rounded-xl border-l-4 border-white/40 bg-white/5 px-4 py-3 text-white/85">
              {f}
            </blockquote>
          ))}
        </div>
        <p className="mt-2 text-xs text-white/40">Paraphrased from the review voice note.</p>
      </Section>

      <Section n={3} title="What we kept, what we dropped">
        <div className="grid grid-cols-3 gap-5">
          {ledger.map((l) => (
            <div key={l.from} className="rounded-2xl bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <img src={brands[l.from].logo.lockup} alt={brands[l.from].name} className="h-6 w-auto" />
                <Swatches id={l.from} />
              </div>
              <ul className="mt-4 space-y-1.5 text-sm">
                {l.kept.map((k) => (
                  <li key={k} className="flex gap-2">
                    <span className="text-[#c6ff3d]">✓</span>
                    {k}
                  </li>
                ))}
                {l.dropped.map((k) => (
                  <li key={k} className="flex gap-2 text-white/45">
                    <span>✕</span>
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section n={4} title="The consolidated look: Detty Gold">
        <div className="grid grid-cols-[1fr_auto] gap-8">
          <BrandProvider brand="gold">
            <div data-brand="gold" className="space-y-5 rounded-card border border-line p-6">
              <div className="flex items-center gap-5">
                <img src={gold.logo.lockup} alt={gold.name} className="h-12 w-auto" />
                <img src={gold.logo.appIcon} alt="" className="size-14" />
              </div>
              <p className="display text-3xl">{gold.tagline}</p>
              <p className="text-dim">{gold.promise}</p>
              <div className="grid grid-cols-5 gap-2">
                {gold.palette.map((p) => (
                  <div key={p.hex}>
                    <div className="h-14 rounded-control border border-line" style={{ background: p.hex }} />
                    <div className="mt-1 text-xs font-semibold">{p.name}</div>
                    <div className="text-[11px] text-faint">{p.hex}</div>
                    <div className="text-[11px] text-dim">{p.role}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button>{gold.copy.reserveCta}</Button>
                <Button variant="secondary">Get tickets</Button>
                <Chip selected>Amapiano</Chip>
                <Badge tone="live">Selling fast</Badge>
              </div>
              <MinSpendMeter spent={6480} minimum={6000} />
              <div className="rounded-card bg-surface-2 p-4 text-sm">
                <div className="text-xs font-bold tracking-wider text-faint uppercase">Voice</div>
                <p className="mt-1">
                  <b>Home:</b> {gold.copy.homeGreeting} · <b>Confirmed:</b> {gold.copy.confirmedTitle} · <b>Empty:</b> {gold.copy.emptyBookings}
                </p>
              </div>
            </div>
          </BrandProvider>
          <Phone id="gold" />
        </div>
      </Section>

      <Section n={5} title="Before → after">
        <div className="flex gap-10">
          {(['detty', 'aurum', 'gold'] as BrandId[]).map((id) => (
            <div key={id} className="text-center">
              <div className="mb-3 text-sm font-semibold text-white/70">{id === 'gold' ? 'Detty Gold (consolidated)' : `${brands[id].name} (original)`}</div>
              <Phone id={id} />
            </div>
          ))}
        </div>
      </Section>

      <Section n={6} title="Still to decide">
        <ul className="list-disc space-y-1 pl-6 text-white/75">
          <li>Final name (Detty vs a new name) and a trademark search in Ghana and key diaspora markets.</li>
          <li>Whether Vybe’s cyan stays as an info colour, or lime carries all the energy.</li>
          <li>English + Pidgin copy rules (where Pidgin appears, where it never does — payments and policies stay plain).</li>
        </ul>
      </Section>
    </div>
  )
}

const meta = { title: 'Brand/Evolution', parameters: { frame: 'raw', layout: 'fullscreen' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const ThreeDirectionsToOne: Story = { render: () => <Evolution /> }
