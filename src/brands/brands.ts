// Candidate brand directions. The product is the same; only the voice, tokens
// (src/styles/index.css) and artwork change. Every screen story can be viewed
// in any of them from the Storybook toolbar.
//
// `era` groups them: the six `rebrand` directions (10 Nov) are current. The
// earlier ones are kept as an archive of how we got here; they use a name and a
// black + gold look that sit too close to an existing events app.

export type NewBrandId = 'jama' | 'fiada' | 'akonnwa' | 'kpanlogo' | 'harmattan' | 'anadwo'
export type ArchiveBrandId = 'detty' | 'aurum' | 'vybe' | 'gold' | 'gold2'
export type BrandId = NewBrandId | ArchiveBrandId

export type Brand = {
  id: BrandId
  era: 'rebrand' | 'archive'
  /** Light or dark UI. Only one direction is light. */
  theme: 'dark' | 'light'
  /** Which of the three written voices the emails and chat scripts use. */
  voiceFamily: 'detty' | 'aurum' | 'vybe'
  /** Placeholder host for sample links and email senders. Never a real domain. */
  domain: string
  /** One-line strategic idea, and where the name comes from (rebrand directions). */
  idea?: string
  nameOrigin?: string
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
  jama: {
    id: 'jama',
    era: 'rebrand',
    theme: 'light',
    voiceFamily: 'detty',
    domain: 'jama.example',
    idea: 'The night belongs to the group. Built around the squad, not the spender.',
    nameOrigin: 'Jama: the songs and chants Ghanaian crowds sing together, at school games and street parties.',
    name: 'Jama',
    tagline: 'Bring everybody.',
    promise: 'One plan, one link, the whole squad inside.',
    voice: ['Loud, warm, a little cheeky', 'Pidgin-friendly, never forced', 'Talks to the group chat, not the big spender'],
    audience: 'Friend groups of 21–32s, local and diaspora, who plan the night together on WhatsApp.',
    palette: [
      { name: 'Paper', hex: '#FFF6EA', role: 'Background' },
      { name: 'Tomato', hex: '#EE3B24', role: 'Primary action' },
      { name: 'Cobalt', hex: '#1F4FFF', role: 'Highlights, progress' },
      { name: 'Bubblegum', hex: '#FF5FA2', role: 'Hot moments, live' },
      { name: 'Ink', hex: '#1B1320', role: 'Text' },
    ],
    type: { display: 'Bricolage Grotesque (variable, 800)', body: 'System UI stack — zero download' },
    logo: { mark: `${base}brands/jama-mark.svg`, lockup: `${base}brands/jama-lockup.svg`, appIcon: `${base}brands/jama-app-icon.svg` },
    keyArt: `${base}img/jama-keyart.webp`,
    copy: {
      welcomeTitle: 'Bring everybody.',
      welcomeBody: 'Tickets, tables and bottles for Accra’s best nights. Book in a minute, share it on WhatsApp.',
      homeGreeting: 'Ete sen, Ama 👋',
      reserveCta: 'Lock it in',
      confirmedTitle: 'We move! 🎉',
      emptyBookings: 'No plans yet. Your people dey wait.',
    },
  },
  fiada: {
    id: 'fiada',
    era: 'rebrand',
    theme: 'dark',
    voiceFamily: 'aurum',
    domain: 'fiada.example',
    idea: 'Own the start of the weekend. Rooftops, sundowners and the slow build before the club.',
    nameOrigin: 'Fiada: “Friday” in Twi. Say it “fee-AH-da”.',
    name: 'Fiada',
    tagline: 'Friday starts at sundown.',
    promise: 'From sundowner to last song, one plan for the whole evening.',
    voice: ['Unhurried, warm, local', 'Starts with the place and the hour', 'A Twi word or two, always explained'],
    audience: 'Locals and returnees, 25–40, whose night starts with dinner or a rooftop, not a queue.',
    palette: [
      { name: 'Dusk', hex: '#12102B', role: 'Background' },
      { name: 'Coral', hex: '#FF7A6B', role: 'Primary action' },
      { name: 'Periwinkle', hex: '#9DB4FF', role: 'Highlights, progress' },
      { name: 'Hibiscus', hex: '#FF4F8B', role: 'Hot moments, live' },
      { name: 'Shell', hex: '#F7EFF3', role: 'Text' },
    ],
    type: { display: 'Syne (variable, 700)', body: 'System UI stack — zero download' },
    logo: { mark: `${base}brands/fiada-mark.svg`, lockup: `${base}brands/fiada-lockup.svg`, appIcon: `${base}brands/fiada-app-icon.svg` },
    keyArt: `${base}img/fiada-keyart.webp`,
    copy: {
      welcomeTitle: 'Friday starts at sundown.',
      welcomeBody: 'Find tonight’s rooms, hold a table and bring your people. Sorted before the sun goes down.',
      homeGreeting: 'Good evening, Ama',
      reserveCta: 'Hold my table',
      confirmedTitle: 'Your evening is set',
      emptyBookings: 'Nothing planned yet. The evening is young.',
    },
  },
  akonnwa: {
    id: 'akonnwa',
    era: 'rebrand',
    theme: 'dark',
    voiceFamily: 'aurum',
    domain: 'akonnwa.example',
    idea: 'Table-first. The booking is a commitment on both sides, and the rules are clear before you pay.',
    nameOrigin: 'Akonnwa: “seat” or “stool” in Twi. Say it “ah-KON-wa”. Meaning to be confirmed with a Twi speaker.',
    name: 'Akonnwa',
    tagline: 'Your seat is kept.',
    promise: 'The table you booked, at the price you saw, held until you arrive.',
    voice: ['Calm, precise, concierge', 'Exact about money, time and policy', 'Never shouts'],
    audience: 'Hosts who book tables: birthdays, client nights, returnees with a group. 26–45.',
    palette: [
      { name: 'Bottle', hex: '#0C1F17', role: 'Background' },
      { name: 'Rose', hex: '#FF8FA3', role: 'Primary action' },
      { name: 'Mint', hex: '#BFE3C8', role: 'Highlights, progress' },
      { name: 'Raspberry', hex: '#FF5A7A', role: 'Hot moments, live' },
      { name: 'Cream', hex: '#F4EFE3', role: 'Text' },
    ],
    type: { display: 'Playfair Display (variable, 600)', body: 'System UI stack — zero download' },
    logo: { mark: `${base}brands/akonnwa-mark.svg`, lockup: `${base}brands/akonnwa-lockup.svg`, appIcon: `${base}brands/akonnwa-app-icon.svg` },
    keyArt: `${base}img/akonnwa-keyart.webp`,
    copy: {
      welcomeTitle: 'Your seat is kept.',
      welcomeBody: 'Reserve tables and bottle service at Accra’s best rooms. Confirmed on the spot, with the minimum spend clear up front.',
      homeGreeting: 'Good evening, Ama',
      reserveCta: 'Reserve',
      confirmedTitle: 'Your table is confirmed',
      emptyBookings: 'You have no upcoming reservations.',
    },
  },
  kpanlogo: {
    id: 'kpanlogo',
    era: 'rebrand',
    theme: 'dark',
    voiceFamily: 'vybe',
    domain: 'kpanlogo.example',
    idea: 'Music first, and proudly from Accra. Pick the night by the sound and get in fast.',
    nameOrigin: 'Kpanlogo: the drum-and-dance style Ga youth created in Accra in the 1960s. Say it “pan-LO-go”.',
    name: 'Kpanlogo',
    tagline: 'Accra’s rhythm, every night.',
    promise: 'Every night in Accra, sorted by sound, booked in a minute.',
    voice: ['Fast, short, music-first', 'Talks DJs and genres before venues', 'Slang with a light touch'],
    audience: 'Music-led 18–28s who choose the night by the DJ and the genre.',
    palette: [
      { name: 'Navy', hex: '#050A1F', role: 'Background' },
      { name: 'Electric', hex: '#3D7BFF', role: 'Primary action' },
      { name: 'Lime', hex: '#C6FF3D', role: 'Highlights, live' },
      { name: 'Flash', hex: '#FF4D9D', role: 'Hot moments' },
      { name: 'Ice', hex: '#F2F5FF', role: 'Text' },
    ],
    type: { display: 'Unbounded (variable, 800, caps)', body: 'System UI stack — zero download' },
    logo: { mark: `${base}brands/kpanlogo-mark.svg`, lockup: `${base}brands/kpanlogo-lockup.svg`, appIcon: `${base}brands/kpanlogo-app-icon.svg` },
    keyArt: `${base}img/kpanlogo-keyart.webp`,
    copy: {
      welcomeTitle: 'Accra’s rhythm, every night.',
      welcomeBody: 'Amapiano, Afrobeats, Afro house. Pick the sound, grab tickets or a table, pull up.',
      homeGreeting: 'Ama, what’s the sound tonight?',
      reserveCta: 'Lock in',
      confirmedTitle: 'Locked in.',
      emptyBookings: 'Nothing booked. The weekend’s loading…',
    },
  },
  harmattan: {
    id: 'harmattan',
    era: 'rebrand',
    theme: 'dark',
    voiceFamily: 'detty',
    domain: 'harmattan.example',
    idea: 'The season everyone comes home for. Warm, nostalgic, made for returnees and their people.',
    nameOrigin: 'Harmattan: the dry, hazy wind that arrives in December and marks party season across West Africa.',
    name: 'Harmattan',
    tagline: 'Warm nights, all season.',
    promise: 'Home for the season? Every night planned, every table held.',
    voice: ['Warm, storytelling, a little nostalgic', 'Welcomes people home', 'Plain about prices and policies'],
    audience: 'Diaspora returnees and the friends and family hosting them, 24–40.',
    palette: [
      { name: 'Cocoa', hex: '#1F130E', role: 'Background' },
      { name: 'Terracotta', hex: '#E2673B', role: 'Primary action' },
      { name: 'Sage', hex: '#A8CDB0', role: 'Highlights, progress' },
      { name: 'Clay', hex: '#F09A7E', role: 'Hot moments, live' },
      { name: 'Sand', hex: '#F7EBDD', role: 'Text' },
    ],
    type: { display: 'Fraunces (variable, 500)', body: 'System UI stack — zero download' },
    logo: { mark: `${base}brands/harmattan-mark.svg`, lockup: `${base}brands/harmattan-lockup.svg`, appIcon: `${base}brands/harmattan-app-icon.svg` },
    keyArt: `${base}img/harmattan-keyart.webp`,
    copy: {
      welcomeTitle: 'Warm nights, all season.',
      welcomeBody: 'Tickets, tables and bottles across Accra. Plan the night with your people and share it on WhatsApp.',
      homeGreeting: 'Akwaaba, Ama',
      reserveCta: 'Hold my table',
      confirmedTitle: 'You’re in. See you there',
      emptyBookings: 'No nights planned yet. The season is long.',
    },
  },
  anadwo: {
    id: 'anadwo',
    era: 'rebrand',
    theme: 'dark',
    voiceFamily: 'vybe',
    domain: 'anadwo.example',
    idea: 'A utility, not a party flyer. Stark, fast and photographic; the events bring the colour.',
    nameOrigin: 'Anadwo: “night” in Twi.',
    name: 'Anadwo',
    tagline: 'The night, sorted.',
    promise: 'Tickets, tables, bottles. Nothing in the way.',
    voice: ['Minimal, direct, confident', 'Few words, no exclamation marks', 'Lets the photography talk'],
    audience: 'Design-aware 22–35s, creatives and visitors who trust a clean tool over a loud one.',
    palette: [
      { name: 'Black', hex: '#000000', role: 'Background' },
      { name: 'White', hex: '#FFFFFF', role: 'Primary action' },
      { name: 'Signal', hex: '#FF2A1F', role: 'Live, urgent, the only colour' },
      { name: 'Signal', hex: '#FF2A1F', role: 'Hot moments' },
      { name: 'White', hex: '#FFFFFF', role: 'Text' },
    ],
    type: { display: 'Big Shoulders Display (variable, 800, caps)', body: 'System UI stack — zero download' },
    logo: { mark: `${base}brands/anadwo-mark.svg`, lockup: `${base}brands/anadwo-lockup.svg`, appIcon: `${base}brands/anadwo-app-icon.svg` },
    keyArt: `${base}img/anadwo-keyart.webp`,
    copy: {
      welcomeTitle: 'The night, sorted.',
      welcomeBody: 'Tickets. Tables. Bottles. Accra after dark, booked in a minute.',
      homeGreeting: 'Tonight, Ama.',
      reserveCta: 'Book',
      confirmedTitle: 'Confirmed.',
      emptyBookings: 'Nothing booked.',
    },
  },
  detty: {
    id: 'detty',
    era: 'archive',
    theme: 'dark',
    voiceFamily: 'detty',
    domain: 'detty.app',
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
    era: 'archive',
    theme: 'dark',
    voiceFamily: 'aurum',
    domain: 'aurum.app',
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
    era: 'archive',
    theme: 'dark',
    voiceFamily: 'vybe',
    domain: 'vybe.app',
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
    era: 'archive',
    theme: 'dark',
    voiceFamily: 'detty',
    domain: 'detty.app',
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
  gold2: {
    id: 'gold2',
    era: 'archive',
    theme: 'dark',
    voiceFamily: 'detty',
    domain: 'detty.app',
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
    type: { display: 'Unbounded (variable, 700, caps) — from Vybe', body: 'System UI stack — zero download' },
    logo: {
      mark: `${base}brands/gold2-mark.svg`,
      lockup: `${base}brands/gold2-lockup.svg`,
      appIcon: `${base}brands/gold2-app-icon.svg`,
    },
    keyArt: `${base}img/detty-keyart.webp`,
    copy: {
      welcomeTitle: 'Who’s outside tonight?',
      welcomeBody: 'Tickets, VIP tables and bottles at Accra’s best rooms — sorted in a minute, shared on WhatsApp.',
      homeGreeting: 'Ete sen, Ama ✨',
      reserveCta: 'Lock it in',
      confirmedTitle: 'You’re outside!',
      emptyBookings: 'No plans yet. Your squad dey wait.',
    },
  },
}

export const brandList = Object.values(brands)
export const newBrands = brandList.filter((b) => b.era === 'rebrand')
export const archiveBrands = brandList.filter((b) => b.era === 'archive')
export const DEFAULT_BRAND: BrandId = 'jama'
