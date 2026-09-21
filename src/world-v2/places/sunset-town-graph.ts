import type { PlaceGraphEdge, PlaceGraphNode, WorldPlate } from '../types';

export const SUNSET_TOWN_GRAPH_NODES: readonly PlaceGraphNode[] = [
  {
    id: 'sunset-town',
    label: 'SUNSET TOWN',
    kind: 'district',
    spatialStatus: 'verified',
    confidence: 'verified',
    referenceIds: ['ST-REF-05', 'ST-REF-09', 'ST-REF-10']
  },
  {
    id: 'central-village',
    label: 'CENTRAL VILLAGE',
    kind: 'district',
    spatialStatus: 'verified',
    confidence: 'verified',
    referenceIds: ['ST-REF-03']
  },
  {
    id: 'la-festa-square',
    label: 'LA FESTA SQUARE',
    kind: 'square',
    spatialStatus: 'verified',
    confidence: 'high',
    referenceIds: ['ST-REF-11']
  },
  {
    id: 'clock-tower',
    label: 'CLOCK TOWER',
    kind: 'landmark',
    spatialStatus: 'verified',
    confidence: 'verified',
    planPoint: { lat: 10.030171875, lon: 104.0071125 },
    referenceIds: ['ST-REF-03', 'ST-REF-08', 'ST-REF-11', 'ST-REF-17']
  },
  {
    id: 'dragon-stairs',
    label: 'DRAGON STAIRS',
    kind: 'landmark',
    spatialStatus: 'verified',
    confidence: 'high',
    referenceIds: ['ST-REF-11']
  },
  {
    id: 'king-of-sun',
    label: 'KING OF THE SUN',
    kind: 'landmark',
    spatialStatus: 'verified',
    confidence: 'high',
    referenceIds: ['ST-REF-11']
  },
  {
    id: 'sun-signature-gallery',
    label: 'SUN SIGNATURE GALLERY',
    kind: 'venue',
    spatialStatus: 'verified',
    confidence: 'high',
    referenceIds: ['ST-REF-11']
  },
  {
    id: 'anh-duong-square',
    label: 'ANH DUONG SQUARE',
    kind: 'square',
    spatialStatus: 'verified',
    confidence: 'high',
    referenceIds: ['ST-REF-11']
  },
  {
    id: 'cable-car-station',
    label: 'CABLE CAR STATION',
    kind: 'transport',
    spatialStatus: 'verified',
    confidence: 'verified',
    planPoint: { lat: 10.0270625, lon: 104.0071875 },
    referenceIds: ['ST-REF-06', 'ST-REF-11', 'ST-REF-12', 'ST-REF-18']
  },
  {
    id: 'apollo-square',
    label: 'APOLLO SQUARE',
    kind: 'square',
    spatialStatus: 'visual-only',
    confidence: 'high',
    referenceIds: ['ST-REF-02', 'ST-REF-07']
  },
  {
    id: 'apollo-cafe',
    label: 'APOLLO CAFE',
    kind: 'venue',
    spatialStatus: 'visual-only',
    confidence: 'high',
    referenceIds: ['ST-REF-01', 'ST-REF-07']
  },
  {
    id: 'sunset-bazaar',
    label: 'SUNSET BAZAAR',
    kind: 'venue',
    spatialStatus: 'verified',
    confidence: 'verified',
    planPoint: { lat: 10.029453125, lon: 104.0071875 },
    referenceIds: ['ST-REF-13', 'ST-REF-17']
  },
  {
    id: 'kiss-stage',
    label: 'KISS OF THE SEA STAGE',
    kind: 'waterfront',
    spatialStatus: 'verified',
    confidence: 'verified',
    referenceIds: ['ST-REF-03', 'ST-REF-11', 'ST-REF-13', 'ST-REF-15', 'ST-REF-16']
  },
  {
    id: 'kiss-bridge',
    label: 'KISS BRIDGE',
    kind: 'waterfront',
    spatialStatus: 'verified',
    confidence: 'verified',
    planPoint: { lat: 10.028140625, lon: 104.0038125 },
    referenceIds: ['ST-REF-03', 'ST-REF-04', 'ST-REF-11', 'ST-REF-19']
  }
] as const;

export const SUNSET_TOWN_GRAPH_EDGES: readonly PlaceGraphEdge[] = [
  { from: 'sunset-town', to: 'central-village', relation: 'contains', confidence: 'verified', referenceIds: ['ST-REF-03', 'ST-REF-09'] },
  { from: 'central-village', to: 'clock-tower', relation: 'contains', confidence: 'verified', referenceIds: ['ST-REF-03'] },
  { from: 'la-festa-square', to: 'clock-tower', relation: 'contains', confidence: 'high', referenceIds: ['ST-REF-11'] },
  { from: 'la-festa-square', to: 'dragon-stairs', relation: 'contains', confidence: 'high', referenceIds: ['ST-REF-11'] },
  { from: 'la-festa-square', to: 'king-of-sun', relation: 'contains', confidence: 'high', referenceIds: ['ST-REF-11'] },
  { from: 'la-festa-square', to: 'sun-signature-gallery', relation: 'contains', confidence: 'high', referenceIds: ['ST-REF-11'] },
  { from: 'anh-duong-square', to: 'cable-car-station', relation: 'contains', confidence: 'high', referenceIds: ['ST-REF-11'] },
  { from: 'apollo-square', to: 'apollo-cafe', relation: 'contains', confidence: 'high', referenceIds: ['ST-REF-07'] },

  // Verified plan relationships. These are independent from elevation.
  { from: 'clock-tower', to: 'sunset-bazaar', relation: 'north-of', confidence: 'verified', referenceIds: ['ST-REF-17'] },
  { from: 'sunset-bazaar', to: 'cable-car-station', relation: 'north-of', confidence: 'verified', referenceIds: ['ST-REF-17', 'ST-REF-18'] },
  { from: 'kiss-bridge', to: 'sunset-bazaar', relation: 'west-of', confidence: 'verified', referenceIds: ['ST-REF-17', 'ST-REF-19'] },
  { from: 'kiss-bridge', to: 'cable-car-station', relation: 'west-of', confidence: 'verified', referenceIds: ['ST-REF-18', 'ST-REF-19'] },
  { from: 'sunset-bazaar', to: 'kiss-bridge', relation: 'connects', confidence: 'high', referenceIds: ['ST-REF-13'] },

  // Verified local vertical relationship. Do not apply this to Sunset Bazaar.
  { from: 'cable-car-station', to: 'kiss-stage', relation: 'above', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'cable-car-station', to: 'kiss-stage', relation: 'step-down-to', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'kiss-stage', to: 'kiss-bridge', relation: 'near', confidence: 'verified', referenceIds: ['ST-REF-03', 'ST-REF-11', 'ST-REF-16'] },
  { from: 'kiss-bridge', to: 'kiss-stage', relation: 'seaward-of', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'sunset-bazaar', to: 'kiss-stage', relation: 'connects', confidence: 'high', referenceIds: ['ST-REF-13'] }
] as const;

export const SUNSET_TOWN_WORLD_PLATES: readonly WorldPlate[] = [
  {
    id: 'STP-01',
    label: 'HILLSIDE · WEST-FACING TOWN',
    kind: 'overview',
    spatialStatus: 'verified',
    focusNodeIds: ['sunset-town', 'central-village'],
    referenceIds: ['ST-REF-09', 'ST-REF-12', 'ST-REF-14'],
    note: 'The town faces west toward the sea. Do not infer a single terrace chain from this overview.'
  },
  {
    id: 'STP-02',
    label: 'CENTRAL VILLAGE · LA FESTA',
    kind: 'central',
    spatialStatus: 'verified',
    focusNodeIds: ['central-village', 'la-festa-square', 'clock-tower', 'dragon-stairs', 'king-of-sun', 'sun-signature-gallery'],
    referenceIds: ['ST-REF-03', 'ST-REF-08', 'ST-REF-11', 'ST-REF-17'],
    note: 'Clock Tower anchors the northern/central cluster. This plate does not assign a waterfront terrace number.'
  },
  {
    id: 'STP-03',
    label: 'SOUTH CLUSTER · CABLE CAR / STAGE',
    kind: 'transport',
    spatialStatus: 'verified',
    focusNodeIds: ['cable-car-station', 'kiss-stage', 'kiss-bridge'],
    referenceIds: ['ST-REF-06', 'ST-REF-11', 'ST-REF-15', 'ST-REF-16', 'ST-REF-18', 'ST-REF-19'],
    note: 'Cable Car Station is south/inland in plan, near the bridge cluster, and sits one level above Kiss of the Sea Stage. Sunset Bazaar is not part of this vertical sequence.'
  },
  {
    id: 'STP-04',
    label: 'APOLLO SQUARE · VISUAL PLATE',
    kind: 'square',
    spatialStatus: 'visual-only',
    focusNodeIds: ['apollo-square', 'apollo-cafe'],
    referenceIds: ['ST-REF-01', 'ST-REF-02', 'ST-REF-07'],
    note: 'Visual identity is supported; route geometry remains unapproved.'
  },
  {
    id: 'STP-05',
    label: 'WATERFRONT · PLAN + LEVEL',
    kind: 'waterfront',
    spatialStatus: 'verified',
    focusNodeIds: ['sunset-bazaar', 'cable-car-station', 'kiss-stage', 'kiss-bridge'],
    referenceIds: ['ST-REF-03', 'ST-REF-11', 'ST-REF-13', 'ST-REF-15', 'ST-REF-16', 'ST-REF-17', 'ST-REF-18', 'ST-REF-19'],
    note: 'Plan and elevation are separate facts: Bazaar is north of Cable Car; Bridge is west/seaward; Cable Car is one level above the adjacent Kiss Stage.'
  },
  {
    id: 'STP-06',
    label: 'PLAN + ELEVATION GRAPH · ROUTE NOT LOCKED',
    kind: 'graph',
    spatialStatus: 'verified',
    focusNodeIds: ['clock-tower', 'sunset-bazaar', 'cable-car-station', 'kiss-stage', 'kiss-bridge'],
    referenceIds: ['ST-REF-03', 'ST-REF-11', 'ST-REF-13', 'ST-REF-15', 'ST-REF-16', 'ST-REF-17', 'ST-REF-18', 'ST-REF-19'],
    note: 'Approved model separates north/south/east/west plan coordinates from local elevation relations. No linear terrace chain is approved.'
  }
] as const;
