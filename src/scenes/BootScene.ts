import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { APPROVED_REAR_RIDER_DATA_URI } from '../art/ApprovedChaseArt';
import { assetRegistry } from '../core/assets/AssetRegistry';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  preload(): void {
    assetRegistry.queueGroup(this, 'shell-map');
    this.load.image('approved-rear-rider', APPROVED_REAR_RIDER_DATA_URI);
    this.load.image('no-brakes-master-horizon', './assets/world/sunset/no-brakes-master-horizon.webp');
  }

  create(): void {
    this.scene.start(SceneKeys.Landing);
  }
}
