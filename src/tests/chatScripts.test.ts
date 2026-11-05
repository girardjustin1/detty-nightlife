import { describe, expect, it } from 'vitest'
import { brands } from '@/brands/brands'
import type { ChatScript, Reply } from '@/prototype/chat/types'
import { menuBot } from '@/prototype/scripts/menuBot'
import { flowsBot } from '@/prototype/scripts/flowsBot'
import { aiBot } from '@/prototype/scripts/aiBot'

const next = (r: Reply): string | null => (r.type === 'end' ? null : r.type === 'buttons' ? r.options.find((o) => o.label === r.hot)!.go : r.go)

describe.each([
  ['menu bot', menuBot],
  ['flows bot', flowsBot],
  ['AI concierge', aiBot],
] as const)('%s', (_, make) => {
  const script: ChatScript = make(brands.aurum)

  it('every route points at a real node', () => {
    for (const [id, node] of Object.entries(script.nodes)) {
      const r = node.reply
      const targets = r.type === 'buttons' ? r.options.map((o) => o.go) : r.type === 'end' ? [] : [r.go]
      for (const t of targets) expect(script.nodes[t], `${id} → ${t}`).toBeTruthy()
    }
  })

  it('the tappable control exists on the last bot message', () => {
    for (const [id, node] of Object.entries(script.nodes)) {
      const r = node.reply
      const labels = node.bot.at(-1)?.buttons?.map((b) => b.label) ?? []
      if (r.type === 'buttons') {
        expect(labels, id).toContain(r.hot)
        for (const o of r.options) expect(labels, id).toContain(o.label)
      }
      if (r.type === 'list' || r.type === 'flow' || r.type === 'momo') expect(labels, id).toContain(r.button)
      if (r.type === 'list') expect(r.sections.flatMap((s) => s.rows).some((row) => row.id === r.pick), id).toBe(true)
    }
  })

  it('following the prefilled path reaches a booking', () => {
    let id: string | null = script.start
    const seen: string[] = []
    while (id && seen.length < 30) {
      seen.push(id)
      id = next(script.nodes[id].reply)
    }
    expect(id).toBeNull()
    expect(seen.some((n) => script.nodes[n].reply.type === 'momo')).toBe(true)
  })

  it('uses the active brand name', () => {
    const text = JSON.stringify(make(brands.gold), (_k, v) => (typeof v === 'object' && v?.$$typeof ? undefined : v))
    expect(text).not.toMatch(/Aurum|AURUM/)
  })
})
