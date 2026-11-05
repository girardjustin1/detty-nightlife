import { CircleExclamationPoint, Hourglass, RefreshCw } from 'lucide-react'
import { Screen, StatusBar } from '@/components/app/chrome'
import { Button } from '@/components/ui/primitives'
import { WhatsAppGlyph } from '../onboarding/parts'
import { StateBlock } from './parts'
import { whatsappLink } from '@/config/contact'

/** App-wide error with retry. Says whose fault it is and that money is safe. */
export function AppError({
  kind = 'server',
  retrying,
  reference = 'ERR-5Q2-8814',
}: {
  /** server = our side broke; timeout = the network was too slow to finish. */
  kind?: 'server' | 'timeout'
  retrying?: boolean
  /** Short code support can look up. */
  reference?: string
}) {
  return (
    <Screen header={<StatusBar />}>
      <StateBlock
        icon={kind === 'server' ? <CircleExclamationPoint className="size-10" /> : <Hourglass className="size-10" />}
        tone={kind === 'server' ? 'danger' : 'warning'}
        title={kind === 'server' ? 'Something broke on our side' : 'That took too long'}
        actions={
          <>
            <Button block size="lg" loading={retrying} icon={<RefreshCw className="size-4" />}>
              {retrying ? 'Trying again…' : 'Try again'}
            </Button>
            <Button block variant="ghost" icon={<WhatsAppGlyph className="size-5 text-whatsapp" />} onClick={() => window.open(whatsappLink('Hi, the app showed me an error'), '_blank')}>
              Chat with us on WhatsApp
            </Button>
          </>
        }
      >
        <p>{kind === 'server' ? 'It’s not you. We’ve been told and we’re on it.' : 'Your connection is slow right now. Move closer to Wi-Fi or try again in a moment.'}</p>
        <p className="rounded-card bg-surface p-3.5 text-left text-sm">
          <b className="text-text">Were you paying?</b> Check Bookings before you try again. If the payment went through, your booking is there — you won’t be charged twice for the same booking.
        </p>
        <p className="text-xs text-faint">
          Reference <span className="font-mono">{reference}</span> — quote this if you contact us.
        </p>
      </StateBlock>
    </Screen>
  )
}
