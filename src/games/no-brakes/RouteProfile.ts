export type WorldZone =
  | 'hillside-blocks'
  | 'central-village'
  | 'waterfront'
  | 'sea-open';

export interface RouteSample {
  depth: number;
  centerOffset: number;
  halfWidthScale: number;
  curve: number;
  grade: number;
  leftWorldZone: WorldZone;
  rightWorldZone: WorldZone;
}

/**
 * Arcade-compressed Sunset Town descent.
 *
 * This is not a claim that every bend is a literal real road. It preserves the
 * verified world logic instead: hillside massing -> Central Village ->
 * waterfront opening. Final geometry will be tuned against the approved map
 * and aerial reference pack.
 */
export const SUNSET_ROUTE_V1: readonly RouteSample[] = [
  {
    depth: 0,
    centerOffset: 0.02,
    halfWidthScale: 0.92,
    curve: 0,
    grade: -0.1,
    leftWorldZone: 'hillside-blocks',
    rightWorldZone: 'hillside-blocks'
  },
  {
    depth: 0.2,
    centerOffset: -0.08,
    halfWidthScale: 0.95,
    curve: -0.18,
    grade: -0.18,
    leftWorldZone: 'hillside-blocks',
    rightWorldZone: 'central-village'
  },
  {
    depth: 0.42,
    centerOffset: -0.14,
    halfWidthScale: 1,
    curve: -0.08,
    grade: -0.22,
    leftWorldZone: 'central-village',
    rightWorldZone: 'central-village'
  },
  {
    depth: 0.62,
    centerOffset: -0.04,
    halfWidthScale: 1.04,
    curve: 0.2,
    grade: -0.16,
    leftWorldZone: 'central-village',
    rightWorldZone: 'waterfront'
  },
  {
    depth: 0.8,
    centerOffset: 0.09,
    halfWidthScale: 1.08,
    curve: 0.16,
    grade: -0.08,
    leftWorldZone: 'central-village',
    rightWorldZone: 'waterfront'
  },
  {
    depth: 1,
    centerOffset: 0.13,
    halfWidthScale: 1.1,
    curve: 0,
    grade: 0,
    leftWorldZone: 'waterfront',
    rightWorldZone: 'sea-open'
  }
] as const;

export interface InterpolatedRouteSample extends RouteSample {
  segmentIndex: number;
}

export function sampleRoute(depth: number): InterpolatedRouteSample {
  const z = Math.max(0, Math.min(1, depth));

  for (let i = 0; i < SUNSET_ROUTE_V1.length - 1; i += 1) {
    const a = SUNSET_ROUTE_V1[i];
    const b = SUNSET_ROUTE_V1[i + 1];
    if (z > b.depth) continue;

    const span = Math.max(0.0001, b.depth - a.depth);
    const t = (z - a.depth) / span;
    const smooth = t * t * (3 - 2 * t);
    return {
      depth: z,
      centerOffset: lerp(a.centerOffset, b.centerOffset, smooth),
      halfWidthScale: lerp(a.halfWidthScale, b.halfWidthScale, smooth),
      curve: lerp(a.curve, b.curve, smooth),
      grade: lerp(a.grade, b.grade, smooth),
      leftWorldZone: t < 0.5 ? a.leftWorldZone : b.leftWorldZone,
      rightWorldZone: t < 0.5 ? a.rightWorldZone : b.rightWorldZone,
      segmentIndex: i
    };
  }

  const last = SUNSET_ROUTE_V1[SUNSET_ROUTE_V1.length - 1];
  return { ...last, segmentIndex: SUNSET_ROUTE_V1.length - 2 };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
