import Phaser from 'phaser';

const WIDTH = 540;
const HEIGHT = 960;
const HORIZON = 438;
const LOWER_HEIGHT = 522;

/**
 * Near-camera environment from the owner's locked rear-chase master.
 *
 * The raster art only occupies the outer scenic edges. A restrained stone
 * foundation sits beneath it so transparent gaps never reveal browser/camera
 * blue, while the center remains reserved for the projected gameplay road.
 */
export class SunsetForegroundLayer {
  private readonly foundation: Phaser.GameObjects.Graphics;
  private readonly masterSides: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.foundation = scene.add.graphics().setDepth(-25);
    this.drawFoundation();

    this.masterSides = scene.add
      .image(0, HORIZON, 'no-brakes-master-sides')
      .setOrigin(0, 0)
      .setDisplaySize(WIDTH, LOWER_HEIGHT)
      .setDepth(-15);

    this.masterSides.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  private drawFoundation(): void {
    const g = this.foundation;
    g.clear();

    // Warm limestone, sampled from the locked master rather than the old bright
    // cream debug wedges.
    g.fillStyle(0xbda78c, 1);
    this.fillQuad(g, 0, HORIZON, 226, HORIZON, 150, HEIGHT, 0, HEIGHT);
    this.fillQuad(g, 314, HORIZON, WIDTH, HORIZON, WIDTH, HEIGHT, 390, HEIGHT);

    // Slight darker outer stone keeps the road edge readable behind photo-rich
    // master art without rebuilding cafes / palms procedurally.
    g.fillStyle(0x927f6d, 0.42);
    this.fillQuad(g, 0, HORIZON, 72, HORIZON + 2, 84, HEIGHT, 0, HEIGHT);
    this.fillQuad(g, WIDTH - 72, HORIZON + 2, WIDTH, HORIZON, WIDTH, HEIGHT, WIDTH - 84, HEIGHT);

    // Sparse perspective joints only. No decorative placeholder objects.
    g.lineStyle(2, 0xe1cfb4, 0.28);
    for (const y of [510, 592, 692, 814, 936]) {
      const t = (y - HORIZON) / (HEIGHT - HORIZON);
      const leftInner = Phaser.Math.Linear(216, 146, t);
      const rightInner = Phaser.Math.Linear(324, 394, t);
      g.lineBetween(0, y, leftInner, y - 4);
      g.lineBetween(rightInner, y - 4, WIDTH, y);
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
