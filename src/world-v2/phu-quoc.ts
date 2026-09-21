import type { GeoBounds } from './geo';
import type { GeoPoint, IslandPlaceAnchor } from './types';

export const PHU_QUOC_BOUNDS: GeoBounds = {
  north: 10.43,
  south: 9.91,
  west: 103.81,
  east: 104.12
};

/**
 * V2 inspector coastline.
 * Coarse scaffold only while production coastline extraction is prepared.
 * POIs derive from geographic coordinates, never from this polygon.
 */
export const PHU_QUOC_COASTLINE_PROVISIONAL: readonly GeoPoint[] = [
  { lat: 10.409, lon: 103.895 }, { lat: 10.397, lon: 103.925 },
  { lat: 10.365, lon: 103.952 }, { lat: 10.326, lon: 103.973 },
  { lat: 10.278, lon: 104.006 }, { lat: 10.226, lon: 104.038 },
  { lat: 10.169, lon: 104.048 }, { lat: 10.111, lon: 104.044 },
  { lat: 10.058, lon: 104.036 }, { lat: 10.012, lon: 104.022 },
  { lat: 9.949, lon: 104.018 }, { lat: 9.929, lon: 103.996 },
  { lat: 9.952, lon: 103.969 }, { lat: 9.996, lon: 103.949 },
  { lat: 10.045, lon: 103.936 }, { lat: 10.102, lon: 103.929 },
  { lat: 10.155, lon: 103.913 }, { lat: 10.213, lon: 103.902 },
  { lat: 10.272, lon: 103.867 }, { lat: 10.332, lon: 103.842 },
  { lat: 10.381, lon: 103.857 }
] as const;

export const ISLAND_PLACE_ANCHORS_V2: readonly IslandPlaceAnchor[] = [
  { id: 'sunset-town', label: 'SUNSET TOWN', point: { lat: 10.0297, lon: 104.0077 }, status: 'pilot', confidence: 'verified' },
  { id: 'an-thoi', label: 'AN THOI', point: { lat: 10.0191, lon: 104.0150 }, status: 'mapped', confidence: 'high' },
  { id: 'duong-dong', label: 'DUONG DONG', point: { lat: 10.2172, lon: 103.9593 }, status: 'mapped', confidence: 'verified' },
  { id: 'hon-thom', label: 'HON THOM', point: { lat: 9.9550, lon: 104.0170 }, status: 'planned', confidence: 'medium' },
  { id: 'bai-sao', label: 'BAI SAO', point: { lat: 10.049993, lon: 104.036407 }, status: 'planned', confidence: 'high' },
  { id: 'ganh-dau', label: 'GANH DAU', point: { lat: 10.3759, lon: 103.9000 }, status: 'planned', confidence: 'high' },
  { id: 'grand-world', label: 'GRAND WORLD', point: { lat: 10.32459, lon: 103.85536 }, status: 'planned', confidence: 'medium' }
] as const;
