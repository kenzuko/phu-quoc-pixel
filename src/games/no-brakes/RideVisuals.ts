import Phaser from 'phaser';

export type ObstacleKind =
  | 'large-planter'
  | 'rolling-suitcase'
  | 'menu-board'
  | 'bougainvillea-planter'
  | 'hotel-cart'
  | 'market-crates';

const OUTLINE = 0x17232a;

export interface ObstacleVisual {
  container: Phaser.GameObjects.Container;
  setKind: (kind: ObstacleKind) => void;
}

/**
 * Rear-chase Traveler from the product owner's approved gameplay reference.
 * The source was isolated into a transparent runtime texture so the player now
 * reads from behind in the same camera language as the approved composition.
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
  const planter = scene.add
    .image(0, 10, 'no-brakes-planter')
    .setOrigin(0.5, 1)
    .setScale(1.28)
    .setVisible(false);

  container.add([g, planter]);

  const setKind = (kind: ObstacleKind): void => {
    g.clear();

    // Compatibility aliases keep the current gameplay sequence stable while
    // the visible art follows the approved Task 02 obstacle family.
    const visualKind =
      kind === 'bougainvillea-planter'
        ? 'large-planter'
        : kind === 'hotel-cart'
          ? 'rolling-suitcase'
          : kind === 'market-crates'
            ? 'menu-board'
            : kind;

    planter.setVisible(visualKind === 'large-planter');
    if (visualKind === 'rolling-suitcase') drawRollingSuitcase(g);
    if (visualKind === 'menu-board') drawMenuBoard(g);
  };

  setKind('large-planter');
  return { container, setKind };
}

function drawRollingSuitcase(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(5, OUTLINE, 1);
  g.strokeRoundedRect(-31, -79, 62, 77, 9);
  g.fillStyle(0xb87442, 1);
  g.fillRoundedRect(-26, -74, 52, 66, 7);
  g.fillStyle(0xe3a05c, 1);
  g.fillRect(-19, -63, 38, 6);
  g.fillRect(-19, -47, 38, 5);
  g.fillRect(-19, -31, 38, 5);
  g.lineStyle(5, OUTLINE, 1);
  g.lineBetween(-11, -79, -11, -103);
  g.lineBetween(11, -79, 11, -103);
  g.lineBetween(-11, -103, 11, -103);
  g.fillStyle(OUTLINE, 1);
  g.fillCircle(-19, 1, 7);
  g.fillCircle(19, 1, 7);
  g.fillStyle(0x69757b, 1);
  g.fillCircle(-19, 1, 3);
  g.fillCircle(19, 1, 3);
}

function drawMenuBoard(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(6, OUTLINE, 1);
  g.lineBetween(-34, -5, -22, -92);
  g.lineBetween(34, -5, 22, -92);
  g.lineBetween(-34, -5, 34, -5);
  g.fillStyle(0x7c4b31, 1);
  g.fillRoundedRect(-34, -94, 68, 70, 5);
  g.lineStyle(4, 0xe0b36c, 1);
  g.strokeRoundedRect(-29, -89, 58, 60, 3);
  g.fillStyle(0x21383c, 1);
  g.fillRoundedRect(-24, -84, 48, 49, 2);
  g.lineStyle(3, 0xf2dfb4, 0.92);
  g.lineBetween(-16, -71, 15, -71);
  g.lineBetween(-13, -59, 18, -59);
  g.lineBetween(-17, -47, 10, -47);
}
