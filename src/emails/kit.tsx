/**
 * Email kit — email-safe building blocks for draft transactional emails.
 *
 * Rules (so these port cleanly to React Email + Resend later):
 * - Table layout, 600px max, inline styles only, system fonts, no external CSS.
 * - Colours come from `brand.palette` hex values (CSS variables are unreliable in mail clients).
 * - Dark by design: the brand backgrounds are already dark, so clients that force a dark
 *   theme (Gmail app, Outlook.com, Apple Mail) leave the email largely alone, and the
 *   lockup artwork (made for dark backgrounds) never sits on white.
 *   When porting, add to <head>: <meta name="color-scheme" content="dark light">
 *   <meta name="supported-color-schemes" content="dark light">, and set bgcolor on <body>.
 * - Images are optional: every image has styled alt text, every QR has a text code.
 *   Port notes: lockup SVG → ~5 KB PNG; FakeQR SVG → 2–6 KB PNG (CID or hosted);
 *   <a> buttons → React Email <Button> (adds the Outlook VML/padding fallback).
 */
import type { CSSProperties, ReactNode } from 'react'
import { useBrand } from '@/brands/BrandContext'
import type { Brand } from '@/brands/brands'
import { FakeQR } from '@/components/app/domain'
import { addressPlaceholder, domainFor, links, support } from './sample'

// ---------- theme ----------

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
/** Mix colour a toward b by t (0..1). Returns hex. */
export const mix = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  const c = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0')
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`
}

export function emailTheme(brand: Brand) {
  const [bg, accent, accent2, accent3, text] = brand.palette.map((p) => p.hex)
  return {
    bg,
    surface: mix(bg, text, 0.06),
    surface2: mix(bg, text, 0.1),
    line: mix(bg, text, 0.16),
    text,
    dim: mix(text, bg, 0.28),
    faint: mix(text, bg, 0.5),
    accent,
    accent2,
    accent3,
    onAccent: bg,
    // Status colours are not in the palette; muted, readable on any of the three dark backgrounds.
    success: '#5FD39A',
    danger: '#FF7A7A',
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace",
    display: (
      {
        detty: { fontWeight: 800, letterSpacing: '-0.01em' },
        aurum: { fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, letterSpacing: '0.005em' },
        vybe: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.01em' },
        gold: { fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600, letterSpacing: '0' },
        gold2: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.01em' },
      } satisfies Record<Brand['id'], CSSProperties>
    )[brand.id] as CSSProperties,
    radius: brand.id === 'aurum' ? 4 : brand.id === 'vybe' ? 6 : 14,
  }
}
export type EmailTheme = ReturnType<typeof emailTheme>
export const useEmailTheme = () => emailTheme(useBrand())

// ---------- primitives ----------

const T = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%" style={{ borderCollapse: 'collapse', ...style }}>
    <tbody>{children}</tbody>
  </table>
)
export { T as Table }

/** One full-width content row with horizontal padding. */
export function Row({ children, pad = '0 32px', style }: { children: ReactNode; pad?: string; style?: CSSProperties }) {
  return (
    <tr>
      <td style={{ padding: pad, ...style }}>{children}</td>
    </tr>
  )
}

export function Spacer({ h = 24 }: { h?: number }) {
  return (
    <tr>
      <td style={{ height: h, lineHeight: `${h}px`, fontSize: 0 }}>&nbsp;</td>
    </tr>
  )
}

/** Vertical gap inside a cell (Spacer is a table row). */
export function Gap({ h = 16 }: { h?: number }) {
  return <div style={{ height: h, lineHeight: `${h}px`, fontSize: 0 }}>&nbsp;</div>
}

export function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  const t = useEmailTheme()
  return <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: color ?? t.accent2, margin: '0 0 8px' }}>{children}</div>
}

export function H1({ children }: { children: ReactNode }) {
  const t = useEmailTheme()
  return <h1 style={{ margin: '0 0 12px', fontSize: 28, lineHeight: '34px', color: t.text, fontFamily: t.font, ...t.display }}>{children}</h1>
}

export function H2({ children }: { children: ReactNode }) {
  const t = useEmailTheme()
  return <h2 style={{ margin: '0 0 10px', fontSize: 18, lineHeight: '24px', color: t.text, fontFamily: t.font, ...t.display, textTransform: 'none' }}>{children}</h2>
}

export function P({ children, dim, small, style }: { children: ReactNode; dim?: boolean; small?: boolean; style?: CSSProperties }) {
  const t = useEmailTheme()
  return <p style={{ margin: '0 0 14px', fontSize: small ? 13 : 16, lineHeight: small ? '20px' : '24px', color: dim ? t.dim : t.text, ...style }}>{children}</p>
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const t = useEmailTheme()
  return (
    <a href={href} style={{ color: t.accent2, textDecoration: 'underline' }}>
      {children}
    </a>
  )
}

export function Button({ href, children, variant = 'primary', full }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary'; full?: boolean }) {
  const t = useEmailTheme()
  const primary = variant === 'primary'
  return (
    <a
      href={href}
      style={{
        display: full ? 'block' : 'inline-block',
        textAlign: 'center',
        background: primary ? t.accent : 'transparent',
        color: primary ? t.onAccent : t.text,
        border: `1px solid ${primary ? t.accent : t.line}`,
        borderRadius: t.radius,
        padding: '13px 22px',
        fontSize: 15,
        fontWeight: 700,
        lineHeight: '20px',
        textDecoration: 'none',
        margin: '0 8px 10px 0',
        textTransform: t.display.textTransform,
        letterSpacing: t.display.textTransform ? '0.04em' : undefined,
      }}
    >
      {children}
    </a>
  )
}

/** Bordered panel. */
export function Panel({ children, tone = 'surface', style }: { children: ReactNode; tone?: 'surface' | 'accent' | 'danger' | 'success'; style?: CSSProperties }) {
  const t = useEmailTheme()
  const edge = tone === 'accent' ? t.accent2 : tone === 'danger' ? t.danger : tone === 'success' ? t.success : t.line
  return (
    <T style={{ background: t.surface, border: `1px solid ${t.line}`, borderLeft: tone === 'surface' ? `1px solid ${t.line}` : `3px solid ${edge}`, borderRadius: t.radius, ...style }}>
      <tr>
        <td style={{ padding: '18px 20px' }}>{children}</td>
      </tr>
    </T>
  )
}

export type KV = { label: ReactNode; value: ReactNode; strong?: boolean; tone?: 'dim' | 'success' | 'danger' | 'accent'; rule?: boolean; sub?: ReactNode }

/** Label / value lines. Two cells only, so it never needs a media query at 375px. */
export function Lines({ rows }: { rows: KV[] }) {
  const t = useEmailTheme()
  const color = (tone?: KV['tone']) => (tone === 'success' ? t.success : tone === 'danger' ? t.danger : tone === 'accent' ? t.accent2 : tone === 'dim' ? t.dim : t.text)
  return (
    <T>
      {rows.map((r, i) => (
        <tr key={i}>
          <td style={{ padding: '7px 12px 7px 0', fontSize: r.strong ? 16 : 14, lineHeight: '20px', color: r.strong ? t.text : t.dim, fontWeight: r.strong ? 700 : 400, borderTop: r.rule ? `1px solid ${t.line}` : undefined, verticalAlign: 'top' }}>
            {r.label}
            {r.sub && <div style={{ fontSize: 12, lineHeight: '16px', color: t.faint, fontWeight: 400 }}>{r.sub}</div>}
          </td>
          <td align="right" style={{ padding: '7px 0', fontSize: r.strong ? 16 : 14, lineHeight: '20px', color: color(r.tone), fontWeight: r.strong ? 700 : 600, whiteSpace: 'nowrap', borderTop: r.rule ? `1px solid ${t.line}` : undefined, verticalAlign: 'top' }}>
            {r.value}
          </td>
        </tr>
      ))}
    </T>
  )
}

export function Divider() {
  const t = useEmailTheme()
  return (
    <tr>
      <td style={{ padding: '0 32px' }}>
        <div style={{ borderTop: `1px solid ${t.line}`, height: 1, lineHeight: '1px', fontSize: 0 }}>&nbsp;</div>
      </td>
    </tr>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  const t = useEmailTheme()
  return <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.faint, margin: '0 0 10px' }}>{children}</div>
}

/** Small date tile + title block; text-only, no hero image. */
export function EventHeader({ iso, title, lines }: { iso: string; title: ReactNode; lines: ReactNode[] }) {
  const t = useEmailTheme()
  const d = new Date(iso)
  const month = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase()
  const day = d.toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'UTC' })
  return (
    <T>
      <tr>
        <td width={64} style={{ width: 64, verticalAlign: 'top', paddingRight: 16 }}>
          <div style={{ width: 64, background: t.accent, color: t.onAccent, borderRadius: t.radius, textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em' }}>{month}</div>
            <div style={{ fontSize: 26, fontWeight: 800, lineHeight: '28px' }}>{day}</div>
          </div>
        </td>
        <td style={{ verticalAlign: 'top' }}>
          <div style={{ fontSize: 19, lineHeight: '24px', fontWeight: 700, color: t.text, ...t.display, textTransform: 'none' }}>{title}</div>
          {lines.map((l, i) => (
            <div key={i} style={{ fontSize: 14, lineHeight: '21px', color: t.dim }}>
              {l}
            </div>
          ))}
        </td>
      </tr>
    </T>
  )
}

/** Entry QR on white (scanners need contrast) with the text code underneath. */
export function QRBlock({ seed, code, caption, size = 168 }: { seed: string; code: string; caption?: ReactNode; size?: number }) {
  const t = useEmailTheme()
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'inline-block', background: '#FFFFFF', borderRadius: 12, padding: 10, lineHeight: 0 }}>
        <FakeQR seed={seed} size={size} />
      </div>
      <div style={{ fontFamily: t.mono, fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: t.text, marginTop: 12 }}>{code}</div>
      {caption && <div style={{ fontSize: 13, lineHeight: '19px', color: t.dim, marginTop: 4 }}>{caption}</div>}
    </div>
  )
}

export function Bullets({ items }: { items: ReactNode[] }) {
  const t = useEmailTheme()
  return (
    <T>
      {items.map((it, i) => (
        <tr key={i}>
          <td width={18} style={{ width: 18, verticalAlign: 'top', color: t.accent2, fontSize: 14, lineHeight: '22px' }}>•</td>
          <td style={{ fontSize: 14, lineHeight: '22px', color: t.dim, paddingBottom: 4 }}>{it}</td>
        </tr>
      ))}
    </T>
  )
}

// ---------- layout ----------

export type EmailMeta = {
  subject: string
  preheader: string
  /** Marketing adds the unsubscribe footer and sends from the news subdomain. */
  kind?: 'transactional' | 'marketing' | 'staff'
}

/** Storybook-only: how the message looks in an inbox list. Not part of the email. */
function InboxPreview({ brand, meta }: { brand: Brand; meta: EmailMeta }) {
  const from = meta.kind === 'marketing' ? `news.${domainFor(brand)}` : meta.kind === 'staff' ? `venues.${domainFor(brand)}` : `mail.${domainFor(brand)}`
  return (
    <div style={{ maxWidth: 600, margin: '0 auto 12px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: '#fff', borderRadius: 10, padding: '10px 14px', border: '1px solid #e2e2e8', color: '#1b1b20' }}>
      <div style={{ fontSize: 11, color: '#8a8a96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Inbox preview · Storybook only</div>
      <div style={{ fontSize: 14 }}>
        <strong>{brand.name}</strong> <span style={{ color: '#8a8a96' }}>&lt;{meta.kind === 'marketing' ? 'drops' : meta.kind === 'staff' ? 'reports' : 'bookings'}@{from}&gt;</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{meta.subject}</div>
      <div style={{ fontSize: 13, color: '#6b6b78', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta.preheader}</div>
    </div>
  )
}

export function EmailLayout({
  meta,
  children,
  refCode,
  inboxPreview = true,
  footerNote,
}: {
  meta: EmailMeta
  children: ReactNode
  /** Booking reference shown top-right and in the footer. */
  refCode?: string
  inboxPreview?: boolean
  footerNote?: ReactNode
}) {
  const brand = useBrand()
  const t = emailTheme(brand)
  const l = links(brand)
  const kind = meta.kind ?? 'transactional'
  return (
    <div>
      {inboxPreview && <InboxPreview brand={brand} meta={meta} />}
      {/* <body bgcolor={t.bg}> in the real template */}
      <div style={{ background: t.bg, color: t.text, fontFamily: t.font, WebkitTextSizeAdjust: '100%', maxWidth: 664, margin: '0 auto' }}>
        {/* Preheader: inbox preview text, hidden in the body. Padded so the client doesn't pull body copy into the preview. */}
        <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden', opacity: 0, fontSize: 1, lineHeight: '1px', color: t.bg }}>
          {meta.preheader}
          {' ‌'.repeat(60)}
        </div>
        <T style={{ background: t.bg }}>
          <tr>
            <td align="center" style={{ padding: '24px 0 8px' }}>
              <T style={{ maxWidth: 600, margin: '0 auto' }}>
                {/* header */}
                <tr>
                  <td style={{ padding: '8px 32px 20px' }}>
                    <T>
                      <tr>
                        <td style={{ verticalAlign: 'middle' }}>
                          <a href={`https://${l.domain}`} style={{ textDecoration: 'none' }}>
                            <img src={brand.logo.lockup} alt={brand.name} height={34} style={{ height: 34, width: 'auto', border: 0, display: 'block', color: t.text, fontSize: 22, fontWeight: 800 }} />
                          </a>
                        </td>
                        {refCode && (
                          <td align="right" style={{ verticalAlign: 'middle', fontSize: 12, color: t.faint, fontFamily: t.mono, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                            {refCode}
                          </td>
                        )}
                      </tr>
                    </T>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0 32px' }}>
                    <div style={{ height: 3, lineHeight: '3px', fontSize: 0, background: t.accent, borderRadius: 2, width: 48 }}>&nbsp;</div>
                  </td>
                </tr>
                <Spacer h={24} />
                {children}
                <Spacer h={32} />
                {/* footer */}
                <tr>
                  <td style={{ padding: '24px 32px 32px', borderTop: `1px solid ${t.line}` }}>
                    <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: '21px', color: t.dim }}>
                      {kind === 'staff' ? 'Venue support: ' : 'Questions? '}
                      <a href={support.waLink(refCode ? `Hi ${brand.name}, a question about booking ${refCode}` : undefined)} style={{ color: t.accent2, fontWeight: 700, textDecoration: 'none' }}>
                        WhatsApp {brand.name} on {support.whatsapp}
                      </a>{' '}
                      or reply to this email.
                    </p>
                    {footerNote && <p style={{ margin: '0 0 10px', fontSize: 12, lineHeight: '18px', color: t.faint }}>{footerNote}</p>}
                    {kind === 'marketing' ? (
                      <p style={{ margin: '0 0 10px', fontSize: 12, lineHeight: '18px', color: t.faint }}>
                        You’re getting this because you opted in to event drops from {brand.name}.{' '}
                        <a href={l.unsubscribe} style={{ color: t.dim, textDecoration: 'underline' }}>
                          Unsubscribe
                        </a>{' '}
                        (one click) ·{' '}
                        <a href={l.prefs} style={{ color: t.dim, textDecoration: 'underline' }}>
                          Email preferences
                        </a>
                      </p>
                    ) : (
                      <p style={{ margin: '0 0 10px', fontSize: 12, lineHeight: '18px', color: t.faint }}>
                        {kind === 'staff'
                          ? `Operational email for venue staff. It contains host names and booking values, so don’t forward it outside your team.`
                          : `This is a service email about your ${brand.name} account${refCode ? ` and booking ${refCode}` : ''}. It isn’t marketing, so there’s nothing to unsubscribe from.`}
                      </p>
                    )}
                    <p style={{ margin: 0, fontSize: 12, lineHeight: '18px', color: t.faint }}>
                      {brand.name} · {addressPlaceholder}
                    </p>
                  </td>
                </tr>
              </T>
            </td>
          </tr>
        </T>
      </div>
    </div>
  )
}

/** Story helper: render at a fixed client width (e.g. 375 for a phone mail app). */
export function AtWidth({ width, children }: { width: number; children: ReactNode }) {
  return <div style={{ width, margin: '0 auto', boxShadow: '0 0 0 1px #d6d6de' }}>{children}</div>
}
