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

/**
 * Reality-led anchor contract for Sunset Town.
 *
 * Art direction may compress depth for gameplay, but it may not swap landmark
 * relationships or add an unverified landmark merely to make the frame busy.
 */
export const SUNSET_WORLD_ANCHORS: readonly WorldAnchor[] = [
  {
    id: 'central-village-clock-tower',
    label: 'Central Village Clock Tower',
    source: 'https://sungroup.com.vn/en/sunsettown',
    realWorldRelationship:
      'Sea-facing Central Village / La Festa landmark. Official Sunset Town material describes the red-brick clock tower as a primary locator near the waterfront.',
    routeDepthRange: [0.18, 0.7],
    screenSector: 'left',
    minimumReadableSize: 48,
    approved: true
  },
  {
    id: 'kiss-bridge',
    label: 'Kiss Bridge',
    source: 'https://sungroup.com.vn/en/tin-tuc/kiss-bridge-a-new-iconic-destination-in-vietnam-4737',
    realWorldRelationship:
      'Offshore waterfront landmark. Two bridge branches extend over the sea and approach each other without touching. It must never carry the player road.',
    routeDepthRange: [0.44, 1],
    screenSector: 'right',
    minimumReadableSize: 82,
    approved: true
  },
  {
    id: 'an-thoi-cable-car-station',
    label: 'An Thoi Cable Car Station',
    source: 'https://sungroup.com.vn/en/sunsettown',
    realWorldRelationship:
      'The Hon Thom cable-car departure node is in An Thoi and geographically distinct from Central Village. Cabins/line are allowed only after a route-specific sightline is verified.',
    routeDepthRange: [0, 1],
    screenSector: 'center',
    minimumReadableSize: 52,
    approved: false
  }
] as const;

export function approvedSunsetAnchors(): readonly WorldAnchor[] {
  return SUNSET_WORLD_ANCHORS.filter((anchor) => anchor.approved);
}

export function isSunsetAnchorApproved(id: string): boolean {
  return SUNSET_WORLD_ANCHORS.some((anchor) => anchor.id === id && anchor.approved);
}
