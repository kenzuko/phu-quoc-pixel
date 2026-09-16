import Phaser from 'phaser';
import type { CharacterId } from '../core/progress/types';

const OUTLINE = 0x17232a;
const SKIN = 0xe4a16f;
const SKIN_LIGHT = 0xf0b98c;

export function createCharacterPortrait(
  scene: Phaser.Scene,
  id: CharacterId,
  x: number,
  y: number,
  scale = 1
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y).setScale(scale);
  const g = scene.add.graphics();
  container.add(g);

  if (id === 'ridgeback') drawRidgeback(g);
  else if (id === 'pepper') drawPepper(g);
  else drawHuman(g, id);

  return container;
}

function drawHuman(g: Phaser.GameObjects.Graphics, id: Exclude<CharacterId, 'ridgeback' | 'pepper'>): void {
  const palette: Record<typeof id, { shirt: number; accent: number; hair: number }> = {
    traveler: { shirt: 0xf4efe5, accent: 0x77944c, hair: 0x2c2420 },
    explorer: { shirt: 0x2e7c72, accent: 0xfcbc12, hair: 0x3f2d22 },
    uncle: { shirt: 0x467d9a, accent: 0xe8d5a6, hair: 0x252525 },
    grandma: { shirt: 0xa44f73, accent: 0xf0d7b1, hair: 0xd8d3c9 },
    kid: { shirt: 0xf28f3b, accent: 0x2e7792, hair: 0x3b2c27 },
    fisherman: { shirt: 0x6a7c58, accent: 0xcaa56a, hair: 0x8a867f }
  };
  const p = palette[id];

  // Body silhouette.
  g.fillStyle(OUTLINE, 1);
  g.fillRoundedRect(-31, 10, 62, 55, 11);
  g.fillStyle(p.shirt, 1);
  g.fillRoundedRect(-26, 15, 52, 47, 8);
  g.fillStyle(p.accent, 1);
  g.fillRect(-26, 47, 52, 9);

  // Neck and head.
  g.fillStyle(OUTLINE, 1);
  g.fillRect(-10, 2, 20, 18);
  g.fillRoundedRect(-28, -48, 56, 57, 18);
  g.fillStyle(SKIN, 1);
  g.fillRect(-22, -32, 44, 34);
  g.fillStyle(SKIN_LIGHT, 1);
  g.fillRect(-18, -38, 36, 12);

  // Eyes.
  g.fillStyle(0x2b2927, 1);
  g.fillRect(-13, -19, 5, 5);
  g.fillRect(8, -19, 5, 5);

  // Hair base.
  g.fillStyle(p.hair, 1);
  g.fillRect(-22, -42, 44, 10);
  g.fillRect(-26, -34, 8, 21);
  g.fillRect(18, -34, 8, 21);

  if (id === 'traveler') {
    // JoTrip traveler cap and backpack straps.
    g.fillStyle(0x77944c, 1);
    g.fillRect(-25, -50, 50, 11);
    g.fillRect(-17, -58, 34, 10);
    g.fillStyle(0xfcbc12, 1);
    g.fillRect(5, -50, 20, 5);
    g.fillStyle(0x77944c, 1);
    g.fillRect(-23, 20, 6, 30);
    g.fillRect(17, 20, 6, 30);
  }

  if (id === 'explorer') {
    // Bucket hat plus camera.
    g.fillStyle(0xd7ba78, 1);
    g.fillRect(-31, -49, 62, 8);
    g.fillRect(-22, -61, 44, 14);
    g.fillStyle(0x193944, 1);
    g.fillRect(-13, 28, 26, 18);
    g.fillStyle(0x8ed0db, 1);
    g.fillRect(-6, 33, 12, 8);
  }

  if (id === 'uncle') {
    // Neat side hair and moustache.
    g.fillStyle(0x252525, 1);
    g.fillRect(-21, -45, 30, 8);
    g.fillRect(-16, -5, 12, 4);
    g.fillRect(4, -5, 12, 4);
  }

  if (id === 'grandma') {
    // Silver bun and scarf.
    g.fillStyle(0xd8d3c9, 1);
    g.fillCircle(18, -48, 11);
    g.fillStyle(0xf2c25b, 1);
    g.fillRect(-24, 17, 48, 8);
  }

  if (id === 'kid') {
    // Bright cap with short brim.
    g.fillStyle(0x2e7792, 1);
    g.fillRect(-24, -51, 48, 10);
    g.fillRect(-12, -59, 29, 9);
    g.fillStyle(0xfcbc12, 1);
    g.fillRect(14, -49, 18, 5);
  }

  if (id === 'fisherman') {
    // Sun hat and short beard.
    g.fillStyle(0xcaa56a, 1);
    g.fillRect(-34, -52, 68, 8);
    g.fillRect(-24, -65, 48, 15);
    g.fillStyle(0x8a867f, 1);
    g.fillRect(-15, -5, 30, 9);
    g.fillRect(-10, 2, 20, 7);
  }
}

function drawRidgeback(g: Phaser.GameObjects.Graphics): void {
  // Phu Quoc ridgeback dog portrait with standing ears and dark dorsal stripe.
  g.fillStyle(OUTLINE, 1);
  g.fillTriangle(-28, -24, -15, -58, -4, -20);
  g.fillTriangle(28, -24, 15, -58, 4, -20);
  g.fillRoundedRect(-34, -31, 68, 66, 20);
  g.fillStyle(0xb86c37, 1);
  g.fillTriangle(-23, -24, -15, -49, -7, -20);
  g.fillTriangle(23, -24, 15, -49, 7, -20);
  g.fillRoundedRect(-28, -25, 56, 54, 17);
  g.fillStyle(0x5f321f, 1);
  g.fillRect(-4, -24, 8, 52);
  g.fillStyle(0x1e1e1e, 1);
  g.fillRect(-15, -9, 5, 5);
  g.fillRect(10, -9, 5, 5);
  g.fillRoundedRect(-10, 6, 20, 12, 6);
  g.fillStyle(0xe7b07d, 1);
  g.fillRect(-22, 32, 44, 28);
  g.fillStyle(0xfcbc12, 1);
  g.fillRect(-22, 36, 44, 6);
}

function drawPepper(g: Phaser.GameObjects.Graphics): void {
  // Friendly Phu Quoc pepper mascot. It is intentionally botanical rather
  // than another human silhouette so the novelty character reads instantly.
  g.fillStyle(0x315c36, 1);
  g.fillRect(-4, -42, 8, 91);
  g.fillStyle(0x4c8b4d, 1);
  g.fillEllipse(-19, -20, 31, 18);
  g.fillEllipse(19, -5, 31, 18);
  g.fillEllipse(-17, 16, 31, 18);
  g.fillEllipse(17, 31, 31, 18);

  const berries = [
    [-13, -34], [0, -30], [12, -25], [-9, -16], [4, -12], [15, -6],
    [-12, 2], [2, 6], [13, 12], [-9, 20], [5, 24], [12, 34]
  ] as const;
  for (const [x, y] of berries) {
    g.fillStyle(OUTLINE, 1);
    g.fillCircle(x, y, 7);
    g.fillStyle(0x171b16, 1);
    g.fillCircle(x, y, 4);
  }

  g.fillStyle(0xd5a25f, 1);
  g.fillRoundedRect(-27, 45, 54, 22, 5);
  g.fillStyle(0x8d5e34, 1);
  g.fillRect(-18, 50, 36, 7);
}
