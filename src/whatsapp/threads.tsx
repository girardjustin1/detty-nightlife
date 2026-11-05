// WhatsApp threads, one component per conversation, with props for state.
import { useBrand } from '@/brands/BrandContext'
import { eventById, guests } from '@/data/fixtures'
import { cedis, dayShort, time } from '@/lib/format'
import { canonicalTable, tableQuote } from '@/lib/pricing'
import { arrivalCutoff, booking, event, host, links, quote, refundFor, tableLabel, tier, venue } from '@/emails/sample'
import { BOOKING_WHATSAPP } from '@/config/contact'
import { Avatar, Bubble, DateChip, FlowDropdown, FlowLabel, FlowOptIn, FlowRadio, FlowResponse, FlowSheet, LinkPreview, Notice, VerifiedBadge, WA, WaScreen } from './wa'
import { fill, share, shareDeadline, templateByName } from './templates'

const useT = (name: string) => templateByName(useBrand(), name)
const kojo = guests.find((g) => g.id === 'g1')!
const efua = guests.find((g) => g.id === 'g2')!

// ---------- OTP ----------

export function OtpThread({ copied = false }: { copied?: boolean }) {
  const t = useT('otp_login')
  return (
    <WaScreen peer={{ kind: 'business' }} clock="19:05" toast={copied ? 'Code copied' : undefined}>
      <DateChip>15 December 2026</DateChip>
      <Notice />
      <Bubble from="them" time="19:05" text={fill(t)} footer={t.footer} buttons={t.buttons} />
    </WaScreen>
  )
}

// ---------- Booking confirmed ----------

export function BookingConfirmedThread() {
  const t = useT('booking_confirmed')
  return (
    <WaScreen peer={{ kind: 'business' }} clock="19:13">
      <DateChip>15 December 2026</DateChip>
      <Notice />
      <Bubble from="them" time="19:05" text={fill(useT('otp_login'))} footer="This code expires in 10 minutes." buttons={[{ type: 'copy', label: 'Copy code' }]} />
      <Bubble from="them" time="19:12" header={{ type: 'text', text: t.header! }} text={fill(t)} footer={t.footer} buttons={t.buttons} />
    </WaScreen>
  )
}

// ---------- Deposit receipt ----------

export function DepositReceiptThread() {
  const t = useT('deposit_receipt')
  return (
    <WaScreen peer={{ kind: 'business' }} clock="19:13">
      <DateChip>15 December 2026</DateChip>
      <Bubble from="them" time="19:12" header={{ type: 'text', text: 'Booking confirmed' }} text={`Hi ${host.firstName}, your table is confirmed.\n\n*${venue.name} · ${event.title}*\n🗓 ${dayShort(event.startsAt)} · ${time(event.startsAt)}\n…`} />
      <Bubble from="them" tail={false} time="19:12" header={{ type: 'document', name: `Receipt-${booking.ref}.pdf`, meta: '1 page · PDF · 38 kB' }} text={fill(t)} buttons={t.buttons} />
    </WaScreen>
  )
}

// ---------- Day-of reminder ----------

export type ReminderState = 'sent' | 'running-late' | 'cancel-tapped'

export function ReminderThread({ state = 'running-late' }: { state?: ReminderState }) {
  const brand = useBrand()
  const t = useT('booking_reminder')
  const hoursLeft = 8 // sent 2pm for a 10pm start
  const refund = refundFor(hoursLeft)
  const snippet = `Tonight: ${tableLabel} at ${venue.name} 🎶`
  return (
    <WaScreen peer={{ kind: 'business' }} clock={state === 'running-late' ? '23:04' : state === 'cancel-tapped' ? '14:06' : '14:00'}>
      <DateChip>Today</DateChip>
      <Bubble from="them" time="14:00" text={fill(t)} buttons={t.buttons} pressed={state === 'running-late' ? 'Running late' : state === 'cancel-tapped' ? 'Cancel' : undefined} />
      {state === 'running-late' && (
        <>
          <Bubble from="me" time="22:58" ticks="read" quote={{ author: brand.name, text: snippet }} text="Running late" />
          <Bubble
            from="them"
            time="22:59"
            text={`No wahala, ${host.firstName}. ${tableLabel} is held until *${time(arrivalCutoff)}*. After that the venue may release it.\n\nRoughly how long will you be?`}
            buttons={[
              { type: 'reply', label: 'Under 30 min' },
              { type: 'reply', label: '30–60 min' },
            ]}
            pressed="Under 30 min"
          />
          <Bubble from="me" time="23:01" ticks="read" text="Under 30 min" />
          <Bubble from="them" time="23:01" text={`Noted ✅ The door at ${venue.name} has your name. Your pass is in the app if you need it.`} />
        </>
      )}
      {state === 'cancel-tapped' && (
        <>
          <Bubble from="me" time="14:05" ticks="read" quote={{ author: brand.name, text: snippet }} text="Cancel" />
          <Bubble
            from="them"
            time="14:05"
            text={`Sorry to hear that, ${host.firstName}. If you cancel now (${hoursLeft} hours before), you get *${refund.rule.pct}% of your deposit back: ${cedis(refund.amount)}*. The ${cedis(quote.fee)} booking fee isn’t refundable.\n\nCancel ${tableLabel}?`}
            buttons={[
              { type: 'reply', label: 'Yes, cancel' },
              { type: 'reply', label: 'Keep my table' },
            ]}
          />
        </>
      )}
    </WaScreen>
  )
}

// ---------- Guest invite (host's personal chat) ----------

export type InviteView = 'host' | 'guest' | 'forwarded'

export function GuestInviteThread({ view = 'host' }: { view?: InviteView }) {
  const brand = useBrand()
  const l = links(brand)
  const t = useT('(wa.me share) guest invite')
  const preview = (me: boolean) => (
    <LinkPreview
      me={me}
      image={event.photo}
      title={`You’re on ${host.firstName}’s table · ${venue.name}`}
      description={`${event.title} · ${dayShort(event.startsAt)} · ${venue.minAge}+ · RSVP in 10 seconds on ${brand.name}`}
      domain={l.domain}
    />
  )
  if (view === 'forwarded')
    return (
      <WaScreen peer={{ kind: 'person', name: 'Yaw Boateng', color: '#E67E22', subtitle: 'last seen today at 20:02' }} clock="20:15">
        <DateChip>15 December 2026</DateChip>
        <Bubble from="them" time="20:11" forwarded text={t.body}>
          {preview(false)}
        </Bubble>
        <Bubble from="them" tail={false} time="20:11" text="Efua sent me this, you coming? 👀" />
      </WaScreen>
    )
  const me = view === 'host'
  return (
    <WaScreen peer={me ? { kind: 'person', name: kojo.name, color: '#25A3E1' } : { kind: 'person', name: host.name, color: '#C2185B' }} clock="19:42">
      <DateChip>15 December 2026</DateChip>
      <Bubble from={me ? 'me' : 'them'} time="19:20" ticks={me ? 'read' : undefined} text={t.body}>
        {preview(me)}
      </Bubble>
      <Bubble from={me ? 'them' : 'me'} time="19:41" ticks={me ? undefined : 'read'} text="I dey come!! 🙌 Just confirmed" />
      <Bubble from={me ? 'me' : 'them'} time="19:41" ticks={me ? 'read' : undefined} text="Sharp 🔥 Bring ID oo" />
    </WaScreen>
  )
}

// ---------- Split payment ----------

export function SplitPaymentThread({ view = 'template' }: { view?: 'template' | 'host-group' }) {
  const brand = useBrand()
  const t = useT('split_payment_request')
  if (view === 'host-group') {
    const link = `${links(brand).domain}/s/${booking.ref.replace('DTY-', '')}`
    return (
      <WaScreen peer={{ kind: 'group', name: 'Booth B3 squad 🍾', subtitle: 'Ama, Efua, Kojo, Yaw, Akosua' }} clock="12:31">
        <DateChip>Yesterday</DateChip>
        <Bubble from="them" sender={{ name: 'Kojo Mensah', color: '#25A3E1' }} time="21:14" text="Who's paying for what? 😅" />
        <DateChip>Today</DateChip>
        <Bubble
          from="me"
          time="12:30"
          ticks="delivered"
          text={`Deposit for B3 is ${cedis(quote.deposit)}. That's *${cedis(share)} each*. Pay your share here by ${time(shareDeadline)} tomorrow or the table goes 👇\n${link}`}
        />
        <Bubble from="them" sender={{ name: 'Efua Asante', color: '#D35400' }} time="12:31" text="Paying now 🙏🏾" />
      </WaScreen>
    )
  }
  return (
    <WaScreen peer={{ kind: 'business' }} clock="12:33">
      <DateChip>Today</DateChip>
      <Bubble from="them" time="12:30" text={fill(t)} buttons={t.buttons} />
    </WaScreen>
  )
}

// ---------- Booking changed ----------

export function BookingChangedThread({ change = 'venue-moved' }: { change?: 'venue-moved' | 'upgrade' }) {
  const t = useT('booking_changed')
  const up = tableQuote(tier, [...canonicalTable.lines, { bottleId: 'veuve', qty: 1 }])
  const diff = up.dueNow - quote.dueNow
  const filled =
    change === 'upgrade'
      ? fill({
          body: t.body,
          vars: [
            { name: 'ref', sample: booking.ref },
            { name: 'field', sample: 'Pre-order' },
            { name: 'old', sample: cedis(quote.preOrder) },
            { name: 'new', sample: cedis(up.preOrder) },
            { name: 'note', sample: `You added 1 × Veuve Clicquot. New deposit ${cedis(up.deposit)}: ${cedis(diff)} to pay to keep the bottle. Otherwise your original pre-order stays.` },
          ],
        })
      : fill(t)
  return (
    <WaScreen peer={{ kind: 'business' }} clock="16:05">
      <DateChip>17 December 2026</DateChip>
      <Bubble from="them" time="16:04" text={filled} buttons={change === 'upgrade' ? [{ type: 'url', label: 'Review & pay' }] : t.buttons} />
    </WaScreen>
  )
}

// ---------- Cancelled + refund ----------

export function CancelledThread({ stage = 'refunded' }: { stage?: 'cancelled' | 'refunded' }) {
  const t = useT('booking_cancelled')
  const r = useT('refund_processed')
  return (
    <WaScreen peer={{ kind: 'business' }} clock={stage === 'refunded' ? '09:02' : '12:01'}>
      <DateChip>16 December 2026</DateChip>
      <Bubble from="them" time="12:00" text={fill(t)} buttons={t.buttons} />
      {stage === 'refunded' && (
        <>
          <DateChip>Today</DateChip>
          <Bubble from="them" time="09:00" text={fill(r)} />
        </>
      )}
    </WaScreen>
  )
}

// ---------- Event drop (marketing) ----------

export function EventDropThread({ stopped = false }: { stopped?: boolean }) {
  const brand = useBrand()
  const t = useT('event_drop')
  const drop = eventById('nye-countdown')
  return (
    <WaScreen peer={{ kind: 'business' }} clock={stopped ? '18:07' : '18:00'}>
      <DateChip>Today</DateChip>
      <Bubble from="them" time="18:00" header={{ type: 'image', src: drop.photo, alt: drop.title }} text={fill(t)} footer={t.footer} buttons={t.buttons} pressed={stopped ? 'Stop promotions' : undefined} />
      {stopped && (
        <>
          <Bubble from="me" time="18:06" ticks="read" quote={{ author: brand.name, text: `🎆 ${drop.title} just dropped.` }} text="Stop promotions" />
          <Bubble from="them" time="18:06" text={`Done. You won’t get event drops from ${brand.name} any more. Booking updates (confirmations, reminders, refunds) still come here.\n\nChanged your mind? Turn drops back on in the app under Profile → Notifications.`} />
        </>
      )}
    </WaScreen>
  )
}

// ---------- WhatsApp Flow: guest RSVP → Paystack ----------

export type FlowStep = 'invite' | 'form' | 'summary' | 'handoff'

export function RsvpFlowThread({ step = 'form' }: { step?: FlowStep }) {
  const brand = useBrand()
  const t = useT('rsvp_flow')
  const sheet =
    step === 'form' ? (
      <FlowSheet title="RSVP · The Vault" cta="Continue" step="1 of 2">
        <FlowLabel hint={`${tableLabel} · ${event.title} · ${dayShort(event.startsAt)}`}>Are you coming?</FlowLabel>
        <FlowRadio options={[{ label: 'Yes, count me in' }, { label: 'Can’t make it' }]} value="Yes, count me in" />
        <FlowLabel hint={`${tier.capacity - 3} spots left on the table`}>Party size</FlowLabel>
        <FlowDropdown label="How many of you?" value="Just me" />
        <FlowLabel hint={`The table is held until ${time(arrivalCutoff)}`}>Arrival time</FlowLabel>
        <FlowRadio options={[{ label: '10:00–10:30pm' }, { label: '10:30–11:00pm' }, { label: '11:00–11:30pm', hint: 'Latest arrival' }]} value="10:30–11:00pm" />
        <FlowOptIn label={`I’m ${venue.minAge}+ and will bring a valid ID`} />
        <FlowOptIn label={`Send me booking updates on WhatsApp from ${brand.name}`} />
      </FlowSheet>
    ) : step === 'summary' ? (
      <FlowSheet title="RSVP · The Vault" cta="Continue to payment" step="2 of 2">
        <FlowLabel>Check your details</FlowLabel>
        {[
          ['Name', kojo.name],
          ['Table', `${tableLabel}, ${host.firstName}’s table`],
          ['When', `${dayShort(event.startsAt)} · arriving 10:30–11pm`],
          ['Party', 'Just me'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 text-[15px]" style={{ borderBottom: `1px solid ${WA.divider}` }}>
            <span style={{ color: WA.sub }}>{k}</span>
            <span className="text-right">{v}</span>
          </div>
        ))}
        <div className="mt-5 rounded-lg p-3" style={{ background: '#F0F2F5' }}>
          <div className="flex justify-between text-[15px] font-medium">
            <span>Your share of the deposit</span>
            <span>{cedis(share)}</span>
          </div>
          <div className="mt-1 text-[13px] leading-snug" style={{ color: WA.sub }}>
            {cedis(quote.deposit)} deposit ÷ {booking.partySize} guests. You’ll pay on Paystack with MoMo or card, then come straight back here.
          </div>
        </div>
      </FlowSheet>
    ) : undefined
  return (
    <WaScreen peer={{ kind: 'business' }} clock={step === 'handoff' ? '19:46' : '19:44'} overlay={sheet}>
      <DateChip>15 December 2026</DateChip>
      <Notice />
      <Bubble from="me" time="19:43" ticks="read" text="RSVP K9QPZ" />
      <Bubble from="them" time="19:43" header={{ type: 'text', text: `You’re invited 🍾` }} text={t.body} footer={`${brand.name} · takes 10 seconds`} buttons={t.buttons} />
      {step === 'handoff' && (
        <>
          <FlowResponse time="19:45" title="RSVP · The Vault" />
          <Bubble
            from="them"
            time="19:45"
            text={`You’re in, Kojo 🙌 Pay your *${cedis(share)}* share by ${dayShort(shareDeadline)}, ${time(shareDeadline)} to keep your spot. The link opens Paystack (MoMo or card).`}
            footer="Secured by Paystack"
            buttons={[{ type: 'url', label: `Pay ${cedis(share)} on Paystack` }]}
          />
        </>
      )}
    </WaScreen>
  )
}

// ---------- Promoter broadcast as received by a guest ----------

export function PromoterBroadcastThread({ stopped = false }: { stopped?: boolean }) {
  const brand = useBrand()
  const t = useT('promoter_broadcast')
  const header = t.header!.replace('{{1}}', t.vars[0].sample)
  return (
    <WaScreen peer={{ kind: 'business' }} clock={stopped ? '17:12' : '17:00'}>
      <DateChip>18 December 2026</DateChip>
      <Bubble from="them" time="14:00" text={`${efua.name.split(' ')[0]}, you’re on ${host.firstName}’s table tonight: *${tableLabel}* at ${venue.name}. Arrive by *${time(arrivalCutoff)}* with ID. Your pass is in the app.`} buttons={[{ type: 'url', label: 'Open my pass' }]} />
      <DateChip>Today</DateChip>
      <Bubble from="them" time="17:00" header={{ type: 'text', text: header }} text={fill({ body: t.body, vars: t.vars })} footer={t.footer} buttons={t.buttons} pressed={stopped ? 'Stop promotions' : undefined} />
      {stopped && (
        <>
          <Bubble from="me" time="17:11" ticks="read" quote={{ author: brand.name, text: header }} text="Stop promotions" />
          <Bubble from="them" time="17:11" text={`Done. No more promotions from ${t.vars[0].sample}. Booking updates still come here.`} />
        </>
      )}
    </WaScreen>
  )
}


// ---------- Business profile (the one place WhatsApp shows the number) ----------

export function BusinessProfile() {
  const brand = useBrand()
  return (
    <div className="flex h-full flex-col" style={{ background: '#F0F2F5', fontFamily: WA.font, color: WA.ink }}>
      <div className="h-11 shrink-0" style={{ background: '#fff' }} />
      <div className="flex flex-col items-center px-6 pt-4 pb-5" style={{ background: '#fff' }}>
        <Avatar peer={{ kind: 'business' }} size={112} />
        <div className="mt-3 flex items-center gap-1.5 text-[22px]">
          {brand.name} <VerifiedBadge size={20} />
        </div>
        <div className="mt-0.5 text-[16px]" style={{ color: WA.sub }}>
          {BOOKING_WHATSAPP.display}
        </div>
        <div className="mt-0.5 text-[13px]" style={{ color: WA.sub }}>
          Official business account
        </div>
        <div className="mt-4 flex gap-3">
          {['Message', 'Call', 'Share'].map((b) => (
            <span key={b} className="rounded-xl border px-5 py-2 text-[13px] font-medium" style={{ borderColor: WA.divider, color: WA.teal }}>
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-2 px-5 py-4 text-[14.5px] leading-snug" style={{ background: '#fff' }}>
        <div>{brand.promise}</div>
        <div className="mt-2 text-[13px]" style={{ color: WA.sub }}>
          Nightlife bookings · Accra, Ghana
        </div>
        <div className="mt-1 text-[13px]" style={{ color: WA.link }}>
          {links(brand).domain}
        </div>
      </div>
      <div className="mt-2 px-5 py-4 text-[13px] leading-snug" style={{ background: '#fff', color: WA.sub }}>
        This business uses a secure service from Meta to manage this chat.
      </div>
    </div>
  )
}
