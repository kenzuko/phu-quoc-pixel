import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';

export class AirportScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Airport);
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0a4770');
    const master = this.add.image(width / 2, height / 2, 'master-airport').setDisplaySize(width, height).setDepth(0);
    master.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    const continueZone = this.add.zone(width / 2, 830, 370, 105).setInteractive({ useHandCursor: true }).setDepth(10);
    continueZone.on('pointerdown', () => flowController.go(this, SceneKeys.Character));
    this.cameras.main.fadeIn(220, 7, 36, 58);
    this.time.delayedCall(900, () => this.cameras.main.shake(90, 0.0015));
  }
}
