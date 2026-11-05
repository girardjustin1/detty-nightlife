import { describe, expect, it } from 'vitest'
import { venueMaps } from '@/data/venueMaps'

describe('SeatGeek-style venue maps', () => {
  for (const [name, map] of Object.entries(venueMaps)) {
    it(`${name}: every spot has a shape with the same id in the SVG`, () => {
      const ids = new Set([...map.svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))
      for (const s of map.spots) expect(ids.has(s.id), `${name}:${s.id}`).toBe(true)
    })
    it(`${name}: prices are positive and spot ids are unique`, () => {
      expect(new Set(map.spots.map((s) => s.id)).size).toBe(map.spots.length)
      for (const s of map.spots) expect(s.price, s.id).toBeGreaterThan(0)
    })
    it(`${name}: stays small enough for mobile data`, () => {
      expect(map.svg.length).toBeLessThan(25_000)
    })
  }
})
