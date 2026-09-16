import Phaser from 'phaser';

const WIDTH = 540;
const HEIGHT = 960;
const HORIZON = 438;

/**
 * Sunset Town world built as independent depth layers for the rear-chase camera.
 *
 * The previous implementation stretched one approved reference image behind the
 * projected road. That preserved artwork but made the street look pasted onto a
 * poster. This layer keeps the locked Sunset Town visual language while drawing
 * the scene around the same vanishing point as gameplay: sunset sea, cable-car
 * line, Kiss Bridge, Clock Tower, Mediterranean facades, palms, stone promenade
 * and bougainvillea all sit behind the playable road instead of inside it.
 *
 * Gameplay/collision remain completely independent from this class.
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
    this.phase = (this.phase + (deltaMs / 1000) * Math.max(0.22, speedFactor) * 0.028) % 1;
    this.redrawMotion();
  }

  private drawSky(): void {
    const g = this.sky;
    g.clear();

    // Pixel-banded sunset gradient. The horizon stays warm like the approved
    // Sunset Town sheet while the upper sky keeps the bright tropical blue.
    const bands = [
      [0, 0x5ca8df],
      [70, 0x69b7e5],
      [140, 0x82c9e9],
      [205, 0xf2bf9b],
      [270, 0xf5a878],
      [340, 0xf18a62]
    ] as const;

    for (let i = 0; i < bands.length; i += 1) {
      const [y, color] = bands[i];
      const nextY = i + 1 < bands.length ? bands[i + 1][0] : HORIZON;
      g.fillStyle(color, 1);
      g.fillRect(0, y, WIDTH, nextY - y + 1);
    }

    // Warm sun over the sea.
    g.fillStyle(0xffe4a3, 0.95);
    g.fillCircle(355, 245, 24);
    g.fillStyle(0xfff3c7, 0.66);
    g.fillCircle(355, 245, 12);

    // Pixel clouds - chunky instead of soft generic gradients.
    this.cloud(g, 62, 120, 1.1, 0xf7e9d8, 0.82);
    this.cloud(g, 304, 118, 0.86, 0xffdfca, 0.78);
    this.cloud(g, 405, 176, 0.68, 0xffd0b9, 0.74);
    this.cloud(g, 155, 204, 0.58, 0xffdbc8, 0.72);
  }

  private drawSea(): void {
    const g = this.sea;
    g.clear();

    // Distant islands/haze.
    g.fillStyle(0x5f708d, 0.58);
    g.fillTriangle(0, 330, 92, 292, 188, 330);
    g.fillTriangle(132, 330, 232, 304, 320, 330);
    g.fillTriangle(390, 330, 455, 305, 540, 330);

    // Sea bands stop at the gameplay horizon so the street can grow out of it.
    g.fillStyle(0x2d92c5, 1);
    g.fillRect(0, 326, WIDTH, 112);
    g.fillStyle(0x257eae, 1);
    g.fillRect(0, 365, WIDTH, 73);
    g.fillStyle(0x1e6f9f, 0.9);
    g.fillRect(0, 406, WIDTH, 32);

    // Sun reflection path.
    g.fillStyle(0xffd583, 0.42);
    for (let i = 0; i < 8; i += 1) {
      const y = 330 + i * 12;
      const w = 9 + i * 7;
      g.fillRect(355 - w / 2 + (i % 2 === 0 ? -3 : 3), y, w, 3);
    }

    // Tiny sailboats keep the sea recognisably like the approved sheet.
    this.sailboat(g, 100, 372, 0.7);
    this.sailboat(g, 469, 348, 0.55);
    this.sailboat(g, 252, 401, 0.46);
  }

  private drawLandmarks(): void {
    const g = this.landmarks;
    g.clear();

    this.drawKissBridge(g);
    this.drawClockTower(g, 420, 434, 0.72);

    // Cable-car support / station cue on the far-left coast.
    g.fillStyle(0x17475e, 0.82);
    g.fillRect(34, 340, 4, 92);
    g.fillRect(17, 430, 38, 6);
    g.lineStyle(3, 0xe8d7bd, 0.7);
    g.lineBetween(36, 340, 65, 306);
    g.lineBetween(36, 340, 8, 314);
  }

  private drawTown(): void {
    const g = this.town;
    g.clear();

    // Distant waterfront town mass. Small enough to read as depth, detailed
    // enough to avoid a generic skyline silhouette.
    const distant = [
      [0, 382, 42, 56, 0xd98555],
      [36, 394, 34, 44, 0xf1c277],
      [67, 373, 45, 65, 0xcf7454],
      [109, 389, 38, 49, 0xf4d49a],
      [145, 380, 45, 58, 0xe19564],
      [187, 394, 35, 44, 0xf3c37a],
      [220, 385, 38, 53, 0xd67d58],
      [258, 399, 32, 39, 0xf4d09a],
      [291, 387, 40, 51, 0xda855c],
      [330, 397, 36, 41, 0xf1bd77],
      [366, 390, 32, 48, 0xd56f53],
      [456, 391, 39, 47, 0xe5a367],
      [492, 381, 48, 57, 0xf2cc91]
    ] as const;

    for (const [x, y, w, h, color] of distant) {
      this.facade(g, x, y, w, h, color, 0.72);
    }

    // Left side Mediterranean facades. Buildings grow toward the player and
    // frame the road instead of sitting underneath it.
    this.facade(g, -28, 430, 98, 155, 0xd56b4f, 1);
    this.facade(g, 24, 470, 92, 176, 0xf1bd75, 1.04);
    this.facade(g, -22, 590, 128, 230, 0xe58c5d, 1.12);

    // Right side facades leave a waterfront window toward the sea/bridge.
    this.facade(g, 467, 444, 93, 150, 0xf0c98b, 1);
    this.facade(g, 486, 564, 92, 218, 0xd77355, 1.1);

    // Terracotta roof rhythm.
    g.fillStyle(0x9e4d3c, 1);
    g.fillTriangle(-28, 430, 21, 396, 70, 430);
    g.fillTriangle(25, 470, 70, 439, 116, 470);
    g.fillTriangle(-22, 590, 42, 548, 106, 590);
    g.fillTriangle(467, 444, 513, 414, 559, 444);
    g.fillTriangle(486, 564, 532, 531, 578, 564);

    // Palms rising from both sides of the promenade.
    this.palm(g, 120, 448, 0.64);
    this.palm(g, 463, 466, 0.58);
    this.palm(g, 95, 560, 0.88);
    this.palm(g, 474, 616, 0.95);
  }

  private drawRoadside(): void {
    const g = this.roadside;
    g.clear();

    // Stone promenade / retaining walls on both sides, aligned toward the same
    // horizon used by PerspectiveRoad.
    g.fillStyle(0xa68f76, 1);
    g.fillTriangle(0, HORIZON + 12, 88, HORIZON + 20, 150, HEIGHT);
    g.fillTriangle(WIDTH, HORIZON + 12, 452, HORIZON + 20, 390, HEIGHT);

    g.lineStyle(2, 0xd5c2a6, 0.72);
    for (let y = 488; y < HEIGHT; y += 48) {
      const t = (y - HORIZON) / (HEIGHT - HORIZON);
      const inset = Phaser.Math.Linear(82, 0, t);
      g.lineBetween(inset, y, Math.min(150, inset + 70 + t * 30), y + 8);
      g.lineBetween(WIDTH - inset, y, Math.max(390, WIDTH - inset - 70 - t * 30), y + 8);
    }

    // Bougainvillea clusters - the strongest warm street cue in the approved art.
    this.bougainvillea(g, 85, 705, 1.15);
    this.bougainvillea(g, 456, 748, 1.22);
    this.bougainvillea(g, 46, 846, 1.36);
    this.bougainvillea(g, 502, 870, 1.32);

    // Decorative street lamps help the scale transition from town to road.
    this.lamp(g, 128, 596, 0.74);
    this.lamp(g, 430, 632, 0.83);
  }

  private redrawMotion(): void {
    const g = this.motion;
    g.clear();

    // Cable line tracks the approved Phu Quoc identity. Cabins drift slowly and
    // independently of road speed so they read as world motion, not obstacles.
    const y0 = 244;
    const y1 = 314;
    g.lineStyle(2, 0x2b4654, 0.78);
    g.lineBetween(-18, y0, WIDTH + 18, y1);
    g.lineBetween(-18, y0 + 6, WIDTH + 18, y1 + 6);

    for (let i = 0; i < 4; i += 1) {
      const t = (this.phase + i * 0.27) % 1;
      const x = Phaser.Math.Linear(-14, WIDTH + 14, t);
      const y = Phaser.Math.Linear(y0, y1, t);
      const s = Phaser.Math.Linear(0.66, 1, t);
      this.cableCabin(g, x, y + 7, s);
    }

    // Moving sea glints keep the horizon alive without making the world swim.
    g.lineStyle(2, 0xffefd0, 0.34);
    for (let i = 0; i < 7; i += 1) {
      const t = (this.phase * 1.7 + i * 0.143) % 1;
      const y = 348 + i * 11;
      const x = 220 + t * 220;
      g.lineBetween(x, y, x + 18 + i * 2, y);
    }
  }

  private drawKissBridge(g: Phaser.GameObjects.Graphics): void {
    // Stylised Kiss Bridge silhouette from the approved Task 02 language.
    const left = [
      [205, 379], [220, 367], [238, 354], [257, 346], [277, 343]
    ] as const;
    const right = [
      [335, 343], [354, 346], [374, 354], [393, 367], [407, 379]
    ] as const;

    g.lineStyle(8, 0xc58a63, 1);
    for (let i = 0; i < left.length - 1; i += 1) {
      g.lineBetween(left[i][0], left[i][1], left[i + 1][0], left[i + 1][1]);
      g.lineBetween(right[i][0], right[i][1], right[i + 1][0], right[i + 1][1]);
    }
    g.lineStyle(3, 0xf1c49f, 0.82);
    for (let i = 0; i < left.length - 1; i += 1) {
      g.lineBetween(left[i][0], left[i][1] - 4, left[i + 1][0], left[i + 1][1] - 4);
      g.lineBetween(right[i][0], right[i][1] - 4, right[i + 1][0], right[i + 1][1] - 4);
    }

    // Support legs.
    g.lineStyle(5, 0x8b6758, 1);
    g.lineBetween(224, 370, 214, 409);
    g.lineBetween(386, 370, 398, 409);
  }

  private drawClockTower(g: Phaser.GameObjects.Graphics, x: number, baseY: number, scale: number): void {
    const w = 52 * scale;
    const h = 155 * scale;

    g.fillStyle(0xb95d48, 1);
    g.fillRect(x - w / 2, baseY - h, w, h);
    g.fillStyle(0xe99a68, 1);
    g.fillRect(x - w / 2 + 6 * scale, baseY - h + 5 * scale, w - 12 * scale, h - 8 * scale);

    // Clock chamber.
    g.fillStyle(0xf1d7a9, 1);
    g.fillRect(x - 22 * scale, baseY - h - 28 * scale, 44 * scale, 31 * scale);
    g.fillStyle(0x294a55, 1);
    g.fillCircle(x, baseY - h - 13 * scale, 11 * scale);
    g.fillStyle(0xf5edcf, 1);
    g.fillCircle(x, baseY - h - 13 * scale, 8 * scale);
    g.lineStyle(Math.max(1, 2 * scale), 0x344147, 1);
    g.lineBetween(x, baseY - h - 13 * scale, x + 5 * scale, baseY - h - 18 * scale);
    g.lineBetween(x, baseY - h - 13 * scale, x, baseY - h - 7 * scale);

    // Teal Venetian roof/spire.
    g.fillStyle(0x3a7f78, 1);
    g.fillTriangle(x - 27 * scale, baseY - h - 28 * scale, x + 27 * scale, baseY - h - 28 * scale, x, baseY - h - 68 * scale);
    g.fillStyle(0xd5ad63, 1);
    g.fillRect(x - 2 * scale, baseY - h - 77 * scale, 4 * scale, 10 * scale);

    // Vertical window rhythm.
    g.fillStyle(0x6c493f, 0.88);
    for (let i = 0; i < 4; i += 1) {
      const y = baseY - h + 22 * scale + i * 28 * scale;
      g.fillRoundedRect(x - 6 * scale, y, 12 * scale, 17 * scale, 2 * scale);
    }
  }

  private facade(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    color: number,
    detailScale: number
  ): void {
    g.fillStyle(0x6a4239, 0.72);
    g.fillRect(x - 4, y + 5, w + 8, h);
    g.fillStyle(color, 1);
    g.fillRect(x, y, w, h);

    // Cream cornice.
    g.fillStyle(0xf2d8a7, 0.9);
    g.fillRect(x, y + 13 * detailScale, w, Math.max(3, 5 * detailScale));

    const columns = Math.max(2, Math.floor(w / (25 * detailScale)));
    const rows = Math.max(2, Math.floor(h / (42 * detailScale)));
    const cellW = w / columns;
    const cellH = h / rows;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        const wx = x + col * cellW + cellW * 0.28;
        const wy = y + row * cellH + cellH * 0.34;
        const ww = Math.max(4, cellW * 0.42);
        const wh = Math.max(7, cellH * 0.38);
        g.fillStyle(0x31596a, 0.88);
        g.fillRoundedRect(wx, wy, ww, wh, Math.max(1, 2 * detailScale));
        g.fillStyle(0xf4d698, 0.68);
        g.fillRect(wx + 2, wy + 2, Math.max(1, ww - 4), 2);
      }
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
    for (const [bx, by, bw, bh] of blocks) {
      g.fillRect(x + bx * scale, y + by * scale, bw * scale, bh * scale);
    }
  }

  private palm(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.lineStyle(Math.max(3, 6 * scale), 0x7f583a, 1);
    g.lineBetween(x, y, x + 5 * scale, y - 62 * scale);
    const topX = x + 5 * scale;
    const topY = y - 62 * scale;
    g.lineStyle(Math.max(2, 5 * scale), 0x2d774c, 1);
    for (const [dx, dy] of [[-32, 4], [-24, -12], [-8, -21], [13, -20], [28, -8], [34, 7], [8, 15]] as const) {
      g.lineBetween(topX, topY, topX + dx * scale, topY + dy * scale);
    }
  }

  private bougainvillea(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.fillStyle(0x2f774d, 1);
    g.fillCircle(x, y, 24 * scale);
    g.fillCircle(x - 18 * scale, y + 8 * scale, 17 * scale);
    g.fillCircle(x + 19 * scale, y + 6 * scale, 18 * scale);

    const flowers = [
      [-18, -5], [-8, 8], [4, -12], [15, 4], [22, -7], [-23, 12], [1, 13], [11, -20]
    ] as const;
    for (const [dx, dy] of flowers) {
      g.fillStyle((dx + dy) % 2 === 0 ? 0xe84f54 : 0xf19a44, 1);
      g.fillCircle(x + dx * scale, y + dy * scale, 5 * scale);
    }
  }

  private lamp(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.lineStyle(Math.max(2, 4 * scale), 0x273b42, 1);
    g.lineBetween(x, y, x, y - 80 * scale);
    g.lineBetween(x, y - 80 * scale, x + 17 * scale, y - 80 * scale);
    g.fillStyle(0xffd879, 0.9);
    g.fillCircle(x + 18 * scale, y - 77 * scale, 7 * scale);
    g.lineStyle(Math.max(1, 2 * scale), 0xf3e0a3, 0.78);
    g.strokeCircle(x + 18 * scale, y - 77 * scale, 9 * scale);
  }

  private cableCabin(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.lineStyle(Math.max(1, 2 * scale), 0x23343e, 1);
    g.lineBetween(x, y - 8 * scale, x, y - 2 * scale);
    g.fillStyle(0x9c2f31, 1);
    g.fillRoundedRect(x - 7 * scale, y - 2 * scale, 14 * scale, 10 * scale, 2 * scale);
    g.fillStyle(0xf0b54d, 0.96);
    g.fillRect(x - 4 * scale, y, 8 * scale, 4 * scale);
  }

  private sailboat(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.fillStyle(0xf7f1dd, 0.9);
    g.fillTriangle(x, y - 19 * scale, x, y, x + 10 * scale, y);
    g.fillStyle(0xe8d6c0, 0.86);
    g.fillRect(x - 6 * scale, y, 18 * scale, 3 * scale);
  }
}
