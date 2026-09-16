import Phaser from 'phaser';

const WIDTH = 540;
const HEIGHT = 960;
const HORIZON = 438;

/**
 * Near-camera Sunset Town promenade layer.
 *
 * This sits behind the projected road but in front of the distant town layer.
 * Its job is to stop the lower frame from reading like two blank retaining-wall
 * wedges and bring back the approved Task 02 cues: warm stone paving,
 * bougainvillea, cafe furniture, lamps and waterfront railings.
 */
export class SunsetForegroundLayer {
  private readonly g: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.g = scene.add.graphics().setDepth(-25);
    this.draw();
  }

  private draw(): void {
    const g = this.g;
    g.clear();

    this.drawPromenadeGround(g);
    this.drawStoneEdges(g);
    this.drawPavingPerspective(g);

    // Left cafe / residential edge.
    this.drawAwning(g, 0, 535, 92, 34, 0xd46d4b, 0xf2d49b);
    this.drawCafeSet(g, 48, 690, 0.8);
    this.drawLamp(g, 104, 630, 0.82);
    this.drawPlanter(g, 72, 780, 1.05);
    this.drawPlanter(g, 28, 904, 1.2);

    // Right waterfront edge. Keep this lighter so the sea and landmarks remain
    // visible through the chase-camera opening.
    this.drawRailing(g, 465, 560, 1);
    this.drawCafeSet(g, 490, 704, 0.76);
    this.drawLamp(g, 454, 650, 0.86);
    this.drawPlanter(g, 492, 794, 1.04);
    this.drawPlanter(g, 530, 916, 1.2);

    // Near palms frame the road without crossing the lane read.
    this.drawPalm(g, 82, 610, 0.83);
    this.drawPalm(g, 476, 592, 0.78);
  }

  private drawPromenadeGround(g: Phaser.GameObjects.Graphics): void {
    // Warm limestone promenade. The road itself is drawn later at depth -20 and
    // therefore masks the middle of these shapes cleanly.
    g.fillStyle(0xcdb18e, 1);
    this.fillQuad(g, 0, HORIZON + 18, 210, HORIZON + 22, 150, HEIGHT, 0, HEIGHT);
    this.fillQuad(g, 330, HORIZON + 22, WIDTH, HORIZON + 18, WIDTH, HEIGHT, 390, HEIGHT);

    // Slightly brighter inner paving catches the road edge.
    g.fillStyle(0xe0caa7, 0.9);
    this.fillQuad(g, 76, HORIZON + 20, 218, HORIZON + 24, 168, HEIGHT, 82, HEIGHT);
    this.fillQuad(g, 322, HORIZON + 24, 466, HORIZON + 20, 458, HEIGHT, 374, HEIGHT);
  }

  private drawStoneEdges(g: Phaser.GameObjects.Graphics): void {
    // Low stone retaining edge rather than giant blank cliff faces.
    g.fillStyle(0x8e765f, 1);
    this.fillQuad(g, 0, 744, 77, 728, 66, HEIGHT, 0, HEIGHT);
    this.fillQuad(g, 469, 724, WIDTH, 742, WIDTH, HEIGHT, 478, HEIGHT);

    g.lineStyle(2, 0xbfa98c, 0.72);
    for (let y = 760; y < HEIGHT; y += 32) {
      const t = (y - 760) / 200;
      g.lineBetween(0, y, 68 - t * 6, y - 12);
      g.lineBetween(WIDTH, y, 474 + t * 5, y - 12);
    }

    // Irregular stone joints.
    g.lineStyle(2, 0x675847, 0.42);
    for (let i = 0; i < 5; i += 1) {
      const y = 782 + i * 38;
      g.lineBetween(19 + (i % 2) * 14, y, 15 + (i % 2) * 12, y + 27);
      g.lineBetween(518 - (i % 2) * 16, y, 522 - (i % 2) * 13, y + 27);
    }
  }

  private drawPavingPerspective(g: Phaser.GameObjects.Graphics): void {
    // Perspective seams all point toward the same road horizon. This makes the
    // sidewalk participate in the chase camera instead of feeling pasted on.
    g.lineStyle(2, 0x9f8a72, 0.32);
    for (const x of [18, 48, 79, 111, 430, 461, 492, 523]) {
      const target = x < WIDTH / 2 ? 231 : 309;
      g.lineBetween(target, HORIZON + 22, x, HEIGHT);
    }

    // Cross joints become farther apart toward the camera.
    const ys = [482, 516, 558, 610, 674, 754, 850];
    for (const y of ys) {
      const depth = (y - HORIZON) / (HEIGHT - HORIZON);
      const leftInner = Phaser.Math.Linear(206, 132, depth);
      const rightInner = Phaser.Math.Linear(334, 410, depth);
      g.lineBetween(0, y, leftInner, y - 5);
      g.lineBetween(rightInner, y - 5, WIDTH, y);
    }
  }

  private drawAwning(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    primary: number,
    secondary: number
  ): void {
    g.fillStyle(0x5b4036, 0.72);
    g.fillRect(x, y - 48, width, 52);
    g.fillStyle(primary, 1);
    g.fillRect(x, y - 36, width, height);
    const stripe = width / 6;
    for (let i = 0; i < 6; i += 2) {
      g.fillStyle(secondary, 1);
      g.fillRect(x + i * stripe, y - 36, stripe, height);
    }
    g.fillStyle(0x324e58, 0.88);
    g.fillRect(x + 10, y - 12, width - 20, 16);
  }

  private drawCafeSet(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    // Round cafe table.
    g.fillStyle(0x5c4537, 1);
    g.fillEllipse(x, y - 36 * scale, 48 * scale, 13 * scale);
    g.fillStyle(0xe3c590, 1);
    g.fillEllipse(x, y - 39 * scale, 44 * scale, 10 * scale);
    g.fillStyle(0x5c4537, 1);
    g.fillRect(x - 3 * scale, y - 34 * scale, 6 * scale, 33 * scale);
    g.fillRect(x - 16 * scale, y - 3 * scale, 32 * scale, 4 * scale);

    // Two woven chairs, simplified at gameplay scale.
    this.drawChair(g, x - 34 * scale, y, scale * 0.74, -1);
    this.drawChair(g, x + 35 * scale, y, scale * 0.74, 1);
  }

  private drawChair(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number, facing: -1 | 1): void {
    g.lineStyle(Math.max(2, 4 * scale), 0x65462f, 1);
    g.strokeEllipse(x, y - 42 * scale, 22 * scale, 31 * scale);
    g.lineBetween(x - 9 * scale, y - 27 * scale, x - 7 * scale, y);
    g.lineBetween(x + 9 * scale, y - 27 * scale, x + 7 * scale, y);
    g.lineBetween(x - 11 * scale, y - 20 * scale, x + 11 * scale, y - 20 * scale);
    g.lineBetween(x, y - 20 * scale, x + 10 * facing * scale, y - 5 * scale);
  }

  private drawRailing(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.lineStyle(4 * scale, 0x62574d, 1);
    g.lineBetween(x - 40 * scale, y - 18 * scale, WIDTH, y - 33 * scale);
    for (let i = 0; i < 4; i += 1) {
      const px = x - 33 * scale + i * 28 * scale;
      const py = y - 20 * scale - i * 4 * scale;
      g.lineBetween(px, py, px, py + 38 * scale);
    }
    g.lineStyle(2 * scale, 0xd4c3a6, 0.8);
    g.lineBetween(x - 40 * scale, y - 23 * scale, WIDTH, y - 38 * scale);
  }

  private drawPlanter(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    // Stone planter.
    g.fillStyle(0x655143, 1);
    g.fillRoundedRect(x - 23 * scale, y - 30 * scale, 46 * scale, 35 * scale, 5 * scale);
    g.fillStyle(0xa88a69, 1);
    g.fillRoundedRect(x - 20 * scale, y - 27 * scale, 40 * scale, 29 * scale, 4 * scale);
    g.fillStyle(0xd1b38d, 1);
    g.fillRect(x - 22 * scale, y - 29 * scale, 44 * scale, 6 * scale);

    // Greenery + bougainvillea.
    g.fillStyle(0x2f7147, 1);
    g.fillCircle(x, y - 43 * scale, 24 * scale);
    g.fillCircle(x - 16 * scale, y - 38 * scale, 15 * scale);
    g.fillCircle(x + 16 * scale, y - 38 * scale, 15 * scale);

    const flowers = [
      [-17, -46], [-9, -56], [0, -43], [8, -57], [17, -47], [-4, -64], [14, -36]
    ] as const;
    for (let i = 0; i < flowers.length; i += 1) {
      const [dx, dy] = flowers[i];
      g.fillStyle(i % 3 === 0 ? 0xffa13d : 0xe54c56, 1);
      g.fillCircle(x + dx * scale, y + dy * scale, 5 * scale);
    }
  }

  private drawLamp(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.lineStyle(Math.max(2, 5 * scale), 0x2f3c40, 1);
    g.lineBetween(x, y, x, y - 94 * scale);
    g.lineBetween(x, y - 94 * scale, x + 18 * scale, y - 94 * scale);
    g.fillStyle(0x2f3c40, 1);
    g.fillCircle(x + 20 * scale, y - 90 * scale, 11 * scale);
    g.fillStyle(0xffd47e, 0.96);
    g.fillCircle(x + 20 * scale, y - 90 * scale, 6 * scale);
  }

  private drawPalm(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
    g.lineStyle(Math.max(3, 7 * scale), 0x765137, 1);
    g.lineBetween(x, y, x + 7 * scale, y - 91 * scale);
    const tx = x + 7 * scale;
    const ty = y - 91 * scale;
    g.lineStyle(Math.max(2, 6 * scale), 0x2d7448, 1);
    for (const [dx, dy] of [[-38, 2], [-30, -16], [-11, -29], [13, -28], [32, -13], [38, 5], [11, 18]] as const) {
      g.lineBetween(tx, ty, tx + dx * scale, ty + dy * scale);
    }
  }

  private fillQuad(
    g: Phaser.GameObjects.Graphics,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
  ): void {
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.lineTo(x3, y3);
    g.lineTo(x4, y4);
    g.closePath();
    g.fillPath();
  }
}
