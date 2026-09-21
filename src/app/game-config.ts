import Phaser from 'phaser';
import '../core/assets/catalog';
import { AirportScene } from '../scenes/AirportScene';
import { BootScene } from '../scenes/BootScene';
import { CharacterScene } from '../scenes/CharacterScene';
import { IslandMapScene } from '../scenes/IslandMapScene';
import { IslandMapV2Scene } from '../scenes/IslandMapV2Scene';
import { LandingScene } from '../scenes/LandingScene';
import { NoBrakesScene } from '../scenes/NoBrakesScene';
import { SunsetWorldTourScene } from '../scenes/SunsetWorldTourScene';
import { V2HubScene } from '../scenes/V2HubScene';

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
    mode: coverTallPortrait ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  scene: [
    BootScene,
    V2HubScene,
    IslandMapV2Scene,
    SunsetWorldTourScene,
    LandingScene,
    AirportScene,
    CharacterScene,
    IslandMapScene,
    NoBrakesScene
  ]
};
