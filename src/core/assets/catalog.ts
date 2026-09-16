import { assetRegistry } from './AssetRegistry';

// These six files are the losslessly migrated, approved visual assets from the
// original prototype. They are intentionally loaded with the shell for now so
// the character/map/game scenes can use real artwork instead of drawing proxy
// rectangles. Once the visual system grows, this can be split back into lazy
// location bundles without changing scene contracts.
const records = [
  {
    key: 'island-map',
    type: 'image' as const,
    src: 'assets/world/island-map.webp',
    group: 'shell-map',
    approved: true,
    width: 240,
    height: 293
  },
  {
    key: 'sunset-background',
    type: 'image' as const,
    src: 'assets/locations/sunset-town/background.webp',
    group: 'shell-map',
    approved: true,
    width: 270,
    height: 480
  },
  {
    key: 'no-brakes-ride-01',
    type: 'image' as const,
    src: 'assets/games/no-brakes/player/ride-01.webp',
    group: 'shell-map',
    approved: true,
    width: 86,
    height: 118
  },
  {
    key: 'no-brakes-ride-02',
    type: 'image' as const,
    src: 'assets/games/no-brakes/player/ride-02.webp',
    group: 'shell-map',
    approved: true,
    width: 89,
    height: 118
  },
  {
    key: 'no-brakes-planter',
    type: 'image' as const,
    src: 'assets/games/no-brakes/props/planter.webp',
    group: 'shell-map',
    approved: true,
    width: 69,
    height: 76
  },
  {
    key: 'jo-coin',
    type: 'image' as const,
    src: 'assets/games/no-brakes/collectibles/jo-coin.webp',
    group: 'shell-map',
    approved: true,
    width: 42,
    height: 58
  }
] as const;

for (const record of records) {
  if (!assetRegistry.has(record.key)) assetRegistry.register(record);
}
