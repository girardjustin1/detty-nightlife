import { useState } from 'react'
import { Link2 } from 'lucide-react'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Avatar, Button } from '@/components/ui/primitives'
import { cedis } from '@/lib/format'
import { AmountDue, ChargeNote, HoldTimer, MethodList, payCta, type MethodChoice } from './PayParts'
import { otherGuests, splitPay, type PayError, type PaySummary } from './payData'

/** Host chose "split the deposit": host pays their share now; guests pay by link. Reuses the method picker. */
export function SplitDeposit({ pay = splitPay(), selected: initial = 'momo-1', error }: { pay?: PaySummary; selected?: MethodChoice; error?: PayError }) {
  const [selected, setSelected] = useState(initial)
  const [open, setOpen] = useState(false)
  const s = pay.split!
  const invitees = Array.from({ length: s.payers }, (_, i) => otherGuests[i]?.name ?? `Guest ${i + 2}`)
  return (
    <Screen
      header={<AppBar title="Pay your share" subtitle={pay.subtitle} />}
      footer={
        <BottomBar>
          <Button block size="lg">
            {payCta(selected, pay.dueNow)}
          </Button>
        </BottomBar>
      }
    >
      <div className="space-y-4 px-5 pt-1 pb-6">
        <AmountDue pay={pay} open={open} onToggle={() => setOpen(!open)} />

        <div className="rounded-card border border-line bg-surface p-4">
          <div className="text-[17px] font-semibold">
            You pay {cedis(pay.dueNow)} now; guests pay their share by link.
          </div>
          <p className="mt-1 text-sm text-dim">
            {s.payers} guests × {cedis(s.guestShare)} = {cedis(s.guestsOwe)}. After you pay, we give you one WhatsApp link to send to the group.
          </p>
          <ul className="mt-3 divide-y divide-line">
            {invitees.map((n) => (
              <li key={n} className="flex items-center gap-3 py-2">
                <Avatar name={n} size={32} />
                <span className="min-w-0 flex-1 truncate text-sm">{n}</span>
                <span className="text-sm text-dim tabular-nums">{cedis(s.guestShare)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center gap-2 text-xs text-faint">
            <Link2 className="size-3.5" /> If someone doesn’t pay, you can cover their share later from the booking.
          </div>
        </div>

        <HoldTimer what="Your table is" />
        <MethodList selected={selected} error={error} onSelect={setSelected} />
        <ChargeNote />
      </div>
    </Screen>
  )
}
