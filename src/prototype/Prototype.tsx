import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { BrandProvider } from '@/brands/BrandContext'
import { brands, type BrandId } from '@/brands/brands'
import { ProtoCtx, type ExperienceId, type ProtoApi } from './ProtoContext'
import { experiences } from './experiences'
import { Launcher } from './Launcher'
import './prototype.css'

type Route = { exp: ExperienceId | null; step?: string }

const parseHash = (): Route => {
  const [, exp, step] = (window.location.hash.replace(/^#/, '') || '/').split('/')
  return experiences.some((e) => e.id === exp) ? { exp: exp as ExperienceId, step: step || undefined } : { exp: null }
}
const toHash = (r: Route) => (r.exp ? `#/${r.exp}${r.step ? `/${r.step}` : ''}` : '#/')

const PROTO_BRANDS: BrandId[] = ['aurum', 'gold', 'gold2', 'detty', 'vybe']

/**
 * Clickable prototype: a menu of four booking experiences (three WhatsApp
 * bots + the consumer app), each playable end to end with prefilled data.
 * `embedded` renders inside an existing phone frame (Storybook).
 */
export function Prototype({ embedded = false, initialBrand }: { embedded?: boolean; initialBrand?: BrandId }) {
  const [route, setRoute] = useState<Route>(() => (embedded ? { exp: null } : parseHash()))
  const [history, setHistory] = useState<string[]>([])
  const [brand, setBrand] = useState<BrandId>(() => initialBrand ?? ((localStorage.getItem('proto-brand') as BrandId) || 'aurum'))
  const [hints, setHints] = useState(() => localStorage.getItem('proto-hints') !== 'off')
  const [run, setRun] = useState(0)
  const [taps, setTaps] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [finishedAt, setFinishedAt] = useState<number | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [panel, setPanel] = useState(false)
  const wide = useWide() && !embedded

  useEffect(() => localStorage.setItem('proto-brand', brand), [brand])
  useEffect(() => localStorage.setItem('proto-hints', hints ? 'on' : 'off'), [hints])
  useEffect(() => {
    if (embedded) return
    const on = () => setRoute(parseHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [embedded])
  // Deep links (e.g. #/wa-ai/chat) start the clock too.
  useEffect(() => {
    if (route.exp && startedAt === null) setStartedAt(Date.now())
  }, [route.exp, startedAt])

  const navigate = useCallback(
    (r: Route) => {
      setRoute(r)
      if (!embedded) window.history.replaceState(null, '', toHash(r))
    },
    [embedded],
  )

  const exp = experiences.find((e) => e.id === route.exp)

  const start = useCallback(
    (id: ExperienceId) => {
      const e = experiences.find((x) => x.id === id)!
      setHistory([])
      setTaps(0)
      setStartedAt(Date.now())
      setFinishedAt(null)
      setRun((n) => n + 1)
      navigate({ exp: id, step: e.start })
    },
    [navigate],
  )

  const api: ProtoApi = useMemo(
    () => ({
      brand,
      hints,
      go: (step) => {
        setHistory((h) => (route.step ? [...h, route.step] : h))
        navigate({ exp: route.exp, step })
      },
      back: () => {
        const prev = history.at(-1)
        if (prev) {
          setHistory((h) => h.slice(0, -1))
          navigate({ exp: route.exp, step: prev })
        }
      },
      menu: () => {
        setPanel(false)
        navigate({ exp: null })
      },
      restart: () => {
        setPanel(false)
        if (route.exp) start(route.exp)
      },
      tap: () => setTaps((t) => t + 1),
      finish: () => setFinishedAt((f) => f ?? Date.now()),
      toast: (m) => {
        setToastMsg(m)
        setTimeout(() => setToastMsg(null), 1800)
      },
    }),
    [brand, hints, history, navigate, route, start],
  )

  const secs = startedAt ? Math.round(((finishedAt ?? Date.now()) - startedAt) / 1000) : 0
  const screen = exp ? <div key={`${exp.id}-${run}`} className="h-full">{exp.render(route.step ?? exp.start)}</div> : <Launcher brand={brand} onBrand={setBrand} onStart={start} hints={hints} onHints={setHints} />

  const phone = (
    <BrandProvider brand={brand}>
      <div data-brand={brand} className={`relative h-full overflow-hidden ${hints ? 'proto-hints' : ''}`}>
        {screen}
        {exp && !wide && <MiniMenu open={panel} onToggle={() => setPanel((p) => !p)} taps={taps} secs={secs} done={!!finishedAt} hints={hints} onHints={setHints} />}
        {toastMsg && (
          <div className="pointer-events-none absolute inset-x-0 bottom-28 z-[70] flex justify-center">
            <span className="rounded-full bg-black/85 px-4 py-2 text-sm text-white shadow-lg">{toastMsg}</span>
          </div>
        )}
      </div>
    </BrandProvider>
  )

  return (
    <ProtoCtx.Provider value={api}>
      {embedded ? (
        phone
      ) : wide ? (
        <div className="flex min-h-screen items-center justify-center gap-10 bg-[#0d0d10] p-6 text-white">
          <SidePanel exp={exp} brand={brand} onBrand={setBrand} taps={taps} secs={secs} done={!!finishedAt} hints={hints} onHints={setHints} onMenu={api.menu} onRestart={api.restart} step={route.step} onJump={(s) => navigate({ exp: route.exp, step: s })} />
          <div className="relative h-[844px] w-[390px] shrink-0 overflow-hidden rounded-[48px]" style={{ boxShadow: '0 0 0 10px #1c1c22, 0 0 0 11px #33333d, 0 30px 80px rgb(0 0 0 / 0.6)', transform: 'translateZ(0)' }}>
            {phone}
          </div>
        </div>
      ) : (
        <div className="proto-root">{phone}</div>
      )}
    </ProtoCtx.Provider>
  )
}

function useWide() {
  const q = '(min-width: 760px)'
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2">
      <div className="text-[11px] tracking-wide text-white/50 uppercase">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  )
}

function SidePanel({
  exp,
  brand,
  onBrand,
  taps,
  secs,
  done,
  hints,
  onHints,
  onMenu,
  onRestart,
  step,
  onJump,
}: {
  exp?: (typeof experiences)[number]
  brand: BrandId
  onBrand: (b: BrandId) => void
  taps: number
  secs: number
  done: boolean
  hints: boolean
  onHints: (v: boolean) => void
  onMenu: () => void
  onRestart: () => void
  step?: string
  onJump: (s: string) => void
}) {
  const [, force] = useState(0)
  useEffect(() => {
    if (!exp || done) return
    const t = setInterval(() => force((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [exp, done])
  return (
    <aside className="w-[300px] shrink-0 space-y-5">
      <div>
        <div className="text-xs font-semibold tracking-widest text-white/50 uppercase">Prototype</div>
        <h1 className="mt-1 text-2xl font-bold">{exp ? exp.title : 'Pick an experience'}</h1>
        <p className="mt-1 text-sm text-white/65">{exp ? exp.blurb : 'Four ways to book the same night. Everything is prefilled — tap the glowing control to move on.'}</p>
      </div>
      {exp && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Taps" value={taps} />
            <Stat label={done ? 'Booked in' : 'Time'} value={`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`} />
          </div>
          <div className="flex gap-2">
            <button onClick={onMenu} className="flex-1 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black">
              ← Menu
            </button>
            <button onClick={onRestart} className="flex-1 rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold">
              Restart
            </button>
          </div>
          {exp.steps && (
            <div>
              <div className="mb-1.5 text-xs font-semibold tracking-widest text-white/50 uppercase">Jump to</div>
              <div className="no-scrollbar max-h-[360px] space-y-0.5 overflow-y-auto pr-1">
                {exp.steps.map((s) => (
                  <button key={s.id} onClick={() => onJump(s.id)} className={`block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-sm ${s.id === step ? 'bg-white/15 font-semibold' : 'text-white/70 hover:bg-white/5'}`}>
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      <div>
        <div className="mb-1.5 text-xs font-semibold tracking-widest text-white/50 uppercase">Brand</div>
        <div className="flex flex-wrap gap-1.5">
          {PROTO_BRANDS.map((b) => (
            <button key={b} onClick={() => onBrand(b)} className={`rounded-full px-3 py-1.5 text-sm ${b === brand ? 'bg-white font-semibold text-black' : 'border border-white/20 text-white/80'}`}>
              {b === 'gold' ? 'Detty Gold' : b === 'gold2' ? 'Gold × Vybe type' : brands[b].name}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-white/75">
        <input type="checkbox" checked={hints} onChange={(e) => onHints(e.target.checked)} /> Show tap hints
      </label>
      <p className="text-xs text-white/40">Sample data only. On your phone, open this page on the same Wi-Fi for the full-screen version.</p>
    </aside>
  )
}

/** Phone-size control: a small pill in the status-bar area that opens a menu. */
function MiniMenu({ open, onToggle, taps, secs, done, hints, onHints }: { open: boolean; onToggle: () => void; taps: number; secs: number; done: boolean; hints: boolean; onHints: (v: boolean) => void }) {
  return (
    <ProtoCtx.Consumer>
      {(api) => (
        <>
          <button
            onClick={onToggle}
            className="absolute top-1.5 left-1/2 z-[65] -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold text-white shadow backdrop-blur"
          >
            ☰ Menu · {taps} taps{done ? ' · done' : ''}
          </button>
          {open && (
            <div className="absolute inset-0 z-[64] flex items-start justify-center bg-black/50 pt-12" onClick={onToggle}>
              <div className="w-[86%] space-y-2 rounded-2xl bg-[#18181c] p-4 text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="text-sm text-white/60">
                  {taps} taps · {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}
                  {done ? ' · booked' : ''}
                </div>
                <button onClick={api.menu} className="block w-full rounded-full bg-white py-3 text-sm font-semibold text-black">
                  Back to menu
                </button>
                <button onClick={api.restart} className="block w-full rounded-full border border-white/25 py-3 text-sm font-semibold">
                  Restart this experience
                </button>
                <label className="flex items-center justify-center gap-2 pt-1 text-sm text-white/75">
                  <input type="checkbox" checked={hints} onChange={(e) => onHints(e.target.checked)} /> Show tap hints
                </label>
              </div>
            </div>
          )}
        </>
      )}
    </ProtoCtx.Consumer>
  )
}
