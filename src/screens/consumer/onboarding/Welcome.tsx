import { Armchair, Ticket, Wine } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { Logo, Screen, StatusBar } from '@/components/app/chrome'
import { Button, Img } from '@/components/ui/primitives'

/** First launch. Brand key art, one promise, one way in: your phone number. */
export function Welcome({ onStart }: { onStart?: () => void }) {
  const brand = useBrand()
  return (
    <Screen bodyClassName="relative flex flex-col">
      <Img src={brand.keyArt} alt="" rounded={false} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

      <StatusBar tone="overlay" />
      <div className="relative z-10 px-6 pt-14">
        <Logo className="h-9 w-auto" />
      </div>

      <div className="relative z-10 mt-auto px-6 pb-10 text-white">
        <div className="mb-4 flex gap-2">
          {[
            { icon: <Ticket className="size-3.5" />, label: 'Tickets' },
            { icon: <Armchair className="size-3.5" />, label: 'Tables' },
            { icon: <Wine className="size-3.5" />, label: 'Bottles' },
          ].map((p) => (
            <span key={p.label} className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              {p.icon}
              {p.label}
            </span>
          ))}
        </div>
        <h1 className="display text-[40px] leading-[1.05]">{brand.copy.welcomeTitle}</h1>
        <p className="mt-3 text-base text-white/80">{brand.copy.welcomeBody}</p>
        <Button size="lg" block className="mt-7" onClick={onStart}>
          Get started
        </Button>
        <p className="mt-4 text-center text-sm text-white/70">
          Been here before? <b className="text-white">Use the same number</b> to log in.
        </p>
      </div>
    </Screen>
  )
}
