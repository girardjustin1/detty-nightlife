import { createContext, useContext, type ReactNode } from 'react'
import { brands, type Brand, type BrandId } from './brands'

type AppSettings = {
  brand: Brand
  /** Data saver: no photos, gradients instead. Default on for 2G/3G in the real app. */
  dataSaver: boolean
}

const Ctx = createContext<AppSettings>({ brand: brands.detty, dataSaver: false })

export function BrandProvider({
  brand = 'detty',
  dataSaver = false,
  children,
}: {
  brand?: BrandId
  dataSaver?: boolean
  children: ReactNode
}) {
  return (
    <Ctx.Provider value={{ brand: brands[brand], dataSaver }}>
      <div data-brand={brand} data-saver={dataSaver ? 'on' : 'off'} className="contents">
        {children}
      </div>
    </Ctx.Provider>
  )
}

export const useBrand = () => useContext(Ctx).brand
export const useDataSaver = () => useContext(Ctx).dataSaver
