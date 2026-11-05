import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useProto } from './ProtoContext'

/**
 * Click-through prototype layer over the real Storybook screens.
 *
 * The screens stay exactly as designed (no prototype props needed): a rule
 * matches a tappable element by its visible text or aria-label and decides
 * where it goes. Matching elements get a soft pulsing ring (`data-hot-auto`; hand-placed hints use `data-hot`) so the
 * next step is obvious. Everything else (steppers, toggles, tabs inside a
 * screen) keeps working normally.
 */
export type Rule = {
  /** Text or aria-label of the button/link/tab. Strings match case-insensitively by "includes". */
  match: string | RegExp
  to: string | (() => void)
  /** Don't draw the hint ring (secondary routes). */
  quiet?: boolean
}

const TAPPABLE = 'button, a, [role="button"], [role="tab"], [role="switch"], label'

const labelOf = (el: Element) => (el.getAttribute('aria-label') || (el as HTMLElement).innerText || el.textContent || '').replace(/\s+/g, ' ').trim()

const matches = (rule: Rule, label: string) =>
  typeof rule.match === 'string' ? label.toLowerCase().includes(rule.match.toLowerCase()) : rule.match.test(label)

export function useHighlight(ref: React.RefObject<HTMLElement | null>, labels: (string | RegExp)[], enabled = true) {
  const key = labels.map(String).join('|')
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const paint = () => {
      root.querySelectorAll('[data-hot-auto]').forEach((el) => el.removeAttribute('data-hot-auto'))
      if (!enabled) return
      const seen = new Set<string>()
      root.querySelectorAll(TAPPABLE).forEach((el) => {
        if ((el as HTMLButtonElement).disabled) return
        const label = labelOf(el)
        const hit = labels.find((m) => (typeof m === 'string' ? label.toLowerCase().includes(m.toLowerCase()) : m.test(label)))
        if (!hit) return
        // Only ring the innermost match, once per rule.
        if (el.querySelector(TAPPABLE) && [...el.querySelectorAll(TAPPABLE)].some((c) => labelOf(c) === label)) return
        if (seen.has(String(hit))) return
        seen.add(String(hit))
        el.setAttribute('data-hot-auto', '')
      })
    }
    paint()
    const mo = new MutationObserver(() => requestAnimationFrame(paint))
    mo.observe(root, { childList: true, subtree: true, characterData: true })
    return () => mo.disconnect()
  }, [ref, key, enabled])
}

/** Wraps one real screen and routes taps according to `rules`. */
export function ProtoScreen({ rules, children, onBack }: { rules: Rule[]; children: ReactNode; onBack?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { go, back, hints, tap, toast } = useProto()
  useHighlight(
    ref,
    rules.filter((r) => !r.quiet).map((r) => r.match),
    hints,
  )
  useEffect(() => {
    ref.current?.querySelector('.overflow-y-auto')?.scrollTo({ top: 0 })
  }, [children])

  return (
    <div
      ref={ref}
      className="h-full"
      onClickCapture={(e) => {
        const el = (e.target as Element).closest(TAPPABLE)
        if (!el || !ref.current?.contains(el)) return
        tap()
        const label = labelOf(el)
        const rule = rules.find((r) => matches(r, label))
        if (rule) {
          e.preventDefault()
          e.stopPropagation()
          if (typeof rule.to === 'function') rule.to()
          else go(rule.to)
          return
        }
        if (/^(back|close)$/i.test(label)) {
          e.preventDefault()
          e.stopPropagation()
          if (onBack) onBack()
          else back()
          return
        }
        if (el instanceof HTMLAnchorElement && el.href) {
          e.preventDefault()
          toast(el.href.includes('wa.me') ? 'Would open WhatsApp' : 'External link (not in prototype)')
        }
      }}
    >
      {children}
    </div>
  )
}
