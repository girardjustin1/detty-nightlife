import { useBrand } from '@/brands/BrandContext'
import { cx } from '@/lib/format'
import { RATES, RATE_SOURCE, fill, templates, type Category } from './templates'

const catStyle: Record<Category, string> = {
  authentication: 'border-accent-2/50 text-accent-2',
  utility: 'border-success/50 text-success',
  marketing: 'border-accent/60 text-accent',
  service: 'border-line text-dim',
  none: 'border-line text-faint',
}

const usd = (n: number | null) => (n === null ? '–' : n === 0 ? '$0' : `$${n.toFixed(4)}`)

export function TemplateCatalogue() {
  const brand = useBrand()
  const list = templates(brand)
  return (
    <div className="mx-auto max-w-[1400px] text-text">
      <h1 className="display text-2xl">WhatsApp template catalogue</h1>
      <p className="mt-1 max-w-3xl text-sm text-dim">
        Every message we plan to send on WhatsApp, from docs/integrations/whatsapp.md §3. Sample values come from the canonical booking (ACC-7Q4K) and{' '}
        <code>tableQuote</code>. Names and wording are drafts until Meta approves them. Business display name: <strong>{brand.name}</strong>.
      </p>
      <div className="mt-5 overflow-x-auto rounded-card border border-line">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="bg-surface-2 text-xs tracking-wide text-faint uppercase">
            <tr>
              {['Template', 'Category', 'Lang', 'Variables (sample)', 'Buttons', 'Trigger', 'Cost / msg (GH)', 'Phase'].map((h) => (
                <th key={h} className="px-3 py-2.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.name} className="border-t border-line align-top">
                <td className="w-[280px] px-3 py-3">
                  <div className="font-mono text-[13px] font-semibold">{t.name}</div>
                  <div className="mt-0.5 text-xs text-faint">{t.kind === 'template' ? 'Template (draft, needs Meta approval)' : t.kind === 'interactive' ? 'Interactive message (in window)' : 'Not a template'}</div>
                  {t.header && <div className="mt-2 text-xs text-dim">Header: {t.header}</div>}
                  <div className="mt-1.5 line-clamp-4 text-xs whitespace-pre-line text-dim">{fill(t)}</div>
                  {t.footer && <div className="mt-1 text-xs text-faint italic">{t.footer}</div>}
                </td>
                <td className="px-3 py-3">
                  <span className={cx('inline-block rounded-full border px-2 py-0.5 text-xs font-semibold whitespace-nowrap', catStyle[t.category])}>{t.category === 'none' ? 'n/a' : t.category}</span>
                </td>
                <td className="px-3 py-3 font-mono text-xs whitespace-nowrap">{t.language}</td>
                <td className="px-3 py-3">
                  <ul className="space-y-0.5 text-xs">
                    {t.vars.map((v, i) => (
                      <li key={v.name}>
                        <span className="font-mono text-faint">{t.kind === 'template' ? `{{${i + 1}}}` : '·'}</span> {v.name}: <span className="text-dim">{v.sample.length > 46 ? v.sample.slice(0, 44) + '…' : v.sample}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-3">
                  {t.buttons.length ? (
                    <ul className="space-y-1 text-xs">
                      {t.buttons.map((b) => (
                        <li key={b.label} className="whitespace-nowrap">
                          <span className="text-faint">{{ url: 'URL', reply: 'Quick reply', copy: 'Copy code', phone: 'Call', flow: 'Flow', list: 'List' }[b.type]}:</span> {b.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-faint">None</span>
                  )}
                </td>
                <td className="max-w-[240px] px-3 py-3 text-xs text-dim">
                  {t.trigger}
                  {t.notes && <div className="mt-1 text-faint">{t.notes}</div>}
                </td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">
                  <div className="font-mono font-semibold">{t.kind === 'share-link' ? '$0' : usd(RATES[t.category])}</div>
                  <div className="text-faint">{t.kind === 'share-link' ? 'sent by host' : t.category === 'service' ? '1,000 free/mo/number' : 'unverified'}</div>
                </td>
                <td className="px-3 py-3 text-xs">{t.phase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid max-w-4xl gap-1.5 text-xs text-dim">
        <p>
          <strong className="text-text">Rates:</strong> {RATE_SOURCE} Meta charges per delivered message by category and by the recipient’s country code: diaspora numbers (+1, +44) pay their own region’s rate.
        </p>
        <p>
          <strong className="text-text">Since 2026-10-01</strong> utility templates inside an open 24h window are charged, and service replies are charged after 1,000 free per number per month. Free Entry Point (Click-to-WhatsApp ad or Page CTA): everything we send for 7 days is free.
        </p>
        <p>
          <strong className="text-text">Per Ghana booking</strong> (OTP + confirmed + receipt + reminder) ≈ $0.018, our arithmetic. Merging the receipt into <code>booking_confirmed</code> saves about a quarter of the utility spend.
        </p>
        <p>
          <strong className="text-text">Limits:</strong> unverified portfolio = 250 new users per 24h (2,000 after Business Verification). Marketing templates hit per-user caps (error 131049); utility and authentication don’t.
        </p>
      </div>
    </div>
  )
}
