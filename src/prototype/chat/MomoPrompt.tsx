import { useEffect, useState } from 'react'
import { cedis } from '@/lib/format'

/**
 * The phone's own mobile-money approval (USSD-style system dialog) — what the
 * user sees when the server triggers a MoMo charge from inside WhatsApp.
 * Phone-system greys on purpose; not brand UI.
 */
export function MomoPrompt({ amount, payee, network, number, onDone, onCancel }: { amount: number; payee: string; network: string; number: string; onDone: () => void; onCancel: () => void }) {
  const [phase, setPhase] = useState<'pin' | 'processing' | 'done'>('pin')
  useEffect(() => {
    if (phase === 'processing') {
      const t = setTimeout(() => setPhase('done'), 1300)
      return () => clearTimeout(t)
    }
    if (phase === 'done') {
      const t = setTimeout(onDone, 900)
      return () => clearTimeout(t)
    }
  }, [phase, onDone])

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/55 px-6" style={{ fontFamily: 'Roboto, system-ui, sans-serif' }}>
      <div className="w-full max-w-[320px] rounded-[22px] bg-[#f3f3f6] p-5 text-[#1c1c1e] shadow-2xl">
        {phase === 'pin' && (
          <>
            <div className="text-[12px] font-semibold tracking-wide text-[#6b6b73] uppercase">{network}</div>
            <p className="mt-2 text-[15px] leading-snug">
              Payment request from <b>{payee}</b>
              <br />
              Amount: <b>GHS {amount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</b>
              <br />
              Wallet: {number}
            </p>
            <p className="mt-3 text-[14px]">Enter MoMo PIN to approve:</p>
            <div className="mt-2 flex h-11 items-center rounded-lg border-2 border-[#1a73e8] bg-white px-3 text-[22px] tracking-[0.4em]">••••</div>
            <div className="mt-2 text-[11px] text-[#6b6b73]">Prototype: PIN is prefilled.</div>
            <div className="mt-4 flex justify-end gap-6 text-[14px] font-semibold text-[#1a73e8]">
              <button type="button" onClick={onCancel}>
                CANCEL
              </button>
              <button type="button" data-hot="" onClick={() => setPhase('processing')}>
                SEND
              </button>
            </div>
          </>
        )}
        {phase !== 'pin' && (
          <div className="flex flex-col items-center py-4 text-center">
            {phase === 'processing' ? (
              <span className="size-8 animate-spin rounded-full border-[3px] border-[#1a73e8] border-t-transparent" />
            ) : (
              <span className="flex size-10 items-center justify-center rounded-full bg-[#1e9e55] text-xl text-white">✓</span>
            )}
            <p className="mt-3 text-[15px]">{phase === 'processing' ? 'Processing…' : `${cedis(amount, { decimals: true })} paid to ${payee}`}</p>
          </div>
        )}
      </div>
    </div>
  )
}
