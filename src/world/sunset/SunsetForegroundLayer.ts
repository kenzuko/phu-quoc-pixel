import Phaser from 'phaser';

const WIDTH = 540;
const HORIZON = 438;
const LOWER_HEIGHT = 522;

/**
 * Near-camera environment from the owner's locked rear-chase master.
 *
 * The center of this image is transparent on purpose. Runtime road, lanes,
 * player, collectibles and hazards remain independent; only the real Sunset
 * Town edge art - cafes, lamps, flowers, curb and promenade - is painted here.
 */
export class SunsetForegroundLayer {
  private readonly masterSides: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.masterSides = scene.add
      .image(0, HORIZON, 'no-brakes-master-sides')
      .setOrigin(0, 0)
      .setDisplaySize(WIDTH, LOWER_HEIGHT)
      .setDepth(-15);

    this.masterSides.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
}
