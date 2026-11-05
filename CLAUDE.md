# CLAUDE.md — Detty Nightlife

Mobile-first nightlife booking for Accra, Ghana: event tickets, VIP tables, bottle
pre-orders toward a table minimum, guests, deposits. Plus a promoter/venue companion
app. **Phase 1 = every screen as a Storybook story.** No backend yet.

## Stack
Vite 8 · React 19 · TypeScript 7 (`tsc -b --noEmit`; no `baseUrl`) · Tailwind v4 ·
Storybook 10 (`pnpm storybook` → http://localhost:6026) · lucide-react icons.
Prototype: `pnpm dev` → http://localhost:5330 (`src/prototype/`). Checks: `pnpm check`
(typecheck + oxlint + vitest). Pages: `pnpm build:pages`; `main` deploys to
https://girardjustin1.github.io/detty-nightlife/ (Storybook under `/storybook/`). No UI kit:
the app must stay small for metered mobile data.

## Brands
Four candidate brands share one codebase: `detty` (loud/joyful), `aurum` (luxe VIP),
`vybe` (neon, music-first) and `gold` (Detty Gold, the consolidated look). Tokens live in `src/styles/index.css` as CSS variables, keyed
on `data-brand`. **Only use token utilities** — `bg-bg bg-surface bg-surface-2 border-line
text-text text-dim text-faint bg-accent text-on-accent text-accent-2 text-accent-3
text-success text-warning text-danger rounded-card rounded-control` and the `display`
utility for headings. Never hard-code brand hex colours in screens (partner brand marks
like MTN yellow / WhatsApp green are the exception). Brand copy: `useBrand().copy`.
Check every screen in all three brands (Storybook toolbar → Brand).

## Layout
- `src/components/ui/primitives.tsx` — Button, IconButton, Chip, Badge, Card,
  SectionHeader, ListRow, Img (data-saver aware), Avatar(Stack), TextField, Segmented,
  Stepper, ProgressBar, Skeleton, Toggle.
- `src/components/app/chrome.tsx` — Screen, StatusBar, AppBar, TabBar, BottomBar, Sheet,
  Logo, NetworkBanner.
- `src/components/app/domain.tsx` — EventCard, VenueCard, DateBadge, GenreTags,
  MinSpendMeter, PriceLines, PolicyBlock, FakeQR, PaymentMark, Rating.
- `src/components/app/FloorPlan.tsx` — interactive table map (consumer + promoter modes).
- `src/data/` — `types.ts`, `fixtures.ts` (SAMPLE, fictional), `floorplans.ts`.
- `src/screens/consumer/<group>/`, `src/screens/promoter/`, `src/emails/`, `src/whatsapp/`.
- `docs/research/` (Mobbin findings — read `synthesis.md`), `docs/integrations/`.

## Screen conventions
- One screen = one component, props for state (e.g. `step`, `error`, `loading`), plus a
  `*.stories.tsx` next to it. Default story frame is a 390×844 phone (set
  `parameters.frame: 'none'` for components, `'email'` for emails).
- Story titles: `Consumer/<NN Group>/<Screen>`, `Promoter/<Screen>`, `Emails/<Name>`,
  `WhatsApp/<Name>`. Every important state gets its own story (empty, loading, error,
  offline, sold out, minimum not met…).
- A screen is `<Screen header footer tabBar>`; booking steps use `AppBar` + `BottomBar`.
- Money: `cedis()` from `src/lib/format.ts` (₵). Times: Accra is UTC+0.
- Low bandwidth is a feature: no autoplay video, images via `Img` (respects data saver),
  skeletons over spinners, offline-friendly tickets.
- Fixtures are fictional. Never use real venue, promoter or artist names.

## Git
Branch `consumer-storybook-v1`. Commit as girardjustin1 (repo-local config set).
**Never push or merge without the owner's explicit go-ahead.** The GitHub repo and the
Pages site are public: no secrets, no real personal data.
