import type { PlanOrientation, RelativePlanPoint } from '../types';

export const SUNSET_TOWN_EDITOR_CAPTURE_ORIENTATION: PlanOrientation = 'east-up';
export const SUNSET_TOWN_SEA_EDGE = 'left' as const;
export const SUNSET_TOWN_CENTRAL_FACING = 'west' as const;

/**
 * Operator-approved relative layout supplied 2026-09-21.
 *
 * These are not geographic coordinates.
 *
 * The operator approved the node arrangement while the editor viewport was
 * East-up. World V2 must reproduce that approved arrangement exactly.
 *
 * Sea edge and facing direction are separate composition facts:
 * - sea edge = left
 * - Central Village faces west toward sea
 *
 * Correcting the sea axis must never rotate or move the approved node layout.
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
