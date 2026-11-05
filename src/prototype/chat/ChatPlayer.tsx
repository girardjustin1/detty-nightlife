import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, Paperclip, SendHorizontal, Smile, X } from 'lucide-react'
import { Bubble, FlowResponse, FlowSheet, WA, WaScreen, type WaButton } from '@/whatsapp/wa'
import { useProto } from '../ProtoContext'
import { useHighlight } from '../hotspots'
import { MomoPrompt } from './MomoPrompt'
import type { BotMsg, ChatNode, ChatScript, ListRow, Reply } from './types'

type Item =
  | { id: number; kind: 'bot'; msg: BotMsg; time: string; node?: string }
  | { id: number; kind: 'me'; text: string; time: string; quote?: string }
  | { id: number; kind: 'flow'; title: string; time: string }

const TYPING_MS = 650

const clockAt = (start: string, plus: number) => {
  const [h, m] = start.split(':').map(Number)
  const t = h * 60 + m + plus
  return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

/** Plays a ChatScript as a live, tappable WhatsApp conversation. */
export function ChatPlayer({ script, subtitle }: { script: ChatScript; subtitle?: string }) {
  const { tap, finish, hints, restart, menu } = useProto()
  const [items, setItems] = useState<Item[]>([])
  const [nodeId, setNodeId] = useState(script.start)
  const [typing, setTyping] = useState(false)
  const [awaiting, setAwaiting] = useState(false)
  const [pressed, setPressed] = useState<Record<number, string>>({})
  const [sheet, setSheet] = useState<null | 'list' | 'flow' | 'momo'>(null)
  const [flowStep, setFlowStep] = useState(0)
  const [minute, setMinute] = useState(0)
  const nextId = useRef(1)
  const bodyRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const node: ChatNode = script.nodes[nodeId]
  const reply: Reply = node.reply
  const lastBotId = [...items].reverse().find((i) => i.kind === 'bot')?.id

  // Bot sends its messages one by one with a typing indicator.
  useEffect(() => {
    let cancelled = false
    setAwaiting(false)
    const send = async () => {
      for (const msg of node.bot) {
        setTyping(true)
        await new Promise((r) => setTimeout(r, TYPING_MS))
        if (cancelled) return
        setTyping(false)
        setItems((xs) => [...xs, { id: nextId.current++, kind: 'bot', msg, time: clockAt(script.clock, minute), node: nodeId }])
        await new Promise((r) => setTimeout(r, 120))
      }
      if (!cancelled) {
        setAwaiting(true)
        if (node.reply.type === 'end') finish()
      }
    }
    send()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [items, typing])

  const advance = useCallback(
    (go: string, mine?: Omit<Extract<Item, { kind: 'me' }>, 'id' | 'kind' | 'time'> | { flow: string }) => {
      setMinute((m) => m + 1)
      if (mine)
        setItems((xs) => [
          ...xs,
          'flow' in mine
            ? { id: nextId.current++, kind: 'flow', title: mine.flow, time: clockAt(script.clock, minute + 1) }
            : { id: nextId.current++, kind: 'me', ...mine, time: clockAt(script.clock, minute + 1) },
        ])
      setSheet(null)
      setFlowStep(0)
      setNodeId(go)
    },
    [minute, script.clock],
  )

  const onButton = (b: WaButton) => {
    if (!awaiting) return
    tap()
    if (lastBotId) setPressed((p) => ({ ...p, [lastBotId]: b.label }))
    if (reply.type === 'buttons') {
      const opt = reply.options.find((o) => o.label === b.label)
      if (opt) advance(opt.go, { text: opt.say ?? opt.label })
    } else if (reply.type === 'list' && b.label === reply.button) setSheet('list')
    else if (reply.type === 'flow' && b.label === reply.button) setSheet('flow')
    else if (reply.type === 'momo' && b.label === reply.button) setSheet('momo')
  }

  // Hint ring on whatever the tester should tap next.
  const hot: string[] = !awaiting
    ? []
    : reply.type === 'buttons'
      ? [reply.hot]
      : reply.type === 'list' || reply.type === 'flow' || reply.type === 'momo'
        ? sheet === 'flow' && reply.type === 'flow'
          ? [reply.screens[flowStep].cta]
          : sheet
            ? []
            : [reply.button]
        : reply.type === 'compose'
          ? ['Send message']
          : []
  useHighlight(rootRef, hot, hints)

  const composer =
    awaiting && reply.type === 'compose' ? (
      <LiveComposer
        draft={reply.draft}
        onSend={() => {
          tap()
          advance(reply.go, { text: reply.draft })
        }}
      />
    ) : undefined

  return (
    <div ref={rootRef} className="h-full">
      <WaScreen
        peer={{ kind: 'business', subtitle: subtitle ?? script.subtitle }}
        clock={clockAt(script.clock, minute)}
        bodyRef={bodyRef}
        composer={composer}
        overlay={
          <>
            {sheet === 'list' && reply.type === 'list' && (
              <ListSheet
                reply={reply}
                onClose={() => setSheet(null)}
                onSend={(row) => {
                  tap()
                  advance(reply.go, { text: reply.say ? reply.say(row) : row.title + (row.description ? `\n${row.description}` : '') })
                }}
              />
            )}
            {sheet === 'flow' && reply.type === 'flow' && (
              <FlowSheet
                title={reply.screens[flowStep].title}
                step={reply.screens[flowStep].step ?? `${flowStep + 1} of ${reply.screens.length}`}
                cta={reply.screens[flowStep].cta}
                onClose={() => setSheet(null)}
                onCta={() => {
                  tap()
                  if (flowStep < reply.screens.length - 1) setFlowStep((s) => s + 1)
                  else advance(reply.go, { flow: reply.responseTitle })
                }}
              >
                {reply.screens[flowStep].body}
              </FlowSheet>
            )}
            {sheet === 'momo' && reply.type === 'momo' && (
              <MomoPrompt
                amount={reply.amount}
                payee={reply.payee}
                network={reply.network}
                number={reply.number}
                onCancel={() => setSheet(null)}
                onDone={() => advance(reply.go)}
              />
            )}
          </>
        }
      >
        <div className="my-2 flex justify-center">
          <span className="rounded-lg px-3 py-1 text-[12.5px] font-medium shadow-[0_1px_0.5px_rgba(11,20,26,.13)]" style={{ background: WA.chip, color: WA.noticeInk }}>
            Today
          </span>
        </div>
        {items.map((it, i) => {
          const prev = items[i - 1]
          const tail = !prev || prev.kind !== it.kind
          if (it.kind === 'flow') return <FlowResponse key={it.id} time={it.time} title={it.title} />
          if (it.kind === 'me')
            return <Bubble key={it.id} from="me" time={it.time} ticks="read" tail={tail} text={it.text} />
          return (
            <div key={it.id}>
              {it.msg.tag && tail && (
                <div className="mt-2 ml-3 text-[11px] font-medium tracking-wide uppercase" style={{ color: WA.sub }}>
                  {it.msg.tag}
                </div>
              )}
              <Bubble
                from="them"
                time={it.time}
                tail={tail}
                text={it.msg.text}
                header={it.msg.header}
                footer={it.msg.footer}
                buttons={it.msg.buttons}
                width={it.msg.width}
                pressed={pressed[it.id]}
                onButton={it.id === lastBotId && awaiting ? onButton : undefined}
              >
                {it.msg.node}
              </Bubble>
            </div>
          )
        })}
        {typing && <TypingBubble />}
        {awaiting && reply.type === 'end' && (
          <div className="my-4 flex justify-center gap-2">
            <button type="button" data-hot="" onClick={restart} className="rounded-full bg-white px-4 py-2 text-[14px] font-medium shadow" style={{ color: WA.teal }}>
              Play again
            </button>
            <button type="button" onClick={menu} className="rounded-full bg-white px-4 py-2 text-[14px] font-medium shadow" style={{ color: WA.teal }}>
              Back to menu
            </button>
          </div>
        )}
      </WaScreen>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="mt-2 flex px-2">
      <div className="flex h-9 items-center gap-1 rounded-lg rounded-tl-none bg-white px-3.5 shadow-[0_1px_0.5px_rgba(11,20,26,.13)]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 animate-bounce rounded-full bg-[#8696A0]" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

function LiveComposer({ draft, onSend }: { draft: string; onSend: () => void }) {
  return (
    <div className="flex shrink-0 items-end gap-1.5 bg-[#EFEAE2] px-1.5 pt-1.5 pb-7">
      <div className="flex min-h-12 flex-1 items-center gap-3 rounded-[24px] bg-white px-3 py-2 shadow-sm" style={{ color: WA.sub }}>
        <Smile size={23} className="shrink-0" />
        <span className="flex-1 text-[16px] leading-snug" style={{ color: WA.ink }}>
          {draft}
          <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-[#1DAA61] align-middle" />
        </span>
        <Paperclip size={21} className="shrink-0 -rotate-45" />
        <Camera size={22} className="shrink-0" />
      </div>
      <button type="button" aria-label="Send message" onClick={onSend} className="flex size-12 shrink-0 items-center justify-center rounded-full text-white" style={{ background: WA.green }}>
        <SendHorizontal size={21} />
      </button>
    </div>
  )
}

function ListSheet({ reply, onSend, onClose }: { reply: Extract<Reply, { type: 'list' }>; onSend: (row: ListRow) => void; onClose: () => void }) {
  const [pick, setPick] = useState(reply.pick)
  const row = reply.sections.flatMap((s) => s.rows).find((r) => r.id === pick)!
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end" style={{ background: 'rgba(11,20,26,.45)', fontFamily: WA.font, color: WA.ink }}>
      <div className="flex max-h-[80%] flex-col rounded-t-2xl bg-white">
        <div className="flex h-14 shrink-0 items-center gap-3 px-4" style={{ borderBottom: `1px solid ${WA.divider}` }}>
          <button type="button" aria-label="Close" onClick={onClose} className="-m-2 p-2">
            <X size={22} />
          </button>
          <div className="flex-1 text-center text-[17px] font-medium">{reply.title}</div>
          <span className="w-6" />
        </div>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
          {reply.sections.map((s, si) => (
            <div key={si}>
              {s.title && (
                <div className="px-5 pt-4 pb-1 text-[13px] font-medium" style={{ color: WA.teal }}>
                  {s.title}
                </div>
              )}
              {s.rows.map((r) => {
                const on = r.id === pick
                return (
                  <button type="button" key={r.id} onClick={() => setPick(r.id)} className="flex w-full items-center gap-3 px-5 py-3 text-left">
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="text-[15.5px]">{r.title}</div>
                      {r.description && (
                        <div className="mt-0.5 text-[13px]" style={{ color: WA.sub }}>
                          {r.description}
                        </div>
                      )}
                    </div>
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: on ? WA.green : '#8696A0' }}>
                      {on && <span className="size-2.5 rounded-full" style={{ background: WA.green }} />}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <div className="shrink-0 px-5 pt-3 pb-7" style={{ borderTop: `1px solid ${WA.divider}` }}>
          <button type="button" data-hot="" onClick={() => onSend(row)} className="flex h-11 w-full items-center justify-center rounded-full text-[15px] font-medium text-white" style={{ background: WA.green }}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
