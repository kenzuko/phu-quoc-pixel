import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { progressStore } from '../core/progress/ProgressStore';
import { createCharacterPortrait } from '../ui/CharacterPortrait';
import { createButton } from '../ui/createButton';
import { ISLAND_LOCATIONS, type IslandLocation } from '../world/locations';
import { PhuQuocMapArt } from '../world/PhuQuocMapArt';

const PQC = { lat: 10.1698, lon: 103.9931 };

export class IslandMapScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.IslandMap);
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#07374a');

    const profile = progressStore.getProfile();
    const progress = progressStore.getProgress();

    this.drawBackgroundMotion(width, height);

    const header = this.add.graphics().setDepth(2);
    header.fillStyle(0x082a3a, 0.96);
    header.fillRect(0, 0, width, 150);
    header.fillStyle(0x0c5167, 0.9);
    header.fillRect(0, 150, width, height - 150);

    const safeLeft = 64;
    const safeRight = width - 64;

    this.add
      .text(safeLeft, 34, `WELCOME, ${profile.displayName.toUpperCase()}`, {
        fontFamily: 'monospace',
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#fcbd22'
      })
      .setOrigin(0, 0.5)
      .setDepth(20);

    this.add
      .text(safeLeft, 69, 'WHERE TO NEXT?', {
        fontFamily: 'monospace',
        fontSize: '26px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#061b24',
        strokeThickness: 4
      })
      .setOrigin(0, 0.5)
      .setDepth(20);

    this.add
      .text(safeLeft, 108, `JO ${progress.totalJo} · EXPLORE PHU QUOC`, {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#b8dfe5'
      })
      .setOrigin(0, 0.5)
      .setDepth(20);

    this.add.circle(448, 69, 38, 0x0b4254, 1).setStrokeStyle(3, 0xfcbd22, 0.7).setDepth(20);
    createCharacterPortrait(this, profile.characterId, 448, 73, 0.4).setDepth(22);

    const mapLeft = 64;
    const mapTop = 154;
    const mapWidth = 412;
    const mapHeight = 548;
    const map = new PhuQuocMapArt(this, mapLeft, mapTop, mapWidth, mapHeight);

    this.add
      .text(mapLeft + 18, mapTop + 16, 'REAL ISLAND MAP · NORTH ↑', {
        fontFamily: 'monospace',
        fontSize: '8px',
        fontStyle: 'bold',
        color: '#e5f6f7'
      })
      .setOrigin(0, 0.5)
      .setDepth(12);

    this.addArrivalStory(map);

    const selectionCard = this.buildSelectionCard(width, height);
    let selected: IslandLocation | undefined;

    const labelOffsets: Record<string, { x: number; y: number }> = {
      'sunset-town': { x: -42, y: 18 },
      'hon-thom': { x: 36, y: 2 },
      'bai-sao': { x: 38, y: 2 },
      'night-market': { x: -48, y: -8 },
      'grand-world': { x: -42, y: 16 },
      safari: { x: 39, y: -4 }
    };

    const choose = (location: IslandLocation): void => {
      selected = location;
      const available = location.status === 'available';
      selectionCard.title.setText(location.label);
      selectionCard.copy.setText(
        available
          ? 'SUNSET TOWN · NO BRAKES\nRIDE THE HILLS. DODGE. COLLECT JO.'
          : 'COMING SOON\nKEEP EXPLORING TO UNLOCK THIS STORY.'
      );
      selectionCard.button.setText(available ? 'RIDE NOW' : 'LOCKED');
      selectionCard.button.setBackgroundColor(available ? '#fcbd22' : '#345c62');
      selectionCard.button.setColor(available ? '#05263a' : '#b9ced2');
      selectionCard.layer.setVisible(true).setAlpha(0).setY(18);
      this.tweens.add({ targets: selectionCard.layer, alpha: 1, y: 0, duration: 220, ease: 'Back.Out' });
    };

    selectionCard.button.on('pointerdown', () => {
      if (selected?.status === 'available') flowController.go(this, SceneKeys.NoBrakes);
    });

    ISLAND_LOCATIONS.forEach((location) => {
      const p = map.geoToScreen(location.coordinates.lat, location.coordinates.lon);
      const available = location.status === 'available';
      const offset = labelOffsets[location.id] ?? { x: 0, y: 18 };

      if (available) {
        const pulse = this.add.circle(p.x, p.y, 18, 0xfcbd22, 0.24).setDepth(13);
        this.tweens.add({
          targets: pulse,
          scaleX: 1.85,
          scaleY: 1.85,
          alpha: 0,
          duration: 1100,
          repeat: -1,
          ease: 'Sine.Out'
        });
      }

      const pin = this.add
        .circle(p.x, p.y, available ? 12 : 8, available ? 0xfcbd22 : 0x345c62)
        .setStrokeStyle(2, available ? 0xffffff : 0x83a5aa, 0.95)
        .setDepth(15)
        .setInteractive({ useHandCursor: true });

      if (available) this.add.circle(p.x, p.y, 3, 0x0b3545, 1).setDepth(16);

      const label = this.add
        .text(p.x + offset.x, p.y + offset.y, location.label, {
          fontFamily: 'monospace',
          fontSize: available ? '9px' : '7px',
          fontStyle: 'bold',
          color: available ? '#ffffff' : '#d1e0df',
          backgroundColor: available ? '#07374ae8' : '#07374abb',
          padding: { x: 4, y: 3 }
        })
        .setOrigin(0.5)
        .setDepth(17)
        .setInteractive({ useHandCursor: true });

      pin.on('pointerdown', () => choose(location));
      label.on('pointerdown', () => choose(location));
    });

    this.add
      .text(width / 2, 720, 'TAP A DESTINATION', {
        fontFamily: 'monospace',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#d8f0f2'
      })
      .setOrigin(0.5)
      .setDepth(20);

    createButton(
      this,
      142,
      height - 43,
      'CHARACTER',
      () => flowController.go(this, SceneKeys.Character),
      { width: 160, fontSize: 11, backgroundColor: '#164b61', color: '#ffffff' }
    ).setDepth(30);

    this.add
      .text(safeRight, height - 43, '1 STORY OPEN · MORE SOON', {
        fontFamily: 'monospace',
        fontSize: '8px',
        fontStyle: 'bold',
        color: '#fcbd22'
      })
      .setOrigin(1, 0.5)
      .setDepth(30);
  }

  private buildSelectionCard(width: number, height: number): {
    layer: Phaser.GameObjects.Container;
    title: Phaser.GameObjects.Text;
    copy: Phaser.GameObjects.Text;
    button: Phaser.GameObjects.Text;
  } {
    const layer = this.add.container(0, 0).setVisible(false).setDepth(40);
    const panel = this.add.rectangle(width / 2, 806, 412, 138, 0x082d3d, 0.97).setStrokeStyle(3, 0xfcbd22, 0.8);
    const title = this.add.text(76, 768, 'DESTINATION', {
      fontFamily: 'monospace',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#fcbd22'
    });
    const copy = this.add.text(76, 799, '', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#d8edf0',
      lineSpacing: 4
    });
    const button = createButton(this, 408, 809, 'RIDE NOW', () => undefined, { width: 124, fontSize: 10 });
    layer.add([panel, title, copy, button]);
    return { layer, title, copy, button };
  }

  private addArrivalStory(map: PhuQuocMapArt): void {
    const airport = map.geoToScreen(PQC.lat, PQC.lon);
    const sunset = ISLAND_LOCATIONS.find((location) => location.id === 'sunset-town');
    if (!sunset) return;
    const destination = map.geoToScreen(sunset.coordinates.lat, sunset.coordinates.lon);

    const pulse = this.add.circle(airport.x, airport.y, 14, 0x8ee8ff, 0.3).setDepth(11);
    this.tweens.add({ targets: pulse, scale: 1.7, alpha: 0, duration: 900, repeat: -1 });
    this.add.circle(airport.x, airport.y, 6, 0xeafcff, 1).setStrokeStyle(2, 0x0b5366, 1).setDepth(12);
    this.add.text(airport.x + 22, airport.y - 4, 'PQC · YOU ARE HERE', {
      fontFamily: 'monospace',
      fontSize: '7px',
      fontStyle: 'bold',
      color: '#eefeff',
      backgroundColor: '#07566ccc',
      padding: { x: 3, y: 2 }
    }).setOrigin(0, 0.5).setDepth(12);

    const route = this.add.graphics().setDepth(10);
    route.lineStyle(2, 0xffd86a, 0.7);
    const steps = 13;
    for (let i = 0; i < steps; i += 2) {
      const t1 = i / steps;
      const t2 = Math.min((i + 1) / steps, 1);
      route.lineBetween(
        Phaser.Math.Linear(airport.x, destination.x, t1),
        Phaser.Math.Linear(airport.y, destination.y, t1),
        Phaser.Math.Linear(airport.x, destination.x, t2),
        Phaser.Math.Linear(airport.y, destination.y, t2)
      );
    }

    const traveler = this.add.circle(airport.x, airport.y, 4, 0xfcbd22, 1).setDepth(14);
    this.tweens.add({
      targets: traveler,
      x: destination.x,
      y: destination.y,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      repeatDelay: 500,
      ease: 'Sine.InOut'
    });
  }

  private drawBackgroundMotion(width: number, height: number): void {
    for (let i = 0; i < 16; i += 1) {
      const line = this.add.rectangle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(160, height - 100),
        Phaser.Math.Between(22, 64),
        2,
        0x8edce8,
        Phaser.Math.FloatBetween(0.08, 0.2)
      ).setDepth(1);
      this.tweens.add({
        targets: line,
        x: line.x + Phaser.Math.Between(20, 70),
        alpha: 0.03,
        duration: Phaser.Math.Between(1600, 3000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 900)
      });
    }
  }
}
