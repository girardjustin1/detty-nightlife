import { ExternalLink, Lock, ShieldCheck } from 'lucide-react'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Button, TextField, Toggle } from '@/components/ui/primitives'
import { cedis } from '@/lib/format'
import { AmountDue, ChargeNote, CountdownBar, Steps } from './PayParts'
import { PAY_RULES, payErrors, tablePay, useCountdown, type PaySummary } from './payData'

/** Minimal card form: number, expiry, CVC, name. No billing address (SeatGeek's full form is too much here). */
export function CardForm({ pay = tablePay(), filled, declined }: { pay?: PaySummary; filled?: boolean; declined?: boolean }) {
  return (
    <Screen
      header={<AppBar title="Add a card" subtitle={pay.subtitle} />}
      footer={
        <BottomBar>
          <Button block size="lg" icon={<Lock className="size-4" />} disabled={!filled}>
            Pay {cedis(pay.dueNow)}
          </Button>
        </BottomBar>
      }
    >
      <div className="space-y-4 px-5 pt-1 pb-6">
        <AmountDue pay={pay} compact />
        <TextField
          label="Card number"
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          defaultValue={filled ? '4000 0566 5566 5556' : ''}
          error={declined ? `${payErrors['card-declined'].title}. ${payErrors['card-declined'].body}` : undefined}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Expiry" placeholder="MM/YY" inputMode="numeric" defaultValue={filled ? '08/28' : ''} />
          <TextField label="CVC" placeholder="3 digits" inputMode="numeric" defaultValue={filled ? '•••' : ''} />
        </div>
        <TextField label="Name on card" placeholder="As printed" autoComplete="cc-name" defaultValue={filled ? 'AMA OWUSU' : ''} />
        <div className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-3">
          <div>
            <div className="font-medium">Save for next time</div>
            <div className="text-sm text-dim">Stored by our payment partner, not on this phone</div>
          </div>
          <Toggle checked label="Save card" />
        </div>
        <div className="flex gap-2 rounded-card bg-surface-2 px-4 py-3 text-sm text-dim">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent-2" />
          <span>3-D Secure may open your bank’s page or app to confirm. Come back here when it’s done.</span>
        </div>
        <ChargeNote />
      </div>
    </Screen>
  )
}

/** Card step 2: waiting on the bank's 3-D Secure check. */
export function CardThreeDS({ pay = tablePay(), elapsed = 12 }: { pay?: PaySummary; elapsed?: number }) {
  const total = PAY_RULES.threeDSTimeoutSeconds
  const left = useCountdown(total - elapsed)
  return (
    <Screen header={<AppBar title="Confirm with your bank" subtitle={pay.subtitle} onClose={() => {}} />}>
      <div className="space-y-5 px-5 pt-2 pb-8">
        <div className="flex flex-col items-center pt-2 text-center">
          <div className="relative flex size-24 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
            <span className="relative flex size-20 items-center justify-center rounded-full bg-surface-2 text-accent">
              <ShieldCheck className="size-10" />
            </span>
          </div>
          <h1 className="display mt-3 text-[26px] leading-tight">Your bank is checking {cedis(pay.dueNow)}</h1>
          <p className="mt-1 text-sm text-dim">Visa ending 4821 · 3-D Secure</p>
        </div>

        <div className="rounded-card border border-line bg-surface p-4">
          <CountdownBar left={left} total={total} label="Bank check expires in" />
        </div>

        <div className="rounded-card border border-line bg-surface p-4">
          <Steps
            steps={[
              { title: 'Card details sent securely', state: 'done' },
              { title: 'Approve in your bank’s page or app', body: 'You may get an SMS code or a push notification from your bank.', state: 'active' },
              { title: 'Payment confirmed', body: 'We bring you straight back to your booking.', state: 'todo' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" icon={<ExternalLink className="size-4" />}>
            Reopen bank page
          </Button>
          <Button variant="ghost">Use MoMo instead</Button>
        </div>
        <p className="px-1 text-center text-xs text-faint">Nothing is charged until your bank approves.</p>
      </div>
    </Screen>
  )
}
