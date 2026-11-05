import { useEffect, useState } from 'react'
import { BellRing, CalendarDays, Clock, Plus, Users } from 'lucide-react'
import { AppBar, Screen } from '@/components/app/chrome'
import { Button, Card, Img, Toggle } from '@/components/ui/primitives'
import { cx, dayShort } from '@/lib/format'
import { eventById, notifyItems, venueById, type NotifyItem } from './bookingData'

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function OpenedCard({ item, secondsLeft }: { item: NotifyItem; secondsLeft: number }) {
  const v = venueById(item.venueId)
  const ev = item.eventId ? eventById(item.eventId) : undefined
  const [left, setLeft] = useState(secondsLeft)
  useEffect(() => {
    if (left <= 0) return
    const id = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [left])
  const expired = left <= 0
  return (
    <div className={cx('overflow-hidden rounded-card border-2 bg-surface', expired ? 'border-line' : 'border-accent')}>
      <div className={cx('flex items-center gap-2 px-4 py-2.5 text-sm font-semibold', expired ? 'bg-surface-2 text-dim' : 'bg-accent text-on-accent')}>
        <BellRing className="size-4" />
        {expired ? 'This one got away — we’ll keep watching' : 'A table opened — book within'}
        {!expired && <span className="ml-auto font-mono text-base tabular-nums">{mmss(left)}</span>}
      </div>
      <div className="flex gap-3 p-4">
        <Img src={ev?.photo ?? v.photo} alt={v.name} className="size-16 shrink-0" />
        <div className="min-w-0">
          <div className="font-semibold">
            {item.what} · {v.name}
          </div>
          <div className="text-sm text-dim">
            {ev?.title} · Tonight, {item.window}
          </div>
          <div className="text-sm text-dim">{item.party} guests · held for you only</div>
        </div>
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <Button block disabled={expired}>
          Book it
        </Button>
        <Button variant="secondary" className="shrink-0">
          Pass
        </Button>
      </div>
    </div>
  )
}

export function NotifyList({ empty, secondsLeft = 900 }: { empty?: boolean; secondsLeft?: number }) {
  const items = empty ? [] : notifyItems
  const opened = items.find((i) => i.notified)
  const watching = items.filter((i) => !i.notified)
  return (
    <Screen header={<AppBar title="Notify list" subtitle="We ping you on WhatsApp when a table opens" />}>
      <div className="space-y-3 px-5 pt-2 pb-8">
        {opened && <OpenedCard item={opened} secondsLeft={secondsLeft} />}
        {watching.length > 0 && <div className="pt-2 text-sm font-semibold text-dim">Watching · {watching.length}</div>}
        {watching.map((n) => {
          const v = venueById(n.venueId)
          const ev = n.eventId ? eventById(n.eventId) : undefined
          return (
            <Card key={n.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">
                    {n.what} · {v.name}
                  </div>
                  {ev && <div className="truncate text-sm text-dim">{ev.title}</div>}
                </div>
                <Toggle checked label={`Notify for ${n.what} at ${v.name}`} />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-dim">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" /> {dayShort(n.dateIso)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" /> {n.window}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4" /> {n.party} guests
                </span>
              </div>
            </Card>
          )
        })}
        {items.length === 0 && (
          <div className="flex flex-col items-center px-4 pt-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-surface-2 text-accent">
              <BellRing className="size-7" />
            </span>
            <p className="display mt-4 text-xl">Nothing on your list</p>
            <p className="mt-1 text-sm text-dim">When a table is full, tap “Notify me”. If it opens, we hold it for you for 15 minutes.</p>
          </div>
        )}
        <Button variant="secondary" block icon={<Plus className="size-4" />}>
          Add a night
        </Button>
        {items.length > 0 && <p className="px-2 text-center text-xs text-faint">When a table opens we hold it for you for 15 minutes, then offer it to the next person.</p>}
      </div>
    </Screen>
  )
}
