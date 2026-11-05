// Accra is UTC+0 all year (no DST), so fixtures use Z times and format in UTC.
const tz = 'UTC'

export const cedis = (n: number, opts: { decimals?: boolean } = {}) =>
  '₵' +
  n.toLocaleString('en-GH', {
    minimumFractionDigits: opts.decimals ? 2 : 0,
    maximumFractionDigits: opts.decimals ? 2 : 0,
  })

export const dayShort = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: tz })

export const dayLong = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: tz })

export const time = (iso: string) =>
  new Date(iso)
    .toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz })
    .replace(':00', '')
    .replace(' ', '')

export const dateBadge = (iso: string) => {
  const d = new Date(iso)
  return {
    month: d.toLocaleDateString('en-GB', { month: 'short', timeZone: tz }).toUpperCase(),
    day: d.toLocaleDateString('en-GB', { day: 'numeric', timeZone: tz }),
    weekday: d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: tz }),
  }
}

export const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
