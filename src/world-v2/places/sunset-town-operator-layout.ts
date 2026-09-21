import type { PlanOrientation, RelativePlanPoint } from '../types';

export const SUNSET_TOWN_OPERATOR_PLAN_ORIENTATION: PlanOrientation = 'east-up';

/**
 * Operator-approved relative layout supplied 2026-09-21.
 *
 * These are not geographic coordinates.
 * They preserve the manually corrected visual/spatial arrangement exactly as
 * approved in the drag editor. Do not normalize these against geo anchors.
 */
export const SUNSET_TOWN_OPERATOR_PLAN: Readonly<Record<string, RelativePlanPoint>> = {
  'clock-tower': { x: 0.5428571428571428, y: 0.5817610062893082 },
  'sunset-bazaar': { x: 0.1392857142857143, y: 0.7106918238993711 },
  'cable-car-station': { x: 0.8535714285714285, y: 0.5251572327044025 },
  'kiss-stage': { x: 0.8392857142857143, y: 0.7783018867924528 },
  'kiss-bridge': { x: 0.3464285714285714, y: 0.8836477987421384 },
  'apollo-square': { x: 0.45357142857142857, y: 0.6808176100628931 },
  'central-village': { x: 0.4142857142857143, y: 0.35691823899371067 }
} as const;
