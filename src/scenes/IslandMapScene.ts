import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';

export class IslandMapScene extends Phaser.Scene {
  private selected = false;

  constructor() {
    super(SceneKeys.IslandMap);
  }

  create(): void {
    const { width, height } = this.scale;
    this.selected = false;
    this.cameras.main.setBackgroundColor('#087cc0');

    const master = this.add.image(width / 2, height / 2, 'master-island-map').setDisplaySize(width, height).setDepth(0);
    master.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.makeSunsetHit(193, 706, 130, 74);
    this.makeSunsetHit(339, 600, 110, 110);
    this.cameras.main.fadeIn(180, 4, 38, 58);
  }

  private makeSunsetHit(x: number, y: number, w: number, h: number): void {
    const zone = this.add.zone(x, y, w, h).setDepth(10).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => this.selectSunsetTown());
  }

  private selectSunsetTown(): void {
    if (this.selected) return;
    this.selected = true;
    const { width } = this.scale;

    const panel = this.add.container(0, 0).setDepth(30).setAlpha(0).setY(18);
    const g = this.add.graphics();
    g.fillStyle(0x072d4b, 0.96);
    g.fillRoundedRect(34, 744, width - 68, 136, 16);
    g.lineStyle(3, 0xf5c13f, 0.95);
    g.strokeRoundedRect(34, 744, width - 68, 136, 16);

    const title = this.add.text(58, 764, '13  SUNSET TOWN', {
      fontFamily: 'monospace', fontSize: '18px', fontStyle: 'bold',
      color: '#ffffff', stroke: '#051c2a', strokeThickness: 3
    });

    const copy = this.add.text(58, 796, 'NO BRAKES\nGOLDEN HOUR RIDE · COLLECT JO', {
      fontFamily: 'monospace', fontSize: '10px', fontStyle: 'bold',
      color: '#bfeaff', lineSpacing: 5
    });

    const ride = this.add.text(421, 809, 'RIDE NOW  ›', {
      fontFamily: 'monospace', fontSize: '13px', fontStyle: 'bold',
      color: '#08253c', backgroundColor: '#f6c43f', padding: { x: 14, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    ride.on('pointerdown', () => flowController.go(this, SceneKeys.NoBrakes));
    panel.add([g, title, copy, ride]);
    this.tweens.add({ targets: panel, alpha: 1, y: 0, duration: 220, ease: 'Back.Out' });
  }
}
