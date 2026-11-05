import { useState } from 'react'
import { Bug, ChevronDown, CircleCheck, Flag, ImagePlus, Search } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { bookings, eventById, venueById } from '@/data/fixtures'
import { AppBar, Screen, Sheet } from '@/components/app/chrome'
import { Button, Chip } from '@/components/ui/primitives'
import { cx } from '@/lib/format'
import { WhatsAppGlyph } from '../onboarding/parts'
import { Group, Row } from './parts'

export const faqs = [
  {
    q: 'How do I get in with my ticket?',
    a: 'Open Bookings and show the QR at the door. It works without signal — we save it on your phone when you book. Screenshots won’t scan: the code changes every few seconds.',
  },
  {
    q: 'Can I get my table deposit back?',
    a: 'Each venue sets its own policy. You see the exact refund amount and cut-off time before you pay, and again on your booking. Refunds go back to the MoMo number or card you paid with.',
  },
  {
    q: 'My MoMo payment is stuck on “pending”',
    a: 'Check your phone for the approval prompt and enter your PIN. If it timed out, nothing was taken — try again. If money left your wallet but the booking didn’t confirm, chat with us and send the MoMo transaction ID.',
  },
  { q: 'How does the table minimum work?', a: 'The minimum is what your table spends in total on the night. Bottles you pre-order count toward it; anything extra goes on your tab.' },
  { q: 'Can I give my ticket to a friend?', a: 'Yes. Open the ticket and tap Transfer. They get it on WhatsApp and your copy stops working.' },
  { q: 'What ID do I need at the door?', a: 'Ghana Card, passport or driver’s licence with your date of birth. The name should match your booking.' },
]

const issueTypes = ['Payment or refund', 'Ticket or QR', 'At the venue', 'App problem', 'Something else']

/** FAQ, WhatsApp chat (team + the venue for tonight's booking), and report an issue. */
export function Help({
  openFaq: initialOpen,
  report: initialReport,
  reportSent,
}: {
  /** Index of the expanded FAQ. */
  openFaq?: number
  /** Show the "Report an issue" sheet. */
  report?: boolean
  reportSent?: boolean
}) {
  const brand = useBrand()
  const [open, setOpen] = useState(initialOpen)
  const [report, setReport] = useState(!!initialReport || !!reportSent)
  const [type, setType] = useState(issueTypes[0])
  const next = bookings[0]
  const ev = eventById(next.eventId)
  const venue = venueById(next.venueId)

  return (
    <Screen header={<AppBar title="Help" />}>
      <div className="px-5 pt-2 pb-5">
        <label className="flex h-11 items-center gap-2 rounded-control border border-line bg-surface px-3.5">
          <Search className="size-4 text-dim" />
          <input placeholder="Search help — e.g. refund, QR, MoMo" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint" />
        </label>
      </div>

      <section className="px-5 pb-6">
        <div className="rounded-card border border-line bg-surface p-4">
          <div className="font-semibold">Talk to a person</div>
          <p className="mt-0.5 text-sm text-dim">Our team answers on WhatsApp, every night from 6pm until the last venue closes.</p>
          <Button variant="whatsapp" block className="mt-3" icon={<WhatsAppGlyph className="size-5" />}>
            Chat with us on WhatsApp
          </Button>
          <div className="mt-3 border-t border-line pt-3 text-sm">
            <div className="text-dim">About tonight’s booking?</div>
            <button className="mt-1 flex w-full items-center gap-2 text-left font-semibold">
              <WhatsAppGlyph className="size-4 text-whatsapp" />
              <span className="flex-1 truncate">
                Message {venue.name}’s host
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 pb-6">
        <h2 className="mb-2 px-1 text-xs font-semibold tracking-wider text-faint uppercase">Common questions</h2>
        <div className="divide-y divide-line rounded-card border border-line bg-surface px-4">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? undefined : i)} aria-expanded={open === i} className="flex w-full items-center gap-3 py-3.5 text-left">
                <span className="flex-1 font-medium">{f.q}</span>
                <ChevronDown className={cx('size-5 shrink-0 text-faint transition', open === i && 'rotate-180')} />
              </button>
              {open === i && <p className="-mt-1 pb-4 text-sm text-dim">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <Group title="Something wrong?" className="pb-10">
        <Row icon={<Flag className="size-4" />} title="Report an issue" subtitle="Payments, tickets, a venue, or the app" chevron onClick={() => setReport(true)} />
        <Row icon={<Bug className="size-4" />} title="Send app diagnostics" subtitle="Device and app version only — no personal data" chevron />
      </Group>

      {report && (
        <Sheet
          title={reportSent ? undefined : 'Report an issue'}
          onClose={() => setReport(false)}
          footer={
            reportSent ? (
              <Button block size="lg" variant="secondary" onClick={() => setReport(false)}>
                Done
              </Button>
            ) : (
              <Button block size="lg">
                Send report
              </Button>
            )
          }
        >
          {reportSent ? (
            <div className="py-6 text-center">
              <CircleCheck className="mx-auto size-12 text-success" />
              <div className="display mt-3 text-2xl">Got it — thank you</div>
              <p className="mt-2 text-sm text-dim">
                Report <b className="text-text">#HLP-3081</b>. We’ll reply on WhatsApp, usually within an hour at night. If it’s about money, keep your MoMo transaction ID handy.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {issueTypes.map((t) => (
                  <Chip key={t} selected={type === t} onClick={() => setType(t)}>
                    {t}
                  </Chip>
                ))}
              </div>
              <div className="rounded-control border border-line bg-surface-2 px-4 py-3 text-sm text-dim">
                Booking: <b className="text-text">{next.ref}</b> · {ev.title} <span className="text-accent">Change</span>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-dim">What happened?</span>
                <textarea
                  rows={4}
                  placeholder="e.g. I approved ₵1,944 on MoMo but the booking still says pending."
                  className="w-full resize-none rounded-card border border-line bg-surface-2 p-3.5 text-[15px] outline-none placeholder:text-faint focus:border-accent"
                />
              </label>
              <button className="flex items-center gap-2 text-sm font-semibold text-accent">
                <ImagePlus className="size-4" /> Add a screenshot
              </button>
              <p className="text-xs text-faint">{brand.name} staff will never ask for your MoMo PIN or login code.</p>
            </div>
          )}
        </Sheet>
      )}
    </Screen>
  )
}
