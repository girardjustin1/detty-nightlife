import type { ReactNode } from 'react'
import type { WaButton } from '@/whatsapp/wa'

/**
 * A WhatsApp bot conversation as a small graph. Each node: the bot sends one
 * or more messages, then waits for exactly one kind of reply. Every reply is
 * prefilled, so the tester only taps the glowing control.
 */
export type BotMsg = {
  text?: string
  header?: { type: 'image'; src: string; alt: string } | { type: 'document'; name: string; meta: string } | { type: 'text'; text: string }
  footer?: string
  /** Buttons drawn on the bubble. On the awaited message they're tappable. */
  buttons?: WaButton[]
  /** Custom content inside the bubble (cards, images, mini maps). */
  node?: ReactNode
  width?: number | string
  /** Small grey label above the bubble, e.g. "AI concierge". */
  tag?: string
}

export type ListRow = { id: string; title: string; description?: string }

export type FlowScreen = {
  title: string
  cta: string
  step?: string
  body: ReactNode
}

export type Reply =
  /** Tap one of the buttons on the last bot message. `hot` = the prefilled choice. */
  | { type: 'buttons'; options: { label: string; go: string; say?: string }[]; hot: string }
  /** Tap the list button on the last message, pick a row (prefilled), send. */
  | { type: 'list'; button: string; title: string; sections: { title?: string; rows: ListRow[] }[]; pick: string; go: string; say?: (row: ListRow) => string }
  /** A typed message, already in the composer: tap send. */
  | { type: 'compose'; draft: string; go: string }
  /** Tap the Flow button on the last message, step through prefilled screens. */
  | { type: 'flow'; button: string; screens: FlowScreen[]; responseTitle: string; go: string }
  /** Tap the pay button on the last message; the phone's MoMo PIN prompt appears. */
  | { type: 'momo'; button: string; amount: number; payee: string; network: string; number: string; go: string }
  /** Conversation complete. */
  | { type: 'end' }

export type ChatNode = { bot: BotMsg[]; reply: Reply }

export type ChatScript = {
  id: string
  /** Shown in the WhatsApp header under the brand name. */
  subtitle?: string
  /** Opening time on the clock, e.g. '21:40'. */
  clock: string
  start: string
  nodes: Record<string, ChatNode>
}
