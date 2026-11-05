import { Clock, IdCard, Shirt, ShieldCheck } from 'lucide-react'
import type { FloorPlanId } from '@/data/types'
import { Sheet } from '@/components/app/chrome'
import { Button } from '@/components/ui/primitives'
import { RULES } from '@/lib/pricing'
import { cedis, time } from '@/lib/format'
import { Fact } from './shared'
import { arrivalCutoff, bookingCtx } from './data'

/** Resy "Are you sure?" — only when the venue has hard rules. I understand → Pay; Go back → Review. */
export function VenueRulesSheet({
  venue: planId = 'vault',
  tableLabel = 'B3',
  dueNow,
  onBack,
  onAccept,
}: {
  venue?: FloorPlanId
  tableLabel?: string
  /** Amount the next step will charge (from tableQuote). */
  dueNow?: number
  onBack?: () => void
  onAccept?: () => void
}) {
  const { venue, event } = bookingCtx(planId)
  const cutoff = arrivalCutoff(event.doorsAt)
  return (
    <Sheet
      title="House rules at the door"
      footer={
        <div className="space-y-2.5">
          <Button block size="lg" onClick={onAccept}>
            I understand{dueNow != null && ` · pay ${cedis(dueNow)}`}
          </Button>
          <Button block variant="ghost" onClick={onBack}>
            Go back
          </Button>
        </div>
      }
    >
      <p className="text-sm text-dim">
        {venue.name} turns people away for these. If your group is refused at the door, the deposit isn’t refunded.
      </p>
      <div className="mt-2 divide-y divide-line">
        <Fact icon={<ShieldCheck className="size-4" />} title={`Everyone ${venue.minAge}+`} body={`Every guest at ${tableLabel}, not just you.`} />
        <Fact icon={<IdCard className="size-4" />} title="Bring photo ID" body="Ghana Card, passport or driver’s licence. Photos of ID aren’t accepted." />
        <Fact icon={<Shirt className="size-4" />} title="Dress code" body={venue.dressCode} />
        <Fact
          icon={<Clock className="size-4" />}
          title={`Arrive by ${time(cutoff)}`}
          body={`Your table is held ${RULES.holdMinutesAfterDoors / 60} hours after doors (${time(event.doorsAt)}), then it may be released.`}
        />
      </div>
    </Sheet>
  )
}
