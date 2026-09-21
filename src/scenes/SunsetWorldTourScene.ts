import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { createButton } from '../ui/createButton';
import {
  SUNSET_TOWN_GRAPH_EDGES,
  SUNSET_TOWN_GRAPH_NODES,
  SUNSET_TOWN_WORLD_PLATES
} from '../world-v2/places/sunset-town-graph';
import { SUNSET_TOWN_EDITOR_CAPTURE_ORIENTATION } from '../world-v2/places/sunset-town-operator-layout';
import {
  SUNSET_TOWN_COMPOSITION,
  SUNSET_TOWN_ROUTE_CANDIDATE,
  SUNSET_TOWN_ROUTE_CANDIDATE_STATUS
} from '../world-v2/places/sunset-town-composition';
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
    g.fillStyle(0x0b3447, 1);
    g.fillRect(0, 72, 540, 538);

    // Sea-axis correction only: keep all approved nodes exactly where they were
    // and move only the open-water edge to the left.
    g.fillStyle(0x226f83, 0.52);
    g.fillRect(0, 72, 112, 538);
    g.fillStyle(0x83d0c8, 0.22);
    for (let y = 118; y < 596; y += 44) g.fillRect(30 + (y % 3) * 5, y, 24, 3);

    this.drawCompositionLayer(g);

    const ids = [
      'central-village',
      'clock-tower',
      'apollo-square',
      'sunset-bazaar',
      'cable-car-station',
      'kiss-seating',
      'kiss-bridge'
    ] as const;

    for (const id of ids) {
      const p = this.operatorPosition(id);
      const color =
        id === 'clock-tower' || id === 'kiss-bridge'
          ? '#ffe283'
          : id === 'kiss-seating'
            ? '#f0a17e'
            : '#d5ecea';
      this.drawPlanNode(g, id, p.x, p.y, color);
    }

    this.addPixelLabel('WORLD MASSING · OPERATOR PLAN', 26, 116, '#8bd9d2');
    this.addPixelLabel('SEA / WEST ←', 24, 326, '#ffe283');
    this.addPixelLabel('NODE LAYOUT FROZEN', 516, 104, '#8fb4bc', 1);
    this.addPixelLabel('NODE POSITIONS LOCKED · MASSING MAY STILL CHANGE', 270, 611, '#8fb4bc', 0.5);
  }

  private drawCentralVillage(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0x0b3447, 1);
    g.fillRect(0, 72, 540, 538);

    this.drawCompositionLayer(g);

    const central = this.operatorPosition('central-village');
    const clock = this.operatorPosition('clock-tower');
    const apollo = this.operatorPosition('apollo-square');

    // Readable central-town fabric without moving the approved anchors.
    g.lineStyle(3, 0x8bd9d2, 0.42);
    g.lineBetween(central.x, central.y, clock.x, clock.y);
    g.lineBetween(clock.x, clock.y, apollo.x, apollo.y);

    this.drawPlanNode(g, 'central-village', central.x, central.y, '#d5ecea');
    this.drawPlanNode(g, 'clock-tower', clock.x, clock.y, '#ffe283');
    this.drawPlanNode(g, 'apollo-square', apollo.x, apollo.y, '#d5ecea');

    // Central Village faces west toward the sea - left in the canonical plan.
    g.lineStyle(4, 0xfcbd22, 0.82);
    g.lineBetween(central.x - 12, central.y + 12, Math.max(34, central.x - 98), central.y + 12);
    g.fillStyle(0xfcbd22, 0.92);
    g.fillTriangle(
      Math.max(28, central.x - 102), central.y + 12,
      Math.max(42, central.x - 88), central.y + 4,
      Math.max(42, central.x - 88), central.y + 20
    );
    this.addPixelLabel('VIEW WEST ← SEA', Math.max(34, central.x - 112), central.y + 26, '#ffe283');

    // Clock Tower visual mass sits at its node, but does not replace the node.
    this.drawClockTower(g, clock.x, clock.y - 76, 0.48);

    this.addPixelLabel('CENTRAL CLUSTER · DENSITY / MATERIAL QA', 26, 118, '#8bd9d2');
    this.addPixelLabel('WARM FACADES · STONE PLAZA · TIGHTER URBAN MASS', 270, 585, '#bcd9dc', 0.5);
    this.addPixelLabel('NO ROUTE APPROVAL FROM THIS PLATE', 270, 606, '#8fb4bc', 0.5);
  }

  private drawTransport(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0x0b3447, 1);
    g.fillRect(0, 72, 540, 538);

    this.addPixelLabel('OPERATOR PLAN · ORIGINAL LAYOUT', 26, 120, '#8bd9d2');
    this.addPixelLabel('SEA / WEST ←', 28, 330, '#ffe283');
    this.addPixelLabel('NODES UNCHANGED', 512, 108, '#8fb4bc', 1);

    const cable = this.operatorPosition('cable-car-station');
    const seating = this.operatorPosition('kiss-seating');
    const showStage = this.kissShowStagePosition();
    const bridge = this.operatorPosition('kiss-bridge');

    this.drawKissShowGeometry(g);
    this.drawPlanNode(g, 'cable-car-station', cable.x, cable.y, '#ffe283');
    this.drawPlanNode(g, 'kiss-seating', seating.x, seating.y, '#f0a17e');
    this.drawPlanNode(g, 'kiss-show-stage', showStage.x, showStage.y, '#ff9f7f');
    this.drawPlanNode(g, 'kiss-bridge', bridge.x, bridge.y, '#ffe283');

    g.lineStyle(2, 0x8bd9d2, 0.58);
    g.lineBetween(cable.x, cable.y, seating.x, seating.y);
    g.lineBetween(seating.x, seating.y, showStage.x, showStage.y);

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
    this.addPixelLabel('KISS SEATING · 1 LEVEL DOWN', 373, 566, '#ffffff', 0.5);
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
    g.fillStyle(0x0b3447, 1);
    g.fillRect(0, 72, 540, 538);

    this.drawCompositionLayer(g);

    this.addPixelLabel('OPERATOR-APPROVED RELATIVE PLAN', 26, 114, '#8bd9d2');
    g.fillStyle(0x226f83, 0.34);
    g.fillRect(0, 72, 102, 538);

    this.addPixelLabel('SEA / WEST ←', 24, 326, '#ffe283');
    this.addPixelLabel('NODES UNCHANGED', 516, 104, '#8fb4bc', 1);

    const ids = [
      'central-village',
      'clock-tower',
      'sunset-bazaar',
      'apollo-square',
      'cable-car-station',
      'kiss-seating',
      'kiss-bridge'
    ] as const;

    for (const id of ids) {
      const p = this.operatorPosition(id);
      const color =
        id === 'clock-tower' || id === 'kiss-bridge'
          ? '#ffe283'
          : id === 'kiss-seating'
            ? '#f0a17e'
            : '#d5ecea';
      this.drawPlanNode(g, id, p.x, p.y, color);
    }

    const showStage = this.kissShowStagePosition();
    this.drawPlanNode(g, 'kiss-show-stage', showStage.x, showStage.y, '#ff9f7f');

    const links: readonly [string, string][] = [
      ['central-village', 'clock-tower'],
      ['clock-tower', 'sunset-bazaar'],
      ['sunset-bazaar', 'kiss-bridge'],
      ['cable-car-station', 'kiss-seating']
    ];
    g.lineStyle(2, 0x8bd9d2, 0.42);
    for (const [a, b] of links) {
      const pa = this.operatorPosition(a);
      const pb = this.operatorPosition(b);
      g.lineBetween(pa.x, pa.y, pb.x, pb.y);
    }
    const seating = this.operatorPosition('kiss-seating');
    g.lineBetween(seating.x, seating.y, showStage.x, showStage.y);

    this.drawRouteCandidate(g);
    this.addPixelLabel('LAYOUT FROM YOUR DRAG EDITOR · NO GEO RE-NORMALIZATION', 270, 610, '#8fb4bc', 0.5);
  }

  private drawPlaceGraph(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0x0b3447, 1);
    g.fillRect(0, 72, 540, 538);

    this.addPixelLabel('APPROVED COMPOSITION GRAPH · LAYOUT FROZEN', 26, 112, '#8bd9d2');
    this.addPixelLabel('SOLID = PLAN RELATION · GOLD = LOCAL LEVEL RELATION', 26, 133, '#8fb4bc');

    const ids = [
      'central-village',
      'clock-tower',
      'sunset-bazaar',
      'apollo-square',
      'cable-car-station',
      'kiss-seating',
      'kiss-bridge'
    ] as const;

    const positions: Record<string, { x: number; y: number }> = {};
    for (const id of ids) positions[id] = this.operatorPosition(id);
    positions['kiss-show-stage'] = this.kissShowStagePosition();

    const edges: readonly [string, string, 'plan' | 'level'][] = [
      ['central-village', 'clock-tower', 'plan'],
      ['clock-tower', 'sunset-bazaar', 'plan'],
      ['sunset-bazaar', 'kiss-bridge', 'plan'],
      ['cable-car-station', 'kiss-seating', 'level'],
      ['kiss-seating', 'kiss-show-stage', 'plan'],
      ['kiss-show-stage', 'kiss-bridge', 'plan']
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
          : id === 'kiss-seating'
            ? '#f0a17e'
            : '#d5ecea'
      );
    }
    const showStage = positions['kiss-show-stage'];
    this.drawPlanNode(g, 'kiss-show-stage', showStage.x, showStage.y, '#ff9f7f');

    this.drawRouteCandidate(g);
    this.addPixelLabel('PLAN SOURCE: OPERATOR DRAG LAYOUT', 270, 584, '#8fb4bc', 0.5);
    this.addPixelLabel('GEO + ELEVATION REMAIN SEPARATE DATA LAYERS', 270, 605, '#8fb4bc', 0.5);
  }

  private drawCompositionLayer(g: Phaser.GameObjects.Graphics): void {
    for (const element of SUNSET_TOWN_COMPOSITION) {
      const position = this.compositionPosition(element);
      const x = position.x;
      const y = position.y;
      const width = element.size.x * 416;
      const height = element.size.y * 330;

      switch (element.kind) {
        case 'building-mass': {
          const tones = [0xb96452, 0xd58b61, 0xd7b67e, 0x8b675f];
          for (let i = 0; i < 4; i += 1) {
            const w = width * (0.34 + (i % 2) * 0.08);
            const h = height * (0.55 + ((i + 1) % 3) * 0.12);
            const bx = x - width / 2 + (i % 2) * width * 0.48 + 4;
            const by = y - height / 2 + Math.floor(i / 2) * height * 0.44;
            g.fillStyle(tones[i % tones.length], element.confidence === 'visual-only' ? 0.52 : 0.82);
            g.fillRect(bx, by, w, h);
            g.fillStyle(0xf0d9ad, 0.42);
            g.fillRect(bx + 7, by + 8, Math.max(5, w * 0.16), Math.max(5, h * 0.12));
          }
          break;
        }
        case 'plaza':
          g.fillStyle(0xcab48d, element.confidence === 'visual-only' ? 0.35 : 0.56);
          g.fillEllipse(x, y, width, height);
          g.lineStyle(2, 0xe3cfaa, 0.3);
          g.strokeEllipse(x, y, width, height);
          break;
        case 'stairs': {
          g.lineStyle(3, 0xd7c49d, 0.74);
          const steps = 7;
          for (let i = 0; i < steps; i += 1) {
            const sy = y - height / 2 + (i / steps) * height;
            const inset = (i / steps) * width * 0.22;
            g.lineBetween(x - width / 2 + inset, sy, x + width / 2 - inset, sy);
          }
          break;
        }
        case 'sea-opening':
          g.fillStyle(0x2b8393, 0.34);
          g.fillEllipse(x, y, width, height);
          g.lineStyle(2, 0x9ddbd5, 0.22);
          g.strokeEllipse(x, y, width, height);
          break;
        case 'audience-bowl':
          g.fillStyle(0xcab48d, 0.48);
          g.fillEllipse(x, y, width, height);
          g.lineStyle(2, 0xf0d9ad, 0.42);
          g.strokeEllipse(x, y, width, height);
          g.strokeEllipse(x, y, width * 0.72, height * 0.68);
          g.strokeEllipse(x, y, width * 0.46, height * 0.38);
          break;
        case 'performance-stage':
          g.fillStyle(0xc65d52, 0.92);
          g.fillEllipse(x, y, width, height);
          g.lineStyle(3, 0xffb28f, 0.9);
          g.strokeEllipse(x, y, width, height);
          break;
        case 'bridge-arc': {
          g.lineStyle(element.arc?.stroke ?? 8, 0xe6d5aa, 0.96);
          const start = Phaser.Math.DegToRad(element.arc?.startDeg ?? 55);
          const end = Phaser.Math.DegToRad(element.arc?.endDeg ?? 305);
          const steps = 34;
          let previousX = x + Math.cos(start) * width * 0.5;
          let previousY = y + Math.sin(start) * height * 0.5;
          for (let i = 1; i <= steps; i += 1) {
            const angle = Phaser.Math.Linear(start, end, i / steps);
            const nextX = x + Math.cos(angle) * width * 0.5;
            const nextY = y + Math.sin(angle) * height * 0.5;
            g.lineBetween(previousX, previousY, nextX, nextY);
            previousX = nextX;
            previousY = nextY;
          }
          g.lineStyle(2, 0xf7e9c7, 0.7);
          previousX = x + Math.cos(start) * width * 0.43;
          previousY = y + Math.sin(start) * height * 0.43;
          for (let i = 1; i <= steps; i += 1) {
            const angle = Phaser.Math.Linear(start, end, i / steps);
            const nextX = x + Math.cos(angle) * width * 0.43;
            const nextY = y + Math.sin(angle) * height * 0.43;
            g.lineBetween(previousX, previousY, nextX, nextY);
            previousX = nextX;
            previousY = nextY;
          }
          break;
        }
        case 'light-band':
          g.fillStyle(0x9d5048, 0.54);
          g.fillRoundedRect(x - width / 2, y - height / 2, width, height, 5);
          for (let i = 0; i < 8; i += 1) {
            g.fillStyle(i % 2 === 0 ? 0xfcbd22 : 0xe98566, 0.86);
            g.fillRect(x - width * 0.38 + i * width * 0.105, y - 3, 6, 6);
          }
          break;
      }
    }
  }

  private drawRouteCandidate(g: Phaser.GameObjects.Graphics): void {
    if (SUNSET_TOWN_ROUTE_CANDIDATE_STATUS !== 'hypothesis') return;

    g.lineStyle(3, 0xf0a17e, 0.55);
    for (let i = 0; i < SUNSET_TOWN_ROUTE_CANDIDATE.length - 1; i += 1) {
      const a = this.operatorPosition(SUNSET_TOWN_ROUTE_CANDIDATE[i]);
      const b = this.operatorPosition(SUNSET_TOWN_ROUTE_CANDIDATE[i + 1]);
      const parts = 10;
      for (let p = 0; p < parts; p += 2) {
        const t1 = p / parts;
        const t2 = Math.min(1, (p + 1) / parts);
        g.lineBetween(
          Phaser.Math.Linear(a.x, b.x, t1),
          Phaser.Math.Linear(a.y, b.y, t1),
          Phaser.Math.Linear(a.x, b.x, t2),
          Phaser.Math.Linear(a.y, b.y, t2)
        );
      }
    }

    this.addPixelLabel('ROUTE CANDIDATE · HYPOTHESIS ONLY', 270, 566, '#f0a17e', 0.5);
  }

  private kissShowStagePosition(): { x: number; y: number } {
    const stage = SUNSET_TOWN_COMPOSITION.find((element) => element.id === 'kiss-performance-stage');
    if (!stage) return this.operatorPosition('kiss-seating');
    return this.compositionPosition(stage);
  }

  private drawKissShowGeometry(g: Phaser.GameObjects.Graphics): void {
    const ids = new Set(['kiss-audience-bowl', 'kiss-performance-stage', 'kiss-bridge-arc']);
    for (const element of SUNSET_TOWN_COMPOSITION) {
      if (!ids.has(element.id)) continue;

      const position = this.compositionPosition(element);
      const x = position.x;
      const y = position.y;
      const width = element.size.x * 416;
      const height = element.size.y * 330;

      if (element.kind === 'audience-bowl') {
        g.fillStyle(0xcab48d, 0.48);
        g.fillEllipse(x, y, width, height);
        g.lineStyle(2, 0xf0d9ad, 0.42);
        g.strokeEllipse(x, y, width, height);
        g.strokeEllipse(x, y, width * 0.72, height * 0.68);
      }

      if (element.kind === 'performance-stage') {
        g.fillStyle(0xc65d52, 0.92);
        g.fillEllipse(x, y, width, height);
        g.lineStyle(3, 0xffb28f, 0.9);
        g.strokeEllipse(x, y, width, height);
      }

      if (element.kind === 'bridge-arc') {
        g.lineStyle(element.arc?.stroke ?? 8, 0xe6d5aa, 0.96);
        const start = Phaser.Math.DegToRad(element.arc?.startDeg ?? 55);
        const end = Phaser.Math.DegToRad(element.arc?.endDeg ?? 305);
        const steps = 34;
        let previousX = x + Math.cos(start) * width * 0.5;
        let previousY = y + Math.sin(start) * height * 0.5;
        for (let i = 1; i <= steps; i += 1) {
          const angle = Phaser.Math.Linear(start, end, i / steps);
          const nextX = x + Math.cos(angle) * width * 0.5;
          const nextY = y + Math.sin(angle) * height * 0.5;
          g.lineBetween(previousX, previousY, nextX, nextY);
          previousX = nextX;
          previousY = nextY;
        }
      }
    }
  }

  private compositionPosition(
    element: (typeof SUNSET_TOWN_COMPOSITION)[number]
  ): { x: number; y: number } {
    if (element.absoluteCenter) return this.editorPointPosition(element.absoluteCenter);

    const anchor = this.operatorPosition(element.anchorId);
    return {
      x: anchor.x + element.offset.x * 416,
      y: anchor.y + element.offset.y * 330
    };
  }

  private editorPointPosition(point: { x: number; y: number }): { x: number; y: number } {
    const oriented = SUNSET_TOWN_EDITOR_CAPTURE_ORIENTATION === 'east-up'
      ? { x: 1 - point.y, y: point.x }
      : point;

    return {
      x: 62 + oriented.x * 416,
      y: 160 + oriented.y * 330
    };
  }

  private operatorPosition(id: string): { x: number; y: number } {
    const node = SUNSET_TOWN_GRAPH_NODES.find((item) => item.id === id);
    if (!node?.operatorPlanPoint) return { x: 270, y: 340 };
    return this.editorPointPosition(node.operatorPlanPoint);
  }

  private planPosition(id: string): { x: number; y: number } {
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
