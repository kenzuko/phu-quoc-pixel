import type { PlanOrientation, RelativePlanPoint } from '../types';

export const SUNSET_TOWN_EDITOR_CAPTURE_ORIENTATION: PlanOrientation = 'east-up';
export const SUNSET_TOWN_SEA_EDGE = 'left' as const;
export const SUNSET_TOWN_CENTRAL_FACING = 'west' as const;

export const KISS_SHOW_SPATIAL_V2 = {
  version: 'kiss-show-spatial-v2',
  seaEdge: 'left',
  editorProjection: 'east-up',
  fixedContext: true,
  kiss: {
    seating: { x: 0.9224137931034483, y: 0.7813299232736572 },
    performanceStage: { x: 0.9281609195402298, y: 0.9680306905370843 },
    bridgeCenter: { x: 0.5344827586206896, y: 0.98 },
    bridgeArc: {
      width: 0.26,
      height: 0.22,
      startDeg: 55,
      endDeg: 305,
      stroke: 8
    },
    seatingSize: { width: 0.17, height: 0.10 },
    performanceStageSize: { width: 0.10, height: 0.07 }
  }
} as const;

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
 *
 * The previously named "kiss-stage" point is the audience/seating area.
 * Kiss Show geometry now uses the operator-edited spatial-v2 JSON as exact
 * source of truth. The bridge is an enclosing composition around the
 * performance stage, not a separate POI arc beside it.
 */
export const SUNSET_TOWN_OPERATOR_PLAN: Readonly<Record<string, RelativePlanPoint>> = {
  'clock-tower': { x: 0.5428571428571428, y: 0.5817610062893082 },
  'sunset-bazaar': { x: 0.1392857142857143, y: 0.7106918238993711 },
  'cable-car-station': { x: 0.8535714285714285, y: 0.5251572327044025 },
  'kiss-seating': KISS_SHOW_SPATIAL_V2.kiss.seating,
  'kiss-bridge': { x: 0.3464285714285714, y: 0.8836477987421384 },
  'apollo-square': { x: 0.45357142857142857, y: 0.6808176100628931 },
  'central-village': { x: 0.4142857142857143, y: 0.35691823899371067 }
} as const;
