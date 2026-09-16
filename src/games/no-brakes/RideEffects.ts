import Phaser from 'phaser';

const GOLD = 0xfcbd22;
const CREAM = 0xffefd5;
const DUST = 0xd9c4a4;
const CORAL = 0xe75d3f;
const TEAL = 0x4eb5aa;

/** Lightweight pixel feedback for No Brakes. */
export class RideEffects {
  constructor(private readonly scene: Phaser.Scene) {}

  landing(x: number, y: number): void {
    this.scatter(x, y + 2, 7, [DUST, CREAM], {
      spreadX: 62,
      rise: 20,
      duration: 280,
      minSize: 4,
      maxSize: 8,
      depth: 79
    });
  }

  laneSkid(x: number, y: number, direction: -1 | 1): void {
    const originX = x - direction * 18;
    this.scatter(originX, y + 5, 4, [DUST, CREAM], {
      spreadX: 34,
      rise: 11,
      duration: 210,
      minSize: 3,
      maxSize: 6,
      depth: 79,
      driftX: -direction * 12
    });
  }

  coinPickup(x: number, y: number): void {
    this.scatter(x, y, 10, [GOLD, CREAM, 0xffffff], {
      spreadX: 62,
      rise: 55,
      duration: 360,
      minSize: 3,
      maxSize: 7,
      depth: 118
    });

    const ring = this.scene.add
      .circle(x, y, 8, GOLD, 0)
      .setStrokeStyle(3, GOLD, 0.95)
      .setDepth(117);
    this.scene.tweens.add({
      targets: ring,
      radius: 32,
      alpha: 0,
      duration: 260,
      ease: 'Quad.Out',
      onComplete: () => ring.destroy()
    });
  }

  milestone(x: number, y: number): void {
    this.scatter(x, y, 14, [GOLD, CREAM, TEAL, CORAL], {
      spreadX: 150,
      rise: 76,
      duration: 520,
      minSize: 4,
      maxSize: 9,
      depth: 135
    });
  }

  crash(x: number, y: number): void {
    this.scatter(x, y - 22, 16, [CORAL, GOLD, CREAM, 0xffffff], {
      spreadX: 112,
      rise: 88,
      duration: 430,
      minSize: 5,
      maxSize: 11,
      depth: 125
    });

    // Chunkier dust below the scooter keeps the crash grounded on the road.
    this.scatter(x, y + 6, 10, [DUST, CREAM], {
      spreadX: 88,
      rise: 32,
      duration: 390,
      minSize: 6,
      maxSize: 12,
      depth: 78
    });
  }

  private scatter(
    x: number,
    y: number,
    count: number,
    colors: number[],
    options: {
      spreadX: number;
      rise: number;
      duration: number;
      minSize: number;
      maxSize: number;
      depth: number;
      driftX?: number;
    }
  ): void {
    for (let i = 0; i < count; i += 1) {
      const size = Phaser.Math.Between(options.minSize, options.maxSize);
      const px = x + Phaser.Math.Between(-8, 8);
      const py = y + Phaser.Math.Between(-5, 5);
      const color = Phaser.Utils.Array.GetRandom(colors);
      const piece = this.scene.add
        .rectangle(px, py, size, size, color, 0.96)
        .setDepth(options.depth)
        .setAngle(Phaser.Math.Between(-20, 20));

      const targetX = px + Phaser.Math.Between(-options.spreadX, options.spreadX) + (options.driftX ?? 0);
      const targetY = py - Phaser.Math.Between(Math.floor(options.rise * 0.35), options.rise);

      this.scene.tweens.add({
        targets: piece,
        x: targetX,
        y: targetY,
        alpha: 0,
        angle: piece.angle + Phaser.Math.Between(-90, 90),
        scale: 0.35,
        duration: options.duration + Phaser.Math.Between(-45, 55),
        ease: 'Quad.Out',
        onComplete: () => piece.destroy()
      });
    }
  }
}
