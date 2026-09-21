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
  spatialUse?: 'approved' | 'visual-only' | 'conflicting';
  license?: string;
  usage: 'reference-only' | 'approved-source';
}

export type IslandMapFeatureKind = 'point' | 'area' | 'coast';

export interface IslandMapFeature {
  id: string;
  label: string;
  kind: IslandMapFeatureKind;
  point: GeoPoint;
  path?: readonly GeoPoint[];
  approxRadiusKm?: number;
  status: 'pilot' | 'mapped' | 'planned';
  confidence: Confidence;
  sourceRefs: readonly string[];
}

export interface PlaceZone {
  id: string;
  label: string;
  kind: 'street' | 'square' | 'descent' | 'waterfront' | 'transport' | 'mixed';
  confidence: Confidence;
}

export type SpatialStatus = 'verified' | 'corroborated' | 'visual-only' | 'hypothesis';

export interface WorldSegment {
  id: string;
  label: string;
  zoneId: string;
  order: number;
  routeProgress: number;
  spatialStatus: SpatialStatus;
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


export type PlaceGraphNodeKind =
  | 'district'
  | 'square'
  | 'landmark'
  | 'transport'
  | 'waterfront'
  | 'venue';

export interface PlaceGraphNode {
  id: string;
  label: string;
  kind: PlaceGraphNodeKind;
  spatialStatus: SpatialStatus;
  confidence: Confidence;
  referenceIds: readonly string[];
}

export type PlaceGraphRelation =
  | 'contains'
  | 'near'
  | 'connects'
  | 'faces'
  | 'part-of';

export interface PlaceGraphEdge {
  from: string;
  to: string;
  relation: PlaceGraphRelation;
  confidence: Confidence;
  referenceIds: readonly string[];
}

export type WorldPlateKind =
  | 'overview'
  | 'central'
  | 'square'
  | 'waterfront'
  | 'transport'
  | 'graph';

export interface WorldPlate {
  id: string;
  label: string;
  kind: WorldPlateKind;
  spatialStatus: SpatialStatus;
  focusNodeIds: readonly string[];
  referenceIds: readonly string[];
  note: string;
}
