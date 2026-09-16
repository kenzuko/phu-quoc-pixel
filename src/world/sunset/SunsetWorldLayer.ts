import Phaser from 'phaser';
import { approvedSunsetAnchors } from './WorldAnchors';

/**
 * Visual world layer for Sunset Town.
 *
 * This layer owns geography-facing scenery and landmark placement. Road
 * projection, collision and gameplay remain elsewhere so real-world layout can
 * evolve without destabilising mechanics.
 */
export class SunsetWorldLayer {
  private readonly graphics: Phaser.GameObjects.Graphics;
  private drift = 0;

  constructor(scene: Phaser.Scene) {
    this.graphics = scene.add.graphics().setDepth(-50);
    this.draw();
  }

  update(deltaMs: number, speedFactor: number): void {
    // Tiny world drift creates depth before final parallax art exists. Keep it
    // subtle so sourced landmark relationships remain readable.
    this.drift = (this.drift + (deltaMs / 1000) * speedFactor * 0.32) % 1;
    this.graphics.setX(Math.sin(this.drift * Math.PI * 2) * 1.5);
  }

  private draw(): void {
    const g = this.graphics;
    g.clear();

    this.drawSkyAndSea(g);
    this.drawHillsideMassing(g);

    for (const anchor of approvedSunsetAnchors()) {
      if (anchor.id === 'central-village-clock-tower') this.drawClockTower(g);
      if (anchor.id === 'kiss-bridge') this.drawKissBridge(g);
    }

    this.drawBougainvillea(g);
  }

  private drawSkyAndSea(g: Phaser.GameObjects.Graphics): void {
    const skyBands = [0x58b8ef, 0x72c7ef, 0xf2c68f, 0xf0aa6e];
    for (let i = 0; i < skyBands.length; i += 1) {
      g.fillStyle(skyBands[i], 1);
      g.fillRect(0, i * 74, 540, 76);
    }

    // West-facing water opening behind the coastal town.
    g.fillStyle(0x269dc4, 1);
    g.fillRect(0, 292, 540, 300);
    g.lineStyle(3, 0x8ce6ef, 0.48);
    for (let y = 326; y < 568; y += 34) {
      g.lineBetween(216, y, 538, y - 8);
    }
  }

  private drawHillsideMassing(g: Phaser.GameObjects.Graphics): void {
    const facades = [0xf3cf9e, 0xe8a57f, 0xf2dfbd, 0xd98466, 0xf0c18f];

    // Stepped blocks communicate Sunset Town's hillside condition. They are
    // intentionally generic massing, not invented signature buildings.
    for (let i = 0; i < 9; i += 1) {
      const x = i * 36;
      const terrace = Math.floor(i / 2) * 13;
      const h = 124 + (i % 3) * 32 + terrace;
      const top = 316 - h;

      g.fillStyle(facades[i % facades.length], 1);
      g.fillRect(x, top, 43, h + 252);

      g.fillStyle(0x315c61, 0.78);
      for (let wy = Math.max(top + 28, 194); wy < 446; wy += 34) {
        g.fillRect(x + 10, wy, 7, 13);
        g.fillRect(x + 26, wy, 7, 13);
      }
    }
  }

  private drawClockTower(g: Phaser.GameObjects.Graphics): void {
    // Central Village proxy silhouette. Final pixel asset will replace this
    // without changing its world-anchor contract.
    g.fillStyle(0xa9553d, 1);
    g.fillRect(166, 184, 43, 184);
    g.fillStyle(0xf0d9b4, 1);
    g.fillRect(159, 174, 57, 28);
    g.fillStyle(0x355e57, 1);
    g.fillTriangle(157, 174, 187, 126, 218, 174);
    g.fillStyle(0xf4e7cc, 1);
    g.fillCircle(187, 190, 10);
    g.fillStyle(0x344451, 1);
    g.fillCircle(187, 190, 6);
  }

  private drawKissBridge(g: Phaser.GameObjects.Graphics): void {
    // Offshore silhouette only. It deliberately does not intersect the road.
    g.lineStyle(7, 0xb7bbb5, 0.94);
    g.beginPath();
    g.moveTo(312, 392);
    g.lineTo(362, 374);
    g.lineTo(409, 372);
    g.lineTo(454, 388);
    g.lineTo(520, 390);
    g.strokePath();

    // Twin rising tips make the landmark legible at small pixel scale without
    // pretending this proxy is an exact architectural drawing.
    g.lineStyle(5, 0xc9cbc5, 0.9);
    g.lineBetween(402, 373, 414, 354);
    g.lineBetween(422, 374, 411, 354);
  }

  private drawBougainvillea(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0xd63c80, 0.9);
    for (let i = 0; i < 20; i += 1) {
      g.fillCircle(18 + (i % 4) * 18, 172 + i * 18, 7 + (i % 3));
    }
  }
}
