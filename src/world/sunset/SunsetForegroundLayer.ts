import Phaser from 'phaser';

const WIDTH = 540;
const HEIGHT = 960;
const HORIZON = 438;
const LOWER_HEIGHT = 522;

/**
 * Master-art foreground edge for the rear-chase camera.
 *
 * Real Sunset Town pixel art owns the scenic edges. The generated foundation is
 * intentionally limited to promenade paving underneath transparent gaps, so it
 * never competes with the master artwork or reads like a placeholder cliff.
 */
export class SunsetForegroundLayer {
  private readonly foundation: Phaser.GameObjects.Graphics;
  private readonly masterSides: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.foundation = scene.add.graphics().setDepth(-25);
    this.drawFoundation();

    this.masterSides = scene.add
      .image(-5, HORIZON - 2, 'no-brakes-master-sides')
      .setOrigin(0, 0)
      .setDisplaySize(WIDTH + 10, LOWER_HEIGHT + 4)
      .setDepth(-15);

    this.masterSides.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  private drawFoundation(): void {
    const g = this.foundation;
    g.clear();

    // Warm limestone paving sampled from the approved master palette.
    g.fillStyle(0xb5a18a, 1);
    this.fillQuad(g, 0, HORIZON, 226, HORIZON, 148, HEIGHT, 0, HEIGHT);
    this.fillQuad(g, 314, HORIZON, WIDTH, HORIZON, WIDTH, HEIGHT, 392, HEIGHT);

    // Camera-side shade from buildings / railings gives the paving volume.
    g.fillStyle(0x786d63, 0.22);
    this.fillQuad(g, 0, HORIZON, 78, HORIZON + 5, 92, HEIGHT, 0, HEIGHT);
    this.fillQuad(g, WIDTH - 74, HORIZON + 6, WIDTH, HORIZON, WIDTH, HEIGHT, WIDTH - 90, HEIGHT);

    // Inner curb shadow and thin sun-facing highlight.
    g.lineStyle(5, 0x71685f, 0.42);
    g.lineBetween(226, HORIZON, 148, HEIGHT);
    g.lineBetween(314, HORIZON, 392, HEIGHT);
    g.lineStyle(2, 0xe0cdb0, 0.72);
    g.lineBetween(221, HORIZON + 1, 143, HEIGHT);
    g.lineBetween(319, HORIZON + 1, 397, HEIGHT);

    // Perspective paving joints. They converge with the gameplay road instead
    // of forming horizontal debug slabs.
    g.lineStyle(1, 0xe6d7c0, 0.24);
    for (const x of [18, 48, 82, 116, 424, 458, 492, 526]) {
      const target = x < WIDTH / 2 ? 229 : 311;
      g.lineBetween(target, HORIZON, x, HEIGHT);
    }

    for (const y of [490, 550, 620, 702, 798, 908]) {
      const t = (y - HORIZON) / (HEIGHT - HORIZON);
      const leftInner = Phaser.Math.Linear(218, 145, t);
      const rightInner = Phaser.Math.Linear(322, 395, t);
      g.lineStyle(1 + Math.floor(t * 2), 0x8f7e6c, 0.24);
      g.lineBetween(0, y, leftInner, y - 3);
      g.lineBetween(rightInner, y - 3, WIDTH, y);
    }

    // A few restrained stone variations break large flat areas without
    // introducing new fake objects.
    const patches = [
      [31, 666, 34, 9], [67, 744, 46, 10], [18, 842, 52, 11],
      [472, 690, 39, 10], [438, 778, 48, 10], [489, 886, 34, 10]
    ] as const;
    for (let i = 0; i < patches.length; i += 1) {
      const [x, y, w, h] = patches[i];
      g.fillStyle(i % 2 === 0 ? 0x8f806f : 0xd2bea1, 0.16);
      g.fillRect(x, y, w, h);
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
