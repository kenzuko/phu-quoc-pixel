import type { PlaceManifest } from '../types';

export const SUNSET_TOWN_V2: PlaceManifest = {
  id: 'sunset-town',
  label: 'SUNSET TOWN',
  realityEpoch: '2026-09',
  anchor: { lat: 10.0297, lon: 104.0077 },
  zones: [
    { id: 'st-upper', label: 'UPPER STREETS', kind: 'street', confidence: 'medium' },
    { id: 'st-apollo', label: 'APOLLO SQUARE', kind: 'square', confidence: 'high' },
    { id: 'st-central', label: 'CENTRAL VILLAGE', kind: 'mixed', confidence: 'verified' },
    { id: 'st-descent', label: 'SEA DESCENT', kind: 'descent', confidence: 'medium' },
    { id: 'st-waterfront', label: 'WATERFRONT', kind: 'waterfront', confidence: 'verified' }
  ],
  segments: [
    { id: 'ST-01', label: 'UPPER STREET', zoneId: 'st-upper', order: 1, routeProgress: 0, slope: 'down', openness: 0.22, seaVisibility: 0, leftMass: 0.88, rightMass: 0.82, landmarkIds: [], allowedActors: ['pedestrian', 'service-cart', 'electric-shuttle'], gameplaySlots: ['street-edge', 'moving-vehicle'], referenceIds: ['ST-REF-01'], confidence: 'medium' },
    { id: 'ST-02', label: 'APOLLO SQUARE', zoneId: 'st-apollo', order: 2, routeProgress: 0.2, slope: 'flat', openness: 0.58, seaVisibility: 0.08, leftMass: 0.54, rightMass: 0.48, landmarkIds: ['apollo-cafe'], allowedActors: ['pedestrian', 'photographer', 'electric-shuttle'], gameplaySlots: ['pedestrian-crossing', 'photographer', 'jo-trail'], referenceIds: ['ST-REF-01', 'ST-REF-02'], confidence: 'high' },
    { id: 'ST-03', label: 'CENTRAL VILLAGE', zoneId: 'st-central', order: 3, routeProgress: 0.4, slope: 'down', openness: 0.48, seaVisibility: 0.18, leftMass: 0.72, rightMass: 0.68, landmarkIds: ['clock-tower'], allowedActors: ['pedestrian', 'service-cart', 'electric-shuttle'], gameplaySlots: ['street-edge', 'moving-vehicle', 'jo-trail'], referenceIds: ['ST-REF-03', 'ST-REF-05'], confidence: 'verified' },
    { id: 'ST-04', label: 'DOWNHILL REVEAL', zoneId: 'st-descent', order: 4, routeProgress: 0.62, slope: 'steep-down', openness: 0.68, seaVisibility: 0.46, leftMass: 0.56, rightMass: 0.40, landmarkIds: ['clock-tower'], allowedActors: ['pedestrian', 'electric-shuttle'], gameplaySlots: ['moving-vehicle', 'jo-trail', 'near-miss'], referenceIds: ['ST-REF-02', 'ST-REF-04'], confidence: 'medium' },
    { id: 'ST-05', label: 'WATERFRONT OPENING', zoneId: 'st-waterfront', order: 5, routeProgress: 0.82, slope: 'down', openness: 0.86, seaVisibility: 0.78, leftMass: 0.34, rightMass: 0.18, landmarkIds: ['kiss-bridge'], allowedActors: ['pedestrian', 'photographer'], gameplaySlots: ['jo-trail', 'near-miss'], referenceIds: ['ST-REF-04', 'ST-REF-05'], confidence: 'high' },
    { id: 'ST-06', label: 'SEA REVEAL', zoneId: 'st-waterfront', order: 6, routeProgress: 1, slope: 'flat', openness: 1, seaVisibility: 1, leftMass: 0.16, rightMass: 0.08, landmarkIds: ['kiss-bridge'], allowedActors: ['pedestrian'], gameplaySlots: ['signature-moment', 'finish'], referenceIds: ['ST-REF-04'], confidence: 'verified' }
  ],
  references: [
    {
      id: 'ST-REF-01',
      kind: 'street-photo',
      title: 'Apollo Cafe daytime street view - Sunset Town',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Apollo_Cafe_daytime_street_view_Sunset_Town_Phu_Quoc_Vietnam.jpg',
      capturedAt: '2026-04-11',
      coordinates: { lat: 10.0310, lon: 103.9820 },
      proves: ['street-level scale', 'Apollo Cafe appearance', 'street furniture', 'building colour and massing'],
      confidence: 'verified',
      license: 'CC BY-SA 4.0',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-02',
      kind: 'aerial-photo',
      title: 'Sunset Town plaza aerial - Apollo Cafe and coastal massing',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:DJI_20260214173618_0031_D_SUNSHINE.jpg',
      capturedAt: '2026-04-13',
      coordinates: { lat: 10.029701, lon: 104.007671 },
      proves: ['plaza openness', 'building massing', 'coastal relationship'],
      confidence: 'verified',
      license: 'CC BY-SA 4.0',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-03',
      kind: 'official',
      title: 'Sun World - Clock Tower / Central Village',
      sourceUrl: 'https://sunworld.vn/vi/hon-thom/an-choi/thap-dong-ho-phu-quochtml',
      proves: ['Clock Tower is in Central Village', 'relationship to Kiss Bridge and cable-car station'],
      confidence: 'verified',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-04',
      kind: 'aerial-photo',
      title: 'Kiss Bridge and Sunset Town aerial sunset view',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kiss_Bridge_Phu_Quoc_aerial_sunset_view.jpg',
      capturedAt: '2026-03-04',
      coordinates: { lat: 10.0231, lon: 103.9812 },
      proves: ['Kiss Bridge coastal position', 'waterfront openness', 'town-to-sea relationship'],
      confidence: 'verified',
      license: 'CC BY 4.0',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-05',
      kind: 'official',
      title: 'Sun World - Sunset Town attractions 2026',
      sourceUrl: 'https://sunworld.vn/vi/hon-thom/an-choi/kham-pha-cac-diem-tham-quan-sunset-town-phu-quoc-dep-quen-loi-ve-17560',
      capturedAt: '2026-03-10',
      proves: ['Sunset Town location in An Thoi', 'Mediterranean streets', 'coastal public-space identity'],
      confidence: 'high',
      usage: 'reference-only'
    }
  ]
};
