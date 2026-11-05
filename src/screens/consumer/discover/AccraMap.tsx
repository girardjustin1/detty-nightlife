import type { ReactNode } from 'react'
import { cx } from '@/lib/format'
import { coastline, MAP_H, MAP_W, mapAreas, mapRoads, venuePins } from './discoverData'

export type MapPin = { id: string; label: string; selected?: boolean; muted?: boolean }

/**
 * Stylised, tile-free map of Accra. Pure SVG drawn from brand tokens, so it
 * costs ~2 KB, works offline and needs no map SDK. `focus` crops the viewBox
 * around one venue for small static location cards.
 */
export function AccraMap({
  pins = [],
  focus,
  zoom = 1,
  className,
  onPin,
  showLabels = true,
  children,
}: {
  pins?: MapPin[]
  /** Venue id to centre on (static location cards). */
  focus?: string
  /** >1 zooms in around `focus`. */
  zoom?: number
  className?: string
  onPin?: (id: string) => void
  showLabels?: boolean
  children?: ReactNode
}) {
  let viewBox = `-6 30 ${MAP_W + 12} ${MAP_H - 30}`
  if (focus && venuePins[focus]) {
    const [x, y] = venuePins[focus]
    const w = MAP_W / zoom
    const h = (MAP_W / zoom) * 0.5
    viewBox = `${x - w / 2} ${y - h / 2} ${w} ${h}`
  }
  const scale = focus ? 1 / zoom : 1
  return (
    <svg viewBox={viewBox} preserveAspectRatio={focus ? 'xMidYMid slice' : 'xMidYMid meet'} className={cx('block size-full bg-bg', className)} role="img" aria-label="Map of Accra">
      <rect x={-200} y={-200} width={MAP_W + 400} height={MAP_H + 400} fill="var(--bg)" />
      {mapAreas.map((a) => (
        <path key={a.area} d={a.d} fill="var(--surface)" stroke="var(--line)" strokeWidth={1.5} strokeLinejoin="round" />
      ))}
      {mapRoads.map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke="var(--line)" strokeWidth={7} strokeLinecap="round" />
          <path d={d} fill="none" stroke="var(--surface-2)" strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
      <path d={coastline} fill="var(--surface-2)" />
      <path d={coastline} fill="none" stroke="var(--accent-2)" strokeOpacity={0.35} strokeWidth={1.5} />
      {showLabels && (
        <>
          {mapAreas.map((a) => (
            <text key={a.area} x={a.label[0]} y={a.label[1]} textAnchor="middle" fontSize={11 * Math.max(scale, 0.6)} fontWeight={700} fill="var(--faint)" style={{ letterSpacing: 1.2 * scale }}>
              {a.area.toUpperCase()}
            </text>
          ))}
          <text x={200} y={536} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--faint)">
            Gulf of Guinea
          </text>
          <g transform="translate(240 70)">
            <rect x={-30} y={-9} width={60} height={18} rx={9} fill="var(--surface-2)" />
            <text y={4} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--dim)">
              ✈ Airport
            </text>
          </g>
        </>
      )}
      {[...pins].sort((a, b) => Number(!!a.selected) - Number(!!b.selected)).map((p) => {
        const pos = venuePins[p.id]
        if (!pos) return null
        const [x, y] = pos
        if (!p.label)
          return <circle key={p.id} cx={x} cy={y} r={4 * scale} fill="var(--faint)" stroke="var(--bg)" strokeWidth={2 * scale} />
        const w = Math.max(54, p.label.length * 7 + 18)
        return (
          <g
            key={p.id}
            transform={`translate(${x} ${y}) scale(${scale})`}
            onClick={() => onPin?.(p.id)}
            style={{ cursor: onPin ? 'pointer' : 'default', opacity: p.muted ? 0.55 : 1 }}
            role={onPin ? 'button' : undefined}
            aria-label={p.label}
          >
            <rect x={-w / 2} y={-38} width={w} height={26} rx={13} fill={p.selected ? 'var(--accent)' : 'var(--bg)'} stroke={p.selected ? 'var(--accent)' : 'var(--line)'} strokeWidth={1.5} />
            <path d="M-6 -13 L0 -4 L6 -13 Z" fill={p.selected ? 'var(--accent)' : 'var(--bg)'} />
            <circle r={4} fill={p.selected ? 'var(--accent)' : 'var(--accent-2)'} stroke="var(--bg)" strokeWidth={2} />
            <text y={-20.5} textAnchor="middle" fontSize={12} fontWeight={800} fill={p.selected ? 'var(--on-accent)' : 'var(--text)'}>
              {p.label}
            </text>
          </g>
        )
      })}
      {children}
    </svg>
  )
}
