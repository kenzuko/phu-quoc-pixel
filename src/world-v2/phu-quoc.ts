import type { GeoBounds } from './geo';
import { BAI_SAO_COAST, HON_THOM_COAST, PHU_QUOC_MAIN_COAST, RACH_VEM_COAST } from './phu-quoc-geometry';
import type { GeoPoint, IslandMapFeature } from './types';

export interface IslandLandmass {
  id: string;
  label: string;
  points: readonly GeoPoint[];
  confidence: 'verified' | 'high' | 'medium' | 'low';
}

export const PHU_QUOC_BOUNDS: GeoBounds = {
  north: 10.46,
  south: 9.90,
  west: 103.80,
  east: 104.10
};

export const PHU_QUOC_LANDMASSES_V2: readonly IslandLandmass[] = [
  {
    id: 'phu-quoc-main',
    label: 'PHU QUOC',
    confidence: 'verified',
    points: PHU_QUOC_MAIN_COAST
  },
  {
    id: 'hon-thom',
    label: 'HON THOM',
    confidence: 'verified',
    points: HON_THOM_COAST
  }
] as const;

/**
 * Map semantics matter:
 * - point = a location that can honestly be represented by a point
 * - area = a complex / park / settlement whose label point is representative
 * - coast = a named shoreline segment; the path is the geographic feature
 *
 * Area radii are only compact map envelopes, not legal property boundaries.
 */
export const ISLAND_MAP_FEATURES_V2: readonly IslandMapFeature[] = [
  {
    id: 'sunset-town',
    label: 'SUNSET TOWN',
    kind: 'area',
    point: { lat: 10.02943, lon: 104.00662 },
    approxRadiusKm: 0.8,
    status: 'pilot',
    confidence: 'high',
    sourceRefs: ['sunset-world-pack']
  },
  {
    id: 'an-thoi',
    label: 'AN THOI',
    kind: 'area',
    point: { lat: 10.01914, lon: 104.01499 },
    approxRadiusKm: 1.0,
    status: 'mapped',
    confidence: 'verified',
    sourceRefs: ['local-ops-anchor']
  },
  {
    id: 'duong-dong',
    label: 'DUONG DONG',
    kind: 'area',
    point: { lat: 10.21716, lon: 103.95929 },
    approxRadiusKm: 1.4,
    status: 'mapped',
    confidence: 'verified',
    sourceRefs: ['local-ops-anchor']
  },
  {
    id: 'hon-thom',
    label: 'HON THOM',
    kind: 'area',
    point: { lat: 9.95432, lon: 104.01784 },
    approxRadiusKm: 0.9,
    status: 'planned',
    confidence: 'verified',
    sourceRefs: ['phu-quoc-admin-geojson']
  },
  {
    id: 'bai-sao',
    label: 'BAI SAO',
    kind: 'coast',
    point: { lat: 10.06058, lon: 104.04004 },
    path: BAI_SAO_COAST,
    status: 'planned',
    confidence: 'high',
    sourceRefs: ['phu-quoc-admin-geojson', 'phuquoc-government-bai-sao']
  },
  {
    id: 'rach-vem',
    label: 'RACH VEM',
    kind: 'coast',
    point: { lat: 10.38602, lon: 103.94166 },
    path: RACH_VEM_COAST,
    status: 'planned',
    confidence: 'verified',
    sourceRefs: ['phu-quoc-admin-geojson', 'osm-beach-451772442']
  },
  {
    id: 'ganh-dau',
    label: 'GANH DAU',
    kind: 'point',
    point: { lat: 10.37588, lon: 103.83891 },
    status: 'planned',
    confidence: 'verified',
    sourceRefs: ['osm-map-crosscheck']
  },
  {
    id: 'grand-world',
    label: 'GRAND WORLD',
    kind: 'area',
    point: { lat: 10.32375, lon: 103.85296 },
    approxRadiusKm: 0.9,
    status: 'planned',
    confidence: 'verified',
    sourceRefs: ['osm-grand-world-square-939817115', 'vinwonders-grand-world-2026']
  },
  {
    id: 'vinwonders',
    label: 'VINWONDERS',
    kind: 'area',
    point: { lat: 10.33800, lon: 103.85449 },
    approxRadiusKm: 1.25,
    status: 'planned',
    confidence: 'verified',
    sourceRefs: ['osm-vinwonders-660104575', 'vinwonders-official-map-2026']
  },
  {
    id: 'vinpearl-safari',
    label: 'SAFARI',
    kind: 'area',
    point: { lat: 10.33987, lon: 103.89582 },
    approxRadiusKm: 1.6,
    status: 'planned',
    confidence: 'verified',
    sourceRefs: ['osm-safari-753491820', 'vinwonders-safari-2026']
  }
] as const;
