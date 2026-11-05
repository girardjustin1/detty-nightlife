import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, RefreshCw, Smartphone } from 'lucide-react'
import { AppBar, Screen } from '@/components/app/chrome'
import { PaymentMark } from '@/components/app/domain'
import { Button, ProgressBar } from '@/components/ui/primitives'
import { cedis, cx } from '@/lib/format'
import { CountdownBar, Steps, type StepState } from './PayParts'
import { localPhone, mmss, momoHelp, PAY_RULES, savedMethods, ticketPay, useCountdown, type PaySummary } from './payData'

export type MomoStage = 'sent' | 'pin' | 'approved'

/** MoMo step 2: "Approve on your phone". Never a dead spinner: live steps, countdown, help, resend. */
export function MomoPending({
  pay = ticketPay(),
  methodId = 'momo-1',
  stage = 'pin',
  elapsed = 24,
  helpOpen,
}: {
  pay?: PaySummary
  methodId?: string
  stage?: MomoStage
  /** Seconds since the prompt was sent (story control). */
  elapsed?: number
  helpOpen?: boolean
}) {
  const m = savedMethods.find((s) => s.id === methodId)!
  const total = PAY_RULES.momoTimeoutSeconds
  const left = useCountdown(total - elapsed, stage !== 'approved')
  const resendIn = Math.max(0, PAY_RULES.momoResendAfterSeconds - (total - left))
  const [help, setHelp] = useState(!!helpOpen)
  const h = momoHelp[m.method]
  const approved = stage === 'approved'
  const st = (s: MomoStage): StepState => {
    const order: MomoStage[] = ['sent', 'pin', 'approved']
    const cur = order.indexOf(stage)
    const me = order.indexOf(s)
    return approved || me < cur ? 'done' : me === cur ? 'active' : 'todo'
  }

  return (
    <Screen header={<AppBar title={approved ? 'Payment received' : 'Approve on your phone'} subtitle={pay.subtitle} onClose={() => {}} />}>
      <div className="space-y-5 px-5 pt-2 pb-8">
        <div className="flex flex-col items-center pt-2 text-center">
          <div className="relative flex size-28 items-center justify-center">
            {!approved && <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />}
            <span className={cx('relative flex size-24 items-center justify-center rounded-full', approved ? 'bg-success text-bg' : 'bg-surface-2 text-accent')}>
              {approved ? <Check className="size-12" strokeWidth={3} /> : <Smartphone className="size-11" />}
            </span>
          </div>
          <h1 className="display mt-3 text-[28px] leading-tight">{approved ? `${cedis(pay.dueNow)} received` : `Approve ${cedis(pay.dueNow)}`}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-dim">
            <PaymentMark method={m.method} size={20} />
            {m.label} · {localPhone(m.phone ?? '')}
          </div>
        </div>

        {approved ? (
          <div className="rounded-card border border-success/40 bg-success/10 p-4">
            <div className="font-semibold">Approved on your phone</div>
            <div className="text-sm text-dim">Ref {pay.ref} · receipt sent by SMS and WhatsApp</div>
            <div className="mt-3 text-sm text-dim">Opening your booking…</div>
            <ProgressBar value={70} max={100} tone="success" className="mt-1.5" />
          </div>
        ) : (
          <div className="rounded-card border border-line bg-surface p-4">
            <CountdownBar left={left} total={total} label="Prompt expires in" />
          </div>
        )}

        <div className="rounded-card border border-line bg-surface p-4">
          <Steps
            steps={[
              { title: 'Prompt sent to your phone', body: 'A MoMo pop-up appears on screen. It can take up to 20 seconds.', state: st('sent') },
              { title: 'Enter your MoMo PIN', body: `Check the amount says ${cedis(pay.dueNow)}, then enter your PIN.`, state: st('pin') },
              { title: approved ? 'Approved' : 'We confirm automatically', body: approved ? 'Payment confirmed with the network.' : 'Stay on this screen or come back — it updates on its own.', state: st('approved') },
            ]}
          />
        </div>

        {!approved && (
          <>
            <div className="rounded-card border border-line bg-surface">
              <button onClick={() => setHelp(!help)} className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold">
                Didn’t get the prompt?
                {help ? <ChevronUp className="size-5 text-dim" /> : <ChevronDown className="size-5 text-dim" />}
              </button>
              {help && h && (
                <div className="space-y-2 border-t border-line px-4 py-3 text-sm text-dim">
                  <p>
                    Dial <b className="text-text">{h.dial}</b>, go to <b className="text-text">{h.path}</b>, and approve the {cedis(pay.dueNow)} payment.
                  </p>
                  <p>Make sure the phone has signal and the number is {localPhone(m.phone ?? '')}.</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" disabled={resendIn > 0} icon={resendIn > 0 ? undefined : <RefreshCw className="size-4" />} className="whitespace-nowrap">
                {resendIn > 0 ? `Resend ${mmss(resendIn)}` : 'Resend prompt'}
              </Button>
              <Button variant="ghost">Change method</Button>
            </div>
          </>
        )}
      </div>
    </Screen>
  )
}
