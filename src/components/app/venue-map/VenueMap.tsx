import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Banknote, Flame, Minus, Plus, TrendingUp } from 'lucide-react'
import { cedis, cx } from '@/lib/format'
import type { MapSpot, VenueMapDef } from './types'
import './venue-map.css'

const dot = { deal: '#2f7d32', fair: '#8bc34a', high: '#e5484d' } as const

type Anchor = { x: number; y: number }

/**
 * SeatGeek-style venue map. The venue art is an inline SVG (Higgsfield);
 * each bookable shape is found by its id, coloured by availability, and gets
 * an HTML price pin anchored to its centre. Pins stay the same size when you
 * zoom, so prices stay readable on a small Android screen.
 */
export function VenueMap({
  map,
  selectedId,
  onSelect,
  callouts = 'selected',
  pins = true,
  zoomable = true,
  initialZoom = 1,
  theme = 'light',
  className,
  style,
  focusId,
}: {
  map: VenueMapDef
  selectedId?: string
  onSelect?: (s: MapSpot) => void
  /** Which tooltips show: on the selected pin, on every hot/rising pin, or none. */
  callouts?: 'selected' | 'all' | 'none'
  pins?: boolean
  zoomable?: boolean
  initialZoom?: number
  theme?: 'light' | 'night'
  className?: string
  style?: CSSProperties
  /** Thumbnail mode: highlight this spot, no pins, no controls. */
  focusId?: string
}) {
  const svgHost = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const [anchors, setAnchors] = useState<Record<string, Anchor>>({})
  const [zoom, setZoom] = useState(initialZoom)
  const [internal, setInternal] = useState<string | undefined>(selectedId)
  const selected = selectedId ?? internal
  const byId = useMemo(() => Object.fromEntries(map.spots.map((s) => [s.id, s])), [map])
  const svgMarkup = useMemo(() => map.svg.replace(/<svg\b/, '<svg preserveAspectRatio="xMidYMid meet"'), [map.svg])

  // Find each spot's shape, measure its centre, and tag its state for CSS.
  useLayoutEffect(() => {
    const svg = svgHost.current?.querySelector('svg')
    if (!svg) return
    svg.removeAttribute('width')
    svg.removeAttribute('height')
    const vb = svg.viewBox.baseVal
    const next: Record<string, Anchor> = {}
    for (const s of map.spots) {
      const el = svg.querySelector<SVGGraphicsElement>(`[id="${CSS.escape(s.id)}"]`)
      if (!el) continue
      const state = focusId ? (s.id === focusId ? 'selected' : 'muted') : s.soldOut ? 'sold' : s.id === selected ? 'selected' : s.held ? 'held' : 'open'
      el.setAttribute('data-vm', state)
      el.style.cursor = !focusId && !s.soldOut && onSelect ? 'pointer' : ''
      try {
        const b = el.getBBox()
        next[s.id] = { x: ((b.x + b.width / 2 - vb.x) / vb.width) * 100, y: ((b.y + Math.min(b.height * 0.22, 26) - vb.y) / vb.height) * 100 }
      } catch {
        /* not rendered yet */
      }
    }
    setAnchors(next)
  }, [map, selected, focusId, onSelect])

  // Keep the selected spot in view when zooming.
  useLayoutEffect(() => {
    const sc = scroller.current
    const a = selected && anchors[selected]
    if (!sc || !a || zoom === 1) return
    sc.scrollTo({ left: (a.x / 100) * sc.scrollWidth - sc.clientWidth / 2, top: (a.y / 100) * sc.scrollHeight - sc.clientHeight / 2, behavior: 'smooth' })
  }, [zoom, selected, anchors])

  const pick = (s: MapSpot) => {
    if (s.soldOut || focusId) return
    setInternal(s.id)
    onSelect?.(s)
  }

  return (
    <div className={cx('vmap relative overflow-hidden', theme === 'night' ? 'vmap-night' : 'vmap-light', focusId && 'vmap-fit', className)} style={style}>
      <div ref={scroller} className="no-scrollbar size-full overflow-auto">
        <div className="relative mx-auto" style={{ width: `${zoom * 100}%` }}>
          <div
            ref={svgHost}
            className="vmap-svg [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
            onClick={(e) => {
              const hit = (e.target as Element).closest('[id]')
              const s = hit && byId[hit.id]
              if (s) pick(s)
            }}
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
          {pins &&
            !focusId &&
            map.spots.map((s) => {
              const a = anchors[s.id]
              if (!a || s.soldOut) return null
              const isSel = s.id === selected
              const showTip = callouts === 'all' ? s.hot || s.rise : callouts === 'selected' ? isSel && (s.hot || s.rise) : false
              return (
                <div key={s.id} className="absolute z-10 -translate-x-1/2 -translate-y-full" style={{ left: `${a.x}%`, top: `${a.y}%` }}>
                  {showTip && <Callout spot={s} align={a.x > 72 ? 'right' : a.x < 28 ? 'left' : 'center'} />}
                  <button
                    type="button"
                    onClick={() => pick(s)}
                    aria-label={`${s.label}, ${cedis(s.price)}${s.hot ? ', going fast' : ''}`}
                    aria-pressed={isSel}
                    className={cx('vmap-pin relative flex items-center gap-1 rounded-full px-2 py-[3px] text-[12.5px] leading-none font-bold whitespace-nowrap shadow-[0_1px_4px_rgb(0_0_0/0.22)] transition active:scale-95', isSel ? 'bg-[#111] text-white' : 'bg-white text-[#111]')}
                  >
                    {s.kind === 'zone' && !s.hot ? (
                      <Banknote className="size-3.5 text-[#3a8f55]" />
                    ) : s.hot ? (
                      <Flame className="size-3.5 fill-[#ff7a1a] text-[#ff5a00]" />
                    ) : (
                      <span className="size-2 rounded-full" style={{ background: dot[s.demand] }} />
                    )}
                    {cedis(s.price)}
                    <span className={cx('absolute -bottom-[4px] left-1/2 size-2 -translate-x-1/2 rotate-45', isSel ? 'bg-[#111]' : 'bg-white')} />
                  </button>
                </div>
              )
            })}
        </div>
      </div>
      {zoomable && !focusId && (
        <div className="absolute top-3 right-3 z-20 flex flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_1px_6px_rgb(0_0_0/0.18)]">
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(3, +(z + 0.5).toFixed(1)))} className="flex size-10 items-center justify-center text-[#111]">
            <Plus className="size-5" />
          </button>
          <span className="mx-2 h-px bg-[#e5e5ea]" />
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))} className="flex size-10 items-center justify-center text-[#111]">
            <Minus className="size-5" />
          </button>
        </div>
      )}
    </div>
  )
}

/** Tooltip above a pin: going fast, and/or a coming price rise. */
export function Callout({ spot, align = 'center' }: { spot: MapSpot; align?: 'left' | 'center' | 'right' }) {
  return (
    <div
      className={cx(
        'pointer-events-none absolute bottom-full mb-1.5 flex w-max flex-col',
        align === 'center' && 'left-1/2 -translate-x-1/2 items-center',
        align === 'left' && 'left-0 items-start',
        align === 'right' && 'right-0 items-end',
      )}
    >
      <div className="max-w-[190px] rounded-[10px] bg-[#111] px-2.5 py-1.5 text-[11px] leading-tight text-white shadow-lg">
        {spot.hot && (
          <div className="flex items-center gap-1 font-semibold">
            <Flame className="size-3 fill-[#ff7a1a] text-[#ff5a00]" />
            Going fast{spot.left != null ? ` · ${spot.left} left` : ''}
          </div>
        )}
        {spot.rise && (
          <div className={cx('flex items-center gap-1', spot.hot && 'mt-0.5 text-white/80')}>
            <TrendingUp className="size-3 text-[#ffb35c]" />
            {cedis(spot.rise.to)} {spot.rise.at ? `from ${spot.rise.at}` : `after ${spot.rise.afterSold} more sell`}
          </div>
        )}
      </div>
      <span className={cx('-mt-1 size-2 rotate-45 bg-[#111]', align === 'left' && 'ml-4', align === 'right' && 'mr-4')} />
    </div>
  )
}

export const demandLabel = { deal: 'Great value', fair: 'Fair price', high: 'Premium' } as const
export const demandDot = dot
