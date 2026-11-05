import { CircleCheck, CircleExclamationPoint, MessageSquareText } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { me } from '@/data/fixtures'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Button } from '@/components/ui/primitives'
import { NumPad, OtpBoxes, StepProgress, Title, WhatsAppGlyph } from './parts'

export type OtpState = 'default' | 'autofilled' | 'wrong' | 'verifying'

const SAMPLE_CODE = '482913'

/** 6-digit code entry. Autofill from WhatsApp/SMS, inline wrong-code error, resend timer, switch channel. */
export function OtpEntry({
  channel = 'whatsapp',
  phone = me.phone,
  state = 'default',
  code: codeProp,
  resendIn = 30,
  triesLeft = 2,
  whatsAppHelper,
}: {
  channel?: 'whatsapp' | 'sms'
  phone?: string
  state?: OtpState
  /** Digits typed so far. Defaults per state. */
  code?: string
  /** Seconds until "Resend" unlocks. 0 = available now. */
  resendIn?: number
  triesLeft?: number
  /** Show the "open WhatsApp" nudge (user hasn't switched apps yet). */
  whatsAppHelper?: boolean
}) {
  const brand = useBrand()
  const code = codeProp ?? (state === 'default' ? '' : state === 'wrong' ? '482193' : SAMPLE_CODE)
  const viaWa = channel === 'whatsapp'
  const mmss = `${Math.floor(resendIn / 60)}:${String(resendIn % 60).padStart(2, '0')}`

  return (
    <Screen
      header={
        <>
          <AppBar />
          <StepProgress step={2} total={5} />
        </>
      }
      footer={
        (state === 'default' || state === 'wrong') && !whatsAppHelper ? (
          <NumPad
            suggestion={
              state === 'default' && !code ? (
                <span className="flex items-center gap-1.5">
                  <span className="text-dim">From {viaWa ? 'WhatsApp' : 'Messages'}</span>
                  <b className="tracking-widest tabular-nums">{SAMPLE_CODE}</b>
                </span>
              ) : undefined
            }
          />
        ) : state === 'autofilled' ? (
          <BottomBar>
            <Button block size="lg">
              Verify and continue
            </Button>
          </BottomBar>
        ) : undefined
      }
    >
      <Title
        body={
          <>
            Sent to <b className="text-text tabular-nums">{phone}</b> on {viaWa ? 'WhatsApp' : 'SMS'}.{' '}
            <button className="font-semibold text-accent">Wrong number?</button>
          </>
        }
      >
        Enter your code
      </Title>

      <div className="px-5">
        <OtpBoxes code={code} tone={state} />

        <div className="mt-3 min-h-6 text-sm" aria-live="polite">
          {state === 'wrong' && (
            <span className="flex items-start gap-1.5 text-danger">
              <CircleExclamationPoint className="mt-0.5 size-4 shrink-0" />
              That code doesn’t match. Check the latest message and try again — {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left.
            </span>
          )}
          {state === 'autofilled' && (
            <span className="flex items-center gap-1.5 text-success">
              <CircleCheck className="size-4" /> Filled in from {viaWa ? 'WhatsApp' : 'your messages'}
            </span>
          )}
          {state === 'verifying' && (
            <span className="flex items-center gap-2 text-dim">
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Checking…
            </span>
          )}
        </div>

        {whatsAppHelper && viaWa && (
          <div className="mt-4 rounded-card border border-whatsapp/40 bg-whatsapp/10 p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp text-[#06260f]">
                <WhatsAppGlyph className="size-6" />
              </span>
              <div className="text-sm">
                <div className="font-semibold">We sent it to WhatsApp — open WhatsApp</div>
                <div className="mt-0.5 text-dim">
                  Look for a chat from <b className="text-text">{brand.name}</b> with a green verified tick. Tap <b className="text-text">Copy code</b>, then come back here.
                </div>
              </div>
            </div>
            <Button variant="whatsapp" block className="mt-3" icon={<WhatsAppGlyph className="size-5" />}>
              Open WhatsApp
            </Button>
          </div>
        )}

        {state !== 'verifying' && state !== 'autofilled' && (
          <div className="mt-5 flex flex-col items-start gap-1">
            {resendIn > 0 ? (
              <span className="text-sm text-dim">
                Resend code in <b className="text-text tabular-nums">{mmss}</b>
              </span>
            ) : (
              <button className="text-sm font-semibold text-accent">Resend code</button>
            )}
            <button className="inline-flex items-center gap-1.5 py-1 text-sm font-semibold text-dim">
              {viaWa ? (
                <>
                  <MessageSquareText className="size-4" /> Send by SMS instead
                </>
              ) : (
                <>
                  <WhatsAppGlyph className="size-4 text-whatsapp" /> Send on WhatsApp instead
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Screen>
  )
}
