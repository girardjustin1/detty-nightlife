import { useState } from 'react'
import { Lock, MoreHorizontal, Plus } from 'lucide-react'
import { AppBar, Screen, Sheet } from '@/components/app/chrome'
import { PaymentMark, paymentLabels } from '@/components/app/domain'
import { Badge, Button, Chip, TextField, Toggle } from '@/components/ui/primitives'
import { Group, Row } from './parts'

type Saved = { id: string; method: string; label: string; detail: string; isDefault?: boolean }

export const savedMomo: Saved[] = [
  { id: 'pm1', method: 'mtn-momo', label: 'MTN MoMo', detail: '024 ••• 0142 · Ama Owusu', isDefault: true },
  { id: 'pm2', method: 'telecel-cash', label: 'Telecel Cash', detail: '020 ••• 0187 · Ama Owusu' },
]
export const savedCards: Saved[] = [{ id: 'pm3', method: 'card', label: 'Visa •••• 4242', detail: 'Expires 08/28' }]

/** Saved MoMo numbers, cards and the Lightning option. MoMo first: it's how most of Accra pays. */
export function PaymentMethods({
  empty,
  addSheet: initialSheet,
  lightning: initialLightning = true,
}: {
  empty?: boolean
  /** Open the "Add Mobile Money" sheet. */
  addSheet?: boolean
  lightning?: boolean
}) {
  const [sheet, setSheet] = useState(!!initialSheet)
  const [lightning, setLightning] = useState(initialLightning)
  const [network, setNetwork] = useState('mtn-momo')
  const momo = empty ? [] : savedMomo
  const cards = empty ? [] : savedCards

  return (
    <Screen header={<AppBar title="Payment methods" />}>
      <div className="pt-2">
        {empty && (
          <p className="px-5 pb-5 text-sm text-dim">Nothing saved yet. Add your MoMo number once and checkout is two taps — you still approve every payment on your phone.</p>
        )}

        <Group title="Mobile Money" footer="You approve every MoMo payment with your PIN on your phone. We never see or store your PIN.">
          {momo.map((m) => (
            <Row
              key={m.id}
              icon={<PaymentMark method={m.method} size={36} />}
              title={
                <span className="flex items-center gap-2">
                  {m.label} {m.isDefault && <Badge tone="accent">Default</Badge>}
                </span>
              }
              subtitle={<span className="tabular-nums">{m.detail}</span>}
              trailing={<MoreHorizontal className="size-5 text-faint" aria-label="Options" />}
            />
          ))}
          <Row
            onClick={() => setSheet(true)}
            icon={<Plus className="size-4" />}
            title={<span className="text-accent">Add a MoMo number</span>}
            subtitle="MTN, Telecel Cash or AT Money"
          />
        </Group>

        <Group title="Cards" footer="Card details are held by our payment partner, not on this phone.">
          {cards.map((c) => (
            <Row key={c.id} icon={<PaymentMark method={c.method} size={36} />} title={c.label} subtitle={c.detail} trailing={<MoreHorizontal className="size-5 text-faint" aria-label="Options" />} />
          ))}
          <Row icon={<Plus className="size-4" />} title={<span className="text-accent">Add a card</span>} subtitle="Visa or Mastercard" chevron />
        </Group>

        <Group
          title="Crypto"
          footer="Lightning payments are final once sent. Refunds, where the venue allows them, go back to MoMo or card — not to a wallet."
        >
          <Row
            icon={<PaymentMark method="lightning" size={36} />}
            title={
              <span className="flex items-center gap-2">
                Bitcoin Lightning <Badge tone="warning">Beta</Badge>
              </span>
            }
            subtitle="Pay an invoice QR from any Lightning wallet"
            trailing={<Toggle checked={lightning} onChange={setLightning} label="Show Lightning at checkout" />}
          />
        </Group>

        <div className="flex items-start gap-2 px-6 pb-8 text-xs text-faint">
          <Lock className="size-4 shrink-0" />
          <span>Removing a method doesn’t affect bookings you’ve already paid for.</span>
        </div>
      </div>

      {sheet && (
        <Sheet title="Add Mobile Money" onClose={() => setSheet(false)} footer={<Button block size="lg">Save number</Button>}>
          <div className="space-y-5 pb-2">
            <div>
              <span className="mb-2 block text-sm font-medium text-dim">Network</span>
              <div className="flex flex-wrap gap-2">
                {['mtn-momo', 'telecel-cash', 'at-money'].map((n) => (
                  <Chip key={n} selected={network === n} onClick={() => setNetwork(n)} icon={<PaymentMark method={n} size={20} />}>
                    {paymentLabels[n].short}
                  </Chip>
                ))}
              </div>
            </div>
            <TextField label="MoMo number" prefix="🇬🇭 +233" placeholder="24 555 0142" inputMode="tel" defaultValue="24 555 0142" hint="Must be registered for Mobile Money." />
            <TextField label="Name on the account" defaultValue="Ama Owusu" hint="We check this matches before your first payment." />
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm">Make this my default</span>
              <Toggle checked label="Make default" />
            </label>
          </div>
        </Sheet>
      )}
    </Screen>
  )
}
