import { Check, Clock, MapPin, MessageCircle, Navigation, Phone, RefreshCw, Shirt, Smartphone } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { BOOKING_WHATSAPP, whatsappLink } from '@/config/contact'
import { FakeQR } from '@/components/app/domain'
import { Avatar, Badge, Button, IconButton } from '@/components/ui/primitives'
import { cedis, dayShort, time } from '@/lib/format'
import { FactRow, MiniFloorPlan, OfflinePill } from '../bookings/parts'
import { WebFrame } from './GuestInvite'
import { guestMe, host, inviteBooking, inviteEvent, inviteSplit, inviteTier, inviteVenue } from './guestData'

export function GuestPass({ paid = true }: { paid?: boolean }) {
  const brand = useBrand()
  const ev = inviteEvent
  const v = inviteVenue
  return (
    <WebFrame>
      <div className="px-5 pt-2 pb-8">
        <div className="flex items-center justify-between">
          <Badge tone="success">
            <Check className="size-3.5" /> You’re on the list
          </Badge>
          <OfflinePill />
        </div>
        <h1 className="display mt-3 text-[26px] leading-tight">{ev.title}</h1>
        <div className="text-sm text-dim">
          {dayShort(ev.startsAt)} · {time(ev.startsAt)} · {v.name}
        </div>

        <div className="mt-4 flex flex-col items-center rounded-card bg-surface p-5 ring-1 ring-line">
          <FakeQR seed={`${inviteBooking.ref}-${guestMe.phone}`} size={200} />
          <div className="mt-3 flex items-center gap-1.5 text-xs text-dim">
            <RefreshCw className="size-3.5 text-accent" /> Rotating code — screenshots won’t get you in
          </div>
          <div className="mt-3 w-full rounded-control bg-surface-2 px-3 py-2.5 text-center">
            <div className="font-semibold">{guestMe.name}</div>
            <div className="text-xs text-dim">
              Guest of {host.name} · {inviteTier.name} {inviteBooking.tableId} · {paid ? `share paid ${cedis(inviteSplit.share)}` : `covered by ${host.first}`}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <MiniFloorPlan venueId={v.id} tableId={inviteBooking.tableId!} height={160} />
        </div>
        <div className="mt-1 divide-y divide-line">
          <FactRow icon={<Clock className="size-4" />} label="Arrive by" value={`${time(inviteBooking.arriveBy!)} — table released after`} />
          <FactRow
            icon={<MapPin className="size-4" />}
            label="Where"
            value={v.address}
            trailing={
              <IconButton label="Directions">
                <Navigation className="size-4" />
              </IconButton>
            }
          />
          <FactRow icon={<Shirt className="size-4" />} label="Dress code" value={`${v.dressCode.split('.')[0]} · ${v.minAge}+ with ID`} />
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-card border border-line bg-surface p-3.5">
          <Avatar name={host.name} size={44} />
          <div className="min-w-0 flex-1">
            <div className="text-xs text-faint">Your host</div>
            <div className="font-semibold">{host.name}</div>
          </div>
          <IconButton label={`WhatsApp ${host.first}`} className="bg-whatsapp text-[#06260f]">
            <MessageCircle className="size-5" />
          </IconButton>
          <IconButton label={`Call ${host.first}`}>
            <Phone className="size-5" />
          </IconButton>
        </div>

        <a
          href={whatsappLink(`Booking ${inviteBooking.ref}: I'm ${guestMe.name}, a guest at ${inviteTier.name} ${inviteBooking.tableId}`)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 text-sm text-dim"
        >
          <MessageCircle className="size-4" /> Need help? WhatsApp {brand.name} bookings · {BOOKING_WHATSAPP.display}
        </a>

        <div className="mt-4 rounded-card border border-dashed border-line p-4 text-center">
          <div className="text-sm font-semibold">Keep your pass in the app</div>
          <div className="mt-0.5 text-xs text-dim">Optional. This page keeps working offline once it has loaded.</div>
          <Button variant="secondary" size="sm" className="mt-3" icon={<Smartphone className="size-4" />}>
            Get {brand.name}
          </Button>
        </div>
      </div>
    </WebFrame>
  )
}
