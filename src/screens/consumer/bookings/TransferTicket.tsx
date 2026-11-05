import { useState } from 'react'
import { ArrowRightLeft, Check, Info, Ticket } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { AppBar, BottomBar, Screen, Sheet } from '@/components/app/chrome'
import { Avatar, Badge, Button, Card, TextField } from '@/components/ui/primitives'
import { cx, dayShort, time } from '@/lib/format'
import { contacts, eventById, ticketWalletBooking } from './bookingData'
import { SearchField } from './parts'

export type TransferStep = 'pick' | 'confirm' | 'done'

function TicketSummary() {
  const b = ticketWalletBooking
  const ev = eventById(b.eventId)
  const tier = ev.ticketTiers.find((t) => t.id === b.tickets?.[0]?.tierId)
  return (
    <Card className="flex items-center gap-3 p-3">
      <span className="flex size-10 items-center justify-center rounded-full bg-surface-2 text-accent">
        <Ticket className="size-5" />
      </span>
      <div className="min-w-0">
        <div className="truncate font-semibold">Ticket 2 of 3 · {tier?.name}</div>
        <div className="truncate text-sm text-dim">
          {ev.title} · {dayShort(ev.startsAt)}, {time(ev.startsAt)}
        </div>
      </div>
    </Card>
  )
}

function Picker({ selected, onSelect, query, phone }: { selected?: string; onSelect: (name: string) => void; query: string; phone: string }) {
  const brand = useBrand()
  const list = contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="px-5 pt-2 pb-6">
      <TicketSummary />
      <TextField className="mt-4" label="Send to a phone number" prefix="🇬🇭 +233" placeholder="20 555 0187" inputMode="tel" defaultValue={phone} hint="We send it on WhatsApp, or by SMS if they’re not on WhatsApp." />
      <div className="mt-5 mb-2 text-sm font-medium text-dim">Or pick a contact</div>
      <SearchField placeholder="Search contacts" defaultValue={query} />
      <ul className="mt-2 divide-y divide-line">
        {list.map((c) => (
          <li key={c.name}>
            <button onClick={() => onSelect(c.name)} className="flex w-full items-center gap-3 py-3 text-left">
              <Avatar name={c.name} size={40} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{c.name}</span>
                <span className="block truncate text-sm text-dim">{c.phone}</span>
              </span>
              {c.onApp && <Badge tone="neutral">On {brand.name}</Badge>}
              <span className={cx('flex size-6 shrink-0 items-center justify-center rounded-full border-2', selected === c.name ? 'border-accent bg-accent text-on-accent' : 'border-line')}>
                {selected === c.name && <Check className="size-3.5" />}
              </span>
            </button>
          </li>
        ))}
        {list.length === 0 && <li className="py-8 text-center text-sm text-dim">No contacts match “{query}”. Type their number above instead.</li>}
      </ul>
    </div>
  )
}

export function TransferTicket({ step = 'pick', to, query = '', phone = '' }: { step?: TransferStep; to?: string; query?: string; phone?: string }) {
  const [selected, setSelected] = useState(to)
  const c = contacts.find((x) => x.name === selected)
  const first = selected?.split(' ')[0]

  if (step === 'done' && c) {
    return (
      <Screen
        header={<AppBar title="Ticket transferred" onClose={() => {}} />}
        footer={
          <BottomBar>
            <Button block size="lg">
              Back to my tickets
            </Button>
          </BottomBar>
        }
      >
        <div className="flex flex-col items-center px-8 pt-12 text-center">
          <div className="relative">
            <Avatar name={c.name} size={88} />
            <span className="absolute -right-1 -bottom-1 flex size-9 items-center justify-center rounded-full bg-success text-bg ring-4 ring-bg">
              <Check className="size-5" />
            </span>
          </div>
          <h1 className="display mt-5 text-3xl">{first} now has this ticket</h1>
          <p className="mt-2 text-dim">
            We sent it to {c.phone} on WhatsApp. {first}’s QR works from now; yours for ticket 2 no longer does.
          </p>
          <div className="mt-6 w-full text-left">
            <TicketSummary />
            <div className="mt-3 flex items-center justify-between px-1 text-sm">
              <span className="text-dim">You still hold</span>
              <b>2 of 3 tickets</b>
            </div>
          </div>
          <button className="mt-5 text-sm font-semibold text-accent">Undo transfer (until {first} opens it)</button>
        </div>
      </Screen>
    )
  }

  return (
    <Screen
      className="relative"
      header={<AppBar title="Transfer ticket" subtitle="Send it to a friend" />}
      footer={
        <BottomBar>
          <Button block size="lg" disabled={!selected} icon={<ArrowRightLeft className="size-5" />}>
            {first ? `Send to ${first}` : 'Choose someone'}
          </Button>
        </BottomBar>
      }
    >
      <Picker selected={selected} onSelect={setSelected} query={query} phone={phone} />
      {step === 'confirm' && c && (
        <Sheet
          title={`Send this ticket to ${first}?`}
          onClose={() => {}}
          footer={
            <div className="space-y-2">
              <Button block size="lg">
                Transfer ticket
              </Button>
              <Button variant="ghost" block>
                Not now
              </Button>
            </div>
          }
        >
          <div className="flex items-center gap-3 rounded-card bg-surface-2 p-3">
            <Avatar name={c.name} size={44} />
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-dim">{c.phone}</div>
            </div>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-dim">
            <li className="flex gap-2">
              <Check className="size-4 shrink-0 text-success" /> {first} gets their own rotating QR. No app needed — it opens on the web.
            </li>
            <li className="flex gap-2">
              <Check className="size-4 shrink-0 text-success" /> Your QR for ticket 2 stops working straight away.
            </li>
            <li className="flex gap-2">
              <Info className="size-4 shrink-0 text-warning" /> Transfers are free. Once {first} opens it, you can’t take it back.
            </li>
          </ul>
        </Sheet>
      )}
    </Screen>
  )
}
