import type { PlaceGraphEdge, PlaceGraphNode, WorldPlate } from '../types';
import { KISS_SHOW_SPATIAL_V2, SUNSET_TOWN_OPERATOR_PLAN } from './sunset-town-operator-layout';

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
    operatorPlanPoint: SUNSET_TOWN_OPERATOR_PLAN['central-village'],
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
    operatorPlanPoint: SUNSET_TOWN_OPERATOR_PLAN['clock-tower'],
    planPoint: { lat: 10.030171875, lon: 104.0071125 },
    referenceIds: ['ST-REF-03', 'ST-REF-08', 'ST-REF-11', 'ST-REF-17', 'ST-REF-20']
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
    operatorPlanPoint: SUNSET_TOWN_OPERATOR_PLAN['cable-car-station'],
    planPoint: { lat: 10.0270625, lon: 104.0071875 },
    referenceIds: ['ST-REF-06', 'ST-REF-11', 'ST-REF-12', 'ST-REF-18', 'ST-REF-20']
  },
  {
    id: 'apollo-square',
    label: 'APOLLO SQUARE',
    kind: 'square',
    spatialStatus: 'visual-only',
    confidence: 'high',
    operatorPlanPoint: SUNSET_TOWN_OPERATOR_PLAN['apollo-square'],
    referenceIds: ['ST-REF-02', 'ST-REF-07', 'ST-REF-20']
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
    operatorPlanPoint: SUNSET_TOWN_OPERATOR_PLAN['sunset-bazaar'],
    planPoint: { lat: 10.029453125, lon: 104.0071875 },
    referenceIds: ['ST-REF-13', 'ST-REF-17', 'ST-REF-20']
  },
  {
    id: 'kiss-seating',
    label: 'KISS SHOW SEATING',
    kind: 'waterfront',
    spatialStatus: 'verified',
    confidence: 'verified',
    operatorPlanPoint: SUNSET_TOWN_OPERATOR_PLAN['kiss-seating'],
    referenceIds: ['ST-REF-03', 'ST-REF-11', 'ST-REF-13', 'ST-REF-15', 'ST-REF-16', 'ST-REF-20', 'ST-REF-21']
  },
  {
    id: 'kiss-show-stage',
    label: 'KISS SHOW PERFORMANCE STAGE',
    kind: 'waterfront',
    spatialStatus: 'verified',
    confidence: 'verified',
    operatorPlanPoint: KISS_SHOW_SPATIAL_V2.kiss.performanceStage,
    referenceIds: ['ST-REF-11', 'ST-REF-13', 'ST-REF-21']
  },
  {
    id: 'kiss-bridge',
    label: 'KISS BRIDGE',
    kind: 'waterfront',
    spatialStatus: 'verified',
    confidence: 'verified',
    operatorPlanPoint: SUNSET_TOWN_OPERATOR_PLAN['kiss-bridge'],
    planPoint: { lat: 10.028140625, lon: 104.0038125 },
    referenceIds: ['ST-REF-03', 'ST-REF-04', 'ST-REF-11', 'ST-REF-19', 'ST-REF-20']
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
  { from: 'kiss-bridge', to: 'sunset-bazaar', relation: 'west-of', confidence: 'verified', referenceIds: ['ST-REF-17', 'ST-REF-19', 'ST-REF-20'] },
  { from: 'kiss-bridge', to: 'cable-car-station', relation: 'west-of', confidence: 'verified', referenceIds: ['ST-REF-18', 'ST-REF-19', 'ST-REF-20'] },
  { from: 'sunset-bazaar', to: 'kiss-bridge', relation: 'connects', confidence: 'high', referenceIds: ['ST-REF-13'] },

  // Verified local vertical relationship. Do not apply this to Sunset Bazaar.
  { from: 'cable-car-station', to: 'kiss-seating', relation: 'above', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16', 'ST-REF-21'] },
  { from: 'cable-car-station', to: 'kiss-seating', relation: 'step-down-to', confidence: 'verified', referenceIds: ['ST-REF-15', 'ST-REF-16', 'ST-REF-21'] },
  { from: 'kiss-seating', to: 'kiss-show-stage', relation: 'inland-of', confidence: 'verified', referenceIds: ['ST-REF-21'] },
  { from: 'kiss-show-stage', to: 'kiss-seating', relation: 'seaward-of', confidence: 'verified', referenceIds: ['ST-REF-21'] },
  { from: 'kiss-show-stage', to: 'kiss-bridge', relation: 'within-arc-of', confidence: 'verified', referenceIds: ['ST-REF-21'] },
  { from: 'kiss-bridge', to: 'kiss-show-stage', relation: 'seaward-of', confidence: 'verified', referenceIds: ['ST-REF-21'] },
  { from: 'sunset-bazaar', to: 'kiss-seating', relation: 'connects', confidence: 'high', referenceIds: ['ST-REF-13'] }
] as const;

export const SUNSET_TOWN_WORLD_PLATES: readonly WorldPlate[] = [
  {
    id: 'STP-01',
    label: 'WORLD MASSING · APPROVED PLAN',
    kind: 'overview',
    spatialStatus: 'verified',
    focusNodeIds: ['sunset-town', 'central-village'],
    referenceIds: ['ST-REF-09', 'ST-REF-12', 'ST-REF-14'],
    note: 'World massing is composed around the operator-approved layout. Node positions are locked; building density and visual mass remain QA-level composition.'
  },
  {
    id: 'STP-02',
    label: 'CENTRAL CLUSTER · DENSITY / MATERIAL',
    kind: 'central',
    spatialStatus: 'verified',
    focusNodeIds: ['central-village', 'la-festa-square', 'clock-tower', 'dragon-stairs', 'king-of-sun', 'sun-signature-gallery'],
    referenceIds: ['ST-REF-03', 'ST-REF-08', 'ST-REF-11', 'ST-REF-17'],
    note: 'Central Village, Clock Tower and Apollo visual mass are composed without moving approved nodes. This plate validates density/material only, not route order.'
  },
  {
    id: 'STP-03',
    label: 'SOUTH CLUSTER · CABLE CAR / KISS SHOW',
    kind: 'transport',
    spatialStatus: 'verified',
    focusNodeIds: ['cable-car-station', 'kiss-seating', 'kiss-show-stage', 'kiss-bridge'],
    referenceIds: ['ST-REF-06', 'ST-REF-11', 'ST-REF-15', 'ST-REF-16', 'ST-REF-18', 'ST-REF-19', 'ST-REF-20', 'ST-REF-21'],
    note: 'Cable Car Station sits one level above the Kiss Show seating area. Seating, performance stage and bridge geometry use the operator-edited spatial-v2 JSON. Kiss Bridge renders as the operator-edited long open C wrapping the performance stage; its legacy POI anchor is not the curve center.'
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
    focusNodeIds: ['sunset-bazaar', 'cable-car-station', 'kiss-seating', 'kiss-show-stage', 'kiss-bridge'],
    referenceIds: ['ST-REF-03', 'ST-REF-11', 'ST-REF-13', 'ST-REF-15', 'ST-REF-16', 'ST-REF-17', 'ST-REF-18', 'ST-REF-19', 'ST-REF-20', 'ST-REF-21'],
    note: 'Local node composition follows the operator-approved drag layouts exactly. Sea edge stays left. Kiss seating and performance stage use exact spatial-v2 points; the long open-C Kiss Bridge extends out toward the sea and wraps the performance stage.'
  },
  {
    id: 'STP-06',
    label: 'PLAN GRAPH · ROUTE CANDIDATE QA',
    kind: 'graph',
    spatialStatus: 'verified',
    focusNodeIds: ['clock-tower', 'sunset-bazaar', 'cable-car-station', 'kiss-seating', 'kiss-show-stage', 'kiss-bridge'],
    referenceIds: ['ST-REF-03', 'ST-REF-11', 'ST-REF-13', 'ST-REF-15', 'ST-REF-16', 'ST-REF-17', 'ST-REF-18', 'ST-REF-19', 'ST-REF-20'],
    note: 'Approved local layout is frozen. Kiss Show separates seating, performance stage and long open-C bridge shape. Exact spatial-v2 stage/seating geometry and operator-edited three-point bridge outline are separate locks; no ellipse render. Route remains hypothesis-only.'
  }
] as const;
