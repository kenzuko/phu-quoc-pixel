import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { createButton } from '../ui/createButton';
import {
  SUNSET_TOWN_GRAPH_EDGES,
  SUNSET_TOWN_GRAPH_NODES,
  SUNSET_TOWN_WORLD_PLATES
} from '../world-v2/places/sunset-town-graph';
import type { WorldPlate } from '../world-v2/types';

export class SunsetWorldTourScene extends Phaser.Scene {
  private index = 0;
  private auto = true;
  private nextAt = 0;
  private world!: Phaser.GameObjects.Graphics;
  private title!: Phaser.GameObjects.Text;
  private meta!: Phaser.GameObjects.Text;
  private evidence!: Phaser.GameObjects.Text;
  private progress!: Phaser.GameObjects.Graphics;

  constructor() {
    super(SceneKeys.SunsetWorldTour);
  }

  create(): void {
    const { width } = this.scale;
    this.cameras.main.setBackgroundColor('#09283a');

    this.world = this.add.graphics().setDepth(0);
    this.progress = this.add.graphics().setDepth(30);

    this.add.text(width / 2, 28, 'SUNSET TOWN · WORLD V2', {
      fontFamily: 'monospace',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(40);

    this.add.text(width / 2, 52, 'WORLD PLATES · PLACE GRAPH · NO GAMEPLAY', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#f4cb64'
    }).setOrigin(0.5).setDepth(40);

    this.title = this.add.text(28, 650, '', {
      fontFamily: 'monospace',
      fontSize: '19px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#061923',
      strokeThickness: 4
    }).setDepth(40);

    this.meta = this.add.text(28, 690, '', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#c7e6e7',
      lineSpacing: 5,
      wordWrap: { width: 484 }
    }).setDepth(40);

    this.evidence = this.add.text(28, 765, '', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#8fb4bc',
      lineSpacing: 3,
      wordWrap: { width: 484 }
    }).setDepth(40);

    createButton(this, 87, 906, 'MAP', () => {
      flowController.go(this, SceneKeys.IslandMapV2);
    }, { width: 125, fontSize: 11, backgroundColor: '#164b61', color: '#ffffff' });

    createButton(this, 225, 906, 'PREV', () => this.step(-1), {
      width: 125,
      fontSize: 11,
      backgroundColor: '#164b61',
      color: '#ffffff'
    });

    createButton(this, 365, 906, 'NEXT', () => this.step(1), {
      width: 125,
      fontSize: 11
    });

    const autoButton = createButton(this, width / 2, 850, 'AUTO: ON', () => {
      this.auto = !this.auto;
      autoButton.setText(this.auto ? 'AUTO: ON' : 'AUTO: OFF');
      this.nextAt = this.time.now + 3400;
    }, {
      width: 205,
      fontSize: 11,
      backgroundColor: '#305c63',
      color: '#ffffff'
    });

    const previous = (): void => this.step(-1);
    const next = (): void => this.step(1);
    this.input.keyboard?.on('keydown-LEFT', previous);
    this.input.keyboard?.on('keydown-RIGHT', next);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off('keydown-LEFT', previous);
      this.input.keyboard?.off('keydown-RIGHT', next);
    });

    this.renderPlate();
    this.nextAt = this.time.now + 3600;
  }

  update(time: number): void {
    if (!this.auto || time < this.nextAt) return;
    this.step(1);
    this.nextAt = time + 3600;
  }

  private step(delta: number): void {
    const count = SUNSET_TOWN_WORLD_PLATES.length;
    this.index = (this.index + delta + count) % count;
    this.renderPlate();
    this.nextAt = this.time.now + 3600;
  }

  private renderPlate(): void {
    const plate = SUNSET_TOWN_WORLD_PLATES[this.index];
    this.drawPlate(plate);

    const focus = plate.focusNodeIds
      .map((id) => SUNSET_TOWN_GRAPH_NODES.find((node) => node.id === id)?.label ?? id)
      .slice(0, 4)
      .join(' · ');

    const spatial = plate.spatialStatus.toUpperCase().replace('-', ' ');
    this.title.setText(`${plate.id} · ${plate.label}`);
    this.meta.setText(
      `SPATIAL ${spatial}\n` +
      `FOCUS ${focus}\n` +
      `ROUTE STATUS NOT LOCKED`
    );

    this.evidence.setText(
      `${plate.note}\nEVIDENCE ${plate.referenceIds.join(' · ')}`
    );

    this.progress.clear();
    this.progress.fillStyle(0x183b48, 1);
    this.progress.fillRect(28, 823, 484, 6);
    this.progress.fillStyle(0xfcbd22, 1);
    this.progress.fillRect(
      28,
      823,
      484 * ((this.index + 1) / SUNSET_TOWN_WORLD_PLATES.length),
      6
    );
  }

  private drawPlate(plate: WorldPlate): void {
    const g = this.world;
    g.clear();

    switch (plate.kind) {
      case 'overview':
        this.drawOverview(g);
        break;
      case 'central':
        this.drawCentralVillage(g);
        break;
      case 'transport':
        this.drawTransport(g);
        break;
      case 'square':
        this.drawApolloSquare(g);
        break;
      case 'waterfront':
        this.drawWaterfront(g);
        break;
      case 'graph':
        this.drawPlaceGraph(g);
        break;
    }

    this.drawPlateBadge(g, plate);
  }

  private drawSky(g: Phaser.GameObjects.Graphics, seaY = 405): void {
    g.fillStyle(0xd38368, 1);
    g.fillRect(0, 72, 540, seaY - 72);
    g.fillStyle(0xe8a977, 1);
    g.fillRect(0, 220, 540, 98);
    g.fillStyle(0xf2c47d, 0.85);
    g.fillRect(0, 318, 540, 48);

    g.fillStyle(0x287b8d, 1);
    g.fillRect(0, seaY, 540, 610 - seaY);
    g.fillStyle(0x83d0c8, 0.34);
    for (let x = 18; x < 530; x += 42) {
      g.fillRect(x, seaY + 18 + ((x / 42) % 3) * 11, 24, 3);
    }
  }

  private drawOverview(g: Phaser.GameObjects.Graphics): void {
    this.drawSky(g, 440);

    // West-facing hillside relationship. This is a spatial plate, not a route.
    g.fillStyle(0x35554d, 1);
    g.beginPath();
    g.moveTo(210, 430);
    g.lineTo(540, 250);
    g.lineTo(540, 610);
    g.lineTo(180, 610);
    g.closePath();
    g.fillPath();

    const palette = [0xd27858, 0xe0a268, 0xc46255, 0xe2bd83, 0x9f7467];
    for (let row = 0; row < 5; row += 1) {
      const y = 475 - row * 55;
      const startX = 230 + row * 40;
      const count = 5 - Math.floor(row / 2);
      for (let i = 0; i < count; i += 1) {
        const x = startX + i * 58;
        const h = 54 + ((i + row) % 3) * 15;
        g.fillStyle(palette[(i + row) % palette.length], 1);
        g.fillRect(x, y - h, 46, h);
        g.fillStyle(0xf0ddb4, 0.58);
        g.fillRect(x + 9, y - h + 14, 8, 11);
        g.fillRect(x + 28, y - h + 14, 8, 11);
      }
    }

    this.drawClockTower(g, 305, 318, 0.72);

    g.fillStyle(0xfcbd22, 0.9);
    g.fillRect(42, 488, 126, 5);
    this.addPixelLabel('SEA · WEST', 46, 500, '#ffe283');

    this.addPixelLabel('HILLSIDE TOWN MASS', 324, 180, '#e6f1e8');
    this.addPixelLabel('NO STREET ROUTE INFERRED', 275, 585, '#8fb4bc');
  }

  private drawCentralVillage(g: Phaser.GameObjects.Graphics): void {
    this.drawSky(g, 430);

    // Plaza is intentionally broad. Relative positions inside the group are
    // presentation-only unless explicitly named by the source.
    g.fillStyle(0xcbb68d, 1);
    g.beginPath();
    g.moveTo(74, 610);
    g.lineTo(466, 610);
    g.lineTo(390, 386);
    g.lineTo(150, 386);
    g.closePath();
    g.fillPath();

    this.drawFacade(g, 24, 286, 126, 232, 0xc76655);
    this.drawFacade(g, 390, 276, 126, 242, 0xd59c66);
    this.drawClockTower(g, 270, 215, 1);

    // Grouped La Festa elements. These are not exact metric placements.
    g.fillStyle(0xb86a4f, 1);
    g.fillRect(176, 454, 58, 44);
    g.fillStyle(0x4d766e, 1);
    g.fillRect(307, 456, 72, 39);

    g.lineStyle(4, 0xe1c27a, 0.85);
    g.beginPath();
    g.moveTo(224, 515);
    g.lineTo(250, 487);
    g.lineTo(270, 515);
    g.lineTo(290, 487);
    g.lineTo(318, 515);
    g.strokePath();

    this.addPixelLabel('CLOCK TOWER', 270, 198, '#ffe283', 0.5);
    this.addPixelLabel('LA FESTA GROUP', 270, 540, '#ffffff', 0.5);
    this.addPixelLabel('DRAGON STAIRS · KING OF SUN · GALLERY', 270, 563, '#bcd9dc', 0.5);
  }

  private drawTransport(g: Phaser.GameObjects.Graphics): void {
    this.drawSky(g, 438);

    g.fillStyle(0xcbb893, 1);
    g.fillRect(52, 405, 436, 205);

    // Anh Duong Square and station are verified as a grouped transport anchor.
    g.fillStyle(0xb65d4c, 1);
    g.fillRect(142, 282, 256, 134);
    g.fillStyle(0xe3c47d, 1);
    g.fillRect(170, 252, 200, 38);
    g.fillStyle(0x264955, 1);
    g.fillRect(185, 315, 170, 74);

    g.fillStyle(0x304c53, 1);
    g.fillRect(118, 214, 12, 196);
    g.fillRect(410, 214, 12, 196);

    g.lineStyle(3, 0x273e44, 0.92);
    g.lineBetween(124, 224, 18, 118);
    g.lineBetween(416, 224, 525, 116);

    g.fillStyle(0xf2dca3, 1);
    for (let i = 0; i < 5; i += 1) {
      g.fillRect(104 + i * 82, 488 + (i % 2) * 18, 20, 6);
    }

    this.addPixelLabel('ANH DUONG SQUARE', 270, 458, '#ffe283', 0.5);
    this.addPixelLabel('HON THOM CABLE CAR DEPARTURE', 270, 535, '#ffffff', 0.5);
    this.addPixelLabel('TRANSPORT ANCHOR · NOT A DRIVING ROUTE', 270, 578, '#8fb4bc', 0.5);
  }

  private drawApolloSquare(g: Phaser.GameObjects.Graphics): void {
    this.drawSky(g, 445);

    g.fillStyle(0xc8b38b, 1);
    g.beginPath();
    g.moveTo(52, 610);
    g.lineTo(488, 610);
    g.lineTo(406, 402);
    g.lineTo(134, 402);
    g.closePath();
    g.fillPath();

    this.drawFacade(g, 26, 300, 122, 214, 0xd37d5c);
    this.drawFacade(g, 392, 292, 122, 222, 0xb96655);

    // Apollo visual identity is supported by recent imagery, but its route
    // geometry is deliberately not approved.
    g.fillStyle(0x14556a, 1);
    g.fillRect(334, 270, 86, 148);
    g.fillStyle(0x5dbcc0, 1);
    g.fillRect(348, 286, 58, 87);
    g.fillStyle(0xf0c45f, 1);
    g.fillRect(318, 382, 116, 36);
    g.fillStyle(0x163c49, 1);
    g.fillRect(338, 425, 76, 12);

    this.addPixelLabel('APOLLO CAFE', 376, 250, '#ffe283', 0.5);
    this.addPixelLabel('VISUAL IDENTITY SUPPORTED', 270, 535, '#ffffff', 0.5);
    this.addPixelLabel('ROUTE GEOMETRY NOT APPROVED', 270, 564, '#f0a17e', 0.5);
  }

  private drawWaterfront(g: Phaser.GameObjects.Graphics): void {
    this.drawSky(g, 330);

    g.fillStyle(0x2b7180, 1);
    g.fillRect(0, 330, 540, 280);

    // Shore platform
    g.fillStyle(0xcab38d, 1);
    g.beginPath();
    g.moveTo(0, 535);
    g.lineTo(540, 490);
    g.lineTo(540, 610);
    g.lineTo(0, 610);
    g.closePath();
    g.fillPath();

    // Kiss Bridge, stylised but preserving the split-pair identity.
    g.lineStyle(7, 0xe7d6ad, 1);
    g.beginPath();
    g.moveTo(34, 478);
    g.lineTo(145, 414);
    g.lineTo(223, 398);
    g.strokePath();
    g.beginPath();
    g.moveTo(506, 474);
    g.lineTo(402, 414);
    g.lineTo(319, 398);
    g.strokePath();

    // Kiss of the Sea stage as a non-metric waterfront anchor.
    g.lineStyle(7, 0xc66f5b, 0.94);
    g.strokeCircle(418, 505, 42);
    g.lineStyle(3, 0xf2c872, 0.8);
    g.strokeCircle(418, 505, 29);

    // Bazaar light band, relation-only.
    g.fillStyle(0x9a5148, 1);
    g.fillRect(64, 525, 170, 38);
    for (let i = 0; i < 8; i += 1) {
      g.fillStyle(i % 2 === 0 ? 0xfcbd22 : 0xe98566, 1);
      g.fillRect(74 + i * 19, 534, 8, 8);
    }

    this.addPixelLabel('KISS BRIDGE', 270, 374, '#ffe283', 0.5);
    this.addPixelLabel('SUNSET BAZAAR', 149, 579, '#ffffff', 0.5);
    this.addPixelLabel('KISS OF THE SEA', 418, 566, '#ffffff', 0.5);
  }

  private drawPlaceGraph(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0x0b3447, 1);
    g.fillRect(0, 72, 540, 538);

    const positions: Readonly<Record<string, { x: number; y: number }>> = {
      'central-village': { x: 270, y: 190 },
      'clock-tower': { x: 270, y: 280 },
      'cable-car-station': { x: 105, y: 400 },
      'kiss-bridge': { x: 270, y: 450 },
      'kiss-stage': { x: 430, y: 410 },
      'sunset-bazaar': { x: 390, y: 520 }
    };

    for (const edge of SUNSET_TOWN_GRAPH_EDGES) {
      const from = positions[edge.from];
      const to = positions[edge.to];
      if (!from || !to) continue;

      g.lineStyle(2, 0x8bd9d2, edge.confidence === 'verified' ? 0.8 : 0.46);
      g.lineBetween(from.x, from.y, to.x, to.y);
    }

    for (const [id, position] of Object.entries(positions)) {
      const node = SUNSET_TOWN_GRAPH_NODES.find((item) => item.id === id);
      if (!node) continue;

      const strong = node.spatialStatus === 'verified';
      g.fillStyle(strong ? 0xfcbd22 : 0x8bd9d2, 1);
      g.fillCircle(position.x, position.y, strong ? 8 : 6);
      g.lineStyle(2, 0x061923, 0.9);
      g.strokeCircle(position.x, position.y, strong ? 8 : 6);

      this.addPixelLabel(
        node.label,
        position.x,
        position.y - 19,
        strong ? '#ffe283' : '#d5ecea',
        0.5
      );
    }

    this.addPixelLabel('SCHEMATIC RELATION GRAPH · NOT A MAP', 270, 566, '#8fb4bc', 0.5);
  }

  private drawFacade(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    color: number
  ): void {
    g.fillStyle(color, 1);
    g.fillRect(x, y, width, height);

    g.fillStyle(0xe6c89a, 0.8);
    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        g.fillRect(x + 16 + column * 31, y + 26 + row * 42, 12, 18);
      }
    }

    g.fillStyle(0x704b43, 0.55);
    g.fillRect(x + 12, y + height - 28, width - 24, 28);
  }

  private drawClockTower(
    g: Phaser.GameObjects.Graphics,
    x: number,
    top: number,
    scale: number
  ): void {
    const width = 40 * scale;
    const bodyHeight = 164 * scale;

    g.fillStyle(0x9f5645, 1);
    g.fillRect(x - width / 2, top, width, bodyHeight);

    g.fillStyle(0xe4b96e, 1);
    g.fillRect(x - width * 0.7, top - 16 * scale, width * 1.4, 18 * scale);

    g.fillStyle(0xf0d79c, 1);
    g.fillRect(x - 13 * scale, top + 20 * scale, 26 * scale, 26 * scale);

    g.fillStyle(0x173743, 1);
    g.fillRect(x - 4 * scale, top + 29 * scale, 8 * scale, 8 * scale);
  }

  private drawPlateBadge(g: Phaser.GameObjects.Graphics, plate: WorldPlate): void {
    const verified = plate.spatialStatus === 'verified';
    g.fillStyle(verified ? 0x143f48 : 0x5b403d, 0.96);
    g.fillRect(18, 88, verified ? 114 : 142, 24);
    this.addPixelLabel(
      verified ? 'SPATIAL VERIFIED' : 'VISUAL ONLY',
      26,
      94,
      verified ? '#9de1d8' : '#f1b08d'
    );
  }

  private addPixelLabel(
    text: string,
    x: number,
    y: number,
    color: string,
    originX = 0
  ): Phaser.GameObjects.Text {
    return this.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '8px',
      fontStyle: 'bold',
      color,
      backgroundColor: '#082c3bcc',
      padding: { x: 4, y: 2 }
    }).setOrigin(originX, 0).setDepth(20);
  }
}
