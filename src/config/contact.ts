// The one WhatsApp number for bookings and help. Every "Chat on WhatsApp",
// "Book on WhatsApp" and support link must read from here, never hard-code it.
// Display it under the BRAND name (useBrand().name), never a person's name.
export const BOOKING_WHATSAPP = {
  e164: '+233552430217',
  display: '+233 55 243 0217',
  /** wa.me deep link; add ?text= with encodeURIComponent for a prefilled message. */
  link: 'https://wa.me/233552430217',
}

export const whatsappLink = (text?: string) =>
  text ? `${BOOKING_WHATSAPP.link}?text=${encodeURIComponent(text)}` : BOOKING_WHATSAPP.link
