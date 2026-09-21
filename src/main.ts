import Phaser from 'phaser';
import { gameConfig } from './app/game-config';
import './style.css';

const COMPILED_BUILD = String(import.meta.env.VITE_BUILD_SHA ?? 'dev').trim();

async function ensureFreshBuild(): Promise<void> {
  if (!COMPILED_BUILD || COMPILED_BUILD === 'dev') return;

  try {
    const response = await fetch(`./build.txt?_=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'cache-control': 'no-cache' }
    });
    if (!response.ok) return;

    const liveBuild = (await response.text()).trim();
    if (!liveBuild || liveBuild === COMPILED_BUILD) return;

    const url = new URL(window.location.href);
    const current = url.searchParams.get('_build');
    const next = liveBuild.slice(0, 12);

    if (current === next) return;

    url.searchParams.set('_build', next);
    window.location.replace(url.toString());
  } catch {
    // A freshness probe must never prevent the game from starting.
  }
}

void ensureFreshBuild();
new Phaser.Game(gameConfig);
