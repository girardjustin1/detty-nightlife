import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { cx } from '@/lib/format'
import { StatusBar, NetworkBanner } from '@/components/app/chrome'
import { IconButton } from '@/components/ui/primitives'

/**
 * Tracks the scroll of the Screen body that contains `ref`. Returns the
 * scroll container too, so screens can jump to anchors.
 */
export function useScrollParent<T extends HTMLElement>(threshold = 200) {
  const ref = useRef<T>(null)
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null)
  const [y, setY] = useState(0)
  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    setScrollEl(el)
    const on = () => setY(el.scrollTop)
    on()
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])
  return { ref, scrollEl, y, scrolled: y > threshold }
}

/** Header height (status bar 44 + bar 48) — anchors and sticky tabs sit below it. */
export const HEADER_H = 92

/**
 * Overlay header for detail pages with a photo hero: glass buttons over the
 * photo, then a solid bar with the title once the hero scrolls away.
 */
export function DetailHeader({ title, solid, trailing, onBack, network }: { title: ReactNode; solid: boolean; trailing?: (tone: 'glass' | 'plain') => ReactNode; onBack?: () => void; network?: 'offline' | 'slow' }) {
  const tone = solid ? 'plain' : 'glass'
  return (
    <div className={cx('absolute inset-x-0 top-0 z-30 transition-colors duration-200', solid ? 'border-b border-line bg-bg/95 backdrop-blur' : 'bg-gradient-to-b from-black/50 to-transparent')}>
      <StatusBar />
      {network && <NetworkBanner state={network} />}
      <div className="flex h-12 items-center gap-2 px-3">
        <IconButton label="Back" tone={tone} onClick={onBack}>
          <ChevronLeft className="size-6" />
        </IconButton>
        <div className={cx('min-w-0 flex-1 truncate text-center text-[15px] font-semibold transition-opacity', solid ? 'opacity-100' : 'opacity-0')}>{title}</div>
        <div className="flex min-w-10 justify-end gap-2">{trailing?.(tone)}</div>
      </div>
    </div>
  )
}
