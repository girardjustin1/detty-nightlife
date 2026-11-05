import { useState } from 'react'
import { Smartphone } from 'lucide-react'
import { AppBar, BottomBar, Screen, Sheet } from '@/components/app/chrome'
import { PaymentMark } from '@/components/app/domain'
import { Button } from '@/components/ui/primitives'
import { cedis } from '@/lib/format'
import { AmountDue, ChargeNote, HoldTimer, MethodList, payCta, type MethodChoice } from './PayParts'
import { detectNetwork, localPhone, PAY_RULES, savedMethods, ticketPay, type PayError, type PaySummary } from './payData'

/** 07 Pay — one method picker for tickets, tables and split deposits. */
export function MethodPicker({
  pay = ticketPay(),
  selected: initial = 'momo-1',
  error,
  addingNumber,
  newNumber,
  showDetails,
}: {
  pay?: PaySummary
  selected?: MethodChoice
  error?: PayError
  addingNumber?: boolean
  newNumber?: string
  showDetails?: boolean
}) {
  const [selected, setSelected] = useState<MethodChoice>(addingNumber ? 'new-momo' : initial)
  const [open, setOpen] = useState(!!showDetails)
  const [adding, setAdding] = useState(!!addingNumber)
  return (
    <Screen
      header={<AppBar title="Pay" subtitle={pay.subtitle} />}
      footer={
        <BottomBar>
          <Button block size="lg">
            {error ? 'Try again' : payCta(selected, pay.dueNow)}
          </Button>
        </BottomBar>
      }
    >
      <div className="space-y-4 px-5 pt-1 pb-6">
        <AmountDue pay={pay} open={open} onToggle={() => setOpen(!open)} />
        <HoldTimer what={pay.kind === 'tickets' ? 'Your tickets are' : 'Your table is'} />
        <MethodList
          selected={selected}
          error={error}
          addingNumber={adding}
          newNumber={newNumber}
          onSelect={(m) => {
            setSelected(m)
            setAdding(m === 'new-momo')
          }}
        />
        <ChargeNote />
      </div>
    </Screen>
  )
}

/** MoMo step 1: confirm the number before we send the approval prompt. */
export function MomoConfirm({ pay = ticketPay(), methodId = 'momo-1' }: { pay?: PaySummary; methodId?: string }) {
  const m = savedMethods.find((s) => s.id === methodId)!
  const net = detectNetwork(m.phone ?? '') ?? m.method
  return (
    <div className="relative h-full">
      <MethodPicker pay={pay} selected={methodId} />
      <Sheet
        title="Confirm your number"
        onClose={() => {}}
        footer={
          <div className="space-y-2">
            <Button block size="lg" icon={<Smartphone className="size-5" />}>
              Send {cedis(pay.dueNow)} prompt
            </Button>
            <Button block variant="ghost">
              Use a different number
            </Button>
          </div>
        }
      >
        <div className="space-y-4 pb-2">
          <div className="flex items-center gap-3 rounded-card border border-line bg-surface-2 p-3.5">
            <PaymentMark method={net} size={44} />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-dim">{m.label}</div>
              <div className="display text-2xl tabular-nums">{localPhone(m.phone ?? '')}</div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-dim">
            <li>
              1. A prompt for <b className="text-text">{cedis(pay.dueNow)}</b> pops up on this phone.
            </li>
            <li>2. Enter your MoMo PIN to approve it.</li>
            <li>3. We confirm automatically — no need to come back and tap anything.</li>
          </ul>
          <p className="text-xs text-faint">Keep this phone nearby. The prompt expires after {PAY_RULES.momoTimeoutSeconds / 60} minutes.</p>
        </div>
      </Sheet>
    </div>
  )
}

