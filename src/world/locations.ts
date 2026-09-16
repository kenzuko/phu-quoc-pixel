export type LocationStatus = 'available' | 'locked' | 'coming-soon';

export interface IslandLocation {
  id: string;
  label: string;
  coordinates: { lat: number; lon: number };
  status: LocationStatus;
  miniGameId?: string;
  assetGroup?: string;
}

/**
 * Geographic anchors used by the island map. These are real-world latitude /
 * longitude positions rather than hand-placed normalized percentages, so pins
 * keep their north-south / east-west relationship when the map art changes.
 */
export const ISLAND_LOCATIONS: readonly IslandLocation[] = Object.freeze([
  {
    id: 'sunset-town',
    label: 'SUNSET TOWN',
    coordinates: { lat: 10.02942, lon: 104.00709 },
    status: 'available',
    miniGameId: 'no-brakes',
    assetGroup: 'location-sunset-town'
  },
  {
    id: 'hon-thom',
    label: 'HON THOM',
    coordinates: { lat: 9.955, lon: 104.017 },
    status: 'locked'
  },
  {
    id: 'bai-sao',
    label: 'BAI SAO',
    coordinates: { lat: 10.049993, lon: 104.036407 },
    status: 'locked'
  },
  {
    id: 'night-market',
    label: 'NIGHT MARKET',
    coordinates: { lat: 10.2163, lon: 103.96058 },
    status: 'locked'
  },
  {
    id: 'grand-world',
    label: 'GRAND WORLD',
    coordinates: { lat: 10.32459, lon: 103.85536 },
    status: 'locked'
  },
  {
    id: 'safari',
    label: 'SAFARI',
    coordinates: { lat: 10.33987, lon: 103.89582 },
    status: 'locked'
  }
]);
