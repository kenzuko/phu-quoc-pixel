import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { progressStore } from '../core/progress/ProgressStore';
import type { CharacterId } from '../core/progress/types';
import { createButton } from '../ui/createButton';
import { createCharacterPortrait } from '../ui/CharacterPortrait';

const CHARACTERS: readonly { id: CharacterId; label: string; note: string }[] = [
  { id: 'traveler', label: 'TRAVELER', note: 'FIRST TRIP' },
  { id: 'explorer', label: 'EXPLORER', note: 'CAMERA READY' },
  { id: 'uncle', label: 'UNCLE', note: 'LOCAL ENERGY' },
  { id: 'grandma', label: 'GRANDMA', note: 'ISLAND WISDOM' },
  { id: 'kid', label: 'KID', note: 'FULL SPEED' },
  { id: 'fisherman', label: 'FISHERMAN', note: 'SEA LIFE' },
  { id: 'ridgeback', label: 'RIDGEBACK', note: 'PHU QUOC DOG' },
  { id: 'pepper', label: 'PEPPER', note: 'ISLAND ROOTS' }
];

export class CharacterScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Character);
  }

  create(): void {
    const { width } = this.scale;
    this.cameras.main.setBackgroundColor('#082a3b');

    const backdrop = this.add.graphics().setDepth(-2);
    backdrop.fillStyle(0x0d5265, 1);
    backdrop.fillRect(0, 0, width, 960);
    backdrop.fillStyle(0x0a3446, 0.72);
    backdrop.fillRect(0, 0, width, 170);
    backdrop.fillStyle(0x0b4255, 0.78);
    backdrop.fillRect(0, 730, width, 230);

    this.add
      .text(width / 2, 62, 'CHOOSE YOUR TRAVELER', {
        fontFamily: 'monospace',
        fontSize: '29px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#061c27',
        strokeThickness: 5
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 102, 'A FACE FOR YOUR PHU QUOC STORY', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#bfe6eb'
      })
      .setOrigin(0.5);

    const selectedText = this.add
      .text(width / 2, 139, '', {
        fontFamily: 'monospace',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#fcbd22'
      })
      .setOrigin(0.5);

    const cards = new Map<CharacterId, Phaser.GameObjects.Rectangle>();

    const syncSelection = (id: CharacterId): void => {
      const selected = CHARACTERS.find((character) => character.id === id);
      selectedText.setText(`SELECTED · ${selected?.label ?? id.toUpperCase()}`);
      for (const [cardId, card] of cards) {
        card.setStrokeStyle(cardId === id ? 4 : 2, cardId === id ? 0xfcbd22 : 0x8ab9c1, cardId === id ? 1 : 0.38);
        card.setFillStyle(cardId === id ? 0x123f4d : 0x0b3545, cardId === id ? 1 : 0.94);
      }
    };

    CHARACTERS.forEach((character, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = col === 0 ? 143 : 397;
      const y = 226 + row * 132;
      const card = this.add
        .rectangle(x, y, 220, 112, 0x0b3545, 0.94)
        .setStrokeStyle(2, 0x8ab9c1, 0.38)
        .setInteractive({ useHandCursor: true });
      cards.set(character.id, card);

      const portrait = createCharacterPortrait(this, character.id, x - 57, y - 2, 0.72);
      portrait.setDepth(2);

      this.add
        .text(x + 36, y - 20, character.label, {
          fontFamily: 'monospace',
          fontSize: character.label.length > 9 ? '12px' : '14px',
          fontStyle: 'bold',
          color: '#ffffff'
        })
        .setOrigin(0.5)
        .setDepth(3);

      this.add
        .text(x + 36, y + 11, character.note, {
          fontFamily: 'monospace',
          fontSize: '8px',
          color: '#a8d8df'
        })
        .setOrigin(0.5)
        .setDepth(3);

      const choose = (): void => {
        progressStore.setCharacter(character.id);
        syncSelection(character.id);
        this.tweens.add({
          targets: portrait,
          scaleX: 0.8,
          scaleY: 0.8,
          yoyo: true,
          duration: 90,
          ease: 'Quad.Out'
        });
      };

      card.on('pointerdown', choose);
      portrait.setSize(95, 105).setInteractive({ useHandCursor: true }).on('pointerdown', choose);
    });

    syncSelection(progressStore.getProfile().characterId);

    this.add
      .text(width / 2, 770, 'YOUR CHARACTER TRAVELS WITH YOU AROUND THE ISLAND', {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#b6dbe1'
      })
      .setOrigin(0.5);

    createButton(this, width / 2, 838, 'OPEN THE ISLAND MAP', () => {
      flowController.go(this, SceneKeys.IslandMap);
    }, { width: 330, fontSize: 16 });
  }
}
