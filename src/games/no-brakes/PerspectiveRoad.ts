import Phaser from 'phaser';
import { SunsetForegroundLayer } from '../../world/sunset/SunsetForegroundLayer';
import { SunsetWorldLayer } from '../../world/sunset/SunsetWorldLayer';
import { sampleRoute } from './RouteProfile';

export interface RoadProjection {
  x: number;
  y: number;
  scale: number;
  halfWidth: number;
}

const HORIZON_Y = 438;
const ROAD_BOTTOM_Y = 986;
const ROAD_TOP_HALF = 26;
const ROAD_BOTTOM_HALF = 200;
const CENTER_X = 270;
const ROAD_SEGMENTS = 48;
const DEPTH_EXPONENT = 2.05;

/**
 * Rear-chase projection surface.
 *
 * World art now comes from the locked master. This class owns only the playable
 * road surface and projection math. It deliberately avoids drawing decorative
 * buildings / palms / walls so the final frame reads as one master scene.
 */
export class PerspectiveRoad {
  private readonly world: SunsetWorldLayer;
  private readonly road: Phaser.GameObjects.Graphics;
  private readonly motion: Phaser.GameObjects.Graphics;
  private phase = 0;

  constructor(scene: Phaser.Scene) {
    this.world = new SunsetWorldLayer(scene);
    new SunsetForegroundLayer(scene);
    this.road = scene.add.graphics().setDepth(-20);
    this.motion = scene.add.graphics().setDepth(-10);
    this.drawRoadBase();
    this.redrawMotion(0);
  }

  update(deltaMs: number, speedFactor: number): void {
    this.phase = (this.phase + (deltaMs / 1000) * speedFactor * 0.66) % 1;
    this.world.update(deltaMs, speedFactor);
    this.redrawMotion(this.phase);
  }

  project(depth: number, lane = 0): RoadProjection {
    const z = Phaser.Math.Clamp(depth, 0, 1);
    const eased = Math.pow(z, DEPTH_EXPONENT);
    const route = sampleRoute(z);
    const baseHalfWidth = Phaser.Math.Linear(ROAD_TOP_HALF, ROAD_BOTTOM_HALF, eased);
    const halfWidth = baseHalfWidth * route.halfWidthScale;

    const centerShift = route.centerOffset * baseHalfWidth;
    const curveBulge = route.curve * baseHalfWidth * Math.sin(Math.PI * z) * 0.5;
    const centerX = CENTER_X + centerShift + curveBulge;
    const laneOffset = lane * halfWidth * 0.61;
    const gradeOffset = route.grade * 28 * Math.sin(Math.PI * z);

    return {
      x: centerX + laneOffset,
      y: Phaser.Math.Linear(HORIZON_Y, ROAD_BOTTOM_Y, eased) + gradeOffset,
      scale: Phaser.Math.Linear(0.08, 1.22, eased),
      halfWidth
    };
  }

  private drawRoadBase(): void {
    const g = this.road;
    g.clear();

    // Subtle depth-band variation gives the road the same textured character as
    // the master art without moving or changing collision geometry.
    const roadTones = [0x706a69, 0x746e6b, 0x6c6869, 0x726c6b] as const;
    for (let i = 0; i < ROAD_SEGMENTS; i += 1) {
      const z0 = i / ROAD_SEGMENTS;
      const z1 = (i + 1) / ROAD_SEGMENTS;
      const a = this.project(z0);
      const b = this.project(z1);

      g.fillStyle(roadTones[i % roadTones.length], 1);
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

    // Late-afternoon side shade from the dense town edge.
    for (let i = 8; i < ROAD_SEGMENTS; i += 1) {
      const z0 = i / ROAD_SEGMENTS;
      const z1 = (i + 1) / ROAD_SEGMENTS;
      const a = this.project(z0);
      const b = this.project(z1);
      const shadowA = a.halfWidth * Phaser.Math.Linear(0.16, 0.28, z0);
      const shadowB = b.halfWidth * Phaser.Math.Linear(0.16, 0.28, z1);
      g.fillStyle(0x3f4448, 0.08);
      this.fillQuad(
        g,
        a.x - a.halfWidth,
        a.y,
        a.x - a.halfWidth + shadowA,
        a.y,
        b.x - b.halfWidth + shadowB,
        b.y,
        b.x - b.halfWidth,
        b.y
      );
    }

    // Pixel-sized asphalt variation. Deterministic hash means no flicker.
    for (let i = 0; i < 190; i += 1) {
      const depth = 0.13 + this.hash(i * 3.1) * 0.84;
      const p = this.project(depth);
      const lateral = (this.hash(i * 5.7 + 2) * 1.7 - 0.85) * p.halfWidth;
      const size = Math.max(1, Math.round(1 + p.scale * 2.1));
      const x = p.x + lateral;
      const y = p.y + (this.hash(i * 2.3 + 7) - 0.5) * 15 * p.scale;
      g.fillStyle(i % 3 === 0 ? 0x8a817b : 0x514f53, i % 3 === 0 ? 0.18 : 0.13);
      g.fillRect(x, y, size + (i % 4 === 0 ? size : 0), size);
    }

    // Road edge - dark curb seam below, sunlit line above.
    g.lineStyle(5, 0x565052, 0.28);
    for (let i = 0; i < ROAD_SEGMENTS; i += 1) {
      const a = this.project(i / ROAD_SEGMENTS);
      const b = this.project((i + 1) / ROAD_SEGMENTS);
      g.lineBetween(a.x - a.halfWidth - 2, a.y, b.x - b.halfWidth - 2, b.y);
      g.lineBetween(a.x + a.halfWidth + 2, a.y, b.x + b.halfWidth + 2, b.y);
    }

    g.lineStyle(3, 0xe7dbca, 0.82);
    for (let i = 0; i < ROAD_SEGMENTS; i += 1) {
      const a = this.project(i / ROAD_SEGMENTS);
      const b = this.project((i + 1) / ROAD_SEGMENTS);
      g.lineBetween(a.x - a.halfWidth, a.y, b.x - b.halfWidth, b.y);
      g.lineBetween(a.x + a.halfWidth, a.y, b.x + b.halfWidth, b.y);
    }

    // Low-contrast longitudinal repair seams near camera add scale without
    // becoming lane markers.
    g.lineStyle(2, 0x4c4b50, 0.26);
    for (const lane of [-0.18, 0.13]) {
      const a = this.project(0.62, lane);
      const b = this.project(1, lane);
      g.lineBetween(a.x, a.y, b.x, b.y);
    }
  }

  private redrawMotion(phase: number): void {
    const g = this.motion;
    g.clear();

    // Three soft lanes remain readable, but the dashes are less bright and
    // blocky than the prototype.
    g.fillStyle(0xf1e6d8, 0.8);
    for (const lane of [-0.5, 0.5]) {
      for (let i = 0; i < 10; i += 1) {
        const depth = (i / 10 + phase) % 1;
        if (depth < 0.05) continue;
        const p = this.project(depth, lane);
        const w = Math.max(1.5, 5.4 * p.scale);
        const h = Math.max(4, 27 * p.scale);
        g.fillRect(p.x - w / 2, p.y - h / 2, w, h);
      }
    }

    // Tiny near-camera road shimmer / scratches only.
    g.lineStyle(2, 0xe3d4c4, 0.08);
    for (let i = 0; i < 4; i += 1) {
      const y = 824 + i * 34;
      const x = 105 + i * 88;
      g.lineBetween(x, y, x - 9, y + 17);
    }
  }

  private hash(n: number): number {
    const value = Math.sin(n * 12.9898) * 43758.5453;
    return value - Math.floor(value);
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
