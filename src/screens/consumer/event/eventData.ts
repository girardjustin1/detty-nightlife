// SAMPLE DATA ONLY — fictional vibe notes, track names and social proof for
// the Event detail drafts. Keyed by event id from src/data/fixtures.ts.

export type EventExtras = {
  /** 1–5 */
  energy: number
  energyLabel: string
  crowd: string
  soundsLike: string[]
  notesForTonight: string[]
  friendsGoing: string[]
  /** One 30s preview per act (fictional titles). */
  tracks: Record<string, { title: string; kb: number }>
  waitlist?: number
}

const friends = ['Kojo Mensah', 'Efua Asante', 'Yaw Boateng', 'Akosua Darko', 'Kwame Nkansah', 'Adjoa Frimpong', 'Nii Ayi']

export const eventExtras: Record<string, EventExtras> = {
  'afrobeats-til-dawn': {
    energy: 5,
    energyLabel: 'Peak-time, hands up',
    crowd: '21–35 · dressed up · locals + diaspora home for December',
    soundsLike: ['Afro-pop anthems', 'Amapiano crossover', 'Singalong hooks', 'Surprise live PA'],
    notesForTonight: ['Guest list closes at 11:30pm.', 'Surprise performance at 2am — stay late.', 'Oxford St is busy after 11pm; use the side entrance on 4th Lane.'],
    friendsGoing: friends.slice(0, 5),
    tracks: { 'Kwesi Wav': { title: 'Osu to Lagos (VIP edit)', kb: 480 }, 'Ama Selecta': { title: 'Shatta Dawn', kb: 460 } },
    waitlist: 214,
  },
  'highlife-champagne': {
    energy: 3,
    energyLabel: 'Dinner, then dancing',
    crowd: '28–50 · elegant · couples and birthday tables',
    soundsLike: ['Palm-wine guitar', 'Brass sections', 'Golden-era highlife', 'Slow R&B after midnight'],
    notesForTonight: ['Supper is served at 8:30pm sharp — tables seated by 8:15pm.', 'Champagne toast at midnight for every table.'],
    friendsGoing: friends.slice(1, 3),
    tracks: { 'The Adinkra Seven': { title: 'Sunday at Labadi (live)', kb: 510 }, 'DJ Yaa Gold': { title: 'Gold Coast Shuffle', kb: 440 } },
  },
  'tidal-beach-rave': {
    energy: 5,
    energyLabel: 'Big, loud, sandy',
    crowd: '18–30 · beachwear · 2,000 on the sand',
    soundsLike: ['Dancehall riddims', 'Afrobeats bangers', 'Log-drum Amapiano', 'Sunrise closing set'],
    notesForTonight: ['Bags are searched at the gate — small bags only.', 'Cashless bar: MoMo and card only.', 'Last shuttle back to Osu leaves at 4:30am.'],
    friendsGoing: friends.slice(0, 2),
    tracks: { 'Selecta Yaw': { title: 'La Beach Riddim', kb: 470 }, 'Akua Bass': { title: 'Bonfire Bass', kb: 450 }, 'Kwesi Wav': { title: 'Osu to Lagos', kb: 480 } },
  },
  'sunset-sessions': {
    energy: 3,
    energyLabel: 'Golden hour build',
    crowd: '25–40 · resort chic · after-work crowd',
    soundsLike: ['Deep Afro house', 'Live sax', 'Organic percussion'],
    notesForTonight: ['Sunset is at 5:52pm — arrive by 5pm for the best light.'],
    friendsGoing: friends.slice(2, 4),
    tracks: { 'Kofi Deep': { title: 'Liberation Road', kb: 490 } },
  },
  'log-drum-sundays': {
    energy: 4,
    energyLabel: 'Slow build, big drops',
    crowd: '21–32 · come as you are',
    soundsLike: ['Log-drum heavy', 'Private-school piano', 'Gqom breaks'],
    notesForTonight: ['Log drum challenge on the main deck at 9pm.'],
    friendsGoing: friends.slice(0, 3),
    tracks: { 'Nana Piano': { title: 'Sunday Keys', kb: 470 } },
  },
  'hiplife-throwback': {
    energy: 4,
    energyLabel: 'Throwback singalong',
    crowd: '25–40 · throwback fits encouraged',
    soundsLike: ['2000s hiplife', 'Azonto', 'Old-school hip-hop'],
    notesForTonight: ['Best throwback fit wins a bottle at 1am.'],
    friendsGoing: friends.slice(3, 6),
    tracks: { 'DJ Oldskool Kwame': { title: 'Back to 2004', kb: 460 } },
  },
  'nye-countdown': {
    energy: 5,
    energyLabel: 'Countdown chaos',
    crowd: '21–40 · all white',
    soundsLike: ['Afrobeats anthems', 'Amapiano', 'Midnight champagne parade'],
    notesForTonight: ['Doors close at 11:30pm — no entry after.', 'All-white dress code is enforced.'],
    friendsGoing: friends,
    tracks: { 'Kwesi Wav': { title: 'Countdown (intro edit)', kb: 480 } },
    waitlist: 530,
  },
}

export const extrasFor = (id: string): EventExtras =>
  eventExtras[id] ?? { energy: 3, energyLabel: '—', crowd: '—', soundsLike: [], notesForTonight: [], friendsGoing: [], tracks: {} }
