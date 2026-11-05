import { Check, Copy, RefreshCw, Wallet, Zap } from 'lucide-react'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { FakeQR } from '@/components/app/domain'
import { Button, ProgressBar } from '@/components/ui/primitives'
import { cedis, cx } from '@/lib/format'
import { BetaBadge, CountdownBar } from './PayParts'
import { fakeInvoice, PAY_RULES, tablePay, toSats, useCountdown, type PaySummary } from './payData'

export type LightningStatus = 'waiting' | 'paid' | 'expired'

/** Bitcoin Lightning invoice (Beta). Priced in cedis, quoted in sats with a short rate lock. */
export function LightningInvoice({ pay = tablePay(), status = 'waiting', elapsed = 74, copied }: { pay?: PaySummary; status?: LightningStatus; elapsed?: number; copied?: boolean }) {
  const total = PAY_RULES.lightningLockSeconds
  const left = useCountdown(status === 'expired' ? 0 : total - elapsed, status === 'waiting')
  const sats = toSats(pay.dueNow)
  const invoice = fakeInvoice(sats)
  const paid = status === 'paid'
  const expired = status === 'expired' || left === 0

  return (
    <Screen
      header={<AppBar title={<span className="inline-flex items-center gap-2">Pay with Lightning <BetaBadge /></span>} subtitle={pay.subtitle} />}
      footer={
        <BottomBar>
          {paid ? (
            <Button block size="lg">
              View booking
            </Button>
          ) : expired ? (
            <Button block size="lg" icon={<RefreshCw className="size-5" />}>
              Get a new quote
            </Button>
          ) : (
            <Button block size="lg" icon={<Wallet className="size-5" />}>
              Open in wallet
            </Button>
          )}
        </BottomBar>
      }
    >
      <div className="space-y-4 px-5 pt-1 pb-6">
        <div className="text-center">
          <div className="display text-[38px] leading-tight tabular-nums">{sats.toLocaleString()} sats</div>
          <div className="text-sm text-dim">
            = <b className="text-text">{cedis(pay.dueNow)}</b> {pay.kind === 'tickets' ? 'total' : 'deposit due now'}
          </div>
        </div>

        <div className="relative mx-auto w-fit">
          <FakeQR seed={invoice} size={232} className={cx('transition', (expired || paid) && 'opacity-15 blur-[2px]')} />
          {paid && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-success text-bg">
                <Check className="size-9" strokeWidth={3} />
              </span>
            </div>
          )}
          {expired && !paid && (
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center font-semibold text-text">Quote expired — the rate is no longer locked</div>
          )}
        </div>

        <div className={cx('flex items-center gap-3 rounded-card border p-3.5', paid ? 'border-success/40 bg-success/10' : 'border-line bg-surface')}>
          {paid ? (
            <Check className="size-5 shrink-0 text-success" />
          ) : (
            <span className="relative flex size-3 shrink-0">
              {!expired && <span className="absolute inset-0 animate-ping rounded-full bg-accent-2" />}
              <span className={cx('relative size-3 rounded-full', expired ? 'bg-faint' : 'bg-accent-2')} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-semibold">{paid ? 'Paid — booking confirmed' : expired ? 'Not paid' : 'Waiting for payment'}</div>
            <div className="text-sm text-dim">{paid ? `Ref ${pay.ref} · settled in a few seconds` : expired ? 'Nothing was charged. Get a fresh quote to try again.' : 'This updates by itself the moment your wallet pays.'}</div>
          </div>
        </div>

        {!paid && (
          <div className="rounded-card border border-line bg-surface p-4">
            <CountdownBar left={left} total={total} label="Rate locked for" tone="warning" />
            <div className="mt-2 text-xs text-faint">1 cedi ≈ {PAY_RULES.sampleSatsPerCedi} sats (sample rate for drafts)</div>
          </div>
        )}

        {!paid && !expired && (
          <div className="flex items-center gap-2 rounded-card border border-line bg-surface p-2 pl-3.5">
            <Zap className="size-4 shrink-0 text-accent-2" />
            <code className="min-w-0 flex-1 truncate font-mono text-xs text-dim">{invoice}</code>
            <Button size="sm" variant={copied ? 'secondary' : 'primary'} icon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        )}

        {paid && <ProgressBar value={100} max={100} tone="success" />}

        <p className="px-1 text-xs leading-relaxed text-faint">
          Beta. Lightning only — please don’t send on-chain bitcoin. If your deposit is refunded under the venue’s policy, you get the <b>cedi value</b> back, by MoMo transfer or as a Lightning payment you claim with a withdraw QR — your choice.
        </p>
      </div>
    </Screen>
  )
}
