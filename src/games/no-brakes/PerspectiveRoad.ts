import Phaser from 'phaser';

export interface RoadProjection {
  x: number;
  y: number;
  scale: number;
}

const HORIZON_Y = 292;
const ROAD_BOTTOM_Y = 960;
const ROAD_TOP_HALF = 44;
const ROAD_BOTTOM_HALF = 228;
const CENTER_X = 270;

export class PerspectiveRoad {
  private readonly scene: Phaser.Scene;
  private readonly background: Phaser.GameObjects.Graphics;
  private readonly road: Phaser.GameObjects.Graphics;
  private readonly motion: Phaser.GameObjects.Graphics;
  private phase = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.background = scene.add.graphics();
    this.road = scene.add.graphics();
    this.motion = scene.add.graphics();
    this.drawBackground();
    this.drawRoadBase();
    this.redrawMotion(0);
  }

  update(deltaMs: number, speedFactor: number): void {
    this.phase = (this.phase + (deltaMs / 1000) * speedFactor * 0.7) % 1;
    this.redrawMotion(this.phase);
  }

  project(depth: number, lane = 0): RoadProjection {
    const z = Phaser.Math.Clamp(depth, 0, 1);
    const eased = Math.pow(z, 1.72);
    const halfWidth = Phaser.Math.Linear(ROAD_TOP_HALF, ROAD_BOTTOM_HALF, eased);
    const laneOffset = lane * halfWidth * 0.58;
    return {
      x: CENTER_X + laneOffset,
      y: Phaser.Math.Linear(HORIZON_Y, ROAD_BOTTOM_Y, eased),
      scale: Phaser.Math.Linear(0.12, 1.18, eased)
    };
  }

  private drawBackground(): void {
    const g = this.background;
    g.clear();

    // Warm late-afternoon sky. Kept procedural until the approved Sunset Town art pack lands.
    const bands = [0x59b7f1, 0x78c8ef, 0xf3c28b, 0xf2a866];
    for (let i = 0; i < bands.length; i += 1) {
      g.fillStyle(bands[i], 1);
      g.fillRect(0, i * 74, 540, 76);
    }

    // Distant green Phu Quoc ridge.
    g.fillStyle(0x4f7555, 1);
    g.fillTriangle(0, 318, 142, 232, 292, 318);
    g.fillTriangle(160, 318, 326, 250, 470, 318);
    g.fillTriangle(350, 318, 468, 268, 540, 318);

    // Sea opening on the right side of the street.
    g.fillStyle(0x299ec5, 1);
    g.fillRect(334, 296, 206, 260);
    g.lineStyle(3, 0x8be5ef, 0.55);
    for (let y = 326; y < 532; y += 34) g.lineBetween(356, y, 536, y - 8);

    // Sunset Town massing on the left. This is geometry only, not final landmark art.
    const facades = [0xf3cf9e, 0xe8a57f, 0xf2dfbd, 0xd98466];
    for (let i = 0; i < 8; i += 1) {
      const x = i * 42;
      const h = 116 + (i % 3) * 34;
      g.fillStyle(facades[i % facades.length], 1);
      g.fillRect(x, 300 - h, 46, h + 238);
      g.fillStyle(0x315c61, 0.85);
      for (let wy = 205; wy < 430; wy += 34) {
        g.fillRect(x + 12, wy, 8, 14);
        g.fillRect(x + 28, wy, 8, 14);
      }
    }

    // Bougainvillea color rhythm.
    g.fillStyle(0xd63c80, 0.9);
    for (let i = 0; i < 18; i += 1) {
      g.fillCircle(22 + (i % 4) * 18, 176 + i * 19, 8 + (i % 3));
    }

    // Cable-car line as a Phu Quoc cue. Final tower/cabin art comes from real references later.
    g.lineStyle(3, 0x2a3b45, 0.9);
    g.lineBetween(286, 202, 540, 172);
    g.fillStyle(0x1e3440, 1);
    g.fillRect(444, 154, 8, 166);
    for (const x of [340, 396, 492]) {
      g.fillStyle(0xb43232, 1);
      g.fillRoundedRect(x, 183 - (x - 340) * 0.11, 24, 18, 4);
      g.fillStyle(0x183947, 1);
      g.fillRect(x + 5, 186 - (x - 340) * 0.11, 14, 8);
    }
  }

  private drawRoadBase(): void {
    const g = this.road;
    g.clear();

    // Sidewalk / promenade shoulders.
    g.fillStyle(0xe8d9c5, 1);
    g.fillTriangle(0, 522, CENTER_X - ROAD_TOP_HALF, HORIZON_Y, CENTER_X - ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y);
    g.fillTriangle(540, 522, CENTER_X + ROAD_TOP_HALF, HORIZON_Y, CENTER_X + ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y);

    // Main asphalt perspective polygon.
    g.fillStyle(0x575b67, 1);
    g.beginPath();
    g.moveTo(CENTER_X - ROAD_TOP_HALF, HORIZON_Y);
    g.lineTo(CENTER_X + ROAD_TOP_HALF, HORIZON_Y);
    g.lineTo(CENTER_X + ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y);
    g.lineTo(CENTER_X - ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y);
    g.closePath();
    g.fillPath();

    // Edge lines.
    g.lineStyle(4, 0xf2e7d2, 0.95);
    g.lineBetween(CENTER_X - ROAD_TOP_HALF, HORIZON_Y, CENTER_X - ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y);
    g.lineBetween(CENTER_X + ROAD_TOP_HALF, HORIZON_Y, CENTER_X + ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y);
  }

  private redrawMotion(phase: number): void {
    const g = this.motion;
    g.clear();

    // Perspective lane dashes. Their spacing accelerates toward the camera.
    g.fillStyle(0xf7f0d9, 0.88);
    for (const lane of [-0.5, 0.5]) {
      for (let i = 0; i < 9; i += 1) {
        const depth = ((i / 9 + phase) % 1);
        if (depth < 0.06) continue;
        const p = this.project(depth, lane);
        const w = Math.max(2, 7 * p.scale);
        const h = Math.max(5, 34 * p.scale);
        g.fillRect(p.x - w / 2, p.y - h / 2, w, h);
      }
    }

    // Speed streaks near the rider only.
    g.lineStyle(2, 0xffffff, 0.18);
    for (let i = 0; i < 6; i += 1) {
      const y = 760 + i * 28;
      const x = 52 + i * 78;
      g.lineBetween(x, y, x - 18, y + 24);
    }
  }
}
