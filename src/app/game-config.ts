import Phaser from 'phaser';
import '../core/assets/catalog';
import { AirportScene } from '../scenes/AirportScene';
import { BootScene } from '../scenes/BootScene';
import { CharacterScene } from '../scenes/CharacterScene';
import { IslandMapScene } from '../scenes/IslandMapScene';
import { LandingScene } from '../scenes/LandingScene';
import { NoBrakesScene } from '../scenes/NoBrakesScene';

export const GAME_WIDTH = 540;
export const GAME_HEIGHT = 960;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-shell',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#05263a',
  pixelArt: true,
  scale: {
    // EXPAND gives Phaser the full visible parent area while preserving the
    // 540x960 design scale. This removes FIT letterboxing on tall phones
    // without using ENVELOP, which would crop large areas on desktop.
    mode: Phaser.Scale.EXPAND,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  scene: [BootScene, LandingScene, AirportScene, CharacterScene, IslandMapScene, NoBrakesScene]
};
