import { Check, Eye, GripVertical, ImagePlus, Lock, Plus, Sparkles, Users } from 'lucide-react'
import { AppBar, BottomBar, Screen } from '@/components/app/chrome'
import { GenreTags } from '@/components/app/domain'
import { Avatar, Button, Chip, Img, Segmented, TextField, Toggle } from '@/components/ui/primitives'
import type { Genre } from '@/data/types'
import { RULES } from '@/lib/pricing'
import { cedis, cx, dayLong, dayShort, time } from '@/lib/format'
import { Fact, Label } from './PromoterChrome'
import { WhatsAppPromoCard } from './Events'
import { draftEvent, vaultPlan, vaultTiers } from './promoterData'

export type CreateStep = 'basics' | 'lineup' | 'tickets' | 'tables' | 'publish'
const steps: { id: CreateStep; label: string }[] = [
  { id: 'basics', label: 'Basics' },
  { id: 'lineup', label: 'Lineup' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'tables', label: 'Tables' },
  { id: 'publish', label: 'Publish' },
]
const allGenres: Genre[] = ['Afrobeats', 'Amapiano', 'Afro House', 'Hiplife', 'Highlife', 'Hip-Hop', 'R&B', 'Dancehall', 'Gqom', 'Live Band']

export function CreateEvent({ step = 'basics', published }: { step?: CreateStep; published?: boolean }) {
  const i = steps.findIndex((s) => s.id === step)
  return (
    <Screen
      header={
        <div className="shrink-0 border-b border-line bg-bg">
          <AppBar title="New event" subtitle="The Vault · saved as draft" trailing={<span className="pr-1 text-sm font-semibold text-dim">Save</span>} />
          <ol className="flex gap-1 px-4 pb-3">
            {steps.map((s, j) => (
              <li key={s.id} className="flex-1">
                <span className={cx('block h-1 rounded-full', j <= i ? 'bg-accent' : 'bg-surface-2')} />
                <span className={cx('mt-1 block text-[10.5px] font-semibold', j === i ? 'text-text' : j < i ? 'text-dim' : 'text-faint')}>
                  {j < i && <Check className="mr-0.5 inline size-3 text-success" />}
                  {s.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      }
      footer={
        <BottomBar summary={<span className="text-xs text-dim">Step {i + 1} of 5</span>}>
          {step === 'publish' ? (
            <Button disabled={published} icon={published ? <Check className="size-4" /> : undefined}>
              {published ? 'Published' : 'Publish now'}
            </Button>
          ) : (
            <Button>Next: {steps[i + 1].label}</Button>
          )}
        </BottomBar>
      }
    >
      <div className="px-4 pt-4 pb-6">
        {step === 'basics' && <Basics />}
        {step === 'lineup' && <Lineup />}
        {step === 'tickets' && <Tickets />}
        {step === 'tables' && <Tables />}
        {step === 'publish' && <Publish published={published} />}
      </div>
    </Screen>
  )
}

function Basics() {
  return (
    <div className="space-y-4">
      <button className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-1 rounded-card border-2 border-dashed border-line bg-surface text-dim">
        <ImagePlus className="size-7" />
        <span className="text-sm font-semibold">Add poster</span>
        <span className="text-xs text-faint">4:5 or 9:16 · we compress it for slow networks</span>
      </button>
      <TextField label="Event name" defaultValue={draftEvent.title} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Date" defaultValue={dayShort(draftEvent.date)} />
        <TextField label="Doors" defaultValue={time(draftEvent.doors)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Music starts" defaultValue={time(draftEvent.date)} />
        <TextField label="Ends" defaultValue={time(draftEvent.ends)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Min age" defaultValue="21+" />
        <TextField label="Dress code" defaultValue="Smart, stylish" />
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-dim">Description</span>
        <textarea rows={3} className="w-full rounded-control border border-line bg-surface p-3 text-sm outline-none focus:border-accent" defaultValue="Year-end Amapiano at The Vault. Log drum till late, bottle parades on the lounge deck." />
      </label>
    </div>
  )
}

function Lineup() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold">Genres</h2>
        <p className="text-xs text-faint">Up to 3. Used for Discover filters and broadcasts.</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {allGenres.map((g) => (
            <Chip key={g} selected={draftEvent.genres.includes(g)} className="h-8 px-3 text-[13px]">
              {g}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-sm font-semibold">Lineup</h2>
        <ul className="mt-2 divide-y divide-line rounded-card border border-line bg-surface">
          {draftEvent.lineup.map((a) => (
            <li key={a.name} className="flex items-center gap-3 px-3 py-2.5">
              <GripVertical className="size-4 text-faint" />
              <Avatar name={a.name} size={32} />
              <span className="flex-1 text-sm font-semibold">{a.name}</span>
              <span className="rounded-[5px] bg-surface-2 px-1.5 py-px text-[11px] font-bold text-dim">{a.role}</span>
            </li>
          ))}
          <li>
            <button className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-semibold text-accent">
              <Plus className="size-4" /> Add artist, DJ or host
            </button>
          </li>
        </ul>
        <p className="mt-2 text-xs text-faint">Set times are optional. Guests see the headliner first.</p>
      </div>
    </div>
  )
}

function Tickets() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Ticket tiers</h2>
        <span className="text-xs text-faint">{draftEvent.ticketTiers.reduce((s, t) => s + t.qty, 0)} tickets total</span>
      </div>
      {draftEvent.ticketTiers.map((t) => (
        <div key={t.id} className="rounded-card border border-line bg-surface p-3">
          <div className="flex items-center gap-2">
            <GripVertical className="size-4 text-faint" />
            <span className="flex-1 font-semibold">{t.name}</span>
            <Toggle checked label={`${t.name} on sale`} />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
            <Cell k="Price" v={cedis(t.price)} />
            <Cell k="Quantity" v={String(t.qty)} />
            <Cell k="Sales end" v={t.window.replace('Until ', '')} />
          </div>
        </div>
      ))}
      <Button variant="secondary" block icon={<Plus className="size-4" />}>
        Add tier
      </Button>
      <p className="text-xs text-faint">
        Guests pay a {RULES.ticketFeePct}% booking fee on top of the ticket price. Early bird switches to GA automatically when it sells out.
      </p>
    </div>
  )
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <span className="block rounded-control border border-line bg-bg px-2.5 py-1.5">
      <span className="block text-[10px] font-bold text-faint uppercase">{k}</span>
      <span className="block font-semibold tabular-nums">{v}</span>
    </span>
  )
}

function Tables() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Table inventory</h2>
        <span className="text-xs text-faint">From The Vault floor plan</span>
      </div>
      {vaultTiers.map((t) => {
        const count = vaultPlan.tables.filter((x) => x.tierId === t.id).length
        const override = draftEvent.minOverrides[t.id as keyof typeof draftEvent.minOverrides] as number | undefined
        const min = override ?? t.minSpend
        const deposit = Math.round((min * t.depositPct) / 100)
        return (
          <div key={t.id} className="rounded-card border border-line bg-surface p-3">
            <div className="flex items-center gap-2">
              <span className="flex-1">
                <span className="block font-semibold">{t.name}</span>
                <span className="flex items-center gap-1 text-xs text-dim">
                  <Users className="size-3" /> up to {t.capacity} · {vaultPlan.tables.filter((x) => x.tierId === t.id).map((x) => x.label).join(' ')}
                </span>
              </span>
              <Toggle checked label={`Sell ${t.name}`} />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <Cell k="On sale" v={`${count} of ${count}`} />
              <Cell k="Minimum" v={cedis(min)} />
              <Cell k="Deposit" v={`${t.depositPct}%`} />
            </div>
            <div className="mt-1.5 text-[11px] text-faint">
              {override ? (
                <span className="text-accent-2">
                  Raised from {cedis(t.minSpend)} for this night · deposit {cedis(deposit)}
                </span>
              ) : (
                <>Deposit {cedis(deposit)} at booking · balance at the venue</>
              )}
            </div>
          </div>
        )
      })}
      <div className="rounded-card border border-line bg-surface px-3 py-1">
        <Fact k="Release unarrived tables" v={`${RULES.holdMinutesAfterDoors / 60} h after doors`} />
        <Fact k="Large-party approval" v="Over capacity" />
      </div>
    </div>
  )
}

function Publish({ published }: { published?: boolean }) {
  return (
    <div className="space-y-4">
      {published && (
        <div className="flex items-center gap-2 rounded-card border border-success/40 bg-success/10 px-3 py-2.5 text-sm">
          <Check className="size-4 text-success" /> <b>Live on Detty.</b> <span className="text-dim">Now share it.</span>
        </div>
      )}
      <div className="overflow-hidden rounded-card border border-line bg-surface">
        <Img src={draftEvent.photo} alt="" rounded={false} className="aspect-[16/9] w-full" />
        <div className="p-3">
          <div className="text-xs font-semibold text-accent uppercase">
            {dayLong(draftEvent.date)} · doors {time(draftEvent.doors)}
          </div>
          <div className="display mt-1 text-xl">{draftEvent.title}</div>
          <div className="mt-0.5 text-sm text-dim">{draftEvent.lineup.map((a) => a.name).join(' · ')}</div>
          <GenreTags genres={draftEvent.genres} className="mt-2" />
        </div>
      </div>
      <div className="rounded-card border border-line bg-surface px-3 py-1">
        <Fact k="Tickets" v={`${draftEvent.ticketTiers.length} tiers · from ${cedis(Math.min(...draftEvent.ticketTiers.map((t) => t.price)))}`} />
        <Fact k="Tables" v={`${vaultPlan.tables.length} tables · from ${cedis(Math.min(...vaultTiers.map((t) => t.minSpend)))}`} />
        <Fact k="Capacity" v="450" />
      </div>
      <Label className="px-0 pt-1">Visibility</Label>
      <Segmented
        value="public"
        options={[
          { value: 'public', label: <><Eye className="size-4" /> Public</> },
          { value: 'link', label: <><Lock className="size-4" /> Link only</> },
        ]}
      />
      <div className="flex items-center justify-between rounded-card border border-line bg-surface p-3">
        <span>
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Sparkles className="size-4 text-accent-2" /> Tell past guests
          </span>
          <span className="block text-xs text-faint">Opens Broadcast with this event attached</span>
        </span>
        <Toggle checked={false} label="Tell past guests" />
      </div>
      <WhatsAppPromoCard eventTitle={draftEvent.title} photo={draftEvent.photo} />
    </div>
  )
}
