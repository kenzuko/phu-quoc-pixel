import Phaser from 'phaser';

/**
 * Sunset Town visual world layer.
 *
 * IMPORTANT: this layer now uses the approved migrated Sunset Town artwork as
 * the primary world image. We deliberately do not redraw the town with proxy
 * rectangles here. Road projection and gameplay stay independent so the art
 * can later be upgraded to higher-resolution parallax layers without touching
 * collision or controls.
 */
export class SunsetWorldLayer {
  private readonly background: Phaser.GameObjects.Image;
  private readonly atmosphere: Phaser.GameObjects.Graphics;
  private drift = 0;

  constructor(scene: Phaser.Scene) {
    this.background = scene.add
      .image(270, 480, 'sunset-background')
      .setDisplaySize(540, 960)
      .setDepth(-90);

    // Small atmospheric accents only. The landmark/town art comes from the
    // raster asset above, not from generated building blocks.
    this.atmosphere = scene.add.graphics().setDepth(-70);
    this.drawAtmosphere();
  }

  update(deltaMs: number, speedFactor: number): void {
    // A one-pixel-scale drift is enough to keep the world alive without making
    // the background swim behind the projected road.
    this.drift = (this.drift + (deltaMs / 1000) * speedFactor * 0.18) % 1;
    const x = Math.sin(this.drift * Math.PI * 2) * 1.25;
    this.background.setX(270 + x);
    this.atmosphere.setX(x * 0.55);
  }

  private drawAtmosphere(): void {
    const g = this.atmosphere;
    g.clear();

    // Warm horizon haze and tiny sea glints reinforce sunset depth while
    // leaving the recognisable town artwork untouched.
    g.fillStyle(0xffd08a, 0.08);
    g.fillRect(0, 215, 540, 150);

    g.lineStyle(2, 0xfff0c5, 0.28);
    for (let i = 0; i < 7; i += 1) {
      const y = 300 + i * 24;
      const x = 338 + (i % 3) * 29;
      g.lineBetween(x, y, x + 38 + i * 4, y);
    }
  }
}
