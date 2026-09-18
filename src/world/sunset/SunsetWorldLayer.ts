import Phaser from 'phaser';

const WIDTH = 540;
const HORIZON = 438;

/**
 * Master-lock Sunset Town horizon.
 *
 * The upper half of NO BRAKES now comes from the owner's locked rear-chase
 * visual rather than procedural facades / sea / landmark geometry. Gameplay
 * road projection remains independent so collision and lane math stay stable.
 */
export class SunsetWorldLayer {
  private readonly master: Phaser.GameObjects.Image;
  private readonly shimmer: Phaser.GameObjects.Graphics;
  private phase = 0;

  constructor(scene: Phaser.Scene) {
    this.master = scene.add
      .image(0, 0, 'no-brakes-master-horizon')
      .setOrigin(0, 0)
      .setDisplaySize(WIDTH, HORIZON)
      .setDepth(-110);

    // Keep nearest-neighbour sampling explicit even though the global Phaser
    // config already has pixelArt enabled.
    this.master.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.shimmer = scene.add.graphics().setDepth(-100);
    this.redrawShimmer();
  }

  update(deltaMs: number, speedFactor: number): void {
    this.phase = (this.phase + (deltaMs / 1000) * Math.max(0.18, speedFactor) * 0.018) % 1;
    this.redrawShimmer();
  }

  private redrawShimmer(): void {
    const g = this.shimmer;
    g.clear();

    // Restrained sea glints keep the postcard alive without repainting any
    // geography or landmark from the locked master.
    g.lineStyle(2, 0xfff0c8, 0.18);
    for (let i = 0; i < 6; i += 1) {
      const t = (this.phase * 1.35 + i * 0.173) % 1;
      const x = 335 + t * 180;
      const y = 306 + i * 15;
      g.lineBetween(x, y, x + 10 + i * 2, y);
    }
  }
}
