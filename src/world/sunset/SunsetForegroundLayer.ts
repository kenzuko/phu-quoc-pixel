import Phaser from 'phaser';

const WIDTH = 540;
const HEIGHT = 960;
const HORIZON = 438;
const LOWER_HEIGHT = 522;
const HALF_TEXTURE = 270;

/**
 * Near-camera edge art from the locked master.
 *
 * The master texture is split into left/right halves and widened slightly
 * toward the playable road. This closes the visual gap without inventing new
 * buildings or stretching the whole scene.
 */
export class SunsetForegroundLayer {
  private readonly foundation: Phaser.GameObjects.Graphics;
  private readonly leftMaster: Phaser.GameObjects.Image;
  private readonly rightMaster: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.foundation = scene.add.graphics().setDepth(-25);
    this.drawFoundation();

    this.leftMaster = scene.add
      .image(0, HORIZON - 2, 'no-brakes-master-sides')
      .setOrigin(0, 0)
      .setCrop(0, 0, HALF_TEXTURE, LOWER_HEIGHT)
      .setDisplaySize(300, LOWER_HEIGHT + 4)
      .setDepth(-15);

    this.rightMaster = scene.add
      .image(WIDTH, HORIZON - 2, 'no-brakes-master-sides')
      .setOrigin(1, 0)
      .setCrop(HALF_TEXTURE, 0, HALF_TEXTURE, LOWER_HEIGHT)
      .setDisplaySize(300, LOWER_HEIGHT + 4)
      .setDepth(-15);

    this.leftMaster.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.rightMaster.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  private drawFoundation(): void {
    const g = this.foundation;
    g.clear();

    // Only the narrow promenade gap behind transparent master pixels is drawn.
    // A mid-tone stone reads closer to the real scene than the former cream
    // triangles and lets flowers / lamps remain dominant.
    g.fillStyle(0x9e9181, 1);
    this.fillQuad(g, 0, HORIZON, 238, HORIZON, 128, HEIGHT, 0, HEIGHT);
    this.fillQuad(g, 302, HORIZON, WIDTH, HORIZON, WIDTH, HEIGHT, 412, HEIGHT);

    g.fillStyle(0x635f5c, 0.16);
    this.fillQuad(g, 0, HORIZON, 86, HORIZON + 4, 95, HEIGHT, 0, HEIGHT);
    this.fillQuad(g, WIDTH - 86, HORIZON + 4, WIDTH, HORIZON, WIDTH, HEIGHT, WIDTH - 95, HEIGHT);

    // Perspective paving joints are restrained and disappear under master art.
    for (const y of [502, 574, 660, 760, 878]) {
      const t = (y - HORIZON) / (HEIGHT - HORIZON);
      const leftInner = Phaser.Math.Linear(231, 127, t);
      const rightInner = Phaser.Math.Linear(309, 413, t);
      g.lineStyle(1 + Math.floor(t * 2), 0xd9c9b4, 0.18);
      g.lineBetween(0, y, leftInner, y - 3);
      g.lineBetween(rightInner, y - 3, WIDTH, y);
    }

    g.lineStyle(2, 0x574f4b, 0.28);
    g.lineBetween(235, HORIZON, 129, HEIGHT);
    g.lineBetween(305, HORIZON, 411, HEIGHT);
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
