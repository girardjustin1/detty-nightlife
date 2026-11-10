import { useMemo, type ReactNode } from 'react'
import type { Brand } from '@/brands/brands'
import { useBrand } from '@/brands/BrandContext'
import type { ChatScript } from './chat/types'
import type { ExperienceId } from './ProtoContext'
import { ChatPlayer } from './chat/ChatPlayer'
import { menuBot } from './scripts/menuBot'
import { flowsBot } from './scripts/flowsBot'
import { aiBot } from './scripts/aiBot'
import { appFlow } from './app/flow'

export type Experience = {
  id: ExperienceId
  title: string
  short: string
  blurb: string
  channel: 'WhatsApp' | 'App'
  start: string
  steps?: { id: string; title: string }[]
  render: (step: string) => ReactNode
  strengths: string[]
  tradeoffs: string[]
}

export const experiences: Experience[] = [
  {
    id: 'wa-menu',
    title: 'WhatsApp · Menu bot',
    short: 'Buttons & lists',
    channel: 'WhatsApp',
    blurb: 'A scripted bot: tap reply buttons and pick from lists. Predictable and cheap to run.',
    start: 'chat',
    render: () => <BrandedChat make={menuBot} />,
    strengths: ['Fast to build', 'No AI cost or risk', 'Works on any phone'],
    tradeoffs: ['Rigid: anything off-script needs staff', 'No real floor plan', 'Max 3 buttons / 10 list rows per message'],
  },
  {
    id: 'wa-flows',
    title: 'WhatsApp · Flows',
    short: 'In-chat forms',
    channel: 'WhatsApp',
    blurb: 'WhatsApp Flows: native forms that open inside the chat, with live availability. Closest to an app without leaving WhatsApp.',
    start: 'chat',
    render: () => <BrandedChat make={flowsBot} />,
    strengths: ['Polished, structured booking', 'Few messages, few taps', 'Bottles + guests in one form'],
    tradeoffs: ['Floor plan only as an image', 'Flows need Meta review per change', 'Payment still hands off (MoMo prompt / link)'],
  },
  {
    id: 'wa-ai',
    title: 'WhatsApp · AI concierge',
    short: 'Just type it',
    channel: 'WhatsApp',
    blurb: 'Type what you want in your own words. The AI reads live availability and prices, offers options and books — with a human on standby.',
    start: 'chat',
    render: () => <BrandedChat make={aiBot} />,
    strengths: ['Most natural, handles Pidgin & slang', 'One message can carry the whole order', 'Scales for December in Accra'],
    tradeoffs: ['Needs guardrails: prices only from the system', 'Model cost per chat', 'Must hand off to a human cleanly'],
  },
  {
    id: 'app',
    title: 'Consumer app',
    short: 'Full app, start to finish',
    channel: 'App',
    blurb: 'The installable app from first launch to the QR at the door: sign-in, discover, interactive floor plan, bottles toward the minimum, guests, pay, wallet.',
    start: appFlow.start,
    steps: appFlow.steps.map((s) => ({ id: s.id, title: s.title })),
    render: (step) => appFlow.render(step),
    strengths: ['Interactive floor plan + full bottle menu', 'Manage, modify, transfer, offline QR', 'Richest brand experience'],
    tradeoffs: ['Needs an install or a web visit', 'More to build and maintain', 'Harder to reach first-time guests'],
  },
]

/** Scripts are written per brand (business name, payee, links). */
function BrandedChat({ make }: { make: (b: Brand) => ChatScript }) {
  const brand = useBrand()
  const script = useMemo(() => make(brand), [make, brand])
  return <ChatPlayer script={script} />
}
