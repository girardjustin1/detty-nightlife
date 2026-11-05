import type { ReactNode } from 'react'
import { Check, Search } from 'lucide-react'
import { cx } from '@/lib/format'
import { Sheet } from '@/components/app/chrome'

/* Local building blocks for the onboarding screens. Not shared on purpose:
   if another group needs them, promote them to src/components. */

/** Thin step indicator under the app bar: "Step 2 of 5". */
export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 px-5 pb-2" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cx('h-1 flex-1 rounded-full', i < step ? 'bg-accent' : 'bg-surface-2')} />
      ))}
    </div>
  )
}

export function Title({ children, body }: { children: ReactNode; body?: ReactNode }) {
  return (
    <div className="px-5 pt-3 pb-5">
      <h1 className="display text-[30px] leading-tight">{children}</h1>
      {body && <p className="mt-2 text-[15px] text-dim">{body}</p>}
    </div>
  )
}

/** WhatsApp glyph (partner mark, so it keeps its own colour wherever it sits). */
export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cx('shrink-0', className)} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.3 1 2.5.1.2 1.7 2.7 4.2 3.8 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.2Z"
      />
    </svg>
  )
}

/** Simple coloured "G" so the Google button reads without shipping their asset. */
export function GoogleGlyph() {
  return (
    <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded-full bg-white text-[13px] font-black text-[#4285F4]">
      G
    </span>
  )
}

/* ───────────────────────── Countries ───────────────────────── */

export type Country = { code: string; name: string; flag: string; dial: string }

/** Ghana first, then the diaspora and neighbours we expect most often. */
export const countries: Country[] = [
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dial: '+233' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dial: '+234' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dial: '+44' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dial: '+1' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dial: '+1' },
  { code: 'CI', name: 'Côte d’Ivoire', flag: '🇨🇮', dial: '+225' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dial: '+228' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dial: '+27' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dial: '+49' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dial: '+31' },
]

export const countryByCode = (code: string) => countries.find((c) => c.code === code) ?? countries[0]

export function CountryPickerSheet({
  selected,
  query = '',
  onPick,
  onClose,
}: {
  selected: string
  query?: string
  onPick?: (c: Country) => void
  onClose?: () => void
}) {
  const q = query.trim().toLowerCase()
  const list = q ? countries.filter((c) => c.name.toLowerCase().includes(q) || c.dial.includes(q)) : countries
  return (
    <Sheet title="Country code" onClose={onClose}>
      <label className="sticky top-0 z-10 flex h-11 items-center gap-2 rounded-control border border-line bg-surface-2 px-3.5">
        <Search className="size-4 text-dim" />
        <input defaultValue={query} placeholder="Search country or code" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint" />
      </label>
      <ul className="mt-2 divide-y divide-line">
        {list.map((c) => (
          <li key={c.code}>
            <button onClick={() => onPick?.(c)} className="flex w-full items-center gap-3 py-3 text-left">
              <span className="text-2xl leading-none">{c.flag}</span>
              <span className="flex-1 font-medium">{c.name}</span>
              <span className="text-dim tabular-nums">{c.dial}</span>
              {c.code === selected && <Check className="size-5 text-accent" />}
            </button>
          </li>
        ))}
        {list.length === 0 && <li className="py-8 text-center text-sm text-dim">No country matches “{query}”.</li>}
      </ul>
    </Sheet>
  )
}

/* ───────────────────────── OTP ───────────────────────── */

export type OtpTone = 'default' | 'autofilled' | 'wrong' | 'verifying'

export function OtpBoxes({ code, tone = 'default', length = 6 }: { code: string; tone?: OtpTone; length?: number }) {
  const digits = code.slice(0, length).split('')
  return (
    <div className="flex justify-between gap-2" role="group" aria-label="Verification code">
      {Array.from({ length }, (_, i) => {
        const d = digits[i]
        const active = tone === 'default' && i === digits.length
        return (
          <span
            key={i}
            className={cx(
              'flex h-14 flex-1 items-center justify-center rounded-card border text-2xl font-semibold tabular-nums transition',
              tone === 'wrong' && 'border-danger bg-danger/10 text-danger',
              tone === 'autofilled' && 'border-success bg-success/10',
              tone === 'verifying' && 'border-line bg-surface opacity-70',
              tone === 'default' && (active ? 'border-accent bg-surface' : d ? 'border-dim bg-surface' : 'border-line bg-surface'),
            )}
          >
            {d ?? (active ? <span className="h-7 w-0.5 animate-pulse bg-accent" /> : '')}
          </span>
        )
      })}
    </div>
  )
}

/** Mock of the phone's number pad, with an optional autofill suggestion above it. */
export function NumPad({ suggestion }: { suggestion?: ReactNode }) {
  const keys = [
    ['1', ''],
    ['2', 'ABC'],
    ['3', 'DEF'],
    ['4', 'GHI'],
    ['5', 'JKL'],
    ['6', 'MNO'],
    ['7', 'PQRS'],
    ['8', 'TUV'],
    ['9', 'WXYZ'],
    ['', ''],
    ['0', ''],
    ['⌫', ''],
  ]
  return (
    <div className="shrink-0 bg-surface-2 pb-7" aria-hidden="true">
      <div className="flex h-11 items-center justify-center border-b border-line text-sm">
        {suggestion ?? <span className="text-faint">Enter code</span>}
      </div>
      <div className="grid grid-cols-3 gap-1.5 px-1.5 pt-1.5">
        {keys.map(([k, sub], i) => (
          <span key={i} className={cx('flex h-11 flex-col items-center justify-center rounded-md leading-none', k && k !== '⌫' && 'bg-surface')}>
            <span className="text-xl">{k}</span>
            {sub && <span className="mt-0.5 text-[9px] font-semibold tracking-widest text-dim">{sub}</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
