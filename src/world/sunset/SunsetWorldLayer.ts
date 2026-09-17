import Phaser from 'phaser';
import { isSunsetAnchorApproved } from './WorldAnchors';

const WIDTH = 540;
const HEIGHT = 960;
const HORIZON = 438;

const PALETTE = {
  outline: 0x172c36,
  deepSea: 0x176a91,
  sea: 0x278db5,
  seaLight: 0x4bb4cc,
  cream: 0xf4ddb0,
  limestone: 0xd8c2a1,
  terracotta: 0x9d493d,
  coral: 0xd86f54,
  apricot: 0xeaa36b,
  butter: 0xf0c67d,
  teal: 0x397b76,
  green: 0x39724b,
  pink: 0xe84e78,
  warmWhite: 0xfff1cc
} as const;

/**
 * Reality-led Sunset Town scenery for the locked rear-chase camera.
 *
 * The scene is intentionally drawn as one coherent pixel postcard rather than
 * independent debug primitives. Every layer shares the same outline weight,
 * highlight direction and warm sunset palette. Real-world landmark relations
 * are controlled by WorldAnchors; unverified cable-car sightlines stay hidden.
 */
export class SunsetWorldLayer {
  private readonly sky: Phaser.GameObjects.Graphics;
  private readonly sea: Phaser.GameObjects.Graphics;
  private readonly landmarks: Phaser.GameObjects.Graphics;
  private readonly town: Phaser.GameObjects.Graphics;
  private readonly roadside: Phaser.GameObjects.Graphics;
  private readonly motion: Phaser.GameObjects.Graphics;
  private phase = 0;

  constructor(scene: Phaser.Scene) {
    this.sky = scene.add.graphics().setDepth(-110);
    this.sea = scene.add.graphics().setDepth(-100);
    this.landmarks = scene.add.graphics().setDepth(-80);
    this.town = scene.add.graphics().setDepth(-65);
    this.roadside = scene.add.graphics().setDepth(-35);
    this.motion = scene.add.graphics().setDepth(-55);

    this.drawSky();
    this.drawSea();
    this.drawLandmarks();
    this.drawTown();
    this.drawRoadside();
    this.redrawMotion();
  }

  update(deltaMs: number, speedFactor: number): void {
    this.phase = (this.phase + (deltaMs / 1000) * Math.max(0.22, speedFactor) * 0.024) % 1;
    this.redrawMotion();
  }

  private drawSky(): void {
    const g = this.sky;
    g.clear();

    const bands = [
      [0, 0x55a4dd],
      [66, 0x68b8e4],
      [132, 0x84cbe8],
      [198, 0xf0c2a1],
      [264, 0xf4aa7d],
      [332, 0xf18a66]
    ] as const;

    for (let i = 0; i < bands.length; i += 1) {
      const [y, color] = bands[i];
      const nextY = i + 1 < bands.length ? bands[i + 1][0] : HORIZON;
      g.fillStyle(color, 1);
      g.fillRect(0, y, WIDTH, nextY - y + 1);
    }

    // Sun sits over the western sea as the main light source for all highlights.
    g.fillStyle(0xffe29a, 0.95);
    g.fillCircle(402, 238, 28);
    g.fillStyle(0xfff2c5, 0.72);
    g.fillCircle(402, 238, 15);

    this.cloud(g, 46, 100, 1.05, 0xf7eadc, 0.82);
    this.cloud(g, 282, 91, 0.9, 0xffe1cb, 0.78);
    this.cloud(g, 375, 164, 0.67, 0xffd0bb, 0.7);
    this.cloud(g, 128, 210, 0.54, 0xffdcc9, 0.68);

    // Deterministic 2-4 px dither ties the broad color bands together and gives
    // the rich pixel-postcard finish of the approved visual lock.
    for (let y = 42; y < 330; y += 19) {
      for (let x = 17 + ((y / 19) % 3) * 7; x < WIDTH; x += 31) {
        const warm = y > 175;
        g.fillStyle(warm ? 0xffd7b9 : 0xdff2f5, warm ? 0.16 : 0.13);
        g.fillRect(x, y, (x + y) % 2 === 0 ? 4 : 2, 2);
      }
    }
  }

  private drawSea(): void {
    const g = this.sea;
    g.clear();

    // Distant offshore silhouettes stay low so the bay and bridge remain readable.
    g.fillStyle(0x596f82, 0.52);
    g.fillTriangle(-18, 334, 72, 305, 170, 334);
    g.fillTriangle(420, 334, 473, 307, 558, 334);

    g.fillStyle(PALETTE.seaLight, 1);
    g.fillRect(0, 326, WIDTH, 40);
    g.fillStyle(PALETTE.sea, 1);
    g.fillRect(0, 366, WIDTH, 42);
    g.fillStyle(PALETTE.deepSea, 1);
    g.fillRect(0, 408, WIDTH, 30);

    // Sunset reflection is blocky and irregular, not a smooth vector gradient.
    for (let i = 0; i < 12; i += 1) {
      const y = 328 + i * 8;
      const w = 8 + i * 7;
      const offset = ((i * 13) % 17) - 8;
      g.fillStyle(i % 3 === 0 ? 0xffd578 : 0xffefb2, 0.34 - i * 0.012);
      g.fillRect(402 - w / 2 + offset, y, w, i < 4 ? 3 : 2);
    }

    // Repeating short wave pixels unify the water mass.
    for (let row = 0; row < 6; row += 1) {
      const y = 347 + row * 14;
      for (let col = 0; col < 10; col += 1) {
        const x = 20 + col * 57 + (row % 2) * 19;
        g.fillStyle(0xd7f2ef, 0.18 + (col % 3) * 0.03);
        g.fillRect(x, y, 10 + ((row + col) % 3) * 4, 2);
      }
    }

    this.fishingBoat(g, 88, 371, 0.74);
    this.fishingBoat(g, 468, 353, 0.58);
    this.sailboat(g, 257, 395, 0.46);
  }

  private drawLandmarks(): void {
    const g = this.landmarks;
    g.clear();

    if (isSunsetAnchorApproved('kiss-bridge')) this.drawKissBridge(g);
    if (isSunsetAnchorApproved('central-village-clock-tower')) this.drawClockTower(g, 202, 439, 0.78);

    // Cable-car art is deliberately absent unless the anchor itself is approved.
    // The station is real, but an unverified gameplay sightline is not.
  }

  private drawTown(): void {
    const g = this.town;
    g.clear();

    // Layered hillside massing behind the playable street. Small stepped blocks
    // create the dense Sunset Town postcard feel without competing with hazards.
    const terraces = [
      [8, 353, 42, 62, PALETTE.coral, 0.64],
      [48, 369, 36, 48, PALETTE.butter, 0.61],
      [84, 341, 46, 78, PALETTE.apricot, 0.68],
      [128, 365, 42, 55, PALETTE.cream, 0.62],
      [169, 347, 44, 75, PALETTE.coral, 0.66],
      [213, 374, 38, 49, PALETTE.butter, 0.6],
      [252, 360, 42, 63, PALETTE.apricot, 0.63],
      [296, 379, 34, 44, PALETTE.cream, 0.6],
      [333, 364, 41, 60, PALETTE.coral, 0.63],
      [375, 382, 34, 42, PALETTE.butter, 0.59],
      [447, 375, 39, 50, PALETTE.apricot, 0.62],
      [485, 355, 52, 70, PALETTE.cream, 0.66]
    ] as const;

    for (const [x, y, w, h, color, detailScale] of terraces) {
      this.facade(g, x, y, w, h, color, detailScale, false);
    }

    // Near architecture frames the road like the approved key art. Facades use
    // the same outline, sun-side highlight, balconies and awnings so they read
    // as one town rather than separate rectangles.
    this.facade(g, -34, 424, 108, 172, PALETTE.coral, 1.02, true);
    this.facade(g, 20, 468, 102, 188, PALETTE.butter, 1.05, true);
    this.facade(g, -28, 592, 138, 238, PALETTE.apricot, 1.12, true);

    this.facade(g, 462, 443, 98, 158, PALETTE.cream, 1.01, true);
    this.facade(g, 482, 566, 102, 224, PALETTE.coral, 1.1, true);

    this.palm(g, 124, 449, 0.66);
    this.palm(g, 456, 463, 0.6);
    this.palm(g, 102, 561, 0.9);
    this.palm(g, 470, 615, 0.96);
  }

  private drawRoadside(): void {
    const g = this.roadside;
    g.clear();

    // Promenade stone shoulders fade into the projected road. Warm shadow on the
    // camera side and a thin sun highlight keep them dimensional.
    g.fillStyle(0xa58d74, 1);
    g.fillTriangle(0, HORIZON + 10, 88, HORIZON + 18, 150, HEIGHT);
    g.fillTriangle(WIDTH, HORIZON + 10, 452, HORIZON + 18, 390, HEIGHT);

    g.lineStyle(3, 0xe8d6b8, 0.74);
    g.lineBetween(89, HORIZON + 18, 150, HEIGHT);
    g.lineBetween(451, HORIZON + 18, 390, HEIGHT);

    for (let y = 482; y < HEIGHT; y += 45) {
      const t = (y - HORIZON) / (HEIGHT - HORIZON);
      const inset = Phaser.Math.Linear(84, 0, t);
      const span = 58 + t * 42;
      g.lineStyle(Math.max(1, 1 + t * 2), 0xd7bea0, 0.55);
      g.lineBetween(inset, y, Math.min(151, inset + span), y + 6 + t * 5);
      g.lineBetween(WIDTH - inset, y, Math.max(389, WIDTH - inset - span), y + 6 + t * 5);
    }

    this.bougainvillea(g, 82, 705, 1.18);
    this.bougainvillea(g, 458, 746, 1.22);
    this.bougainvillea(g, 44, 847, 1.4);
    this.bougainvillea(g, 503, 868, 1.34);

    this.lamp(g, 130, 598, 0.76);
    this.lamp(g, 430, 633, 0.84);
  }

  private redrawMotion(): void {
    const g = this.motion;
    g.clear();

    // Only verified world anchors may animate into the scene.
    if (isSunsetAnchorApproved('an-thoi-cable-car-station')) {
      const y0 = 246;
      const y1 = 314;
      g.lineStyle(2, PALETTE.outline, 0.72);
      g.lineBetween(-18, y0, WIDTH + 18, y1);
      g.lineBetween(-18, y0 + 6, WIDTH + 18, y1 + 6);
      for (let i = 0; i < 4; i += 1) {
        const t = (this.phase + i * 0.27) % 1;
        this.cableCabin(g, Phaser.Math.Linear(-14, WIDTH + 14, t), Phaser.Math.Linear(y0, y1, t) + 7, Phaser.Math.Linear(0.66, 1, t));
      }
    }

    g.lineStyle(2, PALETTE.warmWhite, 0.3);
    for (let i = 0; i < 8; i += 1) {
      const t = (this.phase * 1.5 + i * 0.139) % 1;
      const y = 347 + i * 9;
      const x = 220 + t * 246;
      g.lineBetween(x, y, x + 13 + i * 2, y);
    }
  }

  private drawKissBridge(g: Phaser.GameObjects.Graphics): void {
    // Reality-led cue: a low sweeping offshore bridge with two branches and a
    // visible central separation. It never becomes the player road.
    const leftBranch = [
      [286, 372], [305, 364], [326, 357], [348, 352], [369, 349]
    ] as const;
    const rightBranch = [
      [380, 349], [408, 351], [438, 357], [470, 367], [512, 382]
    ] as const;

    // Kiss of the Sea arena / circular waterfront cue near the bridge root.
    g.lineStyle(7, 0xe4ddd0, 0.95);
    g.strokeEllipse(279, 375, 62, 31);
    g.lineStyle(3, 0x8e7368, 0.75);
    g.strokeEllipse(279, 375, 48, 21);

    g.lineStyle(8, 0x776a63, 1);
    for (let i = 0; i < leftBranch.length - 1; i += 1) {
      g.lineBetween(leftBranch[i][0], leftBranch[i][1], leftBranch[i + 1][0], leftBranch[i + 1][1]);
    }
    for (let i = 0; i < rightBranch.length - 1; i += 1) {
      g.lineBetween(rightBranch[i][0], rightBranch[i][1], rightBranch[i + 1][0], rightBranch[i + 1][1]);
    }

    g.lineStyle(2, 0xf0d7c2, 0.86);
    for (let i = 0; i < leftBranch.length - 1; i += 1) {
      g.lineBetween(leftBranch[i][0], leftBranch[i][1] - 4, leftBranch[i + 1][0], leftBranch[i + 1][1] - 4);
    }
    for (let i = 0; i < rightBranch.length - 1; i += 1) {
      g.lineBetween(rightBranch[i][0], rightBranch[i][1] - 4, rightBranch[i + 1][0], rightBranch[i + 1][1] - 4);
    }

    // Deliberate gap between the two tips.
    g.fillStyle(0xffd78c, 0.6);
    g.fillRect(372, 346, 5, 2);

    // Sparse pylons keep the bridge hovering over water instead of reading as a road.
    g.lineStyle(3, 0x5f5855, 0.9);
    g.lineBetween(309, 364, 307, 397);
    g.lineBetween(448, 360, 453, 398);
    g.lineBetween(496, 376, 504, 410);
  }

  private drawClockTower(g: Phaser.GameObjects.Graphics, x: number, baseY: number, scale: number): void {
    const w = 54 * scale;
    const h = 158 * scale;

    // Dark camera-side edge and sunlit western edge make the tower feel embedded
    // in the same late-afternoon lighting as the town.
    g.fillStyle(PALETTE.outline, 0.78);
    g.fillRect(x - w / 2 - 4 * scale, baseY - h + 4 * scale, w + 8 * scale, h + 4 * scale);
    g.fillStyle(0xad5445, 1);
    g.fillRect(x - w / 2, baseY - h, w, h);
    g.fillStyle(0xd57b59, 1);
    g.fillRect(x - w / 2 + 7 * scale, baseY - h + 5 * scale, w - 14 * scale, h - 8 * scale);
    g.fillStyle(0xf0ad73, 0.52);
    g.fillRect(x - w / 2 + 7 * scale, baseY - h + 5 * scale, 5 * scale, h - 10 * scale);

    g.fillStyle(PALETTE.cream, 1);
    g.fillRect(x - 23 * scale, baseY - h - 30 * scale, 46 * scale, 33 * scale);
    g.lineStyle(Math.max(1, 3 * scale), PALETTE.outline, 0.9);
    g.strokeRect(x - 23 * scale, baseY - h - 30 * scale, 46 * scale, 33 * scale);

    g.fillStyle(PALETTE.outline, 1);
    g.fillCircle(x, baseY - h - 14 * scale, 12 * scale);
    g.fillStyle(0xf8edd0, 1);
    g.fillCircle(x, baseY - h - 14 * scale, 9 * scale);
    g.lineStyle(Math.max(1, 2 * scale), 0x4a4b49, 1);
    g.lineBetween(x, baseY - h - 14 * scale, x + 5 * scale, baseY - h - 20 * scale);
    g.lineBetween(x, baseY - h - 14 * scale, x, baseY - h - 7 * scale);

    g.fillStyle(PALETTE.teal, 1);
    g.fillTriangle(x - 28 * scale, baseY - h - 30 * scale, x + 28 * scale, baseY - h - 30 * scale, x, baseY - h - 72 * scale);
    g.fillStyle(0xd9af62, 1);
    g.fillRect(x - 2 * scale, baseY - h - 81 * scale, 4 * scale, 10 * scale);

    g.fillStyle(0x62433b, 0.9);
    for (let i = 0; i < 4; i += 1) {
      const y = baseY - h + 22 * scale + i * 29 * scale;
      g.fillRect(x - 6 * scale, y, 12 * scale, 17 * scale);
      g.fillStyle(0xf0bd7b, 0.42);
      g.fillRect(x - 4 * scale, y + 2 * scale, 3 * scale, 13 * scale);
      g.fillStyle(0x62433b, 0.9);
    }
  }

  private facade(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    color: number,
    detailScale: number,
    richDetail: boolean
  ): void {
    const outline = Math.max(2, Math.round(3 * detailScale));

    g.fillStyle(PALETTE.outline, 0.62);
    g.fillRect(x - outline, y + outline, w + outline * 2, h);
    g.fillStyle(color, 1);
    g.fillRect(x, y, w, h);

    // Warm left highlight follows the western sunset source.
    g.fillStyle(0xffe1aa, richDetail ? 0.18 : 0.11);
    g.fillRect(x + 3, y + 3, Math.max(3, 7 * detailScale), h - 6);

    // Terracotta roof and cream cornice are repeated across all buildings.
    g.fillStyle(PALETTE.terracotta, 1);
    g.fillTriangle(x - 3, y + 2, x + w / 2, y - 20 * detailScale, x + w + 3, y + 2);
    g.fillStyle(PALETTE.cream, 0.96);
    g.fillRect(x, y + 13 * detailScale, w, Math.max(3, 5 * detailScale));

    const columns = Math.max(2, Math.floor(w / (24 * detailScale)));
    const rows = Math.max(2, Math.floor(h / (41 * detailScale)));
    const cellW = w / columns;
    const cellH = h / rows;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        const wx = x + col * cellW + cellW * 0.27;
        const wy = y + row * cellH + cellH * 0.36;
        const ww = Math.max(4, cellW * 0.43);
        const wh = Math.max(7, cellH * 0.38);

        g.fillStyle(PALETTE.outline, 0.82);
        g.fillRect(wx - 2, wy - 2, ww + 4, wh + 4);
        g.fillStyle(0x315867, 0.96);
        g.fillRect(wx, wy, ww, wh);
        g.fillStyle(0xf6c77e, 0.58);
        g.fillRect(wx + 2, wy + 2, Math.max(1, ww - 4), 2);

        if (richDetail && row < rows - 1) {
          g.fillStyle(0x263c43, 0.9);
          g.fillRect(wx - 4, wy + wh + 4, ww + 8, 3);
          g.lineStyle(Math.max(1, 2 * detailScale), PALETTE.outline, 0.72);
          g.lineBetween(wx - 2, wy + wh + 4, wx - 2, wy + wh + 10 * detailScale);
          g.lineBetween(wx + ww + 2, wy + wh + 4, wx + ww + 2, wy + wh + 10 * detailScale);
        }
      }
    }

    if (richDetail) {
      // Ground-floor awning and a small bougainvillea spill remove the boxy look.
      g.fillStyle(0x2d7075, 1);
      g.fillRect(x + w * 0.14, y + h - 31 * detailScale, w * 0.58, 8 * detailScale);
      g.fillStyle(0xf0e0ba, 0.92);
      for (let i = 0; i < 4; i += 1) {
        g.fillRect(x + w * 0.14 + i * (w * 0.58 / 4), y + h - 31 * detailScale, w * 0.58 / 8, 8 * detailScale);
      }
      this.bougainvillea(g, x + w * 0.83, y + h * 0.2, 0.34 * detailScale);
    }
  }

  private cloud(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number, color: number, alpha: number): void {
    g.fillStyle(color, alpha);
    const blocks = [
      [0, 10, 48, 12],
      [13, 0, 34, 16],
      [31, 5, 42, 17],
      [56, 11, 30, 10]
    ] as const;
    for (const [bx, by, bw, bh] of blocks) g.fillRect(x + bx * scale, y + by * scale, bw * scale, bh * scale);
  }

  private palm(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.lineStyle(Math.max(3, 6 * scale), 0x7f5739, 1);
    g.lineBetween(x, y, x + 5 * scale, y - 63 * scale);
    const topX = x + 5 * scale;
    const topY = y - 63 * scale;
    g.lineStyle(Math.max(2, 5 * scale), PALETTE.green, 1);
    for (const [dx, dy] of [[-32, 4], [-24, -12], [-8, -21], [13, -20], [28, -8], [34, 7], [8, 15]] as const) {
      g.lineBetween(topX, topY, topX + dx * scale, topY + dy * scale);
    }
    g.fillStyle(0x805337, 1);
    g.fillCircle(topX - 3 * scale, topY + 5 * scale, 4 * scale);
    g.fillCircle(topX + 4 * scale, topY + 5 * scale, 4 * scale);
  }

  private bougainvillea(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.fillStyle(PALETTE.green, 1);
    g.fillCircle(x, y, 24 * scale);
    g.fillCircle(x - 18 * scale, y + 8 * scale, 17 * scale);
    g.fillCircle(x + 19 * scale, y + 6 * scale, 18 * scale);

    const flowers = [
      [-18, -5], [-8, 8], [4, -12], [15, 4], [22, -7], [-23, 12], [1, 13], [11, -20], [-3, -2], [19, 14]
    ] as const;
    for (const [dx, dy] of flowers) {
      g.fillStyle((Math.abs(dx + dy) % 3) === 0 ? 0xf09654 : PALETTE.pink, 1);
      const size = Math.max(2, 4.5 * scale);
      g.fillRect(x + dx * scale - size / 2, y + dy * scale - size / 2, size, size);
    }
  }

  private lamp(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.lineStyle(Math.max(2, 4 * scale), PALETTE.outline, 1);
    g.lineBetween(x, y, x, y - 80 * scale);
    g.lineBetween(x, y - 80 * scale, x + 17 * scale, y - 80 * scale);
    g.fillStyle(0xffd77a, 0.95);
    g.fillRect(x + 12 * scale, y - 84 * scale, 12 * scale, 13 * scale);
    g.lineStyle(Math.max(1, 2 * scale), 0xf5e1a5, 0.8);
    g.strokeRect(x + 10 * scale, y - 86 * scale, 16 * scale, 17 * scale);
  }

  private cableCabin(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.lineStyle(Math.max(1, 2 * scale), PALETTE.outline, 1);
    g.lineBetween(x, y - 8 * scale, x, y - 2 * scale);
    g.fillStyle(0x9c3134, 1);
    g.fillRect(x - 7 * scale, y - 2 * scale, 14 * scale, 10 * scale);
    g.fillStyle(0xf0b64e, 0.96);
    g.fillRect(x - 4 * scale, y, 8 * scale, 4 * scale);
  }

  private fishingBoat(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.fillStyle(0x6f4b3f, 0.9);
    g.fillRect(x - 11 * scale, y, 22 * scale, 4 * scale);
    g.fillStyle(0xf4e1b9, 0.9);
    g.fillRect(x - 2 * scale, y - 10 * scale, 7 * scale, 10 * scale);
    g.lineStyle(Math.max(1, scale), PALETTE.outline, 0.7);
    g.lineBetween(x + 2 * scale, y - 10 * scale, x + 2 * scale, y - 20 * scale);
  }

  private sailboat(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.fillStyle(0xf7f0dc, 0.92);
    g.fillTriangle(x, y - 19 * scale, x, y, x + 10 * scale, y);
    g.fillStyle(0xe6d2ba, 0.88);
    g.fillRect(x - 6 * scale, y, 18 * scale, 3 * scale);
  }
}
