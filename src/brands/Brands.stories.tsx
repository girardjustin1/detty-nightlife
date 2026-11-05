import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { BrandProvider } from './BrandContext'
import { brandList, type Brand } from './brands'
import { Discover } from '@/screens/consumer/discover/Discover'
import { Badge, Button, Chip } from '@/components/ui/primitives'
import { MinSpendMeter } from '@/components/app/domain'

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <BrandProvider brand={brand.id}>
      <section data-brand={brand.id} className="overflow-hidden rounded-card border border-line">
        <div className="relative h-72">
          <img src={brand.keyArt} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <img src={brand.logo.lockup} alt={brand.name} className="h-10 w-auto" />
            <p className="display mt-3 text-2xl text-white">{brand.tagline}</p>
          </div>
        </div>
        <div className="space-y-5 p-5">
          <p className="text-sm text-dim">{brand.promise}</p>
          <div className="flex items-center gap-4">
            <img src={brand.logo.appIcon} alt="" className="size-16" />
            <img src={brand.logo.mark} alt="" className="h-12 w-auto" />
          </div>
          <div>
            <h4 className="mb-2 text-xs font-bold tracking-wider text-faint uppercase">Palette</h4>
            <div className="grid grid-cols-5 gap-2">
              {brand.palette.map((p) => (
                <div key={p.hex}>
                  <div className="h-12 rounded-control border border-line" style={{ background: p.hex }} />
                  <div className="mt-1 text-[11px] leading-tight font-semibold">{p.name}</div>
                  <div className="text-[10px] text-faint">{p.hex}</div>
                  <div className="text-[10px] text-dim">{p.role}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-bold tracking-wider text-faint uppercase">Type</h4>
            <div className="display text-3xl">Afrobeats Til Dawn</div>
            <div className="mt-1 text-sm text-dim">
              Display: {brand.type.display}
              <br />
              Body: {brand.type.body}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-bold tracking-wider text-faint uppercase">Voice</h4>
            <ul className="list-disc space-y-0.5 pl-5 text-sm">
              {brand.voice.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-dim">
              <b className="text-text">Audience:</b> {brand.audience}
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-bold tracking-wider text-faint uppercase">Components</h4>
            <div className="flex flex-wrap items-center gap-2">
              <Button>{brand.copy.reserveCta}</Button>
              <Button variant="secondary">Get tickets</Button>
              <Chip selected>Amapiano</Chip>
              <Chip>Afro House</Chip>
              <Badge tone="live">Selling fast</Badge>
            </div>
            <div className="mt-3">
              <MinSpendMeter spent={4400} minimum={6000} />
            </div>
          </div>
          <div className="rounded-card bg-surface-2 p-4 text-sm">
            <div className="text-xs font-bold tracking-wider text-faint uppercase">Copy samples</div>
            <p className="mt-2">
              <b>Home:</b> {brand.copy.homeGreeting}
            </p>
            <p>
              <b>Confirmed:</b> {brand.copy.confirmedTitle}
            </p>
            <p>
              <b>Empty:</b> {brand.copy.emptyBookings}
            </p>
          </div>
        </div>
      </section>
    </BrandProvider>
  )
}

function Overview() {
  return (
    <div className="min-h-screen bg-[#0d0d10] p-8 text-white">
      <h1 className="text-3xl font-bold">Three brand directions</h1>
      <p className="mt-2 max-w-3xl text-white/70">
        Same product, same screens — only tokens, artwork and voice change. Logos and key art were generated with Higgsfield (Ideogram Vector for logos,
        GPT Image 2.6 for art), then split, compressed and tokenised. Use the <b>Brand</b> toolbar menu to see any screen in any direction.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-6" style={{ minWidth: 1100 }}>
        {brandList.map((b) => (
          <BrandCard key={b.id} brand={b} />
        ))}
      </div>
    </div>
  )
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: 390, height: 844, borderRadius: 44, overflow: 'hidden', boxShadow: '0 0 0 8px #1c1c22', transform: 'translateZ(0)' }}>{children}</div>
  )
}

function SameScreen() {
  return (
    <div className="flex min-h-screen gap-10 bg-[#0d0d10] p-10" style={{ minWidth: 1340 }}>
      {brandList.map((b) => (
        <div key={b.id} className="text-center">
          <div className="mb-3 text-sm font-semibold text-white/70">{b.name}</div>
          <BrandProvider brand={b.id}>
            <Phone>
              <div data-brand={b.id} className="h-full">
                <Discover />
              </div>
            </Phone>
          </BrandProvider>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Brand/Directions',
  parameters: { frame: 'raw', layout: 'fullscreen' },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const SideBySide: Story = { render: () => <Overview /> }
export const SameScreenThreeBrands: Story = { render: () => <SameScreen /> }
