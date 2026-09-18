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

const GAME_ASPECT = GAME_WIDTH / GAME_HEIGHT;
const viewportAspect = window.innerWidth / Math.max(1, window.innerHeight);
const coverTallPortrait = viewportAspect < GAME_ASPECT - 0.015;

document.documentElement.dataset.pixelViewport = coverTallPortrait ? 'cover' : 'fit';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-shell',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#05263a',
  pixelArt: true,
  render: {
    antialias: false,
    roundPixels: true
  },
  scale: {
    // Keep the 540x960 logical coordinate system intact. Tall phone screens use
    // ENVELOP so the game fills the physical viewport without stretching pixel
    // art; only the decorative outer edges are cropped. Desktop/tablet retains
    // FIT so no meaningful content is lost on wider aspect ratios.
    mode: coverTallPortrait ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  scene: [BootScene, LandingScene, AirportScene, CharacterScene, IslandMapScene, NoBrakesScene]
};
