// Guest-side fixtures for 09 Guests. SAMPLE ONLY. Amounts come from splitFor() → tableQuote().
import { eventById, hostGuestRows, plusOneRequests, splitFor, tierFor, tonightBooking, venueById } from '../bookings/bookingData'

export const inviteBooking = tonightBooking
export const inviteEvent = eventById(inviteBooking.eventId)
export const inviteVenue = venueById(inviteBooking.venueId)
export const inviteTier = tierFor(inviteBooking)!
export const inviteSplit = splitFor(inviteBooking)
export const host = { name: inviteBooking.guests[0].name, first: inviteBooking.guests[0].name.split(' ')[0], phone: inviteBooking.guests[0].phone }

/** The guest opening the link. */
export const guestMe = { name: 'Efua Asante', first: 'Efua', phone: '+233 54 555 0123', phoneMasked: '054 ••• 0123' }

export const inviteLink = (brandName: string) => `${brandName.toLowerCase()}.example/i/${inviteBooking.ref.slice(4).toLowerCase()}`

export { hostGuestRows, plusOneRequests }
