import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { createButton } from '../ui/createButton';

export class V2HubScene extends Phaser.Scene {
  constructor() { super(SceneKeys.V2Hub); }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#061c2b');

    const g = this.add.graphics();
    g.fillStyle(0x0c3850, 1);
    g.fillRect(0, 0, width, height);
    g.fillStyle(0x0d6f7d, 0.28);
    g.fillRect(0, 0, width, 300);
    g.fillStyle(0xf6c43f, 1);
    g.fillRect(48, 82, 56, 8);
    g.fillRect(width - 104, 82, 56, 8);

    this.add.text(width / 2, 118, 'PHU QUOC', {
      fontFamily: 'monospace', fontSize: '18px', fontStyle: 'bold', color: '#8de4df'
    }).setOrigin(0.5);

    this.add.text(width / 2, 158, 'PIXEL ISLAND', {
      fontFamily: 'monospace', fontSize: '35px', fontStyle: 'bold',
      color: '#ffffff', stroke: '#04151f', strokeThickness: 5
    }).setOrigin(0.5);

    this.add.text(width / 2, 216, 'WORLD V2 · REALITY FIRST', {
      fontFamily: 'monospace', fontSize: '12px', fontStyle: 'bold', color: '#f6c43f'
    }).setOrigin(0.5);

    this.add.text(width / 2, 330, 'ONE WORLD MODEL\nMAP + PLACE + ROUTE + GAMEPLAY', {
      fontFamily: 'monospace', fontSize: '15px', align: 'center',
      lineSpacing: 10, color: '#d6edf1'
    }).setOrigin(0.5).setAlpha(0.9);

    createButton(this, width / 2, 480, 'ISLAND MAP V2', () => {
      flowController.go(this, SceneKeys.IslandMapV2);
    }, { width: 330, fontSize: 17 });

    createButton(this, width / 2, 560, 'SUNSET WORLD TOUR', () => {
      flowController.go(this, SceneKeys.SunsetWorldTour);
    }, { width: 330, fontSize: 15, backgroundColor: '#164b61', color: '#ffffff' });

    this.add.text(width / 2, 692, 'V2 TEST BUILD\nNo gameplay is allowed to hide a wrong world.', {
      fontFamily: 'monospace', fontSize: '10px', align: 'center',
      lineSpacing: 6, color: '#8ab8c1'
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 42, 'V1 REFERENCE: ?v1=1', {
      fontFamily: 'monospace', fontSize: '9px', color: '#628c98'
    }).setOrigin(0.5);
  }
}
