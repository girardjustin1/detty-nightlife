/**
 * WhatsApp chat mock (Android, light theme). The channel's own look, not brand tokens:
 * WhatsApp colours are hard-coded here on purpose (partner-mark exception in CLAUDE.md).
 * Only the business avatar and name come from the active brand.
 */
import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { ArrowLeft, BadgeCheck, Camera, Check, CheckCheck, ChevronDown, Copy, EllipsisVertical, ExternalLink, FileText, Forward, List, Lock, Mic, Paperclip, Phone, Reply, Smile, Video, X } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { initials } from '@/lib/format'

export const WA = {
  green: '#1DAA61',
  teal: '#008069',
  header: '#FFFFFF',
  ink: '#111B21',
  sub: '#667781',
  wallpaper: '#EFEAE2',
  inBubble: '#FFFFFF',
  outBubble: '#D9FDD3',
  tick: '#53BDEB',
  link: '#027EB5',
  divider: '#E9EDEF',
  chip: '#FFFFFF',
  notice: '#FFEECD',
  noticeInk: '#54656F',
  verified: '#1D9BF0',
  font: "Roboto, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
}

// Faint doodle wallpaper, inline SVG so it costs nothing to load.
const doodle = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#000" stroke-opacity=".045" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="20" r="7"/><path d="M60 12l5 9 10 1-7 7 2 10-10-5-9 5 2-10-7-7 10-1z"/><path d="M98 18c6 0 10 4 10 9s-4 9-10 9h-6l-5 4v-5c-3-2-4-5-4-8 0-5 6-9 15-9z"/><path d="M14 62h18v14H14zM18 62v-4h10v4"/><path d="M58 60c0 8 12 8 12 0M54 54h20"/><circle cx="100" cy="66" r="3"/><circle cx="92" cy="74" r="2"/><path d="M20 100l8-8 8 8-8 8z"/><path d="M56 96q8-10 16 0t16 0"/><path d="M100 94v16M92 102h16"/></svg>`,
)
const wallpaper: CSSProperties = { backgroundColor: WA.wallpaper, backgroundImage: `url("data:image/svg+xml,${doodle}")`, backgroundSize: '120px 120px' }

// ---------- text formatting (*bold* _italic_ ~strike~ `mono` and URLs) ----------

const TOKEN = /(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~|`[^`\n]+`|https?:\/\/\S+|\b[a-z0-9-]+\.(?:app|com)\/\S*)/g
const IS_URL = /^(https?:\/\/\S+|[a-z0-9-]+\.(?:app|com)\/\S*)$/

export function WaText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i, all) => (
        <Fragment key={i}>
          {line.split(TOKEN).map((part, j) => {
            if (!part) return null
            if (/^\*.+\*$/.test(part)) return <strong key={j}>{part.slice(1, -1)}</strong>
            if (/^_.+_$/.test(part)) return <em key={j}>{part.slice(1, -1)}</em>
            if (/^~.+~$/.test(part)) return <s key={j}>{part.slice(1, -1)}</s>
            if (/^`.+`$/.test(part)) return <code key={j} style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.92em' }}>{part.slice(1, -1)}</code>
            if (IS_URL.test(part))
              return (
                <span key={j} style={{ color: WA.link, textDecoration: 'underline', wordBreak: 'break-all' }}>
                  {part}
                </span>
              )
            return <Fragment key={j}>{part}</Fragment>
          })}
          {i < all.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  )
}

// ---------- chrome ----------

function StatusBar({ clock }: { clock: string }) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between px-7 text-[13px] font-semibold" style={{ background: WA.header, color: WA.ink }}>
      <span>{clock}</span>
      <span className="flex items-center gap-1.5 text-[11px]">
        <span>4G</span>
        <span className="flex items-end gap-px">
          {[4, 6, 8, 10].map((h, i) => (
            <span key={h} className="w-[3px] rounded-sm" style={{ height: h, background: WA.ink, opacity: i === 3 ? 0.3 : 1 }} />
          ))}
        </span>
        <span className="ml-1 inline-block h-[11px] w-[22px] rounded-[3px] border p-px" style={{ borderColor: WA.ink }}>
          <span className="block h-full w-3/5 rounded-[1px]" style={{ background: WA.ink }} />
        </span>
      </span>
    </div>
  )
}

export function VerifiedBadge({ size = 16 }: { size?: number }) {
  return <BadgeCheck size={size} fill={WA.verified} color="#fff" strokeWidth={2.2} aria-label="Verified business" />
}

export type ChatPeer =
  | { kind: 'business'; verified?: boolean; subtitle?: string }
  | { kind: 'person'; name: string; subtitle?: string; color?: string }
  | { kind: 'group'; name: string; subtitle: string }

export function Avatar({ peer, size = 38 }: { peer: ChatPeer; size?: number }) {
  const brand = useBrand()
  if (peer.kind === 'business')
    return <img src={brand.logo.appIcon} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  const name = peer.name
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white" style={{ width: size, height: size, background: peer.kind === 'person' ? (peer.color ?? '#7F66FF') : '#5E8E8B' }}>
      {initials(name)}
    </span>
  )
}

function ChatHeader({ peer }: { peer: ChatPeer }) {
  const brand = useBrand()
  const name = peer.kind === 'business' ? brand.name : peer.name
  const subtitle = peer.subtitle ?? (peer.kind === 'business' ? (peer.verified === false ? 'Business account' : 'Official business account') : 'online')
  return (
    <div className="flex h-14 shrink-0 items-center gap-2 px-2" style={{ background: WA.header, color: WA.ink, borderBottom: `1px solid ${WA.divider}` }}>
      <ArrowLeft size={22} />
      <Avatar peer={peer} />
      <div className="ml-1 min-w-0 flex-1 leading-tight">
        <div className="flex items-center gap-1 text-[16.5px] font-medium">
          <span className="truncate">{name}</span>
          {peer.kind === 'business' && peer.verified !== false && <VerifiedBadge />}
        </div>
        <div className="truncate text-[12.5px]" style={{ color: WA.sub }}>
          {subtitle}
        </div>
      </div>
      {peer.kind !== 'business' && <Video size={22} className="mx-2" />}
      <Phone size={20} className="mx-2" />
      <EllipsisVertical size={20} />
    </div>
  )
}

function Composer({ draft }: { draft?: string }) {
  return (
    <div className="flex shrink-0 items-end gap-1.5 px-1.5 pt-1.5 pb-7" style={wallpaper}>
      <div className="flex min-h-12 flex-1 items-center gap-3 rounded-[24px] px-3 shadow-sm" style={{ background: '#fff', color: WA.sub }}>
        <Smile size={23} />
        <span className="flex-1 text-[16px]" style={{ color: draft ? WA.ink : '#8696A0' }}>
          {draft ?? 'Message'}
        </span>
        <Paperclip size={21} className="-rotate-45" />
        {!draft && <Camera size={22} />}
      </div>
      <span className="flex size-12 items-center justify-center rounded-full text-white" style={{ background: WA.green }}>
        <Mic size={22} />
      </span>
    </div>
  )
}

/** Full phone screen: status bar, chat header, wallpaper, composer. Messages stick to the bottom like a real chat. */
export function WaScreen({ peer, clock = '14:02', children, overlay, draft, toast }: { peer: ChatPeer; clock?: string; children: ReactNode; overlay?: ReactNode; draft?: string; toast?: string }) {
  return (
    <div className="relative flex h-full flex-col" style={{ fontFamily: WA.font, color: WA.ink }}>
      <StatusBar clock={clock} />
      <ChatHeader peer={peer} />
      <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-2 pt-2 pb-1" style={wallpaper}>
        {children}
      </div>
      <Composer draft={draft} />
      {toast && (
        <div className="absolute inset-x-0 bottom-24 flex justify-center">
          <span className="rounded-full px-4 py-2 text-[14px] text-white shadow" style={{ background: '#323739' }}>
            {toast}
          </span>
        </div>
      )}
      {overlay}
    </div>
  )
}

// ---------- chat items ----------

export function DateChip({ children }: { children: ReactNode }) {
  return (
    <div className="my-2 flex justify-center">
      <span className="rounded-lg px-3 py-1 text-[12.5px] font-medium shadow-[0_1px_0.5px_rgba(11,20,26,.13)]" style={{ background: WA.chip, color: WA.noticeInk }}>
        {children}
      </span>
    </div>
  )
}

export function Notice({ children = 'This business uses a secure service from Meta to manage this chat. Tap to learn more.' }: { children?: ReactNode }) {
  return (
    <div className="my-1.5 flex justify-center px-6">
      <span className="rounded-lg px-3 py-1.5 text-center text-[12.5px] leading-snug shadow-[0_1px_0.5px_rgba(11,20,26,.13)]" style={{ background: WA.notice, color: WA.noticeInk }}>
        <Lock size={11} className="mr-1 inline -translate-y-px" />
        {children}
      </span>
    </div>
  )
}

export type Ticks = 'sent' | 'delivered' | 'read'

function Meta({ time, ticks, onImage }: { time: string; ticks?: Ticks; onImage?: boolean }) {
  return (
    <span className="absolute right-2 bottom-1 flex items-center gap-0.5 text-[11px]" style={{ color: onImage ? '#fff' : WA.sub }}>
      {time}
      {ticks === 'sent' && <Check size={15} />}
      {ticks === 'delivered' && <CheckCheck size={15} />}
      {ticks === 'read' && <CheckCheck size={15} color={WA.tick} />}
    </span>
  )
}

const TailIn = () => (
  <svg viewBox="0 0 8 13" width={8} height={13} className="absolute top-0 -left-2" aria-hidden>
    <path fill={WA.inBubble} d="M1.533 3.568 8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
  </svg>
)
const TailOut = () => (
  <svg viewBox="0 0 8 13" width={8} height={13} className="absolute top-0 -right-2" aria-hidden>
    <path fill={WA.outBubble} d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
  </svg>
)

export type WaButton = { type: 'url' | 'reply' | 'copy' | 'phone' | 'flow' | 'list'; label: string }

const buttonIcon = { url: ExternalLink, reply: Reply, copy: Copy, phone: Phone, flow: FileText, list: List }

/**
 * A message bubble. `buttons` render attached below the body (template / interactive buttons).
 * `header` is an image, document or bold text header (templates).
 */
export function Bubble({
  from,
  time,
  ticks,
  tail = true,
  children,
  text,
  header,
  footer,
  buttons,
  forwarded,
  quote,
  sender,
  width,
  pressed,
}: {
  from: 'me' | 'them'
  time: string
  ticks?: Ticks
  tail?: boolean
  children?: ReactNode
  text?: string
  header?: { type: 'image'; src: string; alt: string } | { type: 'document'; name: string; meta: string } | { type: 'text'; text: string }
  footer?: string
  buttons?: WaButton[]
  forwarded?: boolean
  quote?: { author: string; text: string; color?: string }
  /** Group chats: sender name above the text. */
  sender?: { name: string; color: string }
  width?: number | string
  /** Label of a quick-reply that has already been tapped (greys it out). */
  pressed?: string
}) {
  const me = from === 'me'
  const bg = me ? WA.outBubble : WA.inBubble
  return (
    <div className={`flex ${me ? 'justify-end' : 'justify-start'} ${tail ? 'mt-2' : 'mt-0.5'} px-2`}>
      <div className="relative" style={{ maxWidth: '86%', width }}>
        <div className={`rounded-lg shadow-[0_1px_0.5px_rgba(11,20,26,.13)] ${tail ? (me ? 'rounded-tr-none' : 'rounded-tl-none') : ''}`} style={{ background: bg }}>
          {tail && (me ? <TailOut /> : <TailIn />)}
          <div className="relative p-[3px]">
            {header?.type === 'image' && <img src={header.src} alt={header.alt} className="block aspect-[1.9] w-full rounded-md object-cover" />}
            {header?.type === 'document' && (
              <div className="flex items-center gap-2.5 rounded-md p-2.5" style={{ background: me ? '#C8F0C0' : '#F5F6F6' }}>
                <span className="flex h-10 w-8 items-center justify-center rounded-[3px] text-[9px] font-bold text-white" style={{ background: '#E5252A' }}>
                  PDF
                </span>
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-[14.5px]">{header.name}</div>
                  <div className="text-[12px]" style={{ color: WA.sub }}>
                    {header.meta}
                  </div>
                </div>
              </div>
            )}
            <div className="px-[6px] pt-[3px] pb-[8px] text-[15px] leading-[20px]">
              {forwarded && (
                <div className="mb-0.5 flex items-center gap-1 text-[12.5px] italic" style={{ color: WA.sub }}>
                  <Forward size={13} /> Forwarded
                </div>
              )}
              {sender && (
                <div className="text-[13px] font-medium" style={{ color: sender.color }}>
                  {sender.name}
                </div>
              )}
              {quote && (
                <div className="mb-1 overflow-hidden rounded-md border-l-4 px-2 py-1 text-[13px]" style={{ background: me ? '#CFE9BA' : '#F0F2F5', borderColor: quote.color ?? WA.teal }}>
                  <div className="font-medium" style={{ color: quote.color ?? WA.teal }}>
                    {quote.author}
                  </div>
                  <div className="line-clamp-2" style={{ color: WA.sub }}>
                    {quote.text}
                  </div>
                </div>
              )}
              {header?.type === 'text' && <div className="mb-1 text-[15.5px] font-bold">{header.text}</div>}
              {children}
              {text && <WaText text={text} />}
              {footer && (
                <div className="mt-1 text-[13px] leading-[17px]" style={{ color: WA.sub }}>
                  {footer}
                </div>
              )}
              <span className="inline-block w-[64px]" />
            </div>
            <Meta time={time} ticks={ticks} />
          </div>
          {buttons?.map((b) => {
            const Icon = buttonIcon[b.type]
            const done = pressed === b.label
            return (
              <div key={b.label} className="flex h-11 items-center justify-center gap-2 text-[15px] font-medium" style={{ borderTop: `1px solid ${WA.divider}`, color: done ? '#B3BEC4' : WA.link }}>
                <Icon size={17} />
                {b.label}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** Link preview card shown at the top of a message containing a URL. */
export function LinkPreview({ image, title, description, domain, me }: { image: string; title: string; description: string; domain: string; me?: boolean }) {
  return (
    <div className="-mx-[3px] mb-1.5 overflow-hidden rounded-md" style={{ background: me ? '#C8F0C0' : '#F5F6F6' }}>
      <img src={image} alt="" className="block aspect-[1.91] w-full object-cover" />
      <div className="px-2.5 py-2 leading-snug">
        <div className="text-[14px] font-medium" style={{ color: WA.ink }}>
          {title}
        </div>
        <div className="line-clamp-2 text-[12.5px]" style={{ color: WA.sub }}>
          {description}
        </div>
        <div className="mt-0.5 text-[12px]" style={{ color: WA.sub }}>
          {domain}
        </div>
      </div>
    </div>
  )
}

/** "Flow response sent" bubble that WhatsApp shows after a Flow is submitted. */
export function FlowResponse({ time, title }: { time: string; title: string }) {
  return (
    <Bubble from="me" time={time} ticks="read" buttons={[{ type: 'flow', label: 'View response' }]}>
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full" style={{ background: '#C8F0C0', color: WA.teal }}>
          <Check size={18} />
        </span>
        <div className="leading-tight">
          <div className="text-[14.5px] font-medium">{title}</div>
          <div className="text-[12.5px]" style={{ color: WA.sub }}>
            Response sent
          </div>
        </div>
      </div>
    </Bubble>
  )
}

// ---------- WhatsApp Flow sheet ----------

export function FlowSheet({ title, children, cta, step }: { title: string; children: ReactNode; cta: string; step?: string }) {
  const brand = useBrand()
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end" style={{ background: 'rgba(11,20,26,.45)' }}>
      <div className="flex h-[88%] flex-col rounded-t-2xl" style={{ background: '#fff', fontFamily: WA.font, color: WA.ink }}>
        <div className="flex h-14 shrink-0 items-center gap-3 px-4" style={{ borderBottom: `1px solid ${WA.divider}` }}>
          <X size={22} />
          <div className="flex-1 text-[17px] font-medium">{title}</div>
          {step && (
            <span className="text-[12.5px]" style={{ color: WA.sub }}>
              {step}
            </span>
          )}
          <EllipsisVertical size={20} />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden px-5 pt-4">{children}</div>
        <div className="shrink-0 px-5 pt-3 pb-7" style={{ borderTop: `1px solid ${WA.divider}` }}>
          <div className="flex h-11 items-center justify-center rounded-full text-[15px] font-medium text-white" style={{ background: WA.green }}>
            {cta}
          </div>
          <div className="mt-2.5 text-center text-[12px]" style={{ color: WA.sub }}>
            Managed by {brand.name}. <span style={{ color: WA.link }}>Learn more</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FlowLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mt-4 mb-2 first:mt-0">
      <div className="text-[15px] font-medium">{children}</div>
      {hint && (
        <div className="text-[12.5px]" style={{ color: WA.sub }}>
          {hint}
        </div>
      )}
    </div>
  )
}

export function FlowRadio({ options, value }: { options: { label: string; hint?: string }[]; value: string }) {
  return (
    <div>
      {options.map((o) => {
        const on = o.label === value
        return (
          <div key={o.label} className="flex items-center gap-3 py-2">
            <span className="flex size-5 items-center justify-center rounded-full border-2" style={{ borderColor: on ? WA.green : '#8696A0' }}>
              {on && <span className="size-2.5 rounded-full" style={{ background: WA.green }} />}
            </span>
            <div className="leading-tight">
              <div className="text-[15px]">{o.label}</div>
              {o.hint && (
                <div className="text-[12.5px]" style={{ color: WA.sub }}>
                  {o.hint}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function FlowDropdown({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative mt-1 rounded-md border px-3 pt-4 pb-2" style={{ borderColor: '#8696A0' }}>
      <span className="absolute -top-2 left-2 bg-white px-1 text-[12px]" style={{ color: WA.sub }}>
        {label}
      </span>
      <div className="flex items-center justify-between text-[15px]">
        {value}
        <ChevronDown size={18} color={WA.sub} />
      </div>
    </div>
  )
}

export function FlowOptIn({ label, checked = true }: { label: ReactNode; checked?: boolean }) {
  return (
    <div className="mt-4 flex items-start gap-3">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px] border-2" style={{ borderColor: checked ? WA.green : '#8696A0', background: checked ? WA.green : 'transparent' }}>
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </span>
      <div className="text-[14px] leading-snug">{label}</div>
    </div>
  )
}
