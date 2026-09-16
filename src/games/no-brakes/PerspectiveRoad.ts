import Phaser from 'phaser';
import { SunsetWorldLayer } from '../../world/sunset/SunsetWorldLayer';
import { sampleRoute } from './RouteProfile';

export interface RoadProjection {
  x: number;
  y: number;
  scale: number;
  halfWidth: number;
}

/**
 * NO BRAKES camera lock - rear chase / over-the-road perspective.
 *
 * The approved gameplay reference puts the player in the lower third while the
 * street converges to a vanishing point around the middle of the portrait
 * frame. Objects must appear small near the horizon and grow aggressively as
 * they approach the rider. This is deliberately not a side-scroller camera.
 */
const HORIZON_Y = 438;
const ROAD_BOTTOM_Y = 986;
const ROAD_TOP_HALF = 28;
const ROAD_BOTTOM_HALF = 246;
const CENTER_X = 270;
const ROAD_SEGMENTS = 42;
const DEPTH_EXPONENT = 2.05;

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
    this.phase = (this.phase + (deltaMs / 1000) * speedFactor * 0.74) % 1;
    this.world.update(deltaMs, speedFactor);
    this.redrawMotion(this.phase);
  }

  project(depth: number, lane = 0): RoadProjection {
    const z = Phaser.Math.Clamp(depth, 0, 1);
    const eased = Math.pow(z, DEPTH_EXPONENT);
    const route = sampleRoute(z);
    const baseHalfWidth = Phaser.Math.Linear(ROAD_TOP_HALF, ROAD_BOTTOM_HALF, eased);
    const halfWidth = baseHalfWidth * route.halfWidthScale;

    const centerShift = route.centerOffset * baseHalfWidth * 1.2;
    const curveBulge = route.curve * baseHalfWidth * Math.sin(Math.PI * z) * 0.36;
    const centerX = CENTER_X + centerShift + curveBulge;
    const laneOffset = lane * halfWidth * 0.58;
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

    // Build the street from many perspective strips so curves and grades read
    // as a continuous road rather than one flat trapezoid.
    for (let i = 0; i < ROAD_SEGMENTS; i += 1) {
      const z0 = i / ROAD_SEGMENTS;
      const z1 = (i + 1) / ROAD_SEGMENTS;
      const a = this.project(z0);
      const b = this.project(z1);
      const shoulderA = a.halfWidth + Phaser.Math.Linear(12, 78, Math.pow(z0, 1.7));
      const shoulderB = b.halfWidth + Phaser.Math.Linear(12, 78, Math.pow(z1, 1.7));

      g.fillStyle(0xe5d4bd, 1);
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

      // Asphalt is intentionally slightly warm so it sits inside the approved
      // Sunset Town palette instead of reading as a debug-grey block.
      g.fillStyle(0x5d6069, 1);
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

    // Bright road edges make the converging chase-camera geometry readable at
    // phone scale without changing the geographic background art.
    g.lineStyle(4, 0xf4ead7, 0.94);
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

    // Two dashed dividers define three soft lanes. Their perspective spacing is
    // what makes swipe-left/right feel like lateral movement in the world.
    g.fillStyle(0xf7f0d9, 0.9);
    for (const lane of [-0.5, 0.5]) {
      for (let i = 0; i < 11; i += 1) {
        const depth = (i / 11 + phase) % 1;
        if (depth < 0.04) continue;
        const p = this.project(depth, lane);
        const w = Math.max(1.5, 6.5 * p.scale);
        const h = Math.max(4, 32 * p.scale);
        g.fillRect(p.x - w / 2, p.y - h / 2, w, h);
      }
    }

    // Near-camera streaks are deliberately subtle. They reinforce forward
    // speed without turning the Sunset Town scenery into generic racing VFX.
    g.lineStyle(2, 0xffffff, 0.11);
    for (let i = 0; i < 6; i += 1) {
      const y = 790 + i * 29;
      const x = 50 + i * 90;
      g.lineBetween(x, y, x - 15, y + 24);
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
