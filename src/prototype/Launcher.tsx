import { ArrowRight, Bot, LayoutList, MessageCircle, Smartphone, SquareMousePointer } from 'lucide-react'
import type { ReactNode } from 'react'
import { brands, type BrandId } from '@/brands/brands'
import { useBrand } from '@/brands/BrandContext'
import { StatusBar } from '@/components/app/chrome'
import { Toggle } from '@/components/ui/primitives'
import type { ExperienceId } from './ProtoContext'
import { experiences } from './experiences'

const icons: Record<ExperienceId, ReactNode> = {
  'wa-menu': <LayoutList className="size-5" />,
  'wa-flows': <SquareMousePointer className="size-5" />,
  'wa-ai': <Bot className="size-5" />,
  app: <Smartphone className="size-5" />,
}

const compare: { label: string; values: [string, string, string, string] }[] = [
  { label: 'Pick a table', values: ['List of tiers', 'Form + map image', 'Suggests, map image', 'Interactive floor plan'] },
  { label: 'Bottles', values: ['Packages list', 'Checkboxes in form', 'Typed in one message', 'Full menu + minimum meter'] },
  { label: 'Guests', values: ['Share link', 'Names in form', 'Share link', 'Invite, split, track'] },
  { label: 'Pay', values: ['MoMo prompt', 'MoMo prompt', 'MoMo prompt', 'MoMo / card / Lightning'] },
  { label: 'After booking', values: ['Chat commands', 'Chat + Flow', 'Ask anything', 'Wallet, modify, transfer'] },
]

export function Launcher({ brand, onBrand, onStart, hints, onHints }: { brand: BrandId; onBrand: (b: BrandId) => void; onStart: (id: ExperienceId) => void; hints: boolean; onHints: (v: boolean) => void }) {
  const b = useBrand()
  return (
    <div className="flex h-full flex-col bg-bg text-text">
      <StatusBar />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-10">
        <div className="flex items-center justify-between pt-2">
          <img src={b.logo.lockup} alt={b.name} className="h-8 w-auto" />
          <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-dim uppercase">Prototype</span>
        </div>
        <h1 className="display mt-6 text-[30px] leading-tight">Book the same night, four ways.</h1>
        <p className="mt-2 text-[15px] text-dim">
          Afrobeats Til Dawn · The Vault · VIP booth for 6 · Fri 18 Dec. Everything is prefilled — just tap what glows.
        </p>

        <div className="mt-6 space-y-3">
          {experiences.map((e, i) => (
            <button
              key={e.id}
              onClick={() => onStart(e.id)}
              className="block w-full rounded-card border border-line bg-surface p-4 text-left transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${e.channel === 'WhatsApp' ? 'bg-whatsapp text-[#06260f]' : 'bg-accent text-on-accent'}`}>
                  {e.channel === 'WhatsApp' ? (
                    <span className="relative">
                      <MessageCircle className="size-5" />
                    </span>
                  ) : (
                    icons[e.id]
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold tracking-wider text-faint uppercase">
                    {i + 1} · {e.channel}
                  </div>
                  <div className="text-[17px] leading-tight font-semibold">{e.id === 'app' ? `${b.name} app` : e.title.replace('WhatsApp · ', '')}</div>
                  <div className="text-sm text-dim">{e.short}</div>
                </div>
                <span className="flex size-10 items-center justify-center rounded-full bg-accent text-on-accent" data-hot="">
                  <ArrowRight className="size-5" />
                </span>
              </div>
              <p className="mt-3 text-[13.5px] leading-snug text-dim">{e.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.strengths.map((s) => (
                  <span key={s} className="rounded-full bg-success/12 px-2.5 py-0.5 text-[11.5px] font-medium text-success">
                    + {s}
                  </span>
                ))}
                {e.tradeoffs.map((s) => (
                  <span key={s} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11.5px] text-dim">
                    − {s}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <h2 className="display mt-8 text-xl">At a glance</h2>
        <div className="mt-3 overflow-hidden rounded-card border border-line">
          <div className="grid grid-cols-[76px_repeat(4,1fr)] bg-surface-2 text-[10.5px] font-bold tracking-wide text-faint uppercase">
            <span className="p-2" />
            {['Menu', 'Flows', 'AI', 'App'].map((h) => (
              <span key={h} className="p-2">
                {h}
              </span>
            ))}
          </div>
          {compare.map((row) => (
            <div key={row.label} className="grid grid-cols-[76px_repeat(4,1fr)] border-t border-line text-[11.5px] leading-snug">
              <span className="p-2 font-semibold">{row.label}</span>
              {row.values.map((v, i) => (
                <span key={i} className={`p-2 ${i === 3 ? 'text-text' : 'text-dim'}`}>
                  {v}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-faint">Every option pays with the phone’s own MoMo prompt — WhatsApp Pay isn’t available in Ghana.</p>

        <h2 className="display mt-8 text-xl">Brand</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['aurum', 'gold', 'detty', 'vybe'] as BrandId[]).map((id) => (
            <button
              key={id}
              onClick={() => onBrand(id)}
              className={`rounded-control border px-3.5 py-2 text-sm font-semibold ${id === brand ? 'border-accent bg-accent text-on-accent' : 'border-line text-text'}`}
            >
              {id === 'gold' ? 'Detty Gold' : brands[id].name}
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between rounded-card border border-line bg-surface p-4">
          <div>
            <div className="font-semibold">Tap hints</div>
            <div className="text-sm text-dim">Glow on the next prefilled step</div>
          </div>
          <Toggle checked={hints} onChange={onHints} label="Tap hints" />
        </div>
        <p className="mt-6 text-center text-xs text-faint">Sample data only · fictional venues and people</p>
      </div>
    </div>
  )
}
