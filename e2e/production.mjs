import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';

const url = process.env.PREVIEW_URL;
const executablePath = process.env.CHROME_BIN;
if (!url || !executablePath) throw new Error('PREVIEW_URL and CHROME_BIN are required');

const out = process.env.E2E_OUT || '/tmp/pixel-e2e';
await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader']
});

const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
const runtimeErrors = [];
const badResponses = [];

page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
});
page.on('response', (response) => {
  if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
});

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
await page.locator('canvas').waitFor({ state: 'visible', timeout: 15_000 });

async function canvasBox() {
  const box = await page.locator('canvas').boundingBox();
  if (!box) throw new Error('Canvas bounding box unavailable');
  return box;
}

async function clickLogical(x, y) {
  const box = await canvasBox();
  await page.mouse.click(box.x + (x / 540) * box.width, box.y + (y / 960) * box.height);
}

async function swipeLogical(fromX, toX, y) {
  const box = await canvasBox();
  const startX = box.x + (fromX / 540) * box.width;
  const endX = box.x + (toX / 540) * box.width;
  const py = box.y + (y / 960) * box.height;
  await page.mouse.move(startX, py);
  await page.mouse.down();
  await page.mouse.move(endX, py, { steps: 8 });
  await page.mouse.up();
}

// Let the welcome animation settle so visual QA captures the intended frame.
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/01-landing.png` });
await clickLogical(270, 720); // ENTER THE ISLAND

// Capture both the approach and the settled touchdown state.
await page.waitForTimeout(420);
await page.screenshot({ path: `${out}/02-airport-approach.png` });
await page.waitForTimeout(1850);
await page.screenshot({ path: `${out}/02a-airport-touchdown.png` });
await clickLogical(270, 830); // MEET YOUR TRAVELER

await page.waitForTimeout(350);
await page.screenshot({ path: `${out}/03-character.png` });
await clickLogical(143, 226); // TRAVELER CARD
await clickLogical(270, 838); // OPEN THE ISLAND MAP
await page.waitForTimeout(650);
await page.screenshot({ path: `${out}/04-map.png` });

// Sunset Town is projected from geographic coordinates onto the real-island map.
await clickLogical(339, 600); // SUNSET TOWN
await page.waitForTimeout(350);
await page.screenshot({ path: `${out}/04a-map-selected.png` });
await clickLogical(421, 809); // RIDE NOW
await page.waitForTimeout(650);
await page.screenshot({ path: `${out}/05-no-brakes-tutorial.png` });

await clickLogical(270, 624); // START RIDE
await page.waitForTimeout(650);
await page.screenshot({ path: `${out}/06-no-brakes-running.png` });

// Exercise the actual mobile gesture path. Swipe left, then return right to the
// centre lane. A swipe must not be interpreted as a jump.
await swipeLogical(300, 165, 770);
await page.waitForTimeout(180);
await page.screenshot({ path: `${out}/06a-no-brakes-left-lane.png` });
await swipeLogical(165, 300, 770);
await page.waitForTimeout(220);
await page.screenshot({ path: `${out}/06b-no-brakes-centre-lane.png` });

// Also exercise keyboard parity used on desktop.
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(130);
await page.keyboard.press('ArrowRight');

// The first two training obstacles rescue the player. Once training ends, a
// collision persists the run result. The first live obstacle stays centred so
// this smoke test is deterministic while later hazards can fan across lanes.
await page.waitForFunction(
  () => {
    const raw = window.localStorage.getItem('pqpi:v1:progress');
    if (!raw) return false;
    try {
      const progress = JSON.parse(raw);
      return (progress.bestScores?.['no-brakes'] ?? 0) >= 2;
    } catch {
      return false;
    }
  },
  { timeout: 25_000 }
);
await page.waitForTimeout(250);
await page.screenshot({ path: `${out}/07-no-brakes-result.png` });

const progress = await page.evaluate(() => {
  const raw = window.localStorage.getItem('pqpi:v1:progress');
  return raw ? JSON.parse(raw) : null;
});

if (!progress) throw new Error('ProgressStore did not persist after a completed run');
const best = progress.bestScores?.['no-brakes'] ?? 0;
if (best < 2) throw new Error(`Expected training run best score >= 2, got ${best}`);

await clickLogical(270, 657); // BACK TO MAP
await page.waitForTimeout(450);
await page.screenshot({ path: `${out}/08-return-map.png` });

if (badResponses.length) {
  throw new Error(`HTTP failures during journey:\n${badResponses.join('\n')}`);
}
if (runtimeErrors.length) {
  throw new Error(`Runtime errors during journey:\n${runtimeErrors.join('\n')}`);
}

await fs.writeFile(
  `${out}/journey.json`,
  JSON.stringify({
    url,
    bestScore: best,
    totalJo: progress.totalJo ?? 0,
    runtimeErrors,
    badResponses,
    exercised: [
      'welcome-animation',
      'airport-approach',
      'airport-touchdown',
      'map-select-sunset-town',
      'swipe-left',
      'swipe-right',
      'keyboard-left',
      'keyboard-right'
    ]
  }, null, 2) + '\n'
);

await browser.close();
console.log(`Pixel production E2E passed with best score ${best}`);
