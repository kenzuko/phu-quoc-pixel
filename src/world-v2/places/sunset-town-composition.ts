import type { RelativePlanPoint } from '../types';

export type SunsetCompositionKind =
  | 'building-mass'
  | 'plaza'
  | 'stairs'
  | 'sea-opening'
  | 'light-band'
  | 'audience-bowl'
  | 'performance-stage'
  | 'bridge-arc';

export interface SunsetCompositionElement {
  id: string;
  kind: SunsetCompositionKind;
  anchorId: string;
  offset: RelativePlanPoint;
  size: RelativePlanPoint;
  confidence: 'verified' | 'corroborated' | 'visual-only';
  note: string;
}

export const SUNSET_TOWN_COMPOSITION: readonly SunsetCompositionElement[] = [
  {
    id: 'mass-central-east',
    kind: 'building-mass',
    anchorId: 'central-village',
    offset: { x: 0.03, y: -0.02 },
    size: { x: 0.19, y: 0.13 },
    confidence: 'corroborated',
    note: 'Dense central-town mass around the approved Central Village anchor.'
  },
  {
    id: 'mass-clock',
    kind: 'building-mass',
    anchorId: 'clock-tower',
    offset: { x: -0.03, y: 0.02 },
    size: { x: 0.16, y: 0.12 },
    confidence: 'corroborated',
    note: 'Built mass surrounding Clock Tower without moving its approved anchor.'
  },
  {
    id: 'apollo-plaza',
    kind: 'plaza',
    anchorId: 'apollo-square',
    offset: { x: 0, y: 0 },
    size: { x: 0.16, y: 0.11 },
    confidence: 'visual-only',
    note: 'Apollo visual zone only; exact local geometry remains unapproved.'
  },
  {
    id: 'bazaar-band',
    kind: 'light-band',
    anchorId: 'sunset-bazaar',
    offset: { x: 0.01, y: 0.01 },
    size: { x: 0.19, y: 0.07 },
    confidence: 'corroborated',
    note: 'Bazaar activity/light band around the operator-approved Bazaar position.'
  },
  {
    id: 'cable-station-mass',
    kind: 'building-mass',
    anchorId: 'cable-car-station',
    offset: { x: 0.02, y: -0.01 },
    size: { x: 0.18, y: 0.11 },
    confidence: 'verified',
    note: 'Cable-car terminal mass attached to the approved transport anchor.'
  },
  {
    id: 'cable-stage-steps',
    kind: 'stairs',
    anchorId: 'cable-car-station',
    offset: { x: -0.10, y: -0.02 },
    size: { x: 0.16, y: 0.11 },
    confidence: 'verified',
    note: 'Local step-down relationship from Cable Car area toward Kiss Stage.'
  },
  {
    id: 'kiss-audience-bowl',
    kind: 'audience-bowl',
    anchorId: 'kiss-seating',
    offset: { x: 0, y: 0 },
    size: { x: 0.17, y: 0.10 },
    confidence: 'verified',
    note: 'Operator-confirmed audience/seating area. This is not the performance stage.'
  },
  {
    id: 'kiss-performance-stage',
    kind: 'performance-stage',
    anchorId: 'kiss-seating',
    offset: { x: -0.12, y: 0.00 },
    size: { x: 0.10, y: 0.07 },
    confidence: 'verified',
    note: 'Performance stage is shifted west/seaward from the audience area.'
  },
  {
    id: 'kiss-bridge-arc',
    kind: 'bridge-arc',
    anchorId: 'kiss-seating',
    offset: { x: -0.12, y: 0.00 },
    size: { x: 0.26, y: 0.22 },
    confidence: 'verified',
    note: 'Kiss Bridge is a large outer seaward arc wrapping around the performance stage.'
  },
  {
    id: 'bridge-sea-opening',
    kind: 'sea-opening',
    anchorId: 'kiss-bridge',
    offset: { x: -0.02, y: 0.02 },
    size: { x: 0.23, y: 0.18 },
    confidence: 'verified',
    note: 'Keep visual breathing room and open water around the Kiss Bridge outer arc.'
  }
] as const;

export const SUNSET_TOWN_ROUTE_CANDIDATE: readonly string[] = [
  'central-village',
  'clock-tower',
  'apollo-square',
  'sunset-bazaar',
  'kiss-bridge'
] as const;

export const SUNSET_TOWN_ROUTE_CANDIDATE_STATUS = 'hypothesis' as const;
