import type { RelativePlanPoint } from '../types';
import { KISS_BRIDGE_LONG_C_REVIEW_V1, KISS_SHOW_SPATIAL_V2 } from './sunset-town-operator-layout';

export type KissBridgePoint = Readonly<RelativePlanPoint>;

const p = KISS_BRIDGE_LONG_C_REVIEW_V1.proposal;

function cubic(
  a: KissBridgePoint,
  b: KissBridgePoint,
  c: KissBridgePoint,
  d: KissBridgePoint,
  t: number
): RelativePlanPoint {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y
  };
}

/**
 * Two smooth cubic spans passing THROUGH the three exact operator control
 * points. The bend controls only tangent curvature; it never moves them.
 * Inputs/outputs use the operator's already projected east-up coordinate
 * system. No automatic ellipse fitting or geographic reprojection is allowed.
 */
export function sampleKissBridgeLongC(segmentsPerHalf = 32): RelativePlanPoint[] {
  const top = p.topLandwardEnd;
  const spine = p.seawardSpine;
  const bottom = p.bottomLandwardEnd;
  const bend = p.bend;
  const upperRise = spine.y - top.y;
  const lowerRise = bottom.y - spine.y;
  const upperCtrl1 = { x: top.x - bend, y: top.y + upperRise * 0.08 };
  const upperCtrl2 = { x: spine.x, y: spine.y - upperRise * 0.58 };
  const lowerCtrl1 = { x: spine.x, y: spine.y + lowerRise * 0.58 };
  const lowerCtrl2 = { x: bottom.x - bend, y: bottom.y - lowerRise * 0.08 };
  const steps = Math.max(8, Math.floor(segmentsPerHalf));
  const points: RelativePlanPoint[] = [];

  for (let i = 0; i <= steps; i += 1) {
    points.push(cubic(top, upperCtrl1, upperCtrl2, spine, i / steps));
  }
  for (let i = 1; i <= steps; i += 1) {
    points.push(cubic(spine, lowerCtrl1, lowerCtrl2, bottom, i / steps));
  }
  return points;
}

export function isKissStageInsideLongC(): boolean {
  // The outline is OPEN to the landward side. The performance stage may sit
  // inside that mouth, slightly east of the ends; do not require a closed
  // polygon or silently change the operator's approved coordinates.
  const stage = KISS_SHOW_SPATIAL_V2.kiss.performanceStage;
  const projectedStage = { x: 1 - stage.y, y: stage.x };
  return p.stageInsideBridge
    && p.seawardSpine.x < projectedStage.x
    && projectedStage.y > p.topLandwardEnd.y
    && projectedStage.y < p.bottomLandwardEnd.y
    && projectedStage.x <= Math.max(p.topLandwardEnd.x, p.bottomLandwardEnd.x)
      + KISS_SHOW_SPATIAL_V2.kiss.performanceStageSize.width;
}
