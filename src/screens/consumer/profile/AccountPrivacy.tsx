import { useState } from 'react'
import { Bell, Cake, Check, Download, Feather, Languages, Mail, Megaphone, Phone, Trash, User } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { bookings, eventById, me } from '@/data/fixtures'
import { AppBar, Screen, Sheet } from '@/components/app/chrome'
import { Badge, Button, Toggle } from '@/components/ui/primitives'
import { cx, dayShort } from '@/lib/format'
import { WhatsAppGlyph } from '../onboarding/parts'
import { Group, Row } from './parts'

type Language = 'en' | 'tw'

/** Account details, notification channels, data saver, language, and an honest delete. */
export function AccountPrivacy({
  email = me.email,
  whatsAppUpdates: initialWa = true,
  push: initialPush = true,
  promos: initialPromos = false,
  dataSaver: initialSaver = false,
  sheet: initialSheet,
  upcomingBookings = 1,
}: {
  /** Empty string = no email on file. */
  email?: string
  whatsAppUpdates?: boolean
  push?: boolean
  promos?: boolean
  dataSaver?: boolean
  sheet?: 'language' | 'delete'
  upcomingBookings?: number
}) {
  const brand = useBrand()
  const [wa, setWa] = useState(initialWa)
  const [push, setPush] = useState(initialPush)
  const [promos, setPromos] = useState(initialPromos)
  const [saver, setSaver] = useState(initialSaver)
  const [sheet, setSheet] = useState(initialSheet)
  const [lang, setLang] = useState<Language>('en')
  const next = eventById(bookings[0].eventId)

  return (
    <Screen header={<AppBar title="Account & privacy" />}>
      <div className="pt-2">
        <Group title="Account">
          <Row icon={<User className="size-4" />} title="Name" subtitle={me.name} chevron />
          <Row
            icon={<Phone className="size-4" />}
            title="Phone"
            subtitle={<span className="tabular-nums">{me.phone}</span>}
            trailing={<Badge tone="success">Verified</Badge>}
            chevron
          />
          <Row
            icon={<Mail className="size-4" />}
            title="Email"
            subtitle={email || 'Add one to get receipts by email'}
            trailing={email ? undefined : <span className="text-sm font-semibold text-accent">Add</span>}
            chevron
          />
          <Row icon={<Cake className="size-4" />} title="Date of birth" subtitle="14 Mar 1998 · 21+ venues" />
        </Group>

        <Group title="Notifications" footer="Booking messages on WhatsApp include your QR and receipts. Turning them off doesn’t cancel anything.">
          <Row
            icon={<WhatsAppGlyph className="size-4 text-whatsapp" />}
            title="Booking updates on WhatsApp"
            subtitle="Confirmations, receipts, guest RSVPs"
            trailing={<Toggle checked={wa} onChange={setWa} label="Booking updates on WhatsApp" />}
          />
          <Row icon={<Bell className="size-4" />} title="App notifications" subtitle="Notify-list openings, saved nights" trailing={<Toggle checked={push} onChange={setPush} label="App notifications" />} />
          <Row icon={<Megaphone className="size-4" />} title="Offers & promos" subtitle="At most one a week" trailing={<Toggle checked={promos} onChange={setPromos} label="Offers and promos" />} />
        </Group>

        <Group title="App">
          <Row
            icon={<Feather className="size-4" />}
            title="Data saver"
            subtitle="Hide photos, lighter pages. Tickets still work offline."
            trailing={<Toggle checked={saver} onChange={setSaver} label="Data saver" />}
          />
          <Row icon={<Languages className="size-4" />} title="Language" value={lang === 'en' ? 'English' : 'Twi'} chevron onClick={() => setSheet('language')} />
        </Group>

        <Group title="Your data" footer={`${brand.name} never sells your data. Venues only see your name, party size and booking — not your number, unless you message them.`}>
          <Row icon={<Download className="size-4" />} title="Download my data" subtitle="We’ll email a copy within 48 hours" chevron />
          <Row icon={<Trash className="size-4" />} title="Delete account" danger chevron onClick={() => setSheet('delete')} />
        </Group>
      </div>

      {sheet === 'language' && (
        <Sheet title="Language" onClose={() => setSheet(undefined)}>
          <div className="divide-y divide-line pb-4">
            {(
              [
                { id: 'en', name: 'English', note: undefined },
                { id: 'tw', name: 'Twi', note: 'Coming soon — we’re working with native speakers on it' },
              ] as const
            ).map((l) => (
              <button
                key={l.id}
                disabled={l.id === 'tw'}
                onClick={() => {
                  setLang(l.id)
                  setSheet(undefined)
                }}
                className={cx('flex w-full items-center gap-3 py-3.5 text-left', l.id === 'tw' && 'opacity-60')}
              >
                <span className="flex-1">
                  <span className="block font-medium">{l.name}</span>
                  {l.note && <span className="block text-sm text-dim">{l.note}</span>}
                </span>
                {l.id === 'tw' && <Badge>Soon</Badge>}
                {lang === l.id && <Check className="size-5 text-accent" />}
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {sheet === 'delete' && (
        <Sheet
          title="Delete your account?"
          onClose={() => setSheet(undefined)}
          footer={
            <div className="space-y-2">
              <Button variant="danger" block size="lg">
                Delete my account
              </Button>
              <Button variant="ghost" block onClick={() => setSheet(undefined)}>
                Keep my account
              </Button>
            </div>
          }
        >
          <div className="space-y-4 pb-2 text-sm">
            {upcomingBookings > 0 && (
              <div className="rounded-card border border-warning/40 bg-warning/5 p-3.5">
                <div className="font-semibold text-warning">Deleting does not cancel your bookings</div>
                <p className="mt-1 text-dim">
                  You have {upcomingBookings} upcoming booking{upcomingBookings > 1 ? 's' : ''} ({next.title}, {dayShort(next.startsAt)}). It stays booked and your deposit
                  stays with the venue. To get a refund, cancel it first under the venue’s policy.
                </p>
              </div>
            )}
            <div>
              <div className="font-semibold">What we delete</div>
              <p className="text-dim">Your profile, saved nights and venues, Notify list and saved payment methods. You won’t see tickets in the app any more — the door can still find you by name and booking ref <b className="text-text">{bookings[0].ref}</b>.</p>
            </div>
            <div>
              <div className="font-semibold">What we have to keep</div>
              <p className="text-dim">Payment and refund records, for as long as tax law requires. They’re not used for anything else.</p>
            </div>
            <div>
              <div className="font-semibold">Changed your mind?</div>
              <p className="text-dim">Log back in with {me.phone} within 30 days and everything comes back. After that it’s gone for good.</p>
            </div>
          </div>
        </Sheet>
      )}
    </Screen>
  )
}
