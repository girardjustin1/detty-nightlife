// Three candidate brand directions. The product is the same; only the voice,
// tokens (src/styles/index.css) and artwork change. Pick one later — every
// screen story can be viewed in all three from the Storybook toolbar.

export type BrandId = 'detty' | 'aurum' | 'vybe' | 'gold'

export type Brand = {
  id: BrandId
  name: string
  tagline: string
  promise: string
  voice: string[]
  audience: string
  palette: { name: string; hex: string; role: string }[]
  type: { display: string; body: string }
  logo: { mark: string; lockup: string; appIcon: string }
  keyArt: string
  copy: {
    welcomeTitle: string
    welcomeBody: string
    homeGreeting: string
    reserveCta: string
    confirmedTitle: string
    emptyBookings: string
  }
}

const base = import.meta.env.BASE_URL

export const brands: Record<BrandId, Brand> = {
  detty: {
    id: 'detty',
    name: 'Detty',
    tagline: 'Who’s outside tonight?',
    promise: 'Your table, your squad, sorted before you leave the house.',
    voice: ['Loud, warm, a little cheeky', 'Pidgin-friendly, never forced', 'Celebrates the group, not the spend'],
    audience: 'Diaspora and local 21–35s doing Detty December and every weekend after it.',
    palette: [
      { name: 'Aubergine', hex: '#1A0B1E', role: 'Background' },
      { name: 'Coral', hex: '#FF4D2E', role: 'Primary action' },
      { name: 'Sun', hex: '#FFC531', role: 'Highlights, progress' },
      { name: 'Magenta', hex: '#E6197E', role: 'Hot moments, live' },
      { name: 'Shea', hex: '#FFF4E8', role: 'Text' },
    ],
    type: { display: 'Bricolage Grotesque (variable, 800)', body: 'System UI stack — zero download' },
    logo: {
      mark: `${base}brands/detty-mark.svg`,
      lockup: `${base}brands/detty-lockup.svg`,
      appIcon: `${base}brands/detty-app-icon.svg`,
    },
    keyArt: `${base}img/detty-keyart.webp`,
    copy: {
      welcomeTitle: 'Who’s outside tonight?',
      welcomeBody: 'Tickets, tables and bottles for Accra’s best nights — booked in a minute, shared on WhatsApp.',
      homeGreeting: 'Ete sen, Ama 👋',
      reserveCta: 'Lock it in',
      confirmedTitle: 'You’re outside! 🎉',
      emptyBookings: 'No plans yet. Your squad is waiting.',
    },
  },
  aurum: {
    id: 'aurum',
    name: 'Aurum',
    tagline: 'The table is set.',
    promise: 'Discreet VIP reservations at Accra’s finest rooms.',
    voice: ['Calm, concierge, understated', 'Never shouts prices', 'Precise about policies'],
    audience: 'High-spend locals, executives and visitors who want certainty and privacy.',
    palette: [
      { name: 'Onyx', hex: '#0B0B0C', role: 'Background' },
      { name: 'Champagne', hex: '#C9A45C', role: 'Primary action' },
      { name: 'Gilt', hex: '#E7D3A1', role: 'Highlights' },
      { name: 'Bronze', hex: '#8A6D3B', role: 'Secondary' },
      { name: 'Ivory', hex: '#F3EDE2', role: 'Text' },
    ],
    type: { display: 'Playfair Display (variable, 500)', body: 'System UI stack — zero download' },
    logo: {
      mark: `${base}brands/aurum-mark.svg`,
      lockup: `${base}brands/aurum-lockup.svg`,
      appIcon: `${base}brands/aurum-app-icon.svg`,
    },
    keyArt: `${base}img/aurum-keyart.webp`,
    copy: {
      welcomeTitle: 'The table is set.',
      welcomeBody: 'Reserve VIP tables and bottle service at Accra’s finest rooms. Confirmed instantly, managed privately.',
      homeGreeting: 'Good evening, Ama',
      reserveCta: 'Reserve',
      confirmedTitle: 'Your table is confirmed',
      emptyBookings: 'You have no upcoming reservations.',
    },
  },
  vybe: {
    id: 'vybe',
    name: 'Vybe',
    tagline: 'Find the vibe. Skip the line.',
    promise: 'Every night in Accra, sorted by sound.',
    voice: ['Fast, short, music-first', 'Talks genres and DJs, not venues', 'Gen-Z, emoji-light'],
    audience: 'Music-led 18–28s who pick the night by the DJ and the genre.',
    palette: [
      { name: 'Void', hex: '#07070A', role: 'Background' },
      { name: 'Lime', hex: '#C6FF3D', role: 'Primary action' },
      { name: 'Cyan', hex: '#22D3EE', role: 'Info, live' },
      { name: 'Violet', hex: '#7C3AED', role: 'Secondary, app icon' },
      { name: 'Mist', hex: '#F4F4F8', role: 'Text' },
    ],
    type: { display: 'Unbounded (variable, 700, caps)', body: 'System UI stack — zero download' },
    logo: {
      mark: `${base}brands/vybe-mark.svg`,
      lockup: `${base}brands/vybe-lockup.svg`,
      appIcon: `${base}brands/vybe-app-icon.svg`,
    },
    keyArt: `${base}img/vybe-keyart.webp`,
    copy: {
      welcomeTitle: 'Find the vibe. Skip the line.',
      welcomeBody: 'Amapiano, Afrobeats, Afro house — pick the sound, grab tickets or a table, pull up.',
      homeGreeting: 'Yo Ama — what’s the vibe?',
      reserveCta: 'Reserve now',
      confirmedTitle: 'Locked in.',
      emptyBookings: 'Nothing booked. The weekend’s loading…',
    },
  },
  gold: {
    id: 'gold',
    name: 'Detty',
    tagline: 'Who’s outside tonight?',
    promise: 'Accra’s best tables, set properly — for you and your whole squad.',
    voice: ['Warm and a little cheeky, never loud', 'Pidgin-friendly, never forced', 'Celebrates the group; precise about money and policies'],
    audience: 'Diaspora and local 21–35s who want the Detty December energy with VIP certainty.',
    palette: [
      { name: 'Onyx', hex: '#0B0B0C', role: 'Background' },
      { name: 'Champagne', hex: '#C9A45C', role: 'Primary action' },
      { name: 'Lime', hex: '#C6FF3D', role: 'Live, tonight, minimum met' },
      { name: 'Terracotta', hex: '#E8643C', role: 'Hot moments, earth warmth' },
      { name: 'Ivory', hex: '#F3EDE2', role: 'Text' },
    ],
    type: { display: 'Playfair Display (variable, 650)', body: 'System UI stack — zero download' },
    logo: {
      mark: `${base}brands/gold-mark.svg`,
      lockup: `${base}brands/gold-lockup.svg`,
      appIcon: `${base}brands/gold-app-icon.svg`,
    },
    keyArt: `${base}img/detty-keyart.webp`,
    copy: {
      welcomeTitle: 'Who’s outside tonight?',
      welcomeBody: 'Tickets, VIP tables and bottles at Accra’s best rooms — sorted in a minute, shared on WhatsApp.',
      homeGreeting: 'Ete sen, Ama ✨',
      reserveCta: 'Lock it in',
      confirmedTitle: 'You’re outside! Table set ✨',
      emptyBookings: 'No plans yet. Your squad dey wait.',
    },
  },
}

export const brandList = Object.values(brands)
