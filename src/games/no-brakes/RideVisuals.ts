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
 * Rear-chase Traveler visual locked to the approved No Brakes camera direction.
 *
 * The old migrated rider sprite is a side view and breaks the chase-camera
 * illusion. Until a clean transparent rear-view sprite sheet is exported from
 * the approved art direction, this runtime pixel construction keeps the camera,
 * silhouette, JoTrip backpack and scooter orientation correct without cropping
 * a review-sheet poster and pretending it is a production sprite.
 */
export function createRiderVisual(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const g = scene.add.graphics().setName('rear-rider-v1');

  // Ground-contact rear wheel.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-13, -30, 26, 34, 8);
  g.fillStyle(0x31383d, 1);
  g.fillRoundedRect(-7, -27, 14, 28, 5);

  // Scooter rear body and mudguard - warm red, matching approved chase reference.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-31, -58, 62, 37, 12);
  g.fillStyle(0xd94e35, 1);
  g.fillRoundedRect(-27, -55, 54, 30, 10);
  g.fillStyle(0xf36a3d, 1);
  g.fillRoundedRect(-21, -50, 42, 19, 8);

  // Rear light and indicators.
  g.fillStyle(0xffd84d, 1);
  g.fillRect(-27, -48, 6, 7);
  g.fillRect(21, -48, 6, 7);
  g.fillStyle(0xff3d31, 1);
  g.fillRoundedRect(-8, -52, 16, 9, 3);

  // License plate cue.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-15, -34, 30, 15, 3);
  g.fillStyle(0xf7f0d9, 1);
  g.fillRoundedRect(-12, -32, 24, 10, 2);
  g.fillStyle(0x20343b, 1);
  g.fillRect(-7, -29, 4, 4);
  g.fillRect(-1, -29, 4, 4);
  g.fillRect(5, -29, 4, 4);

  // Rider legs around the seat.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-28, -78, 20, 37, 7);
  g.fillRoundedRect(8, -78, 20, 37, 7);
  g.fillStyle(0x2f6f98, 1);
  g.fillRoundedRect(-24, -75, 15, 31, 5);
  g.fillRoundedRect(9, -75, 15, 31, 5);

  // Shoes / footrests.
  g.fillStyle(0xf0e7d3, 1);
  g.fillRoundedRect(-31, -49, 17, 8, 3);
  g.fillRoundedRect(14, -49, 17, 8, 3);

  // White shirt shoulders and arms reaching handlebars.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-43, -112, 22, 18, 7);
  g.fillRoundedRect(21, -112, 22, 18, 7);
  g.fillStyle(0xf2efe5, 1);
  g.fillRoundedRect(-39, -108, 17, 12, 5);
  g.fillRoundedRect(22, -108, 17, 12, 5);
  g.lineStyle(6, OUTLINE, 1);
  g.lineBetween(-31, -99, -42, -88);
  g.lineBetween(31, -99, 42, -88);
  g.lineStyle(4, 0xe4b285, 1);
  g.lineBetween(-31, -99, -41, -89);
  g.lineBetween(31, -99, 41, -89);

  // Handlebars.
  g.lineStyle(5, OUTLINE, 1);
  g.lineBetween(-43, -89, 43, -89);
  g.fillStyle(0x28343a, 1);
  g.fillRoundedRect(-49, -93, 15, 7, 3);
  g.fillRoundedRect(34, -93, 15, 7, 3);

  // Torso + JoTrip backpack, the strongest character read from the rear.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-29, -135, 58, 52, 12);
  g.fillStyle(0xf4f0e6, 1);
  g.fillRoundedRect(-25, -131, 50, 43, 10);
  g.fillStyle(0x157c7a, 1);
  g.fillRoundedRect(-25, -126, 50, 45, 10);
  g.fillStyle(0x0b585b, 1);
  g.fillRoundedRect(-20, -117, 40, 30, 7);
  g.lineStyle(3, 0x63cbc2, 0.85);
  g.strokeRoundedRect(-20, -117, 40, 30, 7);

  // Small JoTrip wordmark cue. Keep it compact at gameplay scale.
  const bagText = scene.add
    .text(0, -101, 'JoTrip', {
      fontFamily: 'monospace',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#06494b',
      strokeThickness: 2
    })
    .setOrigin(0.5);

  // Helmet behind-view: white shell, warm stripe and tiny Phu Quoc palm mark.
  g.fillStyle(OUTLINE, 1);
  g.fillCircle(0, -151, 27);
  g.fillStyle(0xf2efe2, 1);
  g.fillCircle(0, -151, 23);
  g.fillStyle(0xe8b04b, 1);
  g.fillTriangle(-5, -174, 7, -174, 16, -139);
  g.fillStyle(0x2a7982, 1);
  g.fillRect(-18, -155, 36, 5);
  g.fillStyle(0x2f8c55, 1);
  g.fillRect(12, -166, 3, 11);
  g.fillRect(8, -163, 11, 3);
  g.fillStyle(0xe45246, 1);
  g.fillRect(15, -164, 4, 4);

  // A little exhaust / rear suspension detail makes the silhouette less flat.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(22, -28, 18, 7, 3);
  g.fillStyle(0x7b8587, 1);
  g.fillRoundedRect(25, -26, 13, 4, 2);

  container.add([g, bagText]);
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

    // Old gameplay ids are accepted only as compatibility aliases. The visuals
    // shown to players now come from the approved Task 02 obstacle family.
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
  // Approved Task 02 obstacle family: rolling suitcase.
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
  // Approved Task 02 obstacle family: cafe menu board.
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
