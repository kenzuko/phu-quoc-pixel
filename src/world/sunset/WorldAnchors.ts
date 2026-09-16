export type ScreenSector = 'left' | 'center' | 'right';

export interface WorldAnchor {
  id: string;
  label: string;
  source: string;
  realWorldRelationship: string;
  routeDepthRange: readonly [number, number];
  screenSector: ScreenSector;
  minimumReadableSize: number;
  approved: boolean;
}

export const SUNSET_WORLD_ANCHORS: readonly WorldAnchor[] = [
  {
    id: 'central-village-clock-tower',
    label: 'Central Village Clock Tower',
    source: 'https://sunworld.vn/en/hon-thom/travel-guide/kinh-nghiem-du-lich-sunset-town-phu-quoc-tron-ven-va-tiet-kiem-17546',
    realWorldRelationship:
      'Major Central Village landmark near the waterfront / La Festa area, distinct from the An Thoi cable-car station.',
    routeDepthRange: [0.2, 0.72],
    screenSector: 'left',
    minimumReadableSize: 44,
    approved: true
  },
  {
    id: 'kiss-bridge',
    label: 'Kiss Bridge',
    source: 'https://sunsettown.com.vn/en/sunsettown-map',
    realWorldRelationship:
      'Offshore waterfront landmark across the bay. It must never be represented as a normal road bridge carrying the player route.',
    routeDepthRange: [0.46, 0.98],
    screenSector: 'right',
    minimumReadableSize: 72,
    approved: true
  },
  {
    id: 'an-thoi-cable-car-station',
    label: 'An Thoi Cable Car Station',
    source: 'https://mapcarta.com/W1185867234',
    realWorldRelationship:
      'Cable-car departure node at Anh Duong Square. It is geographically distinct from Central Village and should appear only when the chosen route sightline supports it.',
    routeDepthRange: [0, 1],
    screenSector: 'center',
    minimumReadableSize: 52,
    approved: false
  }
] as const;

export function approvedSunsetAnchors(): readonly WorldAnchor[] {
  return SUNSET_WORLD_ANCHORS.filter((anchor) => anchor.approved);
}
