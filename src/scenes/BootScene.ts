import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { APPROVED_REAR_RIDER_DATA_URI } from '../art/ApprovedChaseArt';
import { assetRegistry } from '../core/assets/AssetRegistry';

export class BootScene extends Phaser.Scene {
  private legacy = false;

  constructor() {
    super(SceneKeys.Boot);
  }

  preload(): void {
    this.legacy = new URLSearchParams(window.location.search).get('v1') === '1';

    // V2 is data-first and intentionally does not preload the V1 world.
    // Legacy assets load only when the explicit V1 reference route is requested.
    if (!this.legacy) return;

    assetRegistry.queueGroup(this, 'shell-map');
    this.load.image('approved-rear-rider', APPROVED_REAR_RIDER_DATA_URI);
    this.load.image('no-brakes-master-horizon', './assets/world/sunset/no-brakes-master-horizon.webp');
    this.load.image('no-brakes-master-sides', './assets/world/sunset/no-brakes-master-sides.webp');
    this.load.image('master-landing', './assets/master/landing-master-v4.avif');
    this.load.image('master-airport', './assets/master/airport-master-v4.avif');
    this.load.image('master-island-map', './assets/master/island-map-approved-v4.avif');
  }

  create(): void {
    this.scene.start(this.legacy ? SceneKeys.Landing : SceneKeys.V2Hub);
  }
}
