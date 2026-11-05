import { Info, MessageSquareText, Pencil, ShieldCheck } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { me } from '@/data/fixtures'
import { AppBar, Screen } from '@/components/app/chrome'
import { Button } from '@/components/ui/primitives'
import { StepProgress, Title, WhatsAppGlyph } from './parts'

/**
 * Where to send the code. WhatsApp first (authentication template: fast, works on
 * Wi-Fi, cheaper than SMS in Ghana), SMS as the fallback.
 */
export function CodeChannel({
  phone = me.phone,
  sending,
  notOnWhatsApp,
}: {
  phone?: string
  /** Which button is busy. */
  sending?: 'whatsapp' | 'sms'
  /** We checked: this number has no WhatsApp account. */
  notOnWhatsApp?: boolean
}) {
  const brand = useBrand()
  return (
    <Screen
      header={
        <>
          <AppBar />
          <StepProgress step={2} total={5} />
        </>
      }
    >
      <Title
        body={
          <span className="inline-flex flex-wrap items-center gap-x-2">
            We’ll send a 6-digit code to <b className="text-text tabular-nums">{phone}</b>
            <button className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
              <Pencil className="size-3.5" /> Edit
            </button>
          </span>
        }
      >
        How should we send your code?
      </Title>

      <div className="space-y-3 px-5">
        {notOnWhatsApp ? (
          <div className="flex gap-3 rounded-card border border-warning/40 bg-warning/5 p-4 text-sm">
            <Info className="mt-0.5 size-5 shrink-0 text-warning" />
            <div>
              <div className="font-semibold">This number isn’t on WhatsApp</div>
              <div className="text-dim">No problem — we’ll text the code instead. Standard SMS rates may apply.</div>
            </div>
          </div>
        ) : (
          <div className="rounded-card border border-line bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">WhatsApp</span>
              <span className="rounded-full bg-whatsapp/15 px-2.5 py-0.5 text-xs font-semibold text-whatsapp">Recommended</span>
            </div>
            <Button variant="whatsapp" size="lg" block loading={sending === 'whatsapp'} icon={<WhatsAppGlyph className="size-5" />}>
              {sending === 'whatsapp' ? 'Sending to WhatsApp…' : 'Send code on WhatsApp'}
            </Button>
            <ul className="mt-3 space-y-1 text-sm text-dim">
              <li>· Arrives in seconds, even on Wi-Fi with no SIM signal</li>
              <li>· Comes from {brand.name}’s verified business account</li>
            </ul>
          </div>
        )}

        <div className="rounded-card border border-line bg-surface p-4">
          <div className="mb-3 text-sm font-semibold">Text message</div>
          <Button
            variant={notOnWhatsApp ? 'primary' : 'secondary'}
            size="lg"
            block
            loading={sending === 'sms'}
            disabled={sending === 'whatsapp'}
            icon={<MessageSquareText className="size-5" />}
          >
            {sending === 'sms' ? 'Sending SMS…' : 'Send by SMS'}
          </Button>
          <p className="mt-3 text-sm text-dim">Can take up to a minute on a busy network.</p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-2.5 px-5 pb-8 text-xs text-faint">
        <ShieldCheck className="size-4 shrink-0" />
        <span>We only use this to confirm it’s you. We never message your contacts, and {brand.name} staff will never ask you for this code.</span>
      </div>
    </Screen>
  )
}
