// Split a Higgsfield/Ideogram logo sheet (mark · lockup · app icon, left to right)
// into three tightly cropped SVGs with the sheet background removed.
// usage: node scripts/split-logo-sheet.mjs <sheet.svg> <out-dir> <brand>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const [src, outDir, brand] = process.argv.slice(2)
const svg = readFileSync(src, 'utf8')
const defs = (svg.match(/<defs>[\s\S]*?<\/defs>/) || [''])[0]
const paths = [...svg.matchAll(/<path\b[^>]*\/>/g)].map((m) => m[0])
const [, ...shapes] = paths // first path is the full-bleed background

const box = (p) => {
  const d = (p.match(/\sd="([^"]+)"/) || [])[1] || ''
  if (/[a-z]/.test(d.replace(/e-?\d/g, ''))) throw new Error('relative path commands not supported')
  const n = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number)
  const xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2 === 1)
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }
}
const items = shapes.map((p) => ({ p, b: box(p) })).filter(({ b }) => b.x1 - b.x0 < 1500 && b.y1 - b.y0 < 900)

// Cluster left→right by gaps in x.
items.sort((a, b) => a.b.x0 - b.b.x0)
const groups = []
for (const it of items) {
  const g = groups.at(-1)
  if (g && it.b.x0 <= g.x1 + 60) { g.items.push(it); g.x1 = Math.max(g.x1, it.b.x1) }
  else groups.push({ items: [it], x1: it.b.x1 })
}
// The lockup (middle) can split into mark + wordmark when the gap is wide: merge middles.
while (groups.length > 3) { const [a, b] = groups.splice(1, 2); groups.splice(1, 0, { items: [...a.items, ...b.items], x1: b.x1 }) }
if (groups.length !== 3) throw new Error(`expected 3 groups, got ${groups.length}`)

mkdirSync(outDir, { recursive: true })
;['mark', 'lockup', 'app-icon'].forEach((name, i) => {
  const its = groups[i].items
  const x0 = Math.min(...its.map((i) => i.b.x0)), x1 = Math.max(...its.map((i) => i.b.x1))
  const y0 = Math.min(...its.map((i) => i.b.y0)), y1 = Math.max(...its.map((i) => i.b.y1))
  const pad = Math.round(Math.max(x1 - x0, y1 - y0) * 0.04)
  const vb = [x0 - pad, y0 - pad, x1 - x0 + pad * 2, y1 - y0 + pad * 2].map((v) => Math.round(v)).join(' ')
  const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${defs}${its.map((i) => i.p).join('')}</svg>\n`
  writeFileSync(`${outDir}/${brand}-${name}.svg`, out)
  console.log(`${brand}-${name}.svg  viewBox ${vb}  ${out.length} bytes`)
})
