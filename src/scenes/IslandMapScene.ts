import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { progressStore } from '../core/progress/ProgressStore';
import { createCharacterPortrait } from '../ui/CharacterPortrait';
import { createButton } from '../ui/createButton';
import { ISLAND_LOCATIONS } from '../world/locations';
import { PhuQuocMapArt } from '../world/PhuQuocMapArt';

export class IslandMapScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.IslandMap);
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#07374a');

    const profile = progressStore.getProfile();
    const progress = progressStore.getProgress();

    const header = this.add.graphics();
    header.fillStyle(0x082a3a, 1);
    header.fillRect(0, 0, width, 150);
    header.fillStyle(0x0c5167, 1);
    header.fillRect(0, 150, width, height - 150);

    this.add
      .text(34, 38, `WELCOME, ${profile.displayName.toUpperCase()}`, {
        fontFamily: 'monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#fcbd22'
      })
      .setOrigin(0, 0.5);

    this.add
      .text(34, 76, 'PHU QUOC ISLAND', {
        fontFamily: 'monospace',
        fontSize: '27px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#061b24',
        strokeThickness: 4
      })
      .setOrigin(0, 0.5);

    this.add
      .text(34, 114, `JO ${progress.totalJo}  ·  EXPLORE THE REAL ISLAND`, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#b8dfe5'
      })
      .setOrigin(0, 0.5);

    this.add.circle(472, 72, 47, 0x0b4254, 1).setStrokeStyle(3, 0xfcbd22, 0.7);
    createCharacterPortrait(this, profile.characterId, 472, 76, 0.48).setDepth(3);
    this.add
      .text(472, 132, profile.characterId.toUpperCase(), {
        fontFamily: 'monospace',
        fontSize: '8px',
        fontStyle: 'bold',
        color: '#d7eef1'
      })
      .setOrigin(0.5);

    const mapLeft = 64;
    const mapTop = 164;
    const mapWidth = 412;
    const mapHeight = 560;
    const map = new PhuQuocMapArt(this, mapLeft, mapTop, mapWidth, mapHeight);

    this.add
      .text(mapLeft + 18, mapTop + 15, 'NORTH', {
        fontFamily: 'monospace',
        fontSize: '8px',
        fontStyle: 'bold',
        color: '#d6eef2'
      })
      .setOrigin(0, 0.5)
      .setDepth(3);

    let notice: Phaser.GameObjects.Text | undefined;

    const labelOffsets: Record<string, { x: number; y: number }> = {
      'sunset-town': { x: -42, y: 18 },
      'hon-thom': { x: 38, y: 3 },
      'bai-sao': { x: 41, y: 4 },
      'night-market': { x: -52, y: -8 },
      'grand-world': { x: -48, y: 16 },
      safari: { x: 45, y: -4 }
    };

    ISLAND_LOCATIONS.forEach((location) => {
      const p = map.geoToScreen(location.coordinates.lat, location.coordinates.lon);
      const available = location.status === 'available';
      const offset = labelOffsets[location.id] ?? { x: 0, y: 18 };

      if (available) {
        this.add.circle(p.x, p.y, 23, 0xfcbd22, 0.12).setDepth(4);
        this.tweens.add({
          targets: this.add.circle(p.x, p.y, 17, 0xfcbd22, 0.18).setDepth(4),
          scaleX: 1.5,
          scaleY: 1.5,
          alpha: 0,
          duration: 1100,
          repeat: -1,
          ease: 'Sine.Out'
        });
      }

      const pin = this.add
        .circle(p.x, p.y, available ? 11 : 7, available ? 0xfcbd22 : 0x345c62)
        .setStrokeStyle(2, available ? 0xffffff : 0x83a5aa, 0.95)
        .setDepth(6);

      if (available) {
        this.add.circle(p.x, p.y, 3, 0x0b3545, 1).setDepth(7);
      }

      const label = this.add
        .text(p.x + offset.x, p.y + offset.y, location.label, {
          fontFamily: 'monospace',
          fontSize: available ? '10px' : '7px',
          fontStyle: 'bold',
          color: available ? '#ffffff' : '#d1e0df',
          backgroundColor: available ? '#07374ae8' : '#07374abb',
          padding: { x: 4, y: 3 }
        })
        .setOrigin(0.5)
        .setDepth(8);

      if (available) {
        pin.setInteractive({ useHandCursor: true });
        label.setInteractive({ useHandCursor: true });
        const open = (): void => {
          if (notice) notice.destroy();
          notice = this.add
            .text(width / 2, 759, 'SUNSET TOWN  ·  NO BRAKES  ·  GO!', {
              fontFamily: 'monospace',
              fontSize: '14px',
              fontStyle: 'bold',
              color: '#082a3a',
              backgroundColor: '#fcbd22',
              padding: { x: 14, y: 10 }
            })
            .setOrigin(0.5)
            .setDepth(20);

          this.time.delayedCall(240, () => flowController.go(this, SceneKeys.NoBrakes));
        };
        pin.on('pointerdown', open);
        label.on('pointerdown', open);
      }
    });

    this.add
      .text(width / 2, 804, 'GEOGRAPHIC PINS  ·  MORE ISLAND STORIES UNLOCK LATER', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#acd5dc'
      })
      .setOrigin(0.5);

    createButton(
      this,
      114,
      height - 47,
      'CHARACTER',
      () => flowController.go(this, SceneKeys.Character),
      { width: 175, fontSize: 13, backgroundColor: '#164b61', color: '#ffffff' }
    );

    this.add
      .text(width - 32, height - 47, 'SUNSET TOWN OPEN', {
        fontFamily: 'monospace',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#fcbd22'
      })
      .setOrigin(1, 0.5);
  }
}
