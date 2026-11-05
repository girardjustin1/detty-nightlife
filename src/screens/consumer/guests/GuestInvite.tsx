import type { ReactNode } from 'react'
import { Clock, Lock, Shirt, Smartphone, Users } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { Logo, Screen, Sheet, StatusBar } from '@/components/app/chrome'
import { Avatar, AvatarStack, Button, Img, TextField } from '@/components/ui/primitives'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { FactRow } from '../bookings/parts'
import { guestMe, host, hostGuestRows, inviteBooking, inviteEvent, inviteLink, inviteSplit, inviteTier, inviteVenue } from './guestData'

/** Phone browser chrome: the guest opened a WhatsApp link, no app installed. */
export function WebFrame({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  const brand = useBrand()
  return (
    <Screen
      header={
        <div className="shrink-0 bg-bg">
          <StatusBar />
          <div className="px-4 pb-2">
            <div className="flex h-9 items-center justify-center gap-1.5 rounded-control bg-surface-2 text-[13px] text-dim">
              <Lock className="size-3" /> {inviteLink(brand.name)}
            </div>
          </div>
        </div>
      }
      footer={footer}
    >
      {children}
    </Screen>
  )
}

export type InviteStep = 'landing' | 'phone' | 'otp' | 'declined'

export function GuestInvite({ step = 'landing', hostCovers = false, allowHostCover = true }: { step?: InviteStep; hostCovers?: boolean; allowHostCover?: boolean }) {
  const brand = useBrand()
  const ev = inviteEvent
  const v = inviteVenue
  const short = inviteTier.name.replace(/^VIP /, '')
  const tableName = `${short[0].toUpperCase()}${short.slice(1)} ${inviteBooking.tableId}`
  const going = hostGuestRows.filter((g) => g.state !== 'declined' && g.state !== 'invited' && g.name !== guestMe.name).map((g) => g.name)

  if (step === 'declined') {
    return (
      <WebFrame>
        <div className="flex flex-col items-center px-8 pt-20 text-center">
          <Avatar name={host.name} size={72} />
          <h1 className="display mt-5 text-3xl">All good, {guestMe.first}</h1>
          <p className="mt-2 text-dim">We’ve told {host.first} you can’t make it. Your spot goes back to the group.</p>
          <Button variant="secondary" className="mt-6">
            Changed your mind? Accept
          </Button>
          <button className="mt-8 text-sm font-semibold text-accent">See what else is on in Accra tonight</button>
        </div>
      </WebFrame>
    )
  }

  return (
    <WebFrame
      footer={
        <div className="shrink-0 border-t border-line bg-bg/95 px-5 pt-3 pb-8 backdrop-blur">
          {hostCovers ? (
            <Button block size="lg">
              Accept invite
            </Button>
          ) : (
            <div className="space-y-2">
              <Button block size="lg">
                Accept & pay {cedis(inviteSplit.share)}
              </Button>
              {allowHostCover && (
                <Button variant="secondary" block>
                  Accept · {host.first} covers my share
                </Button>
              )}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <button className="h-10 px-1 text-sm font-semibold text-dim">Decline</button>
            <button className="flex h-10 items-center gap-1.5 px-1 text-sm font-semibold text-accent">
              <Smartphone className="size-4" /> Get the app
            </button>
          </div>
        </div>
      }
    >
      <div className="relative h-56">
        <Img src={ev.photo} alt={ev.title} rounded={false} className="absolute inset-0" />
        <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        <Logo variant="lockup" className="absolute top-4 left-5 h-6 w-auto" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-4 text-white">
          <div className="flex items-center gap-2 text-sm text-white/85">
            <Avatar name={host.name} size={26} /> {host.first} invited you
          </div>
          <h1 className="display mt-1.5 text-[28px] leading-tight">
            {tableName} at {v.name}
          </h1>
          <div className="text-sm text-white/85">
            {dayShort(ev.startsAt)} · {time(ev.startsAt)} · {ev.title}
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-6">
        <div className={cx('rounded-card border p-4', hostCovers ? 'border-success/40 bg-success/5' : 'border-accent/60 bg-surface')}>
          {hostCovers ? (
            <>
              <div className="text-sm text-dim">Your share</div>
              <div className="display text-3xl">On {host.first} 🥂</div>
              <div className="mt-1 text-sm text-dim">{host.first} has covered the table. Just bring yourself (and ID).</div>
            </>
          ) : (
            <>
              <div className="text-sm text-dim">Your share if you split</div>
              <div className="display text-4xl tabular-nums">{cedis(inviteSplit.share)}</div>
              <div className="mt-1 text-sm text-dim">
                {cedis(inviteSplit.quote.commitment)} table + {cedis(inviteSplit.quote.fee)} booking fee, split {inviteBooking.partySize} ways. Pay by MoMo or card.
              </div>
            </>
          )}
        </div>

        <div className="mt-3 divide-y divide-line">
          <FactRow
            icon={<Users className="size-4" />}
            label="Who’s going"
            value={`${going.length} of ${inviteBooking.partySize} so far`}
            trailing={<AvatarStack names={going} size={26} max={3} />}
          />
          <FactRow icon={<Clock className="size-4" />} label="Arrive by" value={`${time(inviteBooking.arriveBy!)} · doors ${time(ev.doorsAt)}`} />
          <FactRow icon={<Shirt className="size-4" />} label="Dress code" value={`${v.dressCode.split('.')[0]} · ${v.minAge}+ with ID`} />
        </div>

        <p className="mt-4 text-center text-xs text-faint">
          No app needed. We’ll confirm your number with a code, then your pass lives on this page. {brand.name} never shares your number with the venue.
        </p>
      </div>

      {step === 'phone' && (
        <Sheet
          title="Confirm your number"
          onClose={() => {}}
          footer={
            <Button block size="lg">
              Send code
            </Button>
          }
        >
          <p className="text-sm text-dim">So {host.first} knows it’s you, and your pass works on the night.</p>
          <TextField className="mt-4" label="Your phone" prefix="🇬🇭 +233" defaultValue="54 555 0123" inputMode="tel" />
          <TextField className="mt-3" label="Your name" defaultValue={guestMe.name} />
          <p className="mt-3 text-xs text-faint">We send a 6-digit code by SMS. You can get it on WhatsApp instead.</p>
        </Sheet>
      )}
      {step === 'otp' && (
        <Sheet
          title="Enter the code"
          onClose={() => {}}
          footer={
            <Button block size="lg" disabled>
              Verify
            </Button>
          }
        >
          <p className="text-sm text-dim">Sent by SMS to +233 {guestMe.phoneMasked.slice(1)}</p>
          <div className="mt-4 flex justify-center gap-2">
            {['4', '8', '1', '', '', ''].map((d, i) => (
              <span key={i} className={cx('flex h-14 w-11 items-center justify-center rounded-control border bg-surface text-2xl font-semibold', i === 3 ? 'border-accent' : 'border-line', i === 2 && 'mr-2')}>
                {d}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-faint">Resend in 0:24</span>
            <button className="font-semibold text-accent">Send via WhatsApp instead</button>
          </div>
        </Sheet>
      )}
    </WebFrame>
  )
}
