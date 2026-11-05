import type { Decorator, Preview } from '@storybook/react-vite'
import '../src/styles/index.css'
import { BrandProvider } from '../src/brands/BrandContext'
import type { BrandId } from '../src/brands/brands'

/**
 * parameters.frame:
 *   'phone' (default) — 390 × 844 device frame, for every screen story
 *   'none'            — plain canvas on the brand background (components, docs)
 *   'email'           — light canvas for email templates
 *   'raw'             — no wrapper (multi-brand comparison pages set their own)
 */
/** Toolbar → Type: try a display face on every screen without touching brand tokens. */
const typeOverrides: Record<string, string> = {
  'unbounded-caps': "--font-display: 'Unbounded Variable', sans-serif; --display-weight: 700; --display-case: uppercase; --display-tracking: -0.01em;",
  'unbounded-sentence': "--font-display: 'Unbounded Variable', sans-serif; --display-weight: 650; --display-case: none; --display-tracking: -0.02em;",
  'unbounded-light': "--font-display: 'Unbounded Variable', sans-serif; --display-weight: 500; --display-case: uppercase; --display-tracking: 0;",
  playfair: "--font-display: 'Playfair Display Variable', serif; --display-weight: 600; --display-case: none; --display-tracking: 0;",
  bricolage: "--font-display: 'Bricolage Grotesque Variable', sans-serif; --display-weight: 800; --display-case: none; --display-tracking: -0.02em;",
}
const TypeOverride = ({ type }: { type?: string }) =>
  type && typeOverrides[type] ? <style>{`[data-brand] { ${typeOverrides[type].replace(/;/g, ' !important;')} }`}</style> : null

const withBrand: Decorator = (Story, ctx) => {
  const brand = (ctx.globals.brand ?? 'detty') as BrandId
  const dataSaver = ctx.globals.dataSaver === 'on'
  const frame = ctx.parameters.frame ?? 'phone'
  const type = ctx.globals.type as string | undefined
  const inner = (
    <BrandProvider brand={brand} dataSaver={dataSaver}>
      <TypeOverride type={type} />
      <Story />
    </BrandProvider>
  )
  if (frame === 'raw')
    return (
      <>
        <TypeOverride type={type} />
        <Story />
      </>
    )
  if (frame === 'email') return <div style={{ background: '#f1f1f4', minHeight: '100vh', padding: 24 }}>{inner}</div>
  if (frame === 'none')
    return (
      <div data-brand={brand} style={{ minHeight: '100vh', padding: 24 }}>
        {inner}
      </div>
    )
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#0d0d10' }}>
      <div
        style={{
          width: 390,
          height: 844,
          borderRadius: 48,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 0 10px #1c1c22, 0 0 0 11px #33333d, 0 30px 80px rgb(0 0 0 / 0.6)',
          transform: 'translateZ(0)',
        }}
      >
        <BrandProvider brand={brand} dataSaver={dataSaver}>
          <TypeOverride type={type} />
          <div data-brand={brand} style={{ height: '100%' }}>
            <Story />
          </div>
        </BrandProvider>
        <div style={{ position: 'absolute', top: 11, left: '50%', translate: '-50% 0', width: 120, height: 34, borderRadius: 20, background: '#000', zIndex: 60 }} />
        <div style={{ position: 'absolute', bottom: 8, left: '50%', translate: '-50% 0', width: 134, height: 5, borderRadius: 3, background: 'rgb(255 255 255 / 0.5)', zIndex: 60 }} />
      </div>
    </div>
  )
}

const preview: Preview = {
  decorators: [withBrand],
  globalTypes: {
    brand: {
      description: 'Brand direction',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'detty', title: 'Detty — loud & joyful' },
          { value: 'aurum', title: 'Aurum — luxe VIP' },
          { value: 'vybe', title: 'Vybe — neon, music-first' },
          { value: 'gold', title: 'Detty Gold — the blend' },
          { value: 'gold2', title: 'Detty Gold × Vybe type — round 2' },
        ],
        dynamicTitle: true,
      },
    },
    type: {
      description: 'Display type override (fonts exploration)',
      toolbar: {
        title: 'Type',
        icon: 'paragraph',
        items: [
          { value: 'brand', title: 'Type: brand default' },
          { value: 'unbounded-caps', title: 'Unbounded · bold caps (Vybe)' },
          { value: 'unbounded-sentence', title: 'Unbounded · sentence case' },
          { value: 'unbounded-light', title: 'Unbounded · medium caps' },
          { value: 'playfair', title: 'Playfair Display (Aurum / Detty Gold)' },
          { value: 'bricolage', title: 'Bricolage Grotesque (Detty)' },
        ],
        dynamicTitle: true,
      },
    },
    dataSaver: {
      description: 'Data saver (no photos)',
      toolbar: {
        title: 'Data saver',
        icon: 'lightning',
        items: [
          { value: 'off', title: 'Data saver off' },
          { value: 'on', title: 'Data saver on' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { brand: 'detty', dataSaver: 'off', type: 'brand' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Start Here',
          'Brand',
          'Foundations',
          'Components',
          'Consumer',
          ['01 Onboarding', '02 Discover', '03 Event', '04 Venue', '05 Book Tickets', '06 Book a Table', '07 Pay', '08 My Bookings', '09 Guests', '10 Profile', 'States'],
          'Promoter',
          'Emails',
          'WhatsApp',
          'Planning',
        ],
      },
    },
  },
}

export default preview
