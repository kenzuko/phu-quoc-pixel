export type Confidence = 'verified' | 'high' | 'medium' | 'low';

export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface WorldReference {
  id: string;
  kind: 'official' | 'street-photo' | 'aerial-photo' | 'map' | 'video' | 'field-note';
  title: string;
  sourceUrl: string;
  capturedAt?: string;
  coordinates?: GeoPoint;
  proves: readonly string[];
  confidence: Confidence;
  license?: string;
  usage: 'reference-only' | 'approved-source';
}

export interface IslandPlaceAnchor {
  id: string;
  label: string;
  point: GeoPoint;
  status: 'pilot' | 'mapped' | 'planned';
  confidence: Confidence;
}

export interface PlaceZone {
  id: string;
  label: string;
  kind: 'street' | 'square' | 'descent' | 'waterfront' | 'transport' | 'mixed';
  confidence: Confidence;
}

export interface WorldSegment {
  id: string;
  label: string;
  zoneId: string;
  order: number;
  routeProgress: number;
  slope: 'up' | 'flat' | 'down' | 'steep-down';
  openness: number;
  seaVisibility: number;
  leftMass: number;
  rightMass: number;
  landmarkIds: readonly string[];
  allowedActors: readonly string[];
  gameplaySlots: readonly string[];
  referenceIds: readonly string[];
  confidence: Confidence;
}

export interface PlaceManifest {
  id: string;
  label: string;
  realityEpoch: string;
  anchor: GeoPoint;
  zones: readonly PlaceZone[];
  segments: readonly WorldSegment[];
  references: readonly WorldReference[];
}
