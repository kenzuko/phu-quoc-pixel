import Phaser from 'phaser';
import { sampleRoute } from './RouteProfile';

export interface RoadProjection {
  x: number;
  y: number;
  scale: number;
  halfWidth: number;
}

const HORIZON_Y = 292;
const ROAD_BOTTOM_Y = 960;
const ROAD_TOP_HALF = 44;
const ROAD_BOTTOM_HALF = 228;
const CENTER_X = 270;
const ROAD_SEGMENTS = 34;

export class PerspectiveRoad {
  private readonly background: Phaser.GameObjects.Graphics;
  private readonly road: Phaser.GameObjects.Graphics;
  private readonly motion: Phaser.GameObjects.Graphics;
  private phase = 0;

  constructor(scene: Phaser.Scene) {
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
    const route = sampleRoute(z);
    const baseHalfWidth = Phaser.Math.Linear(ROAD_TOP_HALF, ROAD_BOTTOM_HALF, eased);
    const halfWidth = baseHalfWidth * route.halfWidthScale;

    // The route profile controls the road centre. Curve adds a gentle bulge so
    // bends read as bends rather than a straight trapezoid shifted sideways.
    const centerShift = route.centerOffset * baseHalfWidth * 1.45;
    const curveBulge = route.curve * baseHalfWidth * Math.sin(Math.PI * z) * 0.42;
    const centerX = CENTER_X + centerShift + curveBulge;
    const laneOffset = lane * halfWidth * 0.58;
    const gradeOffset = route.grade * 36 * Math.sin(Math.PI * z);

    return {
      x: centerX + laneOffset,
      y: Phaser.Math.Linear(HORIZON_Y, ROAD_BOTTOM_Y, eased) + gradeOffset,
      scale: Phaser.Math.Linear(0.12, 1.18, eased),
      halfWidth
    };
  }

  private drawBackground(): void {
    const g = this.background;
    g.clear();

    // Mechanics proxy only. Final art is built from approved real-world layers.
    const bands = [0x59b7f1, 0x78c8ef, 0xf3c28b, 0xf2a866];
    for (let i = 0; i < bands.length; i += 1) {
      g.fillStyle(bands[i], 1);
      g.fillRect(0, i * 74, 540, 76);
    }

    // West-facing sea behind the town.
    g.fillStyle(0x299ec5, 1);
    g.fillRect(0, 292, 540, 282);
    g.lineStyle(3, 0x8be5ef, 0.5);
    for (let y = 326; y < 556; y += 34) g.lineBetween(210, y, 538, y - 7);

    // Hillside massing on the left. Deliberately abstract until the real art pack.
    const facades = [0xf3cf9e, 0xe8a57f, 0xf2dfbd, 0xd98466];
    for (let i = 0; i < 8; i += 1) {
      const x = i * 39;
      const h = 122 + (i % 3) * 38;
      g.fillStyle(facades[i % facades.length], 1);
      g.fillRect(x, 306 - h, 45, h + 252);
      g.fillStyle(0x315c61, 0.82);
      for (let wy = 204; wy < 440; wy += 34) {
        g.fillRect(x + 11, wy, 8, 14);
        g.fillRect(x + 27, wy, 8, 14);
      }
    }

    // Central Village clock-tower proxy. This is a world anchor, not final art.
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

    // Kiss Bridge is represented only as a low offshore silhouette. No cable
    // system is drawn here until its sightline is verified for this route.
    g.lineStyle(7, 0xb7bbb5, 0.95);
    g.beginPath();
    g.moveTo(312, 392);
    g.lineTo(362, 374);
    g.lineTo(409, 372);
    g.lineTo(454, 388);
    g.lineTo(520, 390);
    g.strokePath();

    // Bougainvillea rhythm on the near hillside side.
    g.fillStyle(0xd63c80, 0.9);
    for (let i = 0; i < 18; i += 1) {
      g.fillCircle(20 + (i % 4) * 18, 176 + i * 19, 8 + (i % 3));
    }
  }

  private drawRoadBase(): void {
    const g = this.road;
    g.clear();

    // Draw road in strips so curves and width changes come from route data.
    for (let i = 0; i < ROAD_SEGMENTS; i += 1) {
      const z0 = i / ROAD_SEGMENTS;
      const z1 = (i + 1) / ROAD_SEGMENTS;
      const a = this.project(z0);
      const b = this.project(z1);
      const shoulderA = a.halfWidth + Phaser.Math.Linear(14, 76, Math.pow(z0, 1.5));
      const shoulderB = b.halfWidth + Phaser.Math.Linear(14, 76, Math.pow(z1, 1.5));

      // Promenade / shoulder strip.
      g.fillStyle(0xe8d9c5, 1);
      this.fillQuad(
        g,
        a.x - shoulderA,
        a.y,
        a.x + shoulderA,
        a.y,
        b.x + shoulderB,
        b.y,
        b.x - shoulderB,
        b.y
      );

      // Asphalt strip.
      g.fillStyle(0x575b67, 1);
      this.fillQuad(
        g,
        a.x - a.halfWidth,
        a.y,
        a.x + a.halfWidth,
        a.y,
        b.x + b.halfWidth,
        b.y,
        b.x - b.halfWidth,
        b.y
      );
    }

    // Edge lines follow the same route projection.
    g.lineStyle(4, 0xf2e7d2, 0.95);
    for (let i = 0; i < ROAD_SEGMENTS; i += 1) {
      const a = this.project(i / ROAD_SEGMENTS);
      const b = this.project((i + 1) / ROAD_SEGMENTS);
      g.lineBetween(a.x - a.halfWidth, a.y, b.x - b.halfWidth, b.y);
      g.lineBetween(a.x + a.halfWidth, a.y, b.x + b.halfWidth, b.y);
    }
  }

  private redrawMotion(phase: number): void {
    const g = this.motion;
    g.clear();

    // Perspective lane dashes travel along the curved route.
    g.fillStyle(0xf7f0d9, 0.88);
    for (const lane of [-0.5, 0.5]) {
      for (let i = 0; i < 10; i += 1) {
        const depth = (i / 10 + phase) % 1;
        if (depth < 0.055) continue;
        const p = this.project(depth, lane);
        const w = Math.max(2, 7 * p.scale);
        const h = Math.max(5, 34 * p.scale);
        g.fillRect(p.x - w / 2, p.y - h / 2, w, h);
      }
    }

    // Speed streaks stay subtle in the proxy build. Final effects are tiered by speed.
    g.lineStyle(2, 0xffffff, 0.12);
    for (let i = 0; i < 5; i += 1) {
      const y = 784 + i * 27;
      const x = 58 + i * 91;
      g.lineBetween(x, y, x - 16, y + 22);
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
