import Phaser from 'phaser';

export type ObstacleKind = 'bougainvillea-planter' | 'hotel-cart' | 'market-crates';

const OUTLINE = 0x17232a;

export interface ObstacleVisual {
  container: Phaser.GameObjects.Container;
  setKind: (kind: ObstacleKind) => void;
}

export function createRiderVisual(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const g = scene.add.graphics();

  // Rear wheel and lower scooter body.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-18, -26, 36, 42, 8);
  g.fillStyle(0x313943, 1);
  g.fillRoundedRect(-12, -22, 24, 34, 6);

  // Scooter silhouette with a warm Phu Quoc sunset red.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-42, -78, 84, 66, 12);
  g.fillStyle(0xd94e37, 1);
  g.fillRoundedRect(-36, -72, 72, 54, 9);
  g.fillStyle(0xf06443, 1);
  g.fillRect(-29, -69, 58, 11);

  // Rear light and plate.
  g.fillStyle(0xffc33c, 1);
  g.fillRect(-12, -50, 24, 12);
  g.fillStyle(0xf5f0dc, 1);
  g.fillRect(-17, -31, 34, 12);
  g.fillStyle(0x294550, 1);
  g.fillRect(-11, -27, 22, 4);

  // Rider torso.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-34, -142, 68, 72, 10);
  g.fillStyle(0xf6f0df, 1);
  g.fillRoundedRect(-28, -137, 56, 62, 8);

  // JoTrip backpack - parent brand green/yellow accents.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-27, -132, 54, 52, 8);
  g.fillStyle(0x77944c, 1);
  g.fillRoundedRect(-22, -127, 44, 42, 6);
  g.fillStyle(0xfcbc12, 1);
  g.fillRect(-22, -100, 44, 8);
  g.fillStyle(0xfaf4e2, 1);
  g.fillRect(-7, -119, 14, 5);
  g.fillRect(-7, -111, 14, 5);

  // Arms and handlebar.
  g.lineStyle(10, OUTLINE, 1);
  g.lineBetween(-27, -124, -49, -105);
  g.lineBetween(27, -124, 49, -105);
  g.lineStyle(6, 0xf6f0df, 1);
  g.lineBetween(-27, -122, -47, -105);
  g.lineBetween(27, -122, 47, -105);
  g.lineStyle(5, OUTLINE, 1);
  g.lineBetween(-49, -105, 49, -105);

  // Mirrors.
  g.fillStyle(OUTLINE, 1);
  g.fillCircle(-52, -116, 9);
  g.fillCircle(52, -116, 9);
  g.fillStyle(0xa9dce3, 1);
  g.fillCircle(-52, -116, 5);
  g.fillCircle(52, -116, 5);

  // Helmet.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-32, -190, 64, 55, 20);
  g.fillStyle(0xf5efe1, 1);
  g.fillRoundedRect(-27, -185, 54, 44, 17);
  g.fillStyle(0x1f6572, 1);
  g.fillRect(-6, -184, 12, 42);
  g.fillStyle(0x8fcfd8, 1);
  g.fillRect(-20, -165, 40, 9);

  // Pixel highlights - deliberately blocky rather than smooth vector gloss.
  g.fillStyle(0xffffff, 0.58);
  g.fillRect(-28, -66, 13, 6);
  g.fillRect(-20, -178, 11, 5);

  container.add(g);
  return container;
}

export function createObstacleVisual(scene: Phaser.Scene): ObstacleVisual {
  const container = scene.add.container(270, 500).setVisible(false);
  const g = scene.add.graphics();
  container.add(g);

  const setKind = (kind: ObstacleKind): void => {
    g.clear();
    if (kind === 'bougainvillea-planter') drawPlanter(g);
    if (kind === 'hotel-cart') drawHotelCart(g);
    if (kind === 'market-crates') drawMarketCrates(g);
  };

  setKind('bougainvillea-planter');
  return { container, setKind };
}

function drawPlanter(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-59, -28, 118, 68, 7);
  g.fillStyle(0xd7a36f, 1);
  g.fillRoundedRect(-53, -22, 106, 56, 5);
  g.fillStyle(0xf0d4aa, 1);
  g.fillRect(-42, -8, 84, 25);
  g.fillStyle(0x8b5a39, 1);
  g.fillRect(-32, 21, 64, 6);

  const leaves = [
    [-42, -35], [-24, -44], [-5, -37], [13, -45], [31, -35], [45, -43]
  ];
  for (const [x, y] of leaves) {
    g.fillStyle(0x3f7f4d, 1);
    g.fillCircle(x, y, 14);
    g.fillStyle(0xd63c80, 1);
    g.fillRect(x - 7, y - 9, 13, 12);
    g.fillStyle(0xf26aa2, 1);
    g.fillRect(x + 2, y - 14, 8, 8);
  }
}

function drawHotelCart(g: Phaser.GameObjects.Graphics): void {
  // A small luggage trolley that belongs in a tourism town, not a generic spike.
  g.lineStyle(8, OUTLINE, 1);
  g.strokeRoundedRect(-45, -70, 90, 102, 14);
  g.lineStyle(5, 0xc9a56a, 1);
  g.strokeRoundedRect(-39, -64, 78, 90, 11);
  g.fillStyle(0x7a4d34, 1);
  g.fillRect(-31, -15, 62, 37);
  g.fillStyle(0x2c6c79, 1);
  g.fillRect(-25, -43, 34, 28);
  g.fillStyle(0xe3a83d, 1);
  g.fillRect(9, -35, 21, 20);
  g.fillStyle(OUTLINE, 1);
  g.fillCircle(-28, 34, 11);
  g.fillCircle(28, 34, 11);
  g.fillStyle(0x6e7e84, 1);
  g.fillCircle(-28, 34, 5);
  g.fillCircle(28, 34, 5);
}

function drawMarketCrates(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(OUTLINE, 1);
  g.fillRect(-58, -25, 116, 65);
  g.fillStyle(0xb87442, 1);
  g.fillRect(-51, -18, 50, 51);
  g.fillRect(5, -18, 46, 51);
  g.fillStyle(0xe0a05d, 1);
  for (const x of [-42, -25, -8, 14, 31]) g.fillRect(x, -12, 7, 39);
  g.fillStyle(0x4f8c51, 1);
  g.fillCircle(-35, -34, 15);
  g.fillCircle(-8, -37, 17);
  g.fillCircle(20, -35, 15);
  g.fillStyle(0xe3b52f, 1);
  g.fillCircle(44, -31, 13);
}
