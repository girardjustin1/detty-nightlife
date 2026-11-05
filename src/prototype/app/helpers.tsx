import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ProtoScreen, type Rule } from '../hotspots'
import { useProto } from '../ProtoContext'

/**
 * Prototype-only helpers for the app click-through. They sit next to a real
 * screen inside `ProtoScreen`; the screens themselves are never edited.
 */

/** A route target: a step id, `BACK`, or a toast message. */
export type Target = string | { back: true } | { toast: string }
export type AppRule = { match: string | RegExp; to: Target; quiet?: boolean }

export const BACK: Target = { back: true }
export const toastTo = (msg: string): Target => ({ toast: msg })

/** `ProtoScreen` with a couple of extra targets (back, toast). */
export function Proto({ rules, children }: { rules: AppRule[]; children: ReactNode }) {
  const { back, toast } = useProto()
  const mapped: Rule[] = rules.map((r) => ({
    match: r.match,
    quiet: r.quiet,
    to: typeof r.to === 'string' ? r.to : 'back' in r.to ? () => back() : ((msg: string) => () => toast(msg))(r.to.toast),
  }))
  return <ProtoScreen rules={mapped}>{children}</ProtoScreen>
}

/** Find an element inside the surrounding `ProtoScreen` root after the screen has rendered. */
function useRootElement(find: (root: HTMLElement) => Element | null) {
  const anchor = useRef<HTMLSpanElement>(null)
  const [el, setEl] = useState<HTMLElement | null>(null)
  useLayoutEffect(() => {
    const root = anchor.current?.parentElement
    if (!root) return
    const locate = () => {
      const hit = find(root) as HTMLElement | null
      setEl((cur) => (cur === hit ? cur : hit))
      return !!hit
    }
    if (locate()) return
    // Not there yet (late render): watch until it appears.
    const mo = new MutationObserver(() => locate() && mo.disconnect())
    mo.observe(root, { childList: true, subtree: true })
    return () => mo.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { anchor: <span ref={anchor} hidden />, el }
}

/**
 * Turns part of a real screen that has no button of its own (a booking card,
 * the MoMo "approve on your phone" art) into a tap target, at runtime only:
 * it gets `role="button"` and an aria-label, which is what the step's rules
 * match. Runs before `ProtoScreen` paints its hint rings.
 */
export function Tappable({ find, label, round }: { find: (root: HTMLElement) => Element | null; label: string; round?: boolean }) {
  const anchor = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const el = anchor.current?.parentElement && (find(anchor.current.parentElement) as HTMLElement | null)
    if (!el) return
    el.setAttribute('role', 'button')
    el.setAttribute('aria-label', label)
    el.tabIndex = 0
    el.style.cursor = 'pointer'
    if (round) el.style.borderRadius = '9999px'
    return () => {
      el.removeAttribute('role')
      el.removeAttribute('aria-label')
      el.removeAttribute('tabindex')
      el.style.cursor = ''
      el.style.borderRadius = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label])
  return <span ref={anchor} hidden />
}

/** Hand-place the hint ring on one specific element (when two buttons share a label). */
export function Mark({ find }: { find: (root: HTMLElement) => Element | null }) {
  const { anchor, el } = useRootElement(find)
  useEffect(() => {
    if (!el) return
    el.setAttribute('data-hot', '')
    return () => el.removeAttribute('data-hot')
  }, [el])
  return anchor
}

/** Moves on by itself after `ms` (a tap still works). */
export function AutoAdvance({ to, ms }: { to: string; ms: number }) {
  const { go } = useProto()
  const goRef = useRef(go)
  goRef.current = go
  useEffect(() => {
    const t = setTimeout(() => goRef.current(to), ms)
    return () => clearTimeout(t)
  }, [to, ms])
  return null
}

/** Stops the prototype timer: the booking is done. */
export function Finish() {
  const { finish } = useProto()
  useEffect(() => {
    finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

/** Last button inside `root` whose visible text matches. */
export const lastButton = (root: HTMLElement, re: RegExp) =>
  [...root.querySelectorAll('button')].filter((b) => re.test(b.innerText.replace(/\s+/g, ' ').trim())).at(-1) ?? null
