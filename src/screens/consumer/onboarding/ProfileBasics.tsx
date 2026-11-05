import { CircleCheck, CircleExclamationPoint, IdCard, Info } from 'lucide-react'
import { NOW } from '@/data/fixtures'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Button, TextField } from '@/components/ui/primitives'
import { cx } from '@/lib/format'
import { StepProgress, Title } from './parts'

export type Dob = { day: string; month: string; year: string }

/** Whole years between a date of birth and the prototype's "now". */
export function ageOn(dob: Dob, nowIso = NOW): number | null {
  const d = +dob.day
  const m = +dob.month
  const y = +dob.year
  if (!d || !m || dob.year.length !== 4 || m > 12 || d > 31) return null
  const now = new Date(nowIso)
  let age = now.getUTCFullYear() - y
  if (now.getUTCMonth() + 1 < m || (now.getUTCMonth() + 1 === m && now.getUTCDate() < d)) age--
  return age
}

/** Name, date of birth (decides what you can book), optional email for receipts. */
export function ProfileBasics({
  name = '',
  dob = { day: '', month: '', year: '' },
  email = '',
  emailError,
}: {
  name?: string
  dob?: Dob
  email?: string
  emailError?: string
}) {
  const age = ageOn(dob)
  const gate = age == null ? 'unknown' : age < 18 ? 'under18' : age < 21 ? '18plus' : '21plus'
  const ready = name.trim().length > 1 && (gate === '18plus' || gate === '21plus') && !emailError

  return (
    <Screen
      header={
        <>
          <AppBar />
          <StepProgress step={3} total={5} />
        </>
      }
      footer={
        <BottomBar>
          <Button block size="lg" disabled={!ready}>
            Continue
          </Button>
        </BottomBar>
      }
    >
      <Title body="Use the name on your ID — it’s how the door finds your booking.">About you</Title>

      <div className="space-y-5 px-5 pb-8">
        <TextField label="Full name" placeholder="e.g. Ama Owusu" defaultValue={name} autoComplete="name" />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-dim">Date of birth</span>
          <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-2">
            <TextField className="min-w-0" placeholder="DD" defaultValue={dob.day} inputMode="numeric" aria-label="Day" maxLength={2} />
            <TextField className="min-w-0" placeholder="MM" defaultValue={dob.month} inputMode="numeric" aria-label="Month" maxLength={2} />
            <TextField className="min-w-0" placeholder="YYYY" defaultValue={dob.year} inputMode="numeric" aria-label="Year" maxLength={4} />
          </div>
          {gate !== 'unknown' && (
            <div
              className={cx(
                'mt-2 flex items-start gap-1.5 text-sm',
                gate === 'under18' && 'text-danger',
                gate === '18plus' && 'text-warning',
                gate === '21plus' && 'text-success',
              )}
            >
              {gate === 'under18' ? <CircleExclamationPoint className="mt-0.5 size-4 shrink-0" /> : gate === '18plus' ? <Info className="mt-0.5 size-4 shrink-0" /> : <CircleCheck className="mt-0.5 size-4 shrink-0" />}
              <span>
                {gate === 'under18' && 'You need to be 18 or older to use the app. Come back on your 18th — we’ll be here.'}
                {gate === '18plus' && `You’re ${age}: you can book 18+ nights like beach parties. Most clubs and lounges are 21+, so we’ll hide those for now.`}
                {gate === '21plus' && 'You’re all set for 21+ venues.'}
              </span>
            </div>
          )}
        </div>

        <div className="rounded-card border border-line bg-surface p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <IdCard className="size-4 text-accent-2" /> Why we ask your age
          </div>
          <ul className="mt-2 space-y-1.5 text-sm text-dim">
            <li className="flex justify-between gap-3">
              <span>Most clubs, rooftops, supper clubs</span>
              <b className="shrink-0 text-text">21+</b>
            </li>
            <li className="flex justify-between gap-3">
              <span>Beach events and some day parties</span>
              <b className="shrink-0 text-text">18+</b>
            </li>
          </ul>
          <p className="mt-2.5 text-xs text-faint">Venues still check ID at the door. If your ID doesn’t match, they can refuse entry and your deposit may not be refunded.</p>
        </div>

        <TextField
          label="Email (optional)"
          placeholder="you@example.com"
          defaultValue={email}
          type="email"
          autoComplete="email"
          error={emailError}
          hint="Only for receipts. No newsletters unless you ask."
        />
      </div>
    </Screen>
  )
}
