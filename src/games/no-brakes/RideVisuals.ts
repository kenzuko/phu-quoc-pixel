import Phaser from 'phaser';

export type ObstacleKind = 'bougainvillea-planter' | 'hotel-cart' | 'market-crates';

const OUTLINE = 0x17232a;

export interface ObstacleVisual {
  container: Phaser.GameObjects.Container;
  setKind: (kind: ObstacleKind) => void;
}

/**
 * Use the approved migrated rider sprite instead of rebuilding the rider from
 * rectangles. The container contract stays the same, so movement/jump/lane
 * logic in NoBrakesScene does not need to know how the art is produced.
 */
export function createRiderVisual(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);

  const rider = scene.add
    .image(0, 3, 'no-brakes-ride-01')
    .setOrigin(0.5, 1)
    .setScale(1.58)
    .setName('rider-sprite');

  container.add(rider);
  return container;
}

export function createObstacleVisual(scene: Phaser.Scene): ObstacleVisual {
  const container = scene.add.container(270, 500).setVisible(false);
  const g = scene.add.graphics();
  const planter = scene.add
    .image(0, 10, 'no-brakes-planter')
    .setOrigin(0.5, 1)
    .setScale(1.2)
    .setVisible(false);

  container.add([g, planter]);

  const setKind = (kind: ObstacleKind): void => {
    g.clear();
    planter.setVisible(kind === 'bougainvillea-planter');

    if (kind === 'hotel-cart') drawHotelCart(g);
    if (kind === 'market-crates') drawMarketCrates(g);
  };

  setKind('bougainvillea-planter');
  return { container, setKind };
}

function drawHotelCart(g: Phaser.GameObjects.Graphics): void {
  // Tourism-town luggage trolley. This remains a drawn fallback until a final
  // approved sprite exists, but unlike the old debug proxy it reads as a real
  // object at gameplay scale.
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
