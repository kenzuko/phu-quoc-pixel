import type { GeoPoint } from './types';

export interface GeoBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

export function projectGeo(
  point: GeoPoint,
  bounds: GeoBounds,
  rect: { x: number; y: number; width: number; height: number }
): ScreenPoint {
  const lonSpan = Math.max(0.000001, bounds.east - bounds.west);
  const latSpan = Math.max(0.000001, bounds.north - bounds.south);
  const nx = (point.lon - bounds.west) / lonSpan;
  const ny = (bounds.north - point.lat) / latSpan;
  return { x: rect.x + nx * rect.width, y: rect.y + ny * rect.height };
}
