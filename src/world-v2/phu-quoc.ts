import type { GeoBounds } from './geo';
import type { GeoPoint, IslandPlaceAnchor } from './types';

export interface IslandLandmass {
  id: string;
  label: string;
  points: readonly GeoPoint[];
  confidence: 'verified' | 'high' | 'medium' | 'low';
}

export const PHU_QUOC_BOUNDS: GeoBounds = {
  north: 10.43,
  south: 9.91,
  west: 103.81,
  east: 104.12
};

/**
 * Simplified geographic trace for the V2 inspector.
 *
 * Important: the main island and Hon Thom are separate landmasses.
 * The trace is intentionally simplified for pixel-map readability, but it keeps
 * the large-scale coastline relationships and uses verified geographic anchors
 * as guard rails. It is not a cadastral boundary.
 */
export const PHU_QUOC_LANDMASSES_V2: readonly IslandLandmass[] = [
  {
    id: 'phu-quoc-main',
    label: 'PHU QUOC',
    confidence: 'high',
    points: [
      { lat: 10.421, lon: 103.943 },
      { lat: 10.414, lon: 103.977 },
      { lat: 10.401, lon: 104.000 },
      { lat: 10.378, lon: 104.019 },
      { lat: 10.342, lon: 104.032 },
      { lat: 10.301, lon: 104.041 },
      { lat: 10.252, lon: 104.046 },
      { lat: 10.181, lon: 104.048 },
      { lat: 10.126, lon: 104.052 },
      { lat: 10.077, lon: 104.054 },
      { lat: 10.036, lon: 104.051 },
      { lat: 10.00934, lon: 104.04825 },
      { lat: 10.006, lon: 104.028 },
      { lat: 10.012, lon: 104.012 },
      { lat: 10.020, lon: 103.997 },
      { lat: 10.047, lon: 103.982 },
      { lat: 10.095, lon: 103.969 },
      { lat: 10.151, lon: 103.962 },
      { lat: 10.21716, lon: 103.95929 },
      { lat: 10.25684, lon: 103.94339 },
      { lat: 10.27799, lon: 103.92205 },
      { lat: 10.309, lon: 103.895 },
      { lat: 10.343, lon: 103.861 },
      { lat: 10.37588, lon: 103.83891 },
      { lat: 10.397, lon: 103.852 },
      { lat: 10.414, lon: 103.886 }
    ]
  },
  {
    id: 'hon-thom',
    label: 'HON THOM',
    confidence: 'medium',
    points: [
      { lat: 9.974, lon: 104.013 },
      { lat: 9.968, lon: 104.026 },
      { lat: 9.9567, lon: 104.031 },
      { lat: 9.944, lon: 104.027 },
      { lat: 9.936, lon: 104.017 },
      { lat: 9.942, lon: 104.007 },
      { lat: 9.955, lon: 104.003 },
      { lat: 9.967, lon: 104.006 }
    ]
  }
] as const;

export const ISLAND_PLACE_ANCHORS_V2: readonly IslandPlaceAnchor[] = [
  {
    id: 'sunset-town',
    label: 'SUNSET TOWN',
    point: { lat: 10.02943, lon: 104.00662 },
    status: 'pilot',
    confidence: 'high'
  },
  {
    id: 'an-thoi',
    label: 'AN THOI',
    point: { lat: 10.01914, lon: 104.01499 },
    status: 'mapped',
    confidence: 'verified'
  },
  {
    id: 'duong-dong',
    label: 'DUONG DONG',
    point: { lat: 10.21716, lon: 103.95929 },
    status: 'mapped',
    confidence: 'verified'
  },
  {
    id: 'hon-thom',
    label: 'HON THOM',
    point: { lat: 9.95432, lon: 104.01784 },
    status: 'planned',
    confidence: 'verified'
  },
  {
    id: 'bai-sao',
    label: 'BAI SAO',
    point: { lat: 10.049993, lon: 104.036407 },
    status: 'planned',
    confidence: 'high'
  },
  {
    id: 'ganh-dau',
    label: 'GANH DAU',
    point: { lat: 10.37588, lon: 103.83891 },
    status: 'planned',
    confidence: 'verified'
  },
  {
    id: 'grand-world',
    label: 'GRAND WORLD',
    point: { lat: 10.32459, lon: 103.85536 },
    status: 'planned',
    confidence: 'high'
  }
] as const;
