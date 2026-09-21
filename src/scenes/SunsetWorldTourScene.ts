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
  private plateLabels: Phaser.GameObjects.Text[] = [];

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
    this.clearPlateLabels();

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
    // Section-like perspective: inland/high at top, sea/lower at bottom.
    g.fillStyle(0xd78c6f, 1);
    g.fillRect(0, 72, 540, 180);
    g.fillStyle(0xe8ad7d, 1);
    g.fillRect(0, 252, 540, 86);

    // UPPER TERRACE - Cable Car Station / Anh Duong Square.
    g.fillStyle(0xd1b98f, 1);
    g.beginPath();
    g.moveTo(46, 290);
    g.lineTo(494, 290);
    g.lineTo(458, 364);
    g.lineTo(82, 364);
    g.closePath();
    g.fillPath();

    g.fillStyle(0xb9604f, 1);
    g.fillRect(118, 190, 260, 104);
    g.fillStyle(0xe3c47d, 1);
    g.fillRect(148, 164, 200, 34);
    g.fillStyle(0x264955, 1);
    g.fillRect(158, 224, 180, 50);

    g.fillStyle(0x304c53, 1);
    g.fillRect(94, 142, 10, 150);
    g.fillRect(432, 142, 10, 150);
    g.lineStyle(3, 0x273e44, 0.9);
    g.lineBetween(99, 152, 12, 82);
    g.lineBetween(437, 152, 528, 82);

    // MIDDLE TERRACE - Sunset Bazaar.
    g.fillStyle(0xbea77f, 1);
    g.beginPath();
    g.moveTo(84, 366);
    g.lineTo(456, 366);
    g.lineTo(428, 433);
    g.lineTo(112, 433);
    g.closePath();
    g.fillPath();

    g.fillStyle(0x9a5148, 1);
    g.fillRect(150, 382, 240, 34);
    for (let i = 0; i < 10; i += 1) {
      g.fillStyle(i % 2 === 0 ? 0xfcbd22 : 0xe98566, 1);
      g.fillRect(160 + i * 21, 392, 8, 8);
    }

    // LOWER TERRACE - Kiss of the Sea stage.
    g.fillStyle(0xaa9777, 1);
    g.beginPath();
    g.moveTo(114, 435);
    g.lineTo(426, 435);
    g.lineTo(398, 502);
    g.lineTo(142, 502);
    g.closePath();
    g.fillPath();

    g.lineStyle(7, 0xc66f5b, 0.95);
    g.strokeCircle(270, 468, 30);
    g.lineStyle(3, 0xf2c872, 0.82);
    g.strokeCircle(270, 468, 19);

    // SEAFRONT - Kiss Bridge beyond the stage.
    g.fillStyle(0x287b8d, 1);
    g.fillRect(0, 502, 540, 108);
    g.lineStyle(6, 0xe7d6ad, 1);
    g.beginPath();
    g.moveTo(48, 550);
    g.lineTo(164, 520);
    g.lineTo(226, 514);
    g.strokePath();
    g.beginPath();
    g.moveTo(492, 550);
    g.lineTo(378, 520);
    g.lineTo(316, 514);
    g.strokePath();

    // Vertical connectors make the terrace hierarchy explicit.
    g.lineStyle(3, 0x6b655b, 0.8);
    for (let x = 118; x <= 422; x += 38) {
      g.lineBetween(x, 356, x + 8, 370);
      g.lineBetween(x + 8, 425, x + 16, 439);
    }

    this.addPixelLabel('UPPER · CABLE CAR', 270, 310, '#ffe283', 0.5);
    this.addPixelLabel('MIDDLE · SUNSET BAZAAR', 270, 404, '#ffffff', 0.5);
    this.addPixelLabel('LOWER · KISS OF THE SEA', 270, 482, '#ffffff', 0.5);
    this.addPixelLabel('SEAFRONT · KISS BRIDGE', 270, 570, '#d8f3ef', 0.5);
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
    // Perspective corrected from operator-confirmed field references:
    // inland/high is toward the top, seaward/low is toward the bottom.
    g.fillStyle(0xd4866d, 1);
    g.fillRect(0, 72, 540, 150);
    g.fillStyle(0xe9aa77, 1);
    g.fillRect(0, 222, 540, 74);

    // Upper town / cable car context.
    g.fillStyle(0xcfb68c, 1);
    g.beginPath();
    g.moveTo(32, 290);
    g.lineTo(508, 290);
    g.lineTo(466, 355);
    g.lineTo(74, 355);
    g.closePath();
    g.fillPath();
    g.fillStyle(0xb86150, 1);
    g.fillRect(72, 230, 150, 60);
    this.addPixelLabel('CABLE CAR · UPPER', 147, 244, '#ffe283', 0.5);

    // Sunset Bazaar belongs on the middle terrace - not below the stage.
    g.fillStyle(0xbda77f, 1);
    g.beginPath();
    g.moveTo(74, 357);
    g.lineTo(466, 357);
    g.lineTo(430, 421);
    g.lineTo(110, 421);
    g.closePath();
    g.fillPath();

    g.fillStyle(0x9a5148, 1);
    g.fillRect(118, 374, 220, 32);
    for (let i = 0; i < 9; i += 1) {
      g.fillStyle(i % 2 === 0 ? 0xfcbd22 : 0xe98566, 1);
      g.fillRect(130 + i * 21, 384, 8, 8);
    }
    this.addPixelLabel('SUNSET BAZAAR · MIDDLE', 228, 397, '#ffffff', 0.5);

    // One terrace down sits Kiss of the Sea.
    g.fillStyle(0xa99575, 1);
    g.beginPath();
    g.moveTo(110, 423);
    g.lineTo(430, 423);
    g.lineTo(397, 491);
    g.lineTo(143, 491);
    g.closePath();
    g.fillPath();

    g.lineStyle(8, 0xc66f5b, 0.95);
    g.strokeCircle(324, 458, 31);
    g.lineStyle(3, 0xf2c872, 0.85);
    g.strokeCircle(324, 458, 19);
    this.addPixelLabel('KISS OF THE SEA · LOWER', 324, 472, '#ffffff', 0.5);

    // Sea and bridge are beyond the stage.
    g.fillStyle(0x287b8d, 1);
    g.fillRect(0, 491, 540, 119);
    g.fillStyle(0x82cfc7, 0.28);
    for (let x = 18; x < 530; x += 48) g.fillRect(x, 548 + (x % 3) * 5, 24, 3);

    g.lineStyle(7, 0xe7d6ad, 1);
    g.beginPath();
    g.moveTo(30, 555);
    g.lineTo(145, 515);
    g.lineTo(226, 510);
    g.strokePath();
    g.beginPath();
    g.moveTo(510, 555);
    g.lineTo(397, 515);
    g.lineTo(316, 510);
    g.strokePath();

    this.addPixelLabel('KISS BRIDGE · SEAFRONT', 270, 524, '#ffe283', 0.5);

    // Stair/level transitions, deliberately schematic rather than metric.
    g.lineStyle(3, 0x6c6558, 0.8);
    for (let x = 90; x <= 420; x += 42) {
      g.lineBetween(x, 347, x + 10, 363);
      g.lineBetween(x + 10, 413, x + 20, 429);
    }
  }

  private drawPlaceGraph(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0x0b3447, 1);
    g.fillRect(0, 72, 540, 538);

    const positions: Readonly<Record<string, { x: number; y: number }>> = {
      'central-village': { x: 270, y: 145 },
      'clock-tower': { x: 270, y: 220 },
      'cable-car-station': { x: 138, y: 300 },
      'sunset-bazaar': { x: 250, y: 380 },
      'kiss-stage': { x: 330, y: 465 },
      'kiss-bridge': { x: 330, y: 555 }
    };

    // Terrace bands make the graph explicitly 3D-ish rather than planar.
    const bands = [
      { y: 116, h: 215, label: 'UPPER TERRACE' },
      { y: 332, h: 82, label: 'MIDDLE TERRACE' },
      { y: 415, h: 84, label: 'LOWER TERRACE' },
      { y: 500, h: 96, label: 'SEAFRONT' }
    ];
    for (let i = 0; i < bands.length; i += 1) {
      const band = bands[i];
      g.fillStyle(i % 2 === 0 ? 0x123d4b : 0x164654, 0.72);
      g.fillRect(26, band.y, 488, band.h);
      this.addPixelLabel(band.label, 38, band.y + 8, '#7faeb5');
    }

    for (const edge of SUNSET_TOWN_GRAPH_EDGES) {
      const from = positions[edge.from];
      const to = positions[edge.to];
      if (!from || !to) continue;

      const vertical =
        edge.relation === 'above' ||
        edge.relation === 'below' ||
        edge.relation === 'terraced-to' ||
        edge.relation === 'inland-of' ||
        edge.relation === 'seaward-of';

      g.lineStyle(
        vertical ? 3 : 2,
        vertical ? 0xf0c86e : 0x8bd9d2,
        edge.confidence === 'verified' ? 0.84 : 0.48
      );
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
        position.y - 20,
        strong ? '#ffe283' : '#d5ecea',
        0.5
      );
    }

    this.addPixelLabel('INLAND / HIGH', 492, 124, '#a8d2d5', 1);
    this.addPixelLabel('SEA / LOW', 492, 572, '#a8d2d5', 1);
    this.addPixelLabel('3D RELATION GRAPH · NOT A METRIC MAP', 270, 603, '#8fb4bc', 0.5);
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

  private clearPlateLabels(): void {
    for (const label of this.plateLabels) label.destroy();
    this.plateLabels = [];
  }

  private addPixelLabel(
    text: string,
    x: number,
    y: number,
    color: string,
    originX = 0
  ): Phaser.GameObjects.Text {
    const label = this.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '8px',
      fontStyle: 'bold',
      color,
      backgroundColor: '#082c3bcc',
      padding: { x: 4, y: 2 }
    }).setOrigin(originX, 0).setDepth(20);
    this.plateLabels.push(label);
    return label;
  }
}
