import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { createButton } from '../ui/createButton';
import {
  SUNSET_TOWN_GRAPH_EDGES,
  SUNSET_TOWN_GRAPH_NODES,
  SUNSET_TOWN_WORLD_PLATES
} from '../world-v2/places/sunset-town-graph';
import { SUNSET_TOWN_OPERATOR_PLAN_ORIENTATION } from '../world-v2/places/sunset-town-operator-layout';
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
    g.fillStyle(0x0b3447, 1);
    g.fillRect(0, 72, 540, 538);

    this.addPixelLabel('OPERATOR PLAN · EAST-UP', 26, 120, '#8bd9d2');
    this.addPixelLabel('E ↑', 270, 108, '#ffffff', 0.5);
    this.addPixelLabel('N ←', 28, 330, '#ffffff');
    this.addPixelLabel('S →', 512, 330, '#ffffff', 1);
    this.addPixelLabel('W / SEA ↓', 270, 586, '#ffe283', 0.5);

    const cable = this.operatorPosition('cable-car-station');
    const stage = this.operatorPosition('kiss-stage');
    const bridge = this.operatorPosition('kiss-bridge');

    this.drawPlanNode(g, 'cable-car-station', cable.x, cable.y, '#ffe283');
    this.drawPlanNode(g, 'kiss-stage', stage.x, stage.y, '#f0a17e');
    this.drawPlanNode(g, 'kiss-bridge', bridge.x, bridge.y, '#ffe283');

    g.lineStyle(2, 0x8bd9d2, 0.58);
    g.lineBetween(cable.x, cable.y, stage.x, stage.y);
    g.lineBetween(stage.x, stage.y, bridge.x, bridge.y);

    // Separate elevation section. This does not alter the approved plan.
    g.fillStyle(0x123e4b, 0.96);
    g.fillRect(34, 470, 472, 102);
    this.addPixelLabel('LOCAL ELEVATION ONLY', 50, 482, '#8bd9d2');
    g.fillStyle(0xd3bd91, 1);
    g.fillRect(82, 522, 150, 14);
    g.fillRect(304, 548, 138, 14);
    g.lineStyle(3, 0xd3bd91, 1);
    g.lineBetween(232, 529, 304, 555);
    this.addPixelLabel('CABLE CAR · ABOVE', 157, 503, '#ffe283', 0.5);
    this.addPixelLabel('KISS STAGE · 1 LEVEL DOWN', 373, 566, '#ffffff', 0.5);
  }

  private drawApolloSquare  private drawApolloSquare(g: Phaser.GameObjects.Graphics): void {
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
    g.fillStyle(0x0b3447, 1);
    g.fillRect(0, 72, 540, 538);

    this.addPixelLabel('OPERATOR-APPROVED RELATIVE PLAN', 26, 114, '#8bd9d2');
    this.addPixelLabel('E ↑', 270, 104, '#ffffff', 0.5);
    this.addPixelLabel('N ←', 24, 326, '#ffffff');
    this.addPixelLabel('S →', 516, 326, '#ffffff', 1);
    this.addPixelLabel('W / SEA ↓', 270, 592, '#ffe283', 0.5);

    const ids = [
      'central-village',
      'clock-tower',
      'sunset-bazaar',
      'apollo-square',
      'cable-car-station',
      'kiss-stage',
      'kiss-bridge'
    ] as const;

    for (const id of ids) {
      const p = this.operatorPosition(id);
      const color =
        id === 'clock-tower' || id === 'kiss-bridge'
          ? '#ffe283'
          : id === 'kiss-stage'
            ? '#f0a17e'
            : '#d5ecea';
      this.drawPlanNode(g, id, p.x, p.y, color);
    }

    const links: readonly [string, string][] = [
      ['central-village', 'clock-tower'],
      ['clock-tower', 'sunset-bazaar'],
      ['sunset-bazaar', 'kiss-bridge'],
      ['cable-car-station', 'kiss-stage'],
      ['kiss-stage', 'kiss-bridge']
    ];
    g.lineStyle(2, 0x8bd9d2, 0.42);
    for (const [a, b] of links) {
      const pa = this.operatorPosition(a);
      const pb = this.operatorPosition(b);
      g.lineBetween(pa.x, pa.y, pb.x, pb.y);
    }

    this.addPixelLabel('LAYOUT FROM YOUR DRAG EDITOR · NO GEO RE-NORMALIZATION', 270, 610, '#8fb4bc', 0.5);
  }

  private drawPlaceGraph  private drawPlaceGraph(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0x0b3447, 1);
    g.fillRect(0, 72, 540, 538);

    this.addPixelLabel('APPROVED PLAN GRAPH · EAST-UP', 26, 112, '#8bd9d2');
    this.addPixelLabel('SOLID = PLAN RELATION · GOLD = LOCAL LEVEL RELATION', 26, 133, '#8fb4bc');

    const ids = [
      'central-village',
      'clock-tower',
      'sunset-bazaar',
      'apollo-square',
      'cable-car-station',
      'kiss-stage',
      'kiss-bridge'
    ] as const;

    const positions: Record<string, { x: number; y: number }> = {};
    for (const id of ids) positions[id] = this.operatorPosition(id);

    const edges: readonly [string, string, 'plan' | 'level'][] = [
      ['central-village', 'clock-tower', 'plan'],
      ['clock-tower', 'sunset-bazaar', 'plan'],
      ['sunset-bazaar', 'kiss-bridge', 'plan'],
      ['cable-car-station', 'kiss-stage', 'level'],
      ['kiss-stage', 'kiss-bridge', 'plan']
    ];

    for (const [a, b, kind] of edges) {
      const pa = positions[a];
      const pb = positions[b];
      g.lineStyle(kind === 'level' ? 3 : 2, kind === 'level' ? 0xf0c86e : 0x8bd9d2, 0.76);
      g.lineBetween(pa.x, pa.y, pb.x, pb.y);
    }

    for (const id of ids) {
      const p = positions[id];
      this.drawPlanNode(
        g,
        id,
        p.x,
        p.y,
        id === 'clock-tower' || id === 'kiss-bridge'
          ? '#ffe283'
          : id === 'kiss-stage'
            ? '#f0a17e'
            : '#d5ecea'
      );
    }

    this.addPixelLabel('PLAN SOURCE: OPERATOR DRAG LAYOUT', 270, 584, '#8fb4bc', 0.5);
    this.addPixelLabel('GEO + ELEVATION REMAIN SEPARATE DATA LAYERS', 270, 605, '#8fb4bc', 0.5);
  }

  private operatorPosition(id: string): { x: number; y: number } {
    const node = SUNSET_TOWN_GRAPH_NODES.find((item) => item.id === id);
    if (!node?.operatorPlanPoint) return { x: 270, y: 340 };

    const point = node.operatorPlanPoint;
    const oriented = SUNSET_TOWN_OPERATOR_PLAN_ORIENTATION === 'east-up'
      ? { x: 1 - point.y, y: point.x }
      : point;

    return {
      x: 62 + oriented.x * 416,
      y: 160 + oriented.y * 330
    };
  }

  private planPosition  private planPosition(id: string): { x: number; y: number } {
    const node = SUNSET_TOWN_GRAPH_NODES.find((item) => item.id === id);
    if (!node?.planPoint) return { x: 270, y: 340 };

    const west = 104.00345;
    const east = 104.00755;
    const north = 10.03045;
    const south = 10.02675;

    const x = 64 + ((node.planPoint.lon - west) / (east - west)) * 412;
    const y = 164 + ((north - node.planPoint.lat) / (north - south)) * 322;
    return { x, y };
  }

  private drawPlanNode(
    g: Phaser.GameObjects.Graphics,
    id: string,
    x: number,
    y: number,
    color: string
  ): void {
    const node = SUNSET_TOWN_GRAPH_NODES.find((item) => item.id === id);
    if (!node) return;

    const value = Number.parseInt(color.replace('#', ''), 16);
    g.fillStyle(value, 1);
    g.fillCircle(x, y, 7);
    g.lineStyle(2, 0x061923, 0.9);
    g.strokeCircle(x, y, 7);

    this.addPixelLabel(node.label, x, y - 19, color, 0.5);
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
