import { Download, ShieldCheck, Ticket } from 'lucide-react'
import { useBrand } from '@/brands/BrandContext'
import { Logo, Screen, StatusBar } from '@/components/app/chrome'
import { Button } from '@/components/ui/primitives'

/** Update prompt. `required` blocks the app (payments changed); `optional` can be dismissed. */
export function ForceUpdate({
  mode = 'required',
  sizeMb = 9,
  version = '1.4.0',
}: {
  mode?: 'required' | 'optional'
  /** Download size, shown so people on mobile data can decide. */
  sizeMb?: number
  version?: string
}) {
  const brand = useBrand()
  const required = mode === 'required'
  return (
    <Screen header={<StatusBar />}>
      <div className="flex min-h-full flex-col px-7 pt-14 pb-10">
        <Logo variant="appIcon" className="size-24 rounded-[22px]" />
        <h1 className="display mt-7 text-[30px] leading-tight">{required ? 'Time to update' : 'A new version is ready'}</h1>
        <p className="mt-3 text-[15px] text-dim">
          {required
            ? `This version of ${brand.name} can’t take payments any more — we changed how payments are approved to keep them safe. Update to keep booking.`
            : `Version ${version} makes checkout faster and fixes a few bugs. Update when it suits you.`}
        </p>

        <ul className="mt-6 space-y-3 text-sm">
          <li className="flex gap-3">
            <Ticket className="size-5 shrink-0 text-accent-2" />
            <span>
              <b>Your tickets still work.</b> <span className="text-dim">QR codes you already have open fine, even before you update.</span>
            </span>
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="size-5 shrink-0 text-accent-2" />
            <span>
              <b>Nothing is lost.</b> <span className="text-dim">Bookings, saved nights and payment methods stay on your account.</span>
            </span>
          </li>
          <li className="flex gap-3">
            <Download className="size-5 shrink-0 text-accent-2" />
            <span>
              <b>About {sizeMb} MB.</b> <span className="text-dim">Wi-Fi is cheaper if you’re close to it.</span>
            </span>
          </li>
        </ul>

        <div className="mt-auto space-y-2.5 pt-10">
          <Button block size="lg">
            Update now
          </Button>
          {required ? (
            <Button block variant="ghost">
              Open my tickets
            </Button>
          ) : (
            <Button block variant="ghost">
              Not now
            </Button>
          )}
        </div>
      </div>
    </Screen>
  )
}
