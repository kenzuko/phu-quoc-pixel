import type { PlaceManifest } from '../types';

export const SUNSET_TOWN_V2: PlaceManifest = {
  id: 'sunset-town',
  label: 'SUNSET TOWN',
  realityEpoch: '2026-09',
  anchor: { lat: 10.02943, lon: 104.00662 },
  zones: [
    { id: 'st-upper', label: 'UPPER STREETS', kind: 'street', confidence: 'medium' },
    { id: 'st-apollo', label: 'APOLLO SQUARE', kind: 'square', confidence: 'high' },
    { id: 'st-central', label: 'CENTRAL VILLAGE', kind: 'mixed', confidence: 'verified' },
    { id: 'st-descent', label: 'SEA DESCENT', kind: 'descent', confidence: 'medium' },
    { id: 'st-waterfront', label: 'WATERFRONT', kind: 'waterfront', confidence: 'verified' }
  ],
  segments: [
    { id: 'ST-01', label: 'UPPER STREET', zoneId: 'st-upper', order: 1, routeProgress: 0, spatialStatus: 'hypothesis', slope: 'down', openness: 0.22, seaVisibility: 0, leftMass: 0.88, rightMass: 0.82, landmarkIds: [], allowedActors: ['pedestrian', 'service-cart', 'electric-shuttle'], gameplaySlots: ['street-edge', 'moving-vehicle'], referenceIds: ['ST-REF-01', 'ST-REF-09'], confidence: 'medium' },
    { id: 'ST-02', label: 'APOLLO SQUARE', zoneId: 'st-apollo', order: 2, routeProgress: 0.2, spatialStatus: 'visual-only', slope: 'flat', openness: 0.58, seaVisibility: 0.08, leftMass: 0.54, rightMass: 0.48, landmarkIds: ['apollo-cafe'], allowedActors: ['pedestrian', 'photographer', 'electric-shuttle'], gameplaySlots: ['pedestrian-crossing', 'photographer', 'jo-trail'], referenceIds: ['ST-REF-01', 'ST-REF-02', 'ST-REF-07'], confidence: 'high' },
    { id: 'ST-03', label: 'CENTRAL VILLAGE', zoneId: 'st-central', order: 3, routeProgress: 0.4, spatialStatus: 'corroborated', slope: 'down', openness: 0.48, seaVisibility: 0.18, leftMass: 0.72, rightMass: 0.68, landmarkIds: ['clock-tower'], allowedActors: ['pedestrian', 'service-cart', 'electric-shuttle'], gameplaySlots: ['street-edge', 'moving-vehicle', 'jo-trail'], referenceIds: ['ST-REF-03', 'ST-REF-05', 'ST-REF-08', 'ST-REF-09'], confidence: 'verified' },
    { id: 'ST-04', label: 'DOWNHILL REVEAL', zoneId: 'st-descent', order: 4, routeProgress: 0.62, spatialStatus: 'hypothesis', slope: 'steep-down', openness: 0.68, seaVisibility: 0.46, leftMass: 0.56, rightMass: 0.40, landmarkIds: ['clock-tower'], allowedActors: ['pedestrian', 'electric-shuttle'], gameplaySlots: ['moving-vehicle', 'jo-trail', 'near-miss'], referenceIds: ['ST-REF-02', 'ST-REF-04', 'ST-REF-09'], confidence: 'medium' },
    { id: 'ST-05', label: 'WATERFRONT OPENING', zoneId: 'st-waterfront', order: 5, routeProgress: 0.82, spatialStatus: 'corroborated', slope: 'down', openness: 0.86, seaVisibility: 0.78, leftMass: 0.34, rightMass: 0.18, landmarkIds: ['kiss-bridge'], allowedActors: ['pedestrian', 'photographer'], gameplaySlots: ['jo-trail', 'near-miss'], referenceIds: ['ST-REF-04', 'ST-REF-05'], confidence: 'high' },
    { id: 'ST-06', label: 'SEA REVEAL', zoneId: 'st-waterfront', order: 6, routeProgress: 1, spatialStatus: 'corroborated', slope: 'flat', openness: 1, seaVisibility: 1, leftMass: 0.16, rightMass: 0.08, landmarkIds: ['kiss-bridge'], allowedActors: ['pedestrian'], gameplaySlots: ['signature-moment', 'finish'], referenceIds: ['ST-REF-04'], confidence: 'verified' }
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
      confidence: 'high',
      spatialUse: 'conflicting',
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
      confidence: 'high',
      spatialUse: 'visual-only',
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
      proves: ['Kiss Bridge appearance', 'waterfront openness', 'town-to-sea visual relationship'],
      confidence: 'high',
      spatialUse: 'conflicting',
      license: 'CC BY 4.0',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-06',
      kind: 'map',
      title: 'An Thoi Cable Car Station - mapped transport anchor',
      sourceUrl: 'https://mapcarta.com/W1185867234',
      coordinates: { lat: 10.02704, lon: 104.00724 },
      proves: ['An Thoi cable-car station position', 'Sunset Town transport anchor'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-07',
      kind: 'official',
      title: 'Sun World - Apollo Cafe at Apollo Square, Sunset Town',
      sourceUrl: 'https://sunworld.vn/vi/hon-thom/check-in/apollo-cafe-sunset-town-tuyet-tac-thi-tran-hoang-hon-lon-nguoc-cua-bill-bensley-20200',
      capturedAt: '2026-07-16',
      proves: ['Apollo Cafe is at Apollo Square', 'Apollo Square is in central Sunset Town', 'sea-facing visual context'],
      confidence: 'high',
      spatialUse: 'visual-only',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-08',
      kind: 'street-photo',
      title: 'Clock Tower at sunset - Sunset Town',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sunset-town.jpg',
      capturedAt: '2026-04-04',
      coordinates: { lat: 10.0269, lon: 104.007917 },
      proves: ['Clock Tower appearance', 'sunset lighting', 'street-scale visual context'],
      confidence: 'high',
      spatialUse: 'visual-only',
      license: 'Wikimedia Commons source - verify file license before asset reuse',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-09',
      kind: 'official',
      title: 'Sun World - Sunset Town hillside facing west',
      sourceUrl: 'https://sunworld.vn/hon-thom/an-choi/thi-tran-hoang-hon-phu-quochtml',
      proves: ['Sunset Town is built on a hillside', 'town faces west toward the sea', 'Clock Tower is central'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-10',
      kind: 'map',
      title: 'Official Sunset Town interactive map',
      sourceUrl: 'https://sunsettown.com.vn/en/sunsettown-map',
      proves: ['official Sunset Town spatial directory', 'named place relationships'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-11',
      kind: 'official',
      title: 'Official Sunset Town / Phu Quoc ecosystem brochure',
      sourceUrl: 'https://sunsettown.com.vn/Ebook/ENG_BROCHURE%20HST%202S%20PHU%20QUOC_27032024_VIEW%20ko%20in.pdf',
      proves: ['La Festa Square landmark grouping', 'Anh Duong Square cable-car station', 'Kiss Bridge and Kiss of the Sea named waterfront anchors'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-12',
      kind: 'aerial-photo',
      title: 'An Thoi fishing harbour with Sunset Town and cable-car tower',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:An_Thoi_fishing_harbour_Sunset_Town_Sun_World_Phu_Quoc_Vietnam.jpg',
      capturedAt: '2026-04-11',
      coordinates: { lat: 10.018615, lon: 104.007016 },
      proves: ['An Thoi harbour context', 'Sunset Town massing in the background', 'cable-car tower visual context'],
      confidence: 'high',
      spatialUse: 'visual-only',
      license: 'Wikimedia Commons source - verify file license before asset reuse',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-13',
      kind: 'official',
      title: 'Sun World - Sunset Bazaar central connection',
      sourceUrl: 'https://sunworld.vn/vi/hon-thom/an-choi/khu-pho-thuong-mai-nghe-thuat-sunset-bazaar-co-gi-ma-ai-den-phu-quoc-cung-muon-di-19265',
      capturedAt: '2026-05-20',
      proves: ['Sunset Bazaar is central in Sunset Town', 'direct connection to Kiss Bridge', 'direct connection to Kiss of the Sea stage'],
      confidence: 'high',
      spatialUse: 'approved',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-14',
      kind: 'aerial-photo',
      title: 'Sunset Town aerial at night',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sunset_Town_Phu_Quoc_at_night.jpg',
      capturedAt: '2026-04-25',
      coordinates: { lat: 10.030084, lon: 104.007752 },
      proves: ['hillside town massing', 'night lighting density', 'waterfront visual relationship'],
      confidence: 'high',
      spatialUse: 'visual-only',
      license: 'Wikimedia Commons source - verify file license before asset reuse',
      usage: 'reference-only'
    },
    {
      id: 'ST-REF-15',
      kind: 'field-note',
      title: 'Operator-confirmed Sunset Town terrace hierarchy',
      sourceNote: 'User field correction confirms a local vertical relationship only: Cable Car Station is near the Kiss Bridge cluster and sits above Kiss of the Sea Stage; moving down one level reaches the stage. This note does not assign Sunset Bazaar to that elevation chain.',
      proves: ['Cable Car Station above Kiss Stage', 'one-level descent from Cable Car area to Kiss Stage', 'prior flat graph misplaced the local cluster'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'approved-source'
    },
    {
      id: 'ST-REF-16',
      kind: 'field-note',
      title: 'Operator-confirmed relative layout from supplied Sunset Town map reference',
      sourceNote: 'User-provided promotional map must be read with its printed compass: E is up, N is left, S is right, W is down. It confirms that plan orientation and elevation must be treated as different axes; Sunset Bazaar must not be inserted into the Cable Car-to-Stage vertical sequence.',
      proves: ['map orientation is east-up / west-down', 'Sunset Bazaar is a separate plan-position node', 'plan position must not be converted into terrace order'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'approved-source'
    },
    {
      id: 'ST-REF-17',
      kind: 'map',
      title: 'Sunset Town plan cross-check - Clock Tower and Sunset Bazaar',
      sourceNote: 'Cross-checked 2026-09-21 from current map/business listings. Clock Tower: 22J4+3RF (~10.03017, 104.00711). Sunset Bazaar: 22H4+QVJ / OSM-backed listing (~10.02945, 104.00719).',
      proves: ['Clock Tower is north of Sunset Bazaar', 'Sunset Bazaar plan position is north of Cable Car Station'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'approved-source'
    },
    {
      id: 'ST-REF-18',
      kind: 'map',
      title: 'An Thoi Cable Car Station plan anchor',
      sourceUrl: 'https://mapcarta.com/W1185867234',
      coordinates: { lat: 10.02704, lon: 104.00724 },
      proves: ['Cable Car Station plan position', 'Cable Car Station lies south of Sunset Bazaar'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'approved-source'
    },
    {
      id: 'ST-REF-19',
      kind: 'map',
      title: 'Kiss Bridge plan anchor',
      sourceNote: 'Google Maps local code 22H3+7G4 cross-checked 2026-09-21, approximately 10.02814, 104.00381.',
      coordinates: { lat: 10.028140625, lon: 104.0038125 },
      proves: ['Kiss Bridge is west/seaward of the inland Clock Tower/Bazaar/Cable Car line', 'Kiss Bridge latitude lies between Sunset Bazaar and Cable Car Station'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'approved-source'
    },
    {
      id: 'ST-REF-20',
      kind: 'field-note',
      title: 'Operator-approved Sunset Town drag layout',
      sourceNote: 'Approved in the interactive spatial editor on 2026-09-21. Operator correction: preserve the approved node arrangement exactly as rendered from the editor layout. Sea edge is a separate composition axis and must be moved to the left without rotating or moving any approved node or massing. Central Village faces west toward the sea.',
      proves: ['approved relative local layout', 'node arrangement must remain unchanged', 'sea edge is left as an independent scene axis', 'Central Village faces west toward sea'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'approved-source'
    },
    {
      id: 'ST-REF-21',
      kind: 'field-note',
      title: 'Operator-confirmed Kiss Show audience / stage / bridge geometry',
      sourceNote: 'Operator correction dated 2026-09-21: the previously approved Kiss point is the audience/seating area, not the performance stage. The performance stage sits farther west/seaward from the seating while remaining inside the large Kiss Bridge arc. Kiss Bridge forms the outer seaward arc wrapping around the show stage.',
      proves: ['approved Kiss point is audience seating', 'performance stage is west/seaward of seating', 'performance stage remains inside Kiss Bridge arc', 'Kiss Bridge is the large outer seaward arc around the performance stage'],
      confidence: 'verified',
      spatialUse: 'approved',
      usage: 'approved-source'
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
