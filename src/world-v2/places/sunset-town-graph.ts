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
    terrace: 'upper',
    referenceIds: ['ST-REF-03', 'ST-REF-15']
  },
  {
    id: 'la-festa-square',
    label: 'LA FESTA SQUARE',
    kind: 'square',
    spatialStatus: 'verified',
    confidence: 'high',
    terrace: 'upper',
    referenceIds: ['ST-REF-11']
  },
  {
    id: 'clock-tower',
    label: 'CLOCK TOWER',
    kind: 'landmark',
    spatialStatus: 'verified',
    confidence: 'verified',
    terrace: 'upper',
    referenceIds: ['ST-REF-03', 'ST-REF-08', 'ST-REF-11', 'ST-REF-15']
  },
  {
    id: 'dragon-stairs',
    label: 'DRAGON STAIRS',
    kind: 'landmark',
    spatialStatus: 'verified',
    confidence: 'high',
    terrace: 'upper',
    referenceIds: ['ST-REF-11']
  },
  {
    id: 'king-of-sun',
    label: 'KING OF THE SUN',
    kind: 'landmark',
    spatialStatus: 'verified',
    confidence: 'high',
    terrace: 'upper',
    referenceIds: ['ST-REF-11']
  },
  {
    id: 'sun-signature-gallery',
    label: 'SUN SIGNATURE GALLERY',
    kind: 'venue',
    spatialStatus: 'verified',
    confidence: 'high',
    terrace: 'upper',
    referenceIds: ['ST-REF-11']
  },
  {
    id: 'anh-duong-square',
    label: 'ANH DUONG SQUARE',
    kind: 'square',
    spatialStatus: 'verified',
    confidence: 'high',
    terrace: 'upper',
    referenceIds: ['ST-REF-11', 'ST-REF-15']
  },
  {
    id: 'cable-car-station',
    label: 'CABLE CAR STATION',
    kind: 'transport',
    spatialStatus: 'verified',
    confidence: 'verified',
    terrace: 'upper',
    referenceIds: ['ST-REF-06', 'ST-REF-11', 'ST-REF-12', 'ST-REF-15', 'ST-REF-16']
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
    terrace: 'middle',
    referenceIds: ['ST-REF-13', 'ST-REF-15', 'ST-REF-16']
  },
  {
    id: 'kiss-stage',
    label: 'KISS OF THE SEA STAGE',
    kind: 'waterfront',
    spatialStatus: 'verified',
    confidence: 'verified',
    terrace: 'lower',
    referenceIds: ['ST-REF-03', 'ST-REF-11', 'ST-REF-13', 'ST-REF-15', 'ST-REF-16']
  },
  {
    id: 'kiss-bridge',
    label: 'KISS BRIDGE',
    kind: 'waterfront',
    spatialStatus: 'verified',
    confidence: 'verified',
    terrace: 'seafront',
    referenceIds: ['ST-REF-03', 'ST-REF-04', 'ST-REF-11', 'ST-REF-15', 'ST-REF-16']
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
  { from: 'clock-tower', to: 'cable-car-station', relation: 'near', confidence: 'high', referenceIds: ['ST-REF-03', 'ST-REF-15'] },
  { from: 'cable-car-station', to: 'kiss-stage', relation: 'above', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'cable-car-station', to: 'kiss-stage', relation: 'inland-of', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'cable-car-station', to: 'kiss-stage', relation: 'terraced-to', confidence: 'verified', referenceIds: ['ST-REF-15'] },
  { from: 'cable-car-station', to: 'kiss-bridge', relation: 'near', confidence: 'high', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'sunset-bazaar', to: 'kiss-stage', relation: 'above', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'sunset-bazaar', to: 'kiss-stage', relation: 'inland-of', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'sunset-bazaar', to: 'kiss-stage', relation: 'terraced-to', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'sunset-bazaar', to: 'kiss-stage', relation: 'connects', confidence: 'high', referenceIds: ['ST-REF-13'] },
  { from: 'kiss-stage', to: 'kiss-bridge', relation: 'inland-of', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'kiss-bridge', to: 'kiss-stage', relation: 'seaward-of', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16'] },
  { from: 'sunset-bazaar', to: 'kiss-bridge', relation: 'connects', confidence: 'high', referenceIds: ['ST-REF-13'] },
  { from: 'apollo-square', to: 'apollo-cafe', relation: 'contains', confidence: 'high', referenceIds: ['ST-REF-07'] }
] as const;

export const SUNSET_TOWN_WORLD_PLATES: readonly WorldPlate[] = [
  {
    id: 'STP-01',
    label: 'HILLSIDE · WEST-FACING TOWN',
    kind: 'overview',
    spatialStatus: 'verified',
    focusNodeIds: ['sunset-town', 'central-village'],
    referenceIds: ['ST-REF-09', 'ST-REF-12', 'ST-REF-14', 'ST-REF-15'],
    note: 'Sunset Town descends in terraces toward the sea. Do not flatten the place into one plane.'
  },
  {
    id: 'STP-02',
    label: 'CENTRAL VILLAGE · LA FESTA',
    kind: 'central',
    spatialStatus: 'verified',
    focusNodeIds: ['central-village', 'la-festa-square', 'clock-tower', 'dragon-stairs', 'king-of-sun', 'sun-signature-gallery'],
    referenceIds: ['ST-REF-03', 'ST-REF-08', 'ST-REF-11', 'ST-REF-15'],
    note: 'Central Village and Clock Tower sit above the waterfront system. Their visual relationship must preserve the downhill view toward the sea.'
  },
  {
    id: 'STP-03',
    label: 'UPPER TERRACE · CABLE CAR',
    kind: 'transport',
    spatialStatus: 'verified',
    focusNodeIds: ['anh-duong-square', 'cable-car-station', 'sunset-bazaar', 'kiss-stage'],
    referenceIds: ['ST-REF-06', 'ST-REF-11', 'ST-REF-12', 'ST-REF-15', 'ST-REF-16'],
    note: 'Cable Car Station is an upper-terrace anchor. Sunset Bazaar is below/in front of the upper zone; Kiss Stage is one terrace lower toward the waterfront.'
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
    label: 'TERRACED WATERFRONT · KISS BRIDGE',
    kind: 'waterfront',
    spatialStatus: 'verified',
    focusNodeIds: ['cable-car-station', 'sunset-bazaar', 'kiss-stage', 'kiss-bridge'],
    referenceIds: ['ST-REF-04', 'ST-REF-11', 'ST-REF-13', 'ST-REF-15', 'ST-REF-16'],
    note: 'Correct hierarchy: upper Cable Car zone -> middle Sunset Bazaar -> lower Kiss of the Sea Stage -> seafront Kiss Bridge.'
  },
  {
    id: 'STP-06',
    label: '3D PLACE GRAPH · ROUTE NOT LOCKED',
    kind: 'graph',
    spatialStatus: 'verified',
    focusNodeIds: ['central-village', 'clock-tower', 'cable-car-station', 'sunset-bazaar', 'kiss-stage', 'kiss-bridge'],
    referenceIds: ['ST-REF-03', 'ST-REF-11', 'ST-REF-13', 'ST-REF-15', 'ST-REF-16'],
    note: 'The approved contract now includes terrace/elevation and inland/seaward relations. A driveable route is still intentionally not inferred.'
  }
] as const;
