import { Construction, Ticket } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { Screen, StatusBar } from '@/components/app/chrome'
import { Button } from '@/components/ui/primitives'
import { WhatsAppGlyph } from '../onboarding/parts'
import { StateBlock } from './parts'

/** Planned downtime. Booking paused, tickets unaffected, a concrete "back by" time. */
export function Maintenance({ backBy = '6:00am', minutesLeft = 40 }: { backBy?: string; minutesLeft?: number }) {
  const brand = useBrand()
  return (
    <Screen header={<StatusBar />}>
      <StateBlock
        icon={<Construction className="size-10" />}
        tone="warning"
        title="We’re doing some upkeep"
        actions={
          <>
            <Button block size="lg" icon={<Ticket className="size-5" />}>
              Show my tickets
            </Button>
            <Button block variant="ghost" icon={<WhatsAppGlyph className="size-5 text-whatsapp" />}>
              Tell me on WhatsApp when it’s back
            </Button>
          </>
        }
      >
        <p>
          Booking and payments are paused until about <b className="text-text">{backBy}</b> ({minutesLeft} min).
        </p>
        <div className="rounded-card bg-surface p-3.5 text-left text-sm">
          <div className="font-semibold text-text">Not affected</div>
          <ul className="mt-1 space-y-1">
            <li>· Tickets and QR codes — they open and scan as normal</li>
            <li>· Bookings you’ve already made, and your deposits</li>
          </ul>
        </div>
        <p className="text-xs text-faint">{brand.name} picks the quietest hour of the week for this, never a Friday or Saturday night.</p>
      </StateBlock>
    </Screen>
  )
}
