import { Check, ChevronRight, Info, Smartphone } from 'lucide-react'
import { PaymentMark, PriceLines } from '@/components/app/domain'
import { Avatar, Button, Card } from '@/components/ui/primitives'
import { cedis, dayShort, time } from '@/lib/format'
import { WebFrame } from './GuestInvite'
import { guestMe, host, inviteBooking, inviteEvent, inviteSplit, inviteTier, inviteVenue } from './guestData'

export type SharePayState = 'review' | 'approve' | 'paid'

export function GuestSharePay({ state = 'review' }: { state?: SharePayState }) {
  const ev = inviteEvent
  const s = inviteSplit
  return (
    <WebFrame
      footer={
        state === 'paid' ? undefined : (
          <div className="shrink-0 border-t border-line bg-bg/95 px-5 pt-3 pb-8 backdrop-blur">
            <Button block size="lg" loading={state === 'approve'}>
              {state === 'approve' ? 'Waiting for approval' : `Pay ${cedis(s.share)}`}
            </Button>
          </div>
        )
      }
    >
      <div className="px-5 pt-3 pb-8">
        <div className="flex items-center gap-2 text-sm text-dim">
          <Avatar name={host.name} size={24} /> Paying {host.first}’s table
        </div>
        <h1 className="display mt-1 text-xl">
          {inviteTier.name} {inviteBooking.tableId} · {inviteVenue.name}
        </h1>
        <div className="text-sm text-dim">
          {ev.title} · {dayShort(ev.startsAt)}, {time(ev.startsAt)}
        </div>

        {state === 'paid' ? (
          <div className="flex flex-col items-center pt-14 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-success text-bg">
              <Check className="size-10" />
            </span>
            <div className="display mt-5 text-3xl">{cedis(s.share)} paid</div>
            <p className="mt-2 text-dim">
              {host.first} can see you’ve paid. Your pass is ready, and it works offline.
            </p>
            <Button block size="lg" className="mt-8">
              Show my pass
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 text-center">
              <div className="text-sm text-dim">Your share</div>
              <div className="display text-5xl tabular-nums">{cedis(s.share)}</div>
            </div>

            <Card className="mt-5 p-4">
              <PriceLines
                lines={[
                  { label: 'Table commitment', value: s.quote.commitment },
                  { label: 'Booking fee', value: s.quote.fee, muted: true },
                ]}
                total={s.total}
                totalLabel="Table total"
              />
              <div className="mt-2 text-sm text-dim">
                Split {inviteBooking.partySize} ways = <b className="text-text">{cedis(s.share)}</b> each
              </div>
            </Card>

            <div className="mt-4 text-sm font-medium text-dim">Pay with</div>
            <button className="mt-2 flex w-full items-center gap-3 rounded-card border border-accent bg-surface p-3.5 text-left">
              <PaymentMark method="mtn-momo" size={40} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">MTN Mobile Money</span>
                <span className="block text-sm text-dim">{guestMe.phoneMasked} · the number you just confirmed</span>
              </span>
              <span className="flex items-center text-sm font-semibold text-accent">
                Change <ChevronRight className="size-4" />
              </span>
            </button>

            {state === 'approve' ? (
              <div className="mt-3 flex gap-3 rounded-card border border-warning/40 bg-warning/5 p-4 text-sm">
                <Smartphone className="size-5 shrink-0 text-warning" />
                <div>
                  <div className="font-semibold">Approve the prompt on your phone</div>
                  <div className="text-dim">Enter your MoMo PIN when the request for {cedis(s.share)} pops up. No prompt? Dial *170# → My Approvals.</div>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex gap-2 text-xs text-faint">
                <Info className="size-4 shrink-0" />
                Same secure checkout as booking a table: MoMo, card or Lightning. If the booking is cancelled, your share is refunded the same way.
              </div>
            )}
          </>
        )}
      </div>
    </WebFrame>
  )
}
