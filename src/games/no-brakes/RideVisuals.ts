import Phaser from 'phaser';

export type ObstacleKind =
  | 'large-planter'
  | 'rolling-suitcase'
  | 'menu-board'
  | 'electric-shuttle'
  | 'cafe-chair'
  | 'tourist-tripod'
  | 'bougainvillea-planter'
  | 'hotel-cart'
  | 'market-crates';

const PALETTE = {
  outline: 0x172c36,
  stoneDark: 0x715e4d,
  stone: 0xb79a74,
  stoneLight: 0xe3c99e,
  woodDark: 0x5d4033,
  wood: 0x8b5b3f,
  terracotta: 0xc56a4f,
  coral: 0xdb6f54,
  butter: 0xf0c67d,
  cream: 0xf6dfb3,
  teal: 0x397b76,
  sea: 0x315e6c,
  green: 0x39724b,
  pink: 0xe84e78,
  amber: 0xf2a24f,
  red: 0xbb493f
} as const;

export interface ObstacleVisual {
  container: Phaser.GameObjects.Container;
  setKind: (kind: ObstacleKind) => void;
}

/**
 * Rear-chase Traveler isolated from the approved master gameplay reference.
 * Everything around the rider is now drawn with one Sunset Town obstacle
 * palette and one outline language so hazards belong to the same pixel world.
 */
export function createRiderVisual(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const rider = scene.add
    .image(0, 4, 'approved-rear-rider')
    .setOrigin(0.5, 1)
    .setScale(1.12)
    .setName('approved-rear-rider');

  container.add(rider);
  return container;
}

export function createObstacleVisual(scene: Phaser.Scene): ObstacleVisual {
  const container = scene.add.container(270, 500).setVisible(false);
  const g = scene.add.graphics();
  container.add(g);

  const setKind = (kind: ObstacleKind): void => {
    g.clear();

    const visualKind: Exclude<ObstacleKind, 'bougainvillea-planter' | 'hotel-cart' | 'market-crates'> =
      kind === 'bougainvillea-planter'
        ? 'large-planter'
        : kind === 'hotel-cart'
          ? 'electric-shuttle'
          : kind === 'market-crates'
            ? 'menu-board'
            : kind;

    if (visualKind === 'large-planter') drawLargePlanter(g);
    if (visualKind === 'rolling-suitcase') drawRollingSuitcase(g);
    if (visualKind === 'menu-board') drawMenuBoard(g);
    if (visualKind === 'electric-shuttle') drawElectricShuttle(g);
    if (visualKind === 'cafe-chair') drawCafeChairCluster(g);
    if (visualKind === 'tourist-tripod') drawTouristTripod(g);
  };

  setKind('large-planter');
  return { container, setKind };
}

function drawLargePlanter(g: Phaser.GameObjects.Graphics): void {
  // Low limestone planter used throughout Sunset Town promenade landscaping.
  g.fillStyle(PALETTE.outline, 0.82);
  g.fillRect(-47, -51, 94, 56);
  g.fillStyle(PALETTE.stoneDark, 1);
  g.fillRect(-43, -47, 86, 48);
  g.fillStyle(PALETTE.stone, 1);
  g.fillRect(-38, -43, 76, 40);
  g.fillStyle(PALETTE.stoneLight, 1);
  g.fillRect(-40, -45, 80, 8);
  g.fillStyle(0x8c725a, 0.75);
  for (let x = -31; x <= 25; x += 14) g.fillRect(x, -24 + ((x + 31) % 28 === 0 ? 0 : 7), 8, 4);

  // Dense greenery is made from block clusters rather than vector circles.
  const leaves = [
    [-32, -64, 20, 22], [-18, -78, 25, 28], [2, -83, 28, 32],
    [23, -72, 24, 27], [-7, -61, 32, 25], [31, -58, 18, 20]
  ] as const;
  g.fillStyle(PALETTE.green, 1);
  for (const [x, y, w, h] of leaves) g.fillRect(x, y, w, h);

  const flowers = [
    [-27, -72], [-16, -90], [-3, -76], [8, -96], [18, -78],
    [31, -86], [35, -66], [-11, -61], [9, -64], [24, -58]
  ] as const;
  flowers.forEach(([x, y], i) => {
    g.fillStyle(i % 3 === 0 ? PALETTE.amber : PALETTE.pink, 1);
    g.fillRect(x - 4, y - 4, 8, 8);
    g.fillStyle(PALETTE.cream, 0.78);
    g.fillRect(x - 1, y - 1, 2, 2);
  });
}

function drawRollingSuitcase(g: Phaser.GameObjects.Graphics): void {
  // Warm leather travel case, seen almost square-on from the approaching rider.
  g.fillStyle(PALETTE.outline, 1);
  g.fillRect(-31, -82, 62, 78);
  g.fillStyle(PALETTE.terracotta, 1);
  g.fillRect(-26, -77, 52, 68);
  g.fillStyle(0xdf9161, 1);
  g.fillRect(-21, -70, 7, 54);
  g.fillStyle(PALETTE.butter, 0.78);
  g.fillRect(-18, -62, 36, 5);
  g.fillRect(-18, -45, 36, 5);
  g.fillRect(-18, -28, 36, 5);

  g.lineStyle(5, PALETTE.outline, 1);
  g.lineBetween(-11, -82, -11, -104);
  g.lineBetween(11, -82, 11, -104);
  g.lineBetween(-11, -104, 11, -104);

  g.fillStyle(PALETTE.outline, 1);
  g.fillRect(-24, -8, 12, 10);
  g.fillRect(12, -8, 12, 10);
  g.fillStyle(0x75838a, 1);
  g.fillRect(-21, -5, 6, 4);
  g.fillRect(15, -5, 6, 4);
}

function drawMenuBoard(g: Phaser.GameObjects.Graphics): void {
  // Cafe menu board echoes the wood and teal accents used on the facades.
  g.fillStyle(PALETTE.outline, 1);
  g.fillRect(-37, -97, 74, 76);
  g.fillStyle(PALETTE.wood, 1);
  g.fillRect(-32, -92, 64, 66);
  g.fillStyle(PALETTE.butter, 1);
  g.fillRect(-28, -88, 56, 5);
  g.fillStyle(0x21383c, 1);
  g.fillRect(-24, -79, 48, 44);
  g.fillStyle(PALETTE.cream, 0.92);
  g.fillRect(-16, -70, 31, 3);
  g.fillRect(-13, -58, 32, 3);
  g.fillRect(-17, -46, 27, 3);

  g.lineStyle(6, PALETTE.outline, 1);
  g.lineBetween(-28, -23, -38, 0);
  g.lineBetween(28, -23, 38, 0);
  g.lineBetween(-38, 0, 38, 0);
}

function drawElectricShuttle(g: Phaser.GameObjects.Graphics): void {
  // Rear view of the compact electric hotel shuttle commonly seen in resort areas.
  g.fillStyle(PALETTE.outline, 1);
  g.fillRect(-54, -91, 108, 82);
  g.fillStyle(PALETTE.cream, 1);
  g.fillRect(-49, -86, 98, 68);
  g.fillStyle(PALETTE.teal, 1);
  g.fillRect(-42, -80, 84, 23);

  // Canopy and posts.
  g.fillStyle(PALETTE.outline, 1);
  g.fillRect(-52, -108, 104, 9);
  g.fillStyle(PALETTE.stoneLight, 1);
  g.fillRect(-47, -105, 94, 5);
  g.fillStyle(PALETTE.outline, 1);
  g.fillRect(-43, -101, 5, 47);
  g.fillRect(38, -101, 5, 47);

  // Rear bench, bumper and lights.
  g.fillStyle(0x50636a, 1);
  g.fillRect(-36, -50, 72, 21);
  g.fillStyle(PALETTE.outline, 1);
  g.fillRect(-49, -20, 98, 12);
  g.fillStyle(PALETTE.red, 1);
  g.fillRect(-39, -31, 13, 9);
  g.fillRect(26, -31, 13, 9);
  g.fillStyle(PALETTE.amber, 1);
  g.fillRect(-18, -29, 10, 5);
  g.fillRect(8, -29, 10, 5);

  g.fillStyle(PALETTE.outline, 1);
  g.fillRect(-46, -10, 24, 15);
  g.fillRect(22, -10, 24, 15);
  g.fillStyle(0x64767d, 1);
  g.fillRect(-41, -6, 14, 7);
  g.fillRect(27, -6, 14, 7);
}

function drawCafeChairCluster(g: Phaser.GameObjects.Graphics): void {
  // A low cafe table + two woven chairs, condensed to a readable road hazard.
  g.fillStyle(PALETTE.outline, 1);
  g.fillRect(-40, -55, 80, 8);
  g.fillStyle(PALETTE.stoneLight, 1);
  g.fillRect(-35, -59, 70, 8);
  g.fillStyle(PALETTE.woodDark, 1);
  g.fillRect(-4, -49, 8, 45);
  g.fillRect(-25, -7, 50, 7);

  for (const side of [-1, 1] as const) {
    const x = side * 47;
    g.lineStyle(5, PALETTE.woodDark, 1);
    g.strokeRect(x - 16, -72, 32, 42);
    g.lineBetween(x - 13, -30, x - 18, 0);
    g.lineBetween(x + 13, -30, x + 18, 0);
    g.fillStyle(PALETTE.coral, 1);
    g.fillRect(x - 12, -57, 24, 18);
    g.fillStyle(PALETTE.cream, 0.56);
    g.fillRect(x - 8, -53, 5, 10);
    g.fillRect(x + 3, -53, 5, 10);
  }
}

function drawTouristTripod(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(PALETTE.outline, 1);
  g.fillRect(-20, -101, 40, 28);
  g.fillStyle(0x405a65, 1);
  g.fillRect(-15, -96, 30, 18);
  g.fillStyle(PALETTE.sea, 1);
  g.fillRect(-8, -92, 14, 10);
  g.fillStyle(0x9ed6df, 0.8);
  g.fillRect(-5, -90, 5, 5);

  g.lineStyle(5, PALETTE.outline, 1);
  g.lineBetween(0, -73, 0, -51);
  g.lineBetween(0, -51, -32, 0);
  g.lineBetween(0, -51, 32, 0);
  g.lineBetween(0, -51, 3, 0);
}
