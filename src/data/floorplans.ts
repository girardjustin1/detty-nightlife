// Interactive layer for the three Higgsfield-generated floor plans in
// public/floorplans/. Coordinates are in the plans' shared 880 × 1168 viewBox.
// The artwork is a static background; tables are drawn on top so status,
// selection and tap targets stay in code (and the art can be swapped per venue).
import type { FloorPlanId, Table } from './types'

export type FloorPlan = {
  id: FloorPlanId
  src: string
  width: number
  height: number
  zones: { label: string; x: number; y: number }[]
  tables: Table[]
}

const src = (id: FloorPlanId) => `${import.meta.env.BASE_URL}floorplans/${id}.svg`

export const floorPlans: Record<FloorPlanId, FloorPlan> = {
  vault: {
    id: 'vault',
    src: src('vault'),
    width: 880,
    height: 1168,
    zones: [
      { label: 'DJ', x: 480, y: 210 },
      { label: 'Dance floor', x: 480, y: 560 },
      { label: 'Bar', x: 70, y: 560 },
      { label: 'Lounge deck', x: 499, y: 1110 },
      { label: 'Entrance', x: 90, y: 1130 },
    ],
    tables: [
      ...[363, 479, 595, 711].map((y, i) => ({
        id: `H${i + 1}`,
        label: `H${i + 1}`,
        tierId: 'hightop',
        status: (['booked', 'available', 'held', 'available'] as const)[i],
        x: 200,
        y,
        shape: 'round' as const,
      })),
      ...[189, 313, 437, 561, 686, 811].map((y, i) => ({
        id: `B${i + 1}`,
        label: `B${i + 1}`,
        tierId: 'booth',
        status: (['booked', 'booked', 'available', 'available', 'held', 'booked'] as const)[i],
        x: 790,
        y,
        shape: 'booth' as const,
      })),
      ...[309, 499, 689].map((x, i) => ({
        id: `L${i + 1}`,
        label: `L${i + 1}`,
        tierId: 'lounge',
        status: (['available', 'booked', 'available'] as const)[i],
        x,
        y: 1005,
        shape: 'long' as const,
        w: 170,
        h: 110,
      })),
    ],
  },
  skyline: {
    id: 'skyline',
    src: src('skyline'),
    width: 880,
    height: 1168,
    zones: [
      { label: 'Pool', x: 212, y: 600 },
      { label: 'Bar island', x: 480, y: 330 },
      { label: 'DJ', x: 780, y: 170 },
      { label: 'Stairs', x: 332, y: 1130 },
    ],
    tables: [
      ...[384, 544, 700, 856].map((y, i) => ({
        id: `C${i + 1}`,
        label: `C${i + 1}`,
        tierId: 'cabana',
        status: (['booked', 'available', 'available', 'held'] as const)[i],
        x: 108,
        y,
        shape: 'cabana' as const,
        w: 96,
        h: 140,
      })),
      ...(
        [
          [186, 206],
          [422, 206],
          [642, 206],
          [714, 400],
          [714, 616],
          [384, 790],
          [162, 1010],
          [504, 1010],
        ] as const
      ).map(([x, y], i) => ({
        id: `S${i + 1}`,
        label: `S${i + 1}`,
        tierId: 'sofa',
        status: (['available', 'booked', 'available', 'booked', 'available', 'available', 'booked', 'held'] as const)[i],
        x,
        y,
        shape: 'round' as const,
      })),
      { id: 'I1', label: 'I1', tierId: 'bar', status: 'available', x: 380, y: 560, shape: 'round' },
      { id: 'I2', label: 'I2', tierId: 'bar', status: 'booked', x: 580, y: 560, shape: 'round' },
    ],
  },
  koko: {
    id: 'koko',
    src: src('koko'),
    width: 880,
    height: 1168,
    zones: [
      { label: 'Stage', x: 330, y: 760 },
      { label: 'Bar', x: 330, y: 120 },
      { label: 'Private room', x: 750, y: 140 },
      { label: 'Entrance', x: 340, y: 1120 },
    ],
    tables: [
      ...(
        [
          [200, 325],
          [454, 325],
          [136, 412],
          [517, 412],
          [120, 519],
          [533, 519],
          [144, 625],
          [509, 625],
        ] as const
      ).map(([x, y], i) => ({
        id: `S${i + 1}`,
        label: `S${i + 1}`,
        tierId: 'stage-booth',
        status: (['available', 'booked', 'available', 'held', 'booked', 'available', 'available', 'booked'] as const)[i],
        x,
        y,
        shape: 'booth' as const,
      })),
      { id: 'V1', label: 'V1', tierId: 'private-room', status: 'available', x: 750, y: 265, shape: 'long', w: 96, h: 196 },
      { id: 'V2', label: 'V2', tierId: 'private-room', status: 'booked', x: 750, y: 497, shape: 'long', w: 96, h: 196 },
    ],
  },
}
