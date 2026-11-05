import { useState } from 'react'
import { Apple, ChevronDown, Lock } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Button } from '@/components/ui/primitives'
import { cx } from '@/lib/format'
import { CountryPickerSheet, GoogleGlyph, StepProgress, Title, countryByCode } from './parts'

/**
 * One field for log-in and sign-up. Phone is the account: venues reach you on it
 * and Mobile Money pays from it. Apple / Google are secondary and still ask for a number.
 */
export function PhoneEntry({
  country: initialCountry = 'GH',
  number: initialNumber = '',
  error,
  loading,
  pickerOpen: initialPicker = false,
  pickerQuery,
}: {
  /** ISO code from the local country list. */
  country?: string
  /** National number as typed, without the dial code. */
  number?: string
  error?: string
  loading?: boolean
  pickerOpen?: boolean
  pickerQuery?: string
}) {
  const brand = useBrand()
  const [country, setCountry] = useState(initialCountry)
  const [number, setNumber] = useState(initialNumber)
  const [picker, setPicker] = useState(initialPicker)
  const c = countryByCode(country)
  const ready = number.replace(/\D/g, '').length >= 9

  return (
    <Screen
      header={
        <>
          <AppBar />
          <StepProgress step={1} total={5} />
        </>
      }
      footer={
        <BottomBar>
          <Button block size="lg" disabled={!ready} loading={loading}>
            {loading ? 'Checking number…' : 'Continue'}
          </Button>
        </BottomBar>
      }
    >
      <Title body={<>Log in or sign up with one number. No password — we’ll send you a 6-digit code.</>}>What’s your number?</Title>

      <div className="px-5">
        <span className="mb-1.5 block text-sm font-medium text-dim">Mobile number</span>
        <div className="flex gap-2">
          <button
            onClick={() => setPicker(true)}
            aria-label={`Country code ${c.name} ${c.dial}`}
            className="flex h-13 shrink-0 items-center gap-1.5 rounded-control border border-line bg-surface px-3 font-medium"
          >
            <span className="text-xl leading-none">{c.flag}</span>
            <span className="tabular-nums">{c.dial}</span>
            <ChevronDown className="size-4 text-dim" />
          </button>
          <label className={cx('flex h-13 min-w-0 flex-1 items-center rounded-control border bg-surface px-4 focus-within:border-accent', error ? 'border-danger' : 'border-line')}>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="24 555 0142"
              aria-label="Mobile number"
              className="h-full min-w-0 flex-1 bg-transparent text-lg tracking-wide text-text tabular-nums outline-none placeholder:text-faint"
            />
          </label>
        </div>
        <p className={cx('mt-1.5 text-xs', error ? 'text-danger' : 'text-faint')}>
          {error ?? (country === 'GH' ? 'Leave out the first 0 — 024 becomes 24.' : 'Your full number without the country code.')}
        </p>

        <div className="mt-5 flex items-start gap-2.5 rounded-card bg-surface p-3.5 text-sm text-dim">
          <Lock className="mt-0.5 size-4 shrink-0 text-accent-2" />
          <span>
            Your number is your account. Venues use it to find your booking at the door, and it’s where Mobile Money payments come from. We never share it with
            promoters.
          </span>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-faint">
          <span className="h-px flex-1 bg-line" />
          or continue with
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="secondary" icon={<Apple className="size-5" />}>
            Apple
          </Button>
          <Button variant="secondary" icon={<GoogleGlyph />}>
            Google
          </Button>
        </div>
        <p className="mt-2.5 text-center text-xs text-faint">You’ll still add a phone number after — tickets and tables need one.</p>

        <p className="mt-6 pb-4 text-center text-xs text-faint">
          By continuing you agree to {brand.name}’s <u>Terms</u> and <u>Privacy Policy</u>. We’ll only message you about your account and bookings.
        </p>
      </div>

      {picker && <CountryPickerSheet selected={country} query={pickerQuery} onClose={() => setPicker(false)} onPick={(x) => { setCountry(x.code); setPicker(false) }} />}
    </Screen>
  )
}
