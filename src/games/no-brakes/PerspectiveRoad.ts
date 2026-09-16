import Phaser from 'phaser';
import { SunsetWorldLayer } from '../../world/sunset/SunsetWorldLayer';
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
  private readonly world: SunsetWorldLayer;
  private readonly road: Phaser.GameObjects.Graphics;
  private readonly motion: Phaser.GameObjects.Graphics;
  private phase = 0;

  constructor(scene: Phaser.Scene) {
    this.world = new SunsetWorldLayer(scene);
    this.road = scene.add.graphics().setDepth(-20);
    this.motion = scene.add.graphics().setDepth(-10);
    this.drawRoadBase();
    this.redrawMotion(0);
  }

  update(deltaMs: number, speedFactor: number): void {
    this.phase = (this.phase + (deltaMs / 1000) * speedFactor * 0.7) % 1;
    this.world.update(deltaMs, speedFactor);
    this.redrawMotion(this.phase);
  }

  project(depth: number, lane = 0): RoadProjection {
    const z = Phaser.Math.Clamp(depth, 0, 1);
    const eased = Math.pow(z, 1.72);
    const route = sampleRoute(z);
    const baseHalfWidth = Phaser.Math.Linear(ROAD_TOP_HALF, ROAD_BOTTOM_HALF, eased);
    const halfWidth = baseHalfWidth * route.halfWidthScale;

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

  private drawRoadBase(): void {
    const g = this.road;
    g.clear();

    for (let i = 0; i < ROAD_SEGMENTS; i += 1) {
      const z0 = i / ROAD_SEGMENTS;
      const z1 = (i + 1) / ROAD_SEGMENTS;
      const a = this.project(z0);
      const b = this.project(z1);
      const shoulderA = a.halfWidth + Phaser.Math.Linear(14, 76, Math.pow(z0, 1.5));
      const shoulderB = b.halfWidth + Phaser.Math.Linear(14, 76, Math.pow(z1, 1.5));

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
