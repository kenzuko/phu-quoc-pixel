import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';

export class LandingScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Landing);
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#07375b');
    const master = this.add.image(width / 2, height / 2, 'master-landing').setDisplaySize(width, height).setDepth(0);
    master.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    const enter = this.add.zone(width / 2, 720, 350, 100).setInteractive({ useHandCursor: true }).setDepth(10);
    enter.on('pointerdown', () => flowController.go(this, SceneKeys.Airport));
    this.tweens.add({ targets: master, y: height / 2 - 2, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }
}
