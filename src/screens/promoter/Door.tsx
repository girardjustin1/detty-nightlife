import { useState } from 'react'
import { Armchair, Check, CircleCheck, CircleX, Flashlight, Gift, History, Keyboard, Search, Ticket, TriangleAlert, Undo2, X } from 'lucide-react'
import { Screen, Sheet, StatusBar } from '@/components/app/chrome'
import { Avatar, Button, ProgressBar, Segmented } from '@/components/ui/primitives'
import { cx, time } from '@/lib/format'
import { OfflineBanner, PartnerLogo, PromoterTabBar, tight } from './PromoterChrome'
import type { ListGuest, ScanResult } from './promoterData'
import { guestList, guestsArrived, guestsExpected, scanResults } from './promoterData'

export type DoorMode = 'list' | 'scan'
type ResultKey = keyof typeof scanResults

export function Door({
  mode: initialMode = 'scan',
  result,
  offline,
  justCheckedIn,
  confirmUndo,
  query = '',
}: {
  mode?: DoorMode
  result?: ResultKey
  offline?: boolean
  /** List mode: show the undo toast for this guest id. */
  justCheckedIn?: string
  confirmUndo?: boolean
  query?: string
}) {
  const [mode, setMode] = useState<DoorMode>(initialMode)
  const scan = mode === 'scan'
  const toast = justCheckedIn ? guestList.find((g) => g.id === justCheckedIn) : undefined
  return (
    <Screen
      className={cx(scan && 'bg-black')}
      header={
        <div className={cx('z-20 shrink-0', scan ? 'bg-black text-white' : 'border-b border-line bg-bg')}>
          <StatusBar />
          {offline && <OfflineBanner pending={7} />}
          <div className="flex items-center justify-between gap-2 px-4 pt-0.5 pb-2">
            <PartnerLogo />
            <span className={cx('text-xs', scan ? 'text-white/70' : 'text-dim')}>
              Main door · <b className={scan ? 'text-white' : 'text-text'}>Kofi Badu</b>
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 pb-3">
            <Segmented
              className="flex-1"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'list', label: 'List' },
                { value: 'scan', label: 'Scan' },
              ]}
            />
            <div className="text-right leading-tight">
              <div className="text-lg font-bold tabular-nums">
                {guestsArrived}
                <span className={cx('text-sm', scan ? 'text-white/50' : 'text-faint')}>/{guestsExpected}</span>
              </div>
              <div className={cx('text-[10px] font-semibold uppercase', scan ? 'text-white/60' : 'text-faint')}>in tonight</div>
            </div>
          </div>
        </div>
      }
      bodyClassName={cx(scan && 'relative')}
      footer={!scan && toast ? <UndoToast g={toast} /> : undefined}
      tabBar={<PromoterTabBar active="door" />}
    >
      {scan ? <ScanView result={result ? scanResults[result] : undefined} offline={offline} /> : <ListView justCheckedIn={justCheckedIn} query={query} />}
      {confirmUndo && (
        <Sheet
          title="Undo check-in?"
          footer={
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" block>
                Keep
              </Button>
              <Button variant="danger" block icon={<Undo2 className="size-4" />}>
                Undo
              </Button>
            </div>
          }
        >
          <p className="pb-2 text-sm text-dim">Fiifi Arthur +1 goes back to “not arrived” and their code works again at the door. This is logged with your name.</p>
        </Sheet>
      )}
    </Screen>
  )
}

/* ───────────────────────── Scan ───────────────────────── */

function ScanView({ result, offline }: { result?: ScanResult; offline?: boolean }) {
  return (
    <div className="relative h-full min-h-[560px] overflow-hidden bg-black text-white">
      {/* Camera mock: a soft, out-of-focus club entrance. */}
      <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(60% 40% at 30% 30%, rgb(255 255 255 / 0.08), transparent), radial-gradient(50% 35% at 75% 65%, rgb(255 255 255 / 0.06), transparent), var(--placeholder)', filter: 'blur(28px) saturate(0.5) brightness(0.45)' }} />
      <div className="absolute top-4 right-4 left-4 flex justify-between">
        <span className="rounded-full bg-black/50 px-3 py-1 text-xs backdrop-blur">{offline ? 'Offline · checking against saved list' : 'Point at the guest’s QR'}</span>
        <button aria-label="Torch" className="flex size-9 items-center justify-center rounded-full bg-black/50 backdrop-blur">
          <Flashlight className="size-4" />
        </button>
      </div>

      {/* Reticle */}
      <div className={cx('absolute top-[64px] left-1/2 size-[236px] -translate-x-1/2', result && 'opacity-40')}>
        {(['top-0 left-0 border-t-4 border-l-4 rounded-tl-[22px]', 'top-0 right-0 border-t-4 border-r-4 rounded-tr-[22px]', 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-[22px]', 'bottom-0 right-0 border-r-4 border-b-4 rounded-br-[22px]'] as const).map((c) => (
          <span key={c} className={cx('absolute size-12 border-accent', c)} />
        ))}
        {!result && <span className="absolute inset-x-5 top-1/2 h-0.5 animate-pulse rounded-full bg-accent shadow-[0_0_18px_var(--accent)]" />}
      </div>

      {!result && (
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-2">
          <Button variant="secondary" className="flex-1 border-white/20 bg-black/60 text-white backdrop-blur" icon={<Keyboard className="size-4" />}>
            Type code
          </Button>
          <Button variant="secondary" className="flex-1 border-white/20 bg-black/60 text-white backdrop-blur" icon={<Search className="size-4" />}>
            Find guest
          </Button>
        </div>
      )}
      {result && <ResultCard r={result} offline={offline} />}
    </div>
  )
}

function ResultCard({ r, offline }: { r: ScanResult; offline?: boolean }) {
  const tone = r.kind === 'valid' ? 'success' : r.kind === 'already' ? 'warning' : 'danger'
  const ring = { success: 'border-success', warning: 'border-warning', danger: 'border-danger' }[tone]
  const head = { success: 'bg-success text-bg', warning: 'bg-warning text-black', danger: 'bg-danger text-white' }[tone]
  return (
    <div className={cx('absolute inset-x-3 bottom-3 overflow-hidden rounded-card border-2 bg-surface text-text shadow-2xl', ring)}>
      <div className={cx('flex items-center gap-2 px-4 py-2.5 text-[15px] font-bold', head)}>
        {r.kind === 'valid' ? <CircleCheck className="size-5" /> : r.kind === 'already' ? <TriangleAlert className="size-5" /> : <CircleX className="size-5" />}
        {r.kind === 'valid' ? 'Valid · let in' : r.kind === 'already' ? 'Already scanned' : r.reason === 'wrong-night' ? 'Wrong night' : 'Not valid'}
        {offline && r.kind === 'valid' && <span className="ml-auto text-[11px] font-semibold opacity-80">Saved offline</span>}
      </div>
      <div className="p-4">
        {r.kind !== 'invalid' || r.name ? (
          <div className="flex items-center gap-3">
            <Avatar name={r.name ?? '?'} size={44} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-bold">{r.name}</div>
              <div className="truncate text-sm text-dim">{r.what}</div>
            </div>
          </div>
        ) : null}
        {r.kind === 'valid' && r.party && (
          <div className="mt-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-semibold">
                Party {r.party.inNow} of {r.party.of} in
              </span>
              <span className="text-xs text-faint">{r.ref}</span>
            </div>
            <ProgressBar value={r.party.inNow} max={r.party.of} tone="success" className="mt-1.5 h-1.5" />
          </div>
        )}
        {r.kind === 'valid' && r.note && <div className="mt-3 rounded-control bg-accent-2/10 px-3 py-2 text-sm text-accent-2">{r.note}</div>}
        {r.kind === 'already' && (
          <div className="mt-3 rounded-control bg-warning/10 px-3 py-2 text-sm">
            Scanned at <b>{time(r.at)}</b> by <b>{r.by}</b> at the main door. Check ID before letting in.
          </div>
        )}
        {r.kind === 'invalid' && <p className={cx('text-sm text-dim', r.name && 'mt-3')}>{r.detail}</p>}
        <div className="mt-4 flex gap-2">
          {r.kind === 'valid' ? (
            <>
              <Button block>Next scan</Button>
              <Button variant="secondary" aria-label="Undo" icon={<Undo2 className="size-4" />}>
                Undo
              </Button>
            </>
          ) : r.kind === 'already' ? (
            <>
              <Button block variant="secondary" icon={<History className="size-4" />}>
                History
              </Button>
              <Button block>Let in anyway</Button>
            </>
          ) : (
            <>
              <Button block variant="secondary" icon={<Search className="size-4" />}>
                Find by name
              </Button>
              <Button block>Scan again</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── List ───────────────────────── */

function UndoToast({ g }: { g: ListGuest }) {
  return (
    <div className="z-20 shrink-0 px-4 pb-2">
      <div className="flex items-center gap-2 rounded-card bg-text px-4 py-3 text-sm text-bg shadow-xl">
        <CircleCheck className="size-4 text-success" />
        <span className="flex-1">
          <b>{g.name}</b>
          {g.plusOnes ? ` +${g.plusOnes}` : ''} checked in
        </span>
        <button className="font-bold">Undo</button>
      </div>
    </div>
  )
}

function ListView({ justCheckedIn, query }: { justCheckedIn?: string; query: string }) {
  const q = query.toLowerCase()
  const [inIds, setIn] = useState<string[]>(() => guestList.filter((g) => g.status === 'checked-in').map((g) => g.id).concat(justCheckedIn ? [justCheckedIn] : []))
  const rows = guestList.filter((g) => g.status !== 'no-show').filter((g) => !q || g.name.toLowerCase().includes(q))
  return (
    <div className="pb-6">
      <div className="px-4 pt-3">
        <label className="flex h-11 items-center gap-2 rounded-control border border-line bg-surface px-3 focus-within:border-accent">
          <Search className="size-4 text-faint" />
          <input defaultValue={query} placeholder="Search name or phone" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint" />
          {query && <X className="size-4 text-faint" />}
        </label>
      </div>
      <div className="flex gap-3 px-4 pt-2 text-xs text-dim">
        <span>
          <b className="text-text">{inIds.length}</b> in
        </span>
        <span>
          <b className="text-text">{rows.length - rows.filter((g) => inIds.includes(g.id)).length}</b> to arrive
        </span>
        <span className="ml-auto">Guest list + tables</span>
      </div>
      {rows.length === 0 ? (
        <div className="px-8 py-14 text-center text-sm text-dim">
          No one called “{query}” on tonight’s list.
          <Button size="sm" variant="secondary" className={cx(tight, 'mt-3')}>
            Add to door list
          </Button>
        </div>
      ) : (
        <ul className="mx-4 mt-2 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
          {rows.map((g) => (
            <GuestRow key={g.id} g={g} checkedIn={inIds.includes(g.id)} at={g.id === justCheckedIn ? '2026-12-18T23:15:00Z' : g.at} onToggle={() => setIn(inIds.includes(g.id) ? inIds.filter((x) => x !== g.id) : [...inIds, g.id])} />
          ))}
        </ul>
      )}
    </div>
  )
}

function GuestRow({ g, checkedIn, at, onToggle }: { g: ListGuest; checkedIn: boolean; at?: string; onToggle: () => void }) {
  const icon = g.list === 'Table' ? <Armchair className="size-3" /> : g.list === 'Comp' ? <Gift className="size-3" /> : <Ticket className="size-3" />
  return (
    <li className="flex items-center gap-3 px-3 py-2.5">
      <Avatar name={g.name} size={34} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">
          {g.name}
          {g.plusOnes > 0 && <span className="text-dim"> +{g.plusOnes}</span>}
        </span>
        <span className="flex items-center gap-1 truncate text-xs text-dim">
          {icon}
          {g.list}
          {g.table && ` ${g.table}`} · {g.addedBy === 'Host' ? 'host' : g.addedBy.split(' ')[0]}
          {g.status === 'pending' && <span className="text-warning"> · RSVP pending</span>}
        </span>
      </span>
      {checkedIn ? (
        <button onClick={onToggle} className="flex shrink-0 items-center gap-1 text-xs font-semibold text-success">
          <Check className="size-4" />
          {at ? time(at) : 'In'}
        </button>
      ) : (
        <Button size="sm" className={cx(tight, 'shrink-0')} onClick={onToggle}>
          Check in
        </Button>
      )}
    </li>
  )
}
