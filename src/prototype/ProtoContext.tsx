import { createContext, useContext } from 'react'
import { DEFAULT_BRAND, type BrandId } from '@/brands/brands'

export type ExperienceId = 'wa-menu' | 'wa-flows' | 'wa-ai' | 'app'

export type ProtoApi = {
  brand: BrandId
  /** Navigate inside the current experience (app step id). */
  go: (step: string) => void
  back: () => void
  menu: () => void
  restart: () => void
  /** Count a tap toward the comparison stats. */
  tap: () => void
  /** Mark the booking as done (stops the timer). */
  finish: () => void
  toast: (msg: string) => void
  hints: boolean
}

export const ProtoCtx = createContext<ProtoApi>({
  brand: DEFAULT_BRAND,
  go: () => {},
  back: () => {},
  menu: () => {},
  restart: () => {},
  tap: () => {},
  finish: () => {},
  toast: () => {},
  hints: true,
})

export const useProto = () => useContext(ProtoCtx)
