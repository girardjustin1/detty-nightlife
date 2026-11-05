import { useState } from 'react'
import { Banknote, Cake, Check, CreditCard, MessageCircle, Phone, Smartphone, Sparkles, StickyNote } from 'lucide-react'
import { AppBar, BottomBar, Screen, Sheet } from '@/components/app/chrome'
import { MinSpendMeter } from '@/components/app/domain'
import { Avatar, Button, IconButton, Segmented, TextField } from '@/components/ui/primitives'
import { bottleById, guests } from '@/data/fixtures'
import { RULES } from '@/lib/pricing'
import { cedis, cx, dayShort, time } from '@/lib/format'
import { Fact, Label, PayLabel, StatusPill } from './PromoterChrome'
import { b3Timeline, guestList, reservationByTable, staffById, tierById } from './promoterData'

type Method = 'momo' | 'card' | 'cash'

export function BookingDetail({ collect, method = 'momo', settled, prepped = ['mixers'] }: { collect?: boolean; method?: Method; settled?: boolean; prepped?: string[] }) {
  const res = reservationByTable('B3')!
  const tier = tierById(res.tierId)
  const [done, setDone] = useState<string[]>(prepped)
  const [m, setM] = useState<Method>(method)
  const service = res.quote.serviceAtVenue
  const balance = settled ? 0 : res.balance
  const inList = guestList.filter((g) => g.table === 'B3')

  return (
    <Screen
      header={
        <AppBar
          title={`${res.tableId} · ${res.host}`}
          subtitle={`${res.ref} · ${tier.name}`}
          trailing={
            <IconButton label="Message host on WhatsApp" className="size-9">
              <MessageCircle className="size-4" />
            </IconButton>
          }
        />
      }
      footer={
        <BottomBar
          summary={
            settled ? (
              <span className="text-sm text-success">
                <Check className="mr-1 inline size-4" />
                Settled · receipt sent on WhatsApp
              </span>
            ) : (
              <>
                <div className="text-xs text-dim">Balance + {RULES.venueServicePct}% service</div>
                <div className="text-lg font-bold tabular-nums">{cedis(balance + service)}</div>
              </>
            )
          }
        >
          {settled ? (
            <Button variant="secondary">Close tab</Button>
          ) : (
            <Button icon={<Banknote className="size-4" />}>Record payment</Button>
          )}
        </BottomBar>
      }
    >
      <div className="flex flex-wrap items-center gap-2 px-4 pt-1">
        <StatusPill status={res.status} />
        <PayLabel pay={settled ? 'paid-in-full' : res.pay} />
        <span className="text-xs text-faint">· via {res.promoterId ? staffById(res.promoterId).company : res.source}</span>
      </div>

      <div className="mx-4 mt-3 flex items-center gap-3 rounded-card border border-line bg-surface p-3">
        <Avatar name={res.host} size={44} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{res.host}</div>
          <div className="truncate text-xs text-dim">{res.phone} · 3rd booking</div>
        </div>
        <IconButton label="Call host" className="size-9">
          <Phone className="size-4" />
        </IconButton>
      </div>

      <div className="mx-4 mt-2 grid grid-cols-3 gap-2 text-center">
        {[
          ['Party', `${res.arrived}/${res.partySize}`],
          ['Due', time(res.arriveBy)],
          ['Arrived', res.arrivedAt ? time(res.arrivedAt) : '—'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-control border border-line bg-surface py-2">
            <div className="text-[10px] font-bold text-faint uppercase">{k}</div>
            <div className="text-[15px] font-bold tabular-nums">{v}</div>
          </div>
        ))}
      </div>

      {(res.occasion || res.notes) && (
        <div className="mx-4 mt-2 space-y-1.5 rounded-card border border-accent-2/30 bg-accent-2/5 p-3 text-sm">
          {res.occasion && (
            <div className="flex items-center gap-2 font-semibold">
              <Cake className="size-4 text-accent-2" /> {res.occasion}
            </div>
          )}
          {res.notes && (
            <div className="flex items-start gap-2 text-dim">
              <StickyNote className="mt-0.5 size-4 shrink-0" /> {res.notes}
            </div>
          )}
        </div>
      )}

      <Label>Timeline</Label>
      <ol className="mx-4 rounded-card border border-line bg-surface px-3 py-2">
        {b3Timeline.map((t, i) => {
          const isDone = t.done || (t.id === 'balance' && settled)
          return (
            <li key={t.id} className="relative flex gap-3 pb-3 last:pb-1">
              {i < b3Timeline.length - 1 && <span className={cx('absolute top-5 left-[9px] h-[calc(100%-12px)] w-0.5', isDone ? 'bg-success/50' : 'bg-line')} />}
              <span className={cx('z-10 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full', isDone ? 'bg-success text-bg' : 'border-2 border-line bg-surface')}>
                {isDone && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className={cx('block font-medium', !isDone && 'text-dim')}>
                  {t.label}
                  {t.id === 'deposit' && ` · ${cedis(res.depositPaid)}`}
                </span>
                <span className="block text-xs text-faint">{t.at ? `${dayShort(t.at)} · ${time(t.at)}` : settled ? 'Just now' : `${cedis(res.balance)} to collect`}</span>
              </span>
            </li>
          )
        })}
      </ol>

      <Label action={`${done.length}/${res.lines.length} ready`}>Bar prep</Label>
      <div className="mx-4 overflow-hidden rounded-card border border-line bg-surface">
        {res.lines.map((l) => {
          const b = bottleById(l.bottleId)
          const on = done.includes(l.bottleId)
          return (
            <button
              key={l.bottleId}
              onClick={() => setDone(on ? done.filter((x) => x !== l.bottleId) : [...done, l.bottleId])}
              className="flex w-full items-center gap-3 border-b border-line px-3 py-2.5 text-left last:border-0"
            >
              <span className={cx('flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2', on ? 'border-success bg-success text-bg' : 'border-line')}>
                {on && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className="w-6 text-sm font-bold text-accent tabular-nums">{l.qty}×</span>
              <span className={cx('min-w-0 flex-1 text-sm', on && 'text-faint line-through')}>
                <span className="block truncate">{b.name}</span>
                {b.showpiece && (
                  <span className="flex items-center gap-1 text-xs text-accent-2 no-underline">
                    <Sparkles className="size-3" /> Showpiece · sparklers at 12am
                  </span>
                )}
              </span>
              <span className="text-xs text-faint">{b.size}</span>
            </button>
          )
        })}
      </div>

      <Label action="Invite more">Guests · {inList.filter((g) => g.status === 'checked-in').length} in</Label>
      <ul className="mx-4 divide-y divide-line rounded-card border border-line bg-surface">
        {guests.map((g) => {
          const row = inList.find((x) => x.name === g.name)
          const st = row?.status === 'checked-in' ? 'In' : g.status === 'declined' ? 'Declined' : g.status === 'invited' ? 'Invited' : 'Accepted'
          return (
            <li key={g.id} className="flex items-center gap-3 px-3 py-2">
              <Avatar name={g.name} size={28} />
              <span className="min-w-0 flex-1 truncate text-sm">
                {g.name}
                {g.status === 'host' && <span className="text-faint"> · host</span>}
              </span>
              <span className={cx('text-xs font-semibold', st === 'In' ? 'text-success' : st === 'Declined' ? 'text-faint' : 'text-dim')}>
                {st}
                {row?.at && ` ${time(row.at)}`}
              </span>
            </li>
          )
        })}
      </ul>

      <Label>Money</Label>
      <div className="mx-4">
        <MinSpendMeter spent={res.quote.preOrder} minimum={tier.minSpend} />
      </div>
      <div className="mx-4 mt-2 mb-6 rounded-card border border-line bg-surface px-3 py-1.5">
        <Fact k="Commitment" v={cedis(res.quote.commitment)} />
        <Fact k={`Deposit paid (${tier.depositPct}%)`} v={<span className="text-success">−{cedis(res.depositPaid)}</span>} />
        {settled && <Fact k="Paid at venue · MoMo" v={<span className="text-success">−{cedis(res.balance)}</span>} />}
        <Fact k="Balance" v={cedis(balance)} className="border-t border-line" />
        <Fact k={`Service charge (${RULES.venueServicePct}%)`} v={settled ? <span className="text-success">Paid</span> : cedis(service)} />
      </div>

      {collect && (
        <Sheet
          title="Record payment"
          footer={
            <Button block size="lg">
              {m === 'momo' ? `Send ${cedis(res.balance + service)} prompt` : `Record ${cedis(res.balance + service)}`}
            </Button>
          }
        >
          <div className="space-y-4 pb-2">
            <Segmented
              value={m}
              onChange={setM}
              options={[
                { value: 'momo', label: <><Smartphone className="size-4" /> MoMo</> },
                { value: 'card', label: <><CreditCard className="size-4" /> Card</> },
                { value: 'cash', label: <><Banknote className="size-4" /> Cash</> },
              ]}
            />
            <div className="rounded-card border border-line bg-bg px-3 py-1.5">
              <Fact k="Balance" v={cedis(res.balance)} />
              <Fact k={`Service (${RULES.venueServicePct}%)`} v={cedis(service)} />
              <Fact k="Total" v={cedis(res.balance + service)} className="border-t border-line" />
            </div>
            <TextField label="Amount" prefix="₵" defaultValue={(res.balance + service).toLocaleString('en-GH')} inputMode="decimal" />
            {m === 'momo' && (
              <>
                <TextField label="Payer’s MoMo number" prefix="+233" defaultValue="24 555 0142" hint="They approve the prompt on their phone. We confirm here when it lands." />
                <div className="flex items-center gap-2 text-xs text-dim">
                  <span className="size-2 rounded-full bg-success" /> MTN · Telecel · AT Money
                </div>
              </>
            )}
            {m === 'card' && <TextField label="POS approval code" placeholder="e.g. 483920" hint="From the venue card terminal slip." />}
            {m === 'cash' && <TextField label="Received by" defaultValue="Esi Quaye (Manager)" hint="Logged with your name and the time." />}
            <button className="text-sm font-semibold text-accent">Split between guests</button>
          </div>
        </Sheet>
      )}
    </Screen>
  )
}
