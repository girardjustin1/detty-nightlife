import type { ReactNode } from 'react'
import { useState } from 'react'
import { Briefcase, Cake, Gem, Heart, PartyPopper } from 'lucide-react'
import type { FloorPlanId } from '@/data/types'
import { BottomBar, Screen } from '@/components/app/chrome'
import { Button, Chip } from '@/components/ui/primitives'
import { BookingHeader, ContextPill, StepTitle } from './shared'
import { HoldTimer } from './HoldTimer'
import { arrivalSlots, bookingCtx, occasions, type Occasion } from './data'

const icons: Record<Occasion, ReactNode> = {
  Birthday: <Cake className="size-4" />,
  'December in Accra': <PartyPopper className="size-4" />,
  Anniversary: <Heart className="size-4" />,
  Corporate: <Briefcase className="size-4" />,
  Proposal: <Gem className="size-4" />,
}

const MAX = 200

/** Optional step — occasion chips and a note for the host. Skippable; can also be added after booking. */
export function OccasionRequests({
  venue: planId = 'vault',
  occasion: initialOccasion,
  note: initialNote = '',
  partySize = 6,
}: {
  venue?: FloorPlanId
  occasion?: Occasion
  note?: string
  partySize?: number
}) {
  const { venue, event } = bookingCtx(planId)
  const [occasion, setOccasion] = useState<Occasion | undefined>(initialOccasion)
  const [note, setNote] = useState(initialNote)
  const touched = !!occasion || note.trim().length > 0

  return (
    <Screen
      header={
        <BookingHeader
          step={4}
          optional
          title="Occasion & requests"
          trailing={<HoldTimer />}
          context={<ContextPill event={event} partySize={partySize} arrival={arrivalSlots(event.doorsAt)[1]} />}
        />
      }
      footer={
        <BottomBar
          summary={
            <button className="text-sm font-semibold text-dim underline-offset-4 hover:underline" disabled={!touched}>
              {touched ? 'Clear' : 'Nothing to add'}
            </button>
          }
        >
          <Button size="lg">{touched ? 'Save & review' : 'Skip to review'}</Button>
        </BottomBar>
      }
    >
      <StepTitle title="Celebrating something?" sub={`Optional. ${venue.name}’s host sees this before you arrive. You can also add it after booking.`} />
      <div className="flex flex-wrap gap-2 px-5">
        {occasions.map((o) => (
          <Chip key={o} selected={occasion === o} icon={icons[o]} onClick={() => setOccasion((cur) => (cur === o ? undefined : o))}>
            {o}
          </Chip>
        ))}
      </div>
      {occasion === 'Proposal' && <p className="mx-5 mt-3 text-sm text-dim">We’ll flag it to the host quietly — nothing shows on your guests’ invites.</p>}
      {occasion === 'Birthday' && <p className="mx-5 mt-3 text-sm text-dim">Tip: showpiece bottles arrive with sparklers. Tell us whose birthday it is below.</p>}

      <StepTitle title="Requests for the host" />
      <label className="mx-5 block">
        <span className="sr-only">Note to the venue</span>
        <textarea
          value={note}
          maxLength={MAX}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="e.g. Kojo’s 30th — bring the Moët out at midnight. One guest uses a wheelchair."
          className="block w-full resize-none rounded-card border border-line bg-surface p-4 text-base text-text outline-none placeholder:text-faint focus:border-accent"
        />
        <span className="mt-1.5 flex justify-between text-xs text-faint">
          <span>Requests aren’t guaranteed, but the host will reply on WhatsApp.</span>
          <span className="tabular-nums">
            {note.length}/{MAX}
          </span>
        </span>
      </label>
      <div className="h-6" />
    </Screen>
  )
}
