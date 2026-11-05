import { useState } from 'react'
import { Check, ChevronRight, KeyRound, Lock, MessageCircle, ShieldCheck, X } from 'lucide-react'
import { StatusBar } from '@/components/app/chrome'
import { Badge, Button, Img, TextField } from '@/components/ui/primitives'
import { venueById } from '@/data/fixtures'
import { cx } from '@/lib/format'
import { PartnerLogo } from './PromoterChrome'
import type { Role } from './promoterData'
import { roles, signedInAs, venueAccess } from './promoterData'

export type SignInStep = 'phone' | 'otp' | 'venue'

export function SignIn({ step = 'phone', error, sending }: { step?: SignInStep; error?: boolean; sending?: boolean }) {
  return (
    <div className="flex h-full flex-col bg-bg text-text">
      <StatusBar />
      <div className="flex items-center justify-between px-5 pt-2">
        <PartnerLogo />
        <span className="text-xs text-faint">For venues & promoters</span>
      </div>
      {step === 'phone' && <PhoneStep sending={sending} />}
      {step === 'otp' && <OtpStep error={error} />}
      {step === 'venue' && <VenueStep />}
    </div>
  )
}

function PhoneStep({ sending }: { sending?: boolean }) {
  return (
    <div className="flex flex-1 flex-col px-5 pt-10 pb-8">
      <h1 className="display text-[32px]">Run your night from your phone.</h1>
      <p className="mt-3 text-[15px] text-dim">Tables, guest lists, the door and payouts. Sign in with the number your venue added you with.</p>
      <TextField className="mt-8" label="Phone number" prefix="🇬🇭 +233" defaultValue="20 555 0131" inputMode="tel" />
      <div className="mt-6 space-y-2.5">
        <Button variant="whatsapp" block size="lg" loading={sending} icon={<MessageCircle className="size-5" />}>
          {sending ? 'Sending code…' : 'Send code on WhatsApp'}
        </Button>
        <Button variant="ghost" block>
          Send by SMS instead
        </Button>
      </div>
      <div className="mt-auto space-y-3">
        <button className="flex w-full items-center gap-3 rounded-card border border-line bg-surface p-3.5 text-left">
          <KeyRound className="size-5 text-accent" />
          <span className="flex-1 text-sm">
            <b>Got an invite code?</b>
            <span className="block text-dim">From a venue owner or manager</span>
          </span>
          <ChevronRight className="size-4 text-faint" />
        </button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-faint">
          <Lock className="size-3.5" /> Staff accounts only. Guests use the Detty app.
        </p>
      </div>
    </div>
  )
}

function OtpStep({ error }: { error?: boolean }) {
  const digits = error ? ['4', '8', '2', '9', '1', '7'] : ['4', '8', '2', '9', '', '']
  return (
    <div className="flex flex-1 flex-col px-5 pt-10 pb-8">
      <h1 className="display text-[28px]">Enter the 6-digit code</h1>
      <p className="mt-2 text-[15px] text-dim">
        Sent on WhatsApp to <b className="text-text">+233 20 555 0131</b>.{' '}
        <button className="font-semibold text-accent">Change</button>
      </p>
      <div className="mt-8 flex justify-between gap-2">
        {digits.map((d, i) => (
          <span
            key={i}
            className={cx(
              'flex h-14 flex-1 items-center justify-center rounded-control border-2 bg-surface text-2xl font-bold tabular-nums',
              error ? 'border-danger text-danger' : d ? 'border-line' : i === 4 ? 'border-accent' : 'border-line',
            )}
          >
            {d}
            {!d && i === 4 && !error && <span className="h-6 w-0.5 animate-pulse bg-accent" />}
          </span>
        ))}
      </div>
      {error ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-danger">
          <X className="size-4" /> That code didn’t match. 2 tries left.
        </p>
      ) : (
        <p className="mt-3 text-sm text-faint">Codes expire after 10 minutes.</p>
      )}
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-dim">Didn’t get it?</span>
        <span className="text-faint">Resend in 0:24</span>
      </div>
      <div className="mt-2 flex gap-2">
        <Button variant="secondary" size="sm" disabled>
          Resend on WhatsApp
        </Button>
        <Button variant="ghost" size="sm">
          Text me instead
        </Button>
      </div>
      <div className="mt-auto">
        <Button block size="lg" disabled={!error}>
          Verify
        </Button>
      </div>
    </div>
  )
}

function VenueStep() {
  const [selected, setSelected] = useState<string>('vault')
  const access = venueAccess.find((v) => v.venueId === selected)!
  const role = roles.find((r) => r.id === access.role)!
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pt-6 pb-4">
        <p className="text-sm text-dim">Akwaaba, {signedInAs.name.split(' ')[0]}</p>
        <h1 className="display mt-1 text-[28px]">Which venue tonight?</h1>
        <p className="mt-2 text-sm text-dim">Your role is set by the venue owner. What you can see depends on it.</p>
        <div className="mt-5 space-y-2">
          {venueAccess.map((a) => {
            const v = venueById(a.venueId)
            const on = selected === a.venueId
            return (
              <button
                key={a.venueId}
                onClick={() => setSelected(a.venueId)}
                className={cx('flex w-full items-center gap-3 rounded-card border p-3 text-left transition', on ? 'border-accent bg-accent/10' : 'border-line bg-surface')}
              >
                <Img src={v.photo} alt="" className="size-12 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{v.name}</span>
                  <span className="block truncate text-xs text-dim">
                    {v.kind} · {v.area}
                  </span>
                  <span className={cx('block truncate text-xs', a.tonight ? 'text-success' : 'text-faint')}>{a.tonight ? `● Live: ${a.tonight}` : 'No event tonight'}</span>
                </span>
                <RoleBadge role={a.role} />
                <span className={cx('flex size-5 items-center justify-center rounded-full border-2', on ? 'border-accent bg-accent text-on-accent' : 'border-line')}>
                  {on && <Check className="size-3" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-5 rounded-card border border-line bg-surface p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-accent" />
            <span className="text-sm font-semibold">As {role.label.toLowerCase()} you can</span>
          </div>
          <ul className="mt-2 space-y-1.5 text-sm">
            {role.can.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <Check className="size-4 text-success" /> {c}
              </li>
            ))}
            {role.cannot?.map((c) => (
              <li key={c} className="flex items-center gap-2 text-faint">
                <X className="size-4" /> {c}
              </li>
            ))}
          </ul>
        </div>

        <h2 className="mt-6 mb-2 text-[11px] font-bold tracking-[0.14em] text-faint uppercase">All roles</h2>
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-faint">
              <tr>
                <th className="px-3 py-2 font-semibold">Access</th>
                {roles.map((r) => (
                  <th key={r.id} className="px-1 py-2 text-center font-semibold">
                    {r.label.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {permissionMatrix.map((row) => (
                <tr key={row.label}>
                  <td className="px-3 py-2 text-dim">{row.label}</td>
                  {roles.map((r) => (
                    <td key={r.id} className="px-1 py-2 text-center">
                      {row.roles.includes(r.id) ? <Check className="mx-auto size-4 text-success" /> : <span className="text-faint">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="border-t border-line px-5 pt-3 pb-8">
        <Button block size="lg">
          Open {venueById(selected).name}
        </Button>
      </div>
    </div>
  )
}

const permissionMatrix: { label: string; roles: Role[] }[] = [
  { label: 'Scan & check in', roles: ['owner', 'manager', 'promoter', 'door'] },
  { label: 'Floor & bookings', roles: ['owner', 'manager'] },
  { label: 'Own guest list & comps', roles: ['owner', 'manager', 'promoter'] },
  { label: 'Events & pricing', roles: ['owner', 'manager'] },
  { label: 'Payouts & reports', roles: ['owner', 'manager'] },
  { label: 'Payout account', roles: ['owner'] },
  { label: 'Broadcast', roles: ['owner', 'manager', 'promoter'] },
]

export function RoleBadge({ role }: { role: Role }) {
  const label = roles.find((r) => r.id === role)!.label
  return <Badge tone={role === 'owner' || role === 'manager' ? 'accent' : 'neutral'}>{label}</Badge>
}
