import { Bell, Check, X } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { Button } from '@/components/ui/primitives'
import { StepProgress, Title, WhatsAppGlyph } from './parts'

/**
 * Explains the two channels honestly before the OS prompt appears, so "Allow"
 * is an informed yes. WhatsApp = your bookings. Push = tonight's drops.
 */
export function NotificationOptIn({ systemPrompt }: { /** Show the OS permission dialog on top. */ systemPrompt?: boolean }) {
  const brand = useBrand()
  return (
    <Screen
      header={
        <>
          <AppBar />
          <StepProgress step={5} total={5} />
        </>
      }
      footer={
        <BottomBar>
          <Button block size="lg" icon={<Bell className="size-5" />}>
            Turn on notifications
          </Button>
          <Button block variant="ghost" className="mt-2">
            Not now
          </Button>
        </BottomBar>
      }
    >
      <Title body="Two channels, two jobs. You choose what each one is for.">How should we keep you posted?</Title>

      <div className="space-y-3 px-5 pb-6">
        <div className="rounded-card border border-line bg-surface p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-whatsapp text-[#06260f]">
              <WhatsAppGlyph className="size-6" />
            </span>
            <div className="flex-1">
              <div className="font-semibold">WhatsApp · your bookings</div>
              <div className="text-xs text-success">On — you chose this in the last step</div>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {['Booking confirmed + your QR', 'MoMo receipts and refunds', 'Guests accepting or paying their share', 'A reminder 3 hours before you go'].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-success" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-card border border-line bg-surface p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-on-accent">
              <Bell className="size-5" />
            </span>
            <div className="flex-1">
              <div className="font-semibold">App notifications · what’s on</div>
              <div className="text-xs text-dim">Needs your permission</div>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {['A table opens up on your Notify list', 'New nights from DJs and venues you saved', 'Tickets about to sell out for nights you liked'].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-success" /> {t}
              </li>
            ))}
            <li className="flex gap-2 text-dim">
              <X className="mt-0.5 size-4 shrink-0" /> No more than one promo a week. Mute any time.
            </li>
          </ul>
        </div>

        <p className="px-1 text-xs text-faint">
          We never sell your number, and venues can’t message you directly. {brand.name} only messages you about things you booked or asked for.
        </p>
      </div>

      {systemPrompt && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 px-12">
          <div className="w-full overflow-hidden rounded-2xl bg-[#2c2c2e]/95 text-center text-white backdrop-blur-xl">
            <div className="px-4 pt-5 pb-4">
              <div className="text-[17px] font-semibold">“{brand.name}” Would Like to Send You Notifications</div>
              <div className="mt-1 text-[13px] text-white/80">Notifications may include alerts, sounds and icon badges. These can be configured in Settings.</div>
            </div>
            <div className="grid grid-cols-2 border-t border-white/15 text-[17px]">
              <button className="py-3 text-[#0a84ff]">Don’t Allow</button>
              <button className="border-l border-white/15 py-3 font-semibold text-[#0a84ff]">Allow</button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  )
}
