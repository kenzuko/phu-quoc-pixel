import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { createButton } from '../ui/createButton';
import { SUNSET_TOWN_V2 } from '../world-v2/places/sunset-town';
import type { WorldSegment } from '../world-v2/types';

export class SunsetWorldTourScene extends Phaser.Scene {
  private index = 0;
  private auto = true;
  private nextAt = 0;
  private world!: Phaser.GameObjects.Graphics;
  private title!: Phaser.GameObjects.Text;
  private meta!: Phaser.GameObjects.Text;
  private evidence!: Phaser.GameObjects.Text;
  private progress!: Phaser.GameObjects.Graphics;

  constructor() { super(SceneKeys.SunsetWorldTour); }

  create(): void {
    const { width } = this.scale;
    this.cameras.main.setBackgroundColor('#09283a');

    this.world = this.add.graphics().setDepth(0);
    this.progress = this.add.graphics().setDepth(30);

    this.add.text(width / 2, 28, 'SUNSET TOWN · WORLD TOUR V2', {
      fontFamily: 'monospace', fontSize: '15px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5).setDepth(40);

    this.add.text(width / 2, 52, 'SCHEMATIC WORLD INSPECTOR · NO GAMEPLAY', {
      fontFamily: 'monospace', fontSize: '8px', color: '#f4cb64'
    }).setOrigin(0.5).setDepth(40);

    this.title = this.add.text(28, 650, '', {
      fontFamily: 'monospace', fontSize: '23px', fontStyle: 'bold',
      color: '#ffffff', stroke: '#061923', strokeThickness: 4
    }).setDepth(40);

    this.meta = this.add.text(28, 690, '', {
      fontFamily: 'monospace', fontSize: '10px', color: '#c7e6e7', lineSpacing: 5
    }).setDepth(40);

    this.evidence = this.add.text(28, 762, '', {
      fontFamily: 'monospace', fontSize: '8px', color: '#8fb4bc', lineSpacing: 3
    }).setDepth(40);

    createButton(this, 87, 906, 'MAP', () => {
      flowController.go(this, SceneKeys.IslandMapV2);
    }, { width: 125, fontSize: 11, backgroundColor: '#164b61', color: '#ffffff' });

    createButton(this, 225, 906, 'PREV', () => this.step(-1), {
      width: 125, fontSize: 11, backgroundColor: '#164b61', color: '#ffffff'
    });

    createButton(this, 365, 906, 'NEXT', () => this.step(1), { width: 125, fontSize: 11 });

    const autoButton = createButton(this, width / 2, 848, 'AUTO: ON', () => {
      this.auto = !this.auto;
      autoButton.list.forEach((child) => {
        if (child instanceof Phaser.GameObjects.Text) {
          child.setText(this.auto ? 'AUTO: ON' : 'AUTO: OFF');
        }
      });
      this.nextAt = this.time.now + 2600;
    }, { width: 205, fontSize: 11, backgroundColor: '#305c63', color: '#ffffff' });

    const previous = (): void => this.step(-1);
    const next = (): void => this.step(1);
    this.input.keyboard?.on('keydown-LEFT', previous);
    this.input.keyboard?.on('keydown-RIGHT', next);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off('keydown-LEFT', previous);
      this.input.keyboard?.off('keydown-RIGHT', next);
    });

    this.renderSegment();
    this.nextAt = this.time.now + 2800;
  }

  update(time: number): void {
    if (!this.auto || time < this.nextAt) return;
    this.step(1);
    this.nextAt = time + 2800;
  }

  private step(delta: number): void {
    const count = SUNSET_TOWN_V2.segments.length;
    this.index = (this.index + delta + count) % count;
    this.renderSegment();
    this.nextAt = this.time.now + 2800;
  }

  private renderSegment(): void {
    const segment = SUNSET_TOWN_V2.segments[this.index];
    this.drawWorld(segment);

    const confidence = segment.confidence.toUpperCase();
    this.title.setText(`${segment.id} · ${segment.label}`);
    this.meta.setText(
      `SLOPE ${segment.slope.toUpperCase()}   SEA ${Math.round(segment.seaVisibility * 100)}%\n` +
      `OPENNESS ${Math.round(segment.openness * 100)}%   CONFIDENCE ${confidence}\n` +
      `LANDMARKS ${segment.landmarkIds.length ? segment.landmarkIds.join(', ').toUpperCase() : 'NONE'}`
    );
    this.evidence.setText(`EVIDENCE: ${segment.referenceIds.join(' · ')}`);

    this.progress.clear();
    this.progress.fillStyle(0x183b48, 1);
    this.progress.fillRect(28, 814, 484, 6);
    this.progress.fillStyle(0xfcbd22, 1);
    this.progress.fillRect(28, 814, 484 * segment.routeProgress, 6);
  }

  private drawWorld(segment: WorldSegment): void {
    const g = this.world;
    g.clear();

    g.fillStyle(segment.seaVisibility > 0.5 ? 0xd88968 : 0xd9a87d, 1);
    g.fillRect(0, 72, 540, 520);
    g.fillStyle(0xf4ca83, 0.65);
    g.fillRect(0, 250, 540, 190);

    if (segment.seaVisibility > 0) {
      const seaHeight = 58 + segment.seaVisibility * 118;
      g.fillStyle(0x247b8e, 1);
      g.fillRect(0, 422 - seaHeight * 0.38, 540, seaHeight);
      g.fillStyle(0x8ed6ce, 0.36);
      for (let i = 0; i < 8; i += 1) g.fillRect(300 + i * 27, 402 + (i % 2) * 9, 18, 3);
    }

    this.drawTownMass(g, segment.leftMass, true, segment.openness);
    this.drawTownMass(g, segment.rightMass, false, segment.openness);
    this.drawRoad(g, segment);

    if (segment.landmarkIds.includes('apollo-cafe')) this.drawApollo(g);
    if (segment.landmarkIds.includes('clock-tower')) this.drawClockTower(g, segment.seaVisibility);
    if (segment.landmarkIds.includes('kiss-bridge')) this.drawKissBridge(g, segment.seaVisibility);

    const actors = Math.min(5, segment.allowedActors.length + (segment.openness > 0.6 ? 1 : 0));
    for (let i = 0; i < actors; i += 1) {
      const x = 80 + ((i * 109 + this.index * 31) % 385);
      const y = 522 + ((i * 37) % 58);
      g.fillStyle(0x173743, 0.7);
      g.fillRect(x, y - 12, 5, 12);
      g.fillRect(x - 2, y - 16, 9, 7);
    }
  }

  private drawRoad(g: Phaser.GameObjects.Graphics, segment: WorldSegment): void {
    const center = 270;
    const topY = 410;
    const bottomY = 640;
    const farHalf = 30 + segment.openness * 20;
    const nearHalf = 170 + segment.openness * 40;

    g.fillStyle(0x6e6867, 1);
    g.beginPath();
    g.moveTo(center - farHalf, topY);
    g.lineTo(center + farHalf, topY);
    g.lineTo(center + nearHalf, bottomY);
    g.lineTo(center - nearHalf, bottomY);
    g.closePath();
    g.fillPath();

    g.lineStyle(3, 0xe5d7c0, 0.8);
    g.lineBetween(center - farHalf, topY, center - nearHalf, bottomY);
    g.lineBetween(center + farHalf, topY, center + nearHalf, bottomY);

    if (segment.slope === 'steep-down') {
      g.lineStyle(2, 0xf2e9d8, 0.28);
      for (let y = 470; y < 620; y += 34) g.lineBetween(150, y, 390, y);
    }
  }

  private drawTownMass(g: Phaser.GameObjects.Graphics, mass: number, left: boolean, openness: number): void {
    if (mass <= 0.12) return;
    const baseX = left ? 0 : 540;
    const direction = left ? 1 : -1;
    const count = Math.max(1, Math.round(2 + mass * 5));

    for (let i = 0; i < count; i += 1) {
      const w = 56 + (i % 3) * 18;
      const h = 105 + ((i * 31) % 90);
      const x = baseX + direction * (i * 47 + 8);
      const leftX = left ? x : x - w;
      const y = 405 - h;
      const palette = [0xc86d52, 0xd99c63, 0xe0b983, 0x9f7668];
      g.fillStyle(palette[(i + this.index) % palette.length], 1);
      g.fillRect(leftX, y, w, h);
      g.fillStyle(0xf4dfb7, 0.52);
      for (let wy = y + 24; wy < y + h - 16; wy += 28) {
        g.fillRect(leftX + (left ? w - 20 : 10), wy, 10, 14);
      }
    }

    if (openness < 0.35) {
      g.fillStyle(0x6a4c45, 0.32);
      g.fillRect(left ? 0 : 430, 372, 110, 54);
    }
  }

  private drawApollo(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0x174d5f, 1);
    g.fillRect(392, 276, 54, 130);
    g.fillStyle(0x58b8bd, 0.9);
    g.fillRect(400, 288, 38, 90);
    g.fillStyle(0xf3c55f, 1);
    g.fillRect(381, 360, 76, 45);
  }

  private drawClockTower(g: Phaser.GameObjects.Graphics, seaVisibility: number): void {
    const x = seaVisibility > 0.35 ? 175 : 270;
    g.fillStyle(0x9a5944, 1);
    g.fillRect(x - 18, 240, 36, 166);
    g.fillStyle(0xf2d49c, 1);
    g.fillRect(x - 12, 254, 24, 24);
    g.fillStyle(0x173743, 1);
    g.fillRect(x - 4, 262, 8, 8);
    g.fillStyle(0xe5b86d, 1);
    g.fillRect(x - 25, 228, 50, 15);
  }

  private drawKissBridge(g: Phaser.GameObjects.Graphics, seaVisibility: number): void {
    if (seaVisibility < 0.5) return;
    g.lineStyle(5, 0xe6d3a8, 0.96);
    g.beginPath();
    g.moveTo(330, 392);
    g.lineTo(386, 370);
    g.lineTo(425, 378);
    g.strokePath();
    g.beginPath();
    g.moveTo(518, 392);
    g.lineTo(468, 370);
    g.lineTo(438, 378);
    g.strokePath();
  }
}
