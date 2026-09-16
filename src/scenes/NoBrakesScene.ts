import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { inputActions } from '../core/input/InputActions';
import { flowController } from '../core/navigation/FlowController';
import { progressStore } from '../core/progress/ProgressStore';
import { PerspectiveRoad } from '../games/no-brakes/PerspectiveRoad';
import { createButton } from '../ui/createButton';

const GAME_ID = 'no-brakes';
const PLAYER_BASE_Y = 870;

interface Difficulty {
  depthSpeed: number;
  gapMinMs: number;
  gapMaxMs: number;
}

export class NoBrakesScene extends Phaser.Scene {
  private road!: PerspectiveRoad;
  private player!: Phaser.GameObjects.Container;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private obstacle!: Phaser.GameObjects.Container;
  private coin!: Phaser.GameObjects.Image;
  private scoreText!: Phaser.GameObjects.Text;
  private joText!: Phaser.GameObjects.Text;
  private bestText!: Phaser.GameObjects.Text;
  private speedText!: Phaser.GameObjects.Text;
  private toastText!: Phaser.GameObjects.Text;
  private tutorialLayer!: Phaser.GameObjects.Container;
  private resultLayer!: Phaser.GameObjects.Container;
  private resultText!: Phaser.GameObjects.Text;

  private running = false;
  private ended = false;
  private onGround = true;
  private velocityY = 0;
  private score = 0;
  private runJo = 0;
  private best = 0;
  private obstacleDepth = 0.05;
  private coinDepth = 0.16;
  private obstacleTraining = true;
  private obstaclesSpawned = 0;
  private nextObstacleAt = 0;
  private nextCoinAt = 0;
  private trainingRescueUntil = 0;
  private toastUntil = 0;
  private rideClock = 0;

  constructor() {
    super(SceneKeys.NoBrakes);
  }

  preload(): void {
    this.load.image('jo-coin', './assets/games/no-brakes/collectibles/jo-coin.webp');
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#72c4ec');

    this.road = new PerspectiveRoad(this);
    this.buildHud();

    this.playerShadow = this.add.ellipse(width / 2, PLAYER_BASE_Y + 14, 94, 22, 0x13222b, 0.28);
    this.player = this.buildRiderProxy(width / 2, PLAYER_BASE_Y);
    this.obstacle = this.buildPlanterProxy();
    this.coin = this.add.image(width / 2, 500, 'jo-coin').setVisible(false);

    this.speedText = this.add
      .text(width / 2, height - 22, '', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ffffff',
        stroke: '#24333a',
        strokeThickness: 3
      })
      .setOrigin(0.5);

    this.toastText = this.add
      .text(width / 2, 176, '', {
        fontFamily: 'monospace',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#fcbd22',
        stroke: '#172a34',
        strokeThickness: 5
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.tutorialLayer = this.buildTutorial();
    this.resultLayer = this.buildResult();

    inputActions.bindPrimary(this, () => {
      if (this.running) this.jump();
    });
    inputActions.bindBack(this, () => {
      if (!this.running) flowController.go(this, SceneKeys.IslandMap);
    });

    this.prepareIdleState();
  }

  update(time: number, delta: number): void {
    const difficulty = this.difficulty();
    this.road.update(delta, difficulty.depthSpeed * 4.2);

    if (!this.running) return;

    const dt = Math.min(delta / 1000, 0.034);
    this.rideClock += delta;
    this.animateRide();

    if (!this.onGround) {
      this.velocityY += 2250 * dt;
      this.player.y += this.velocityY * dt;
      this.playerShadow.setScale(Phaser.Math.Clamp(1 - (PLAYER_BASE_Y - this.player.y) / 360, 0.48, 1));
      this.playerShadow.setAlpha(Phaser.Math.Clamp(0.28 - (PLAYER_BASE_Y - this.player.y) / 900, 0.1, 0.28));
      if (this.player.y >= PLAYER_BASE_Y) {
        this.player.y = PLAYER_BASE_Y;
        this.velocityY = 0;
        this.onGround = true;
        this.playerShadow.setScale(1).setAlpha(0.28);
        this.cameras.main.shake(60, 0.0015);
      }
    }

    if (time >= this.nextObstacleAt) {
      this.obstacleDepth += difficulty.depthSpeed * dt;
      this.placeObstacle();

      if (this.obstacleDepth >= 0.82 && this.obstacleDepth <= 0.98 && this.onGround) {
        if (this.obstacleTraining) {
          if (time >= this.trainingRescueUntil) {
            this.trainingRescueUntil = time + 500;
            this.jump(true);
            this.toast('HOP EARLIER!', 720);
          }
        } else {
          this.endRun();
          return;
        }
      }

      if (this.obstacleDepth > 1.03) {
        this.score += 1;
        this.scoreText.setText(`SCORE\n${String(this.score).padStart(4, '0')}`);
        if (this.score === 1) this.toast('THAT\'S IT.');
        if (this.score === 5) this.toast('NOW WE RIDE.');
        if (this.score === 25) this.toast('FASTER!');
        this.scheduleObstacle(time);
      }
    }

    if (time >= this.nextCoinAt) {
      this.coinDepth += difficulty.depthSpeed * 0.94 * dt;
      this.placeCoin();
      if (this.coinDepth >= 0.84 && this.coinDepth <= 0.99) {
        this.runJo += 1;
        this.joText.setText(`JO\n${String(this.runJo).padStart(3, '0')}`);
        this.toast('+1 JO', 430);
        this.scheduleCoin(time);
      } else if (this.coinDepth > 1.03) {
        this.scheduleCoin(time);
      }
    }

    if (time > this.toastUntil && this.toastText.visible) this.toastText.setVisible(false);
    this.speedText.setText(
      `${Math.round(difficulty.depthSpeed * 100)} SPEED · ${this.score < 2 ? 'TRAINING' : this.score < 5 ? 'FAST START' : 'NO BRAKES'}`
    );
  }

  private buildHud(): void {
    const { width } = this.scale;
    this.add.rectangle(92, 54, 166, 82, 0x102d42, 0.94).setStrokeStyle(3, 0xe9dfc8, 0.95);
    this.add.rectangle(width / 2, 54, 142, 82, 0x102d42, 0.94).setStrokeStyle(3, 0xe9dfc8, 0.95);
    this.add.rectangle(width - 92, 54, 166, 82, 0x102d42, 0.94).setStrokeStyle(3, 0xe9dfc8, 0.95);

    this.scoreText = this.hudText(92, 54, 'SCORE\n0000');
    this.joText = this.hudText(width / 2, 54, 'JO\n000');
    this.bestText = this.hudText(width - 92, 54, 'BEST\n0000');

    this.add
      .text(width / 2, 126, 'SUNSET TOWN · PHU QUOC', {
        fontFamily: 'monospace',
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#26333a',
        strokeThickness: 4
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, 151, 'NO BRAKES', {
        fontFamily: 'monospace',
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#e85d32',
        stroke: '#ffffff',
        strokeThickness: 2
      })
      .setOrigin(0.5);
  }

  private hudText(x: number, y: number, text: string): Phaser.GameObjects.Text {
    return this.add
      .text(x, y, text, {
        fontFamily: 'monospace',
        fontSize: '17px',
        fontStyle: 'bold',
        align: 'center',
        color: '#ffffff',
        stroke: '#14232d',
        strokeThickness: 3,
        lineSpacing: 2
      })
      .setOrigin(0.5);
  }

  private buildRiderProxy(x: number, y: number): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const rearWheel = this.add.rectangle(0, -8, 28, 44, 0x20252a).setStrokeStyle(3, 0x0f1317);
    const body = this.add.rectangle(0, -54, 72, 64, 0xe33f31).setStrokeStyle(4, 0x7e1e1b);
    const tail = this.add.rectangle(0, -50, 24, 15, 0xffc22d).setStrokeStyle(2, 0x5c291e);
    const torso = this.add.rectangle(0, -112, 58, 62, 0xf4efe5).setStrokeStyle(4, 0x24343c);
    const backpack = this.add.rectangle(0, -108, 48, 48, 0x197b7e).setStrokeStyle(4, 0x0c4f56);
    const helmet = this.add.ellipse(0, -162, 62, 52, 0xf5f0e6).setStrokeStyle(4, 0x26343b);
    const stripe = this.add.rectangle(0, -162, 12, 50, 0x1b6874);
    const armL = this.add.rectangle(-38, -112, 36, 13, 0xf4efe5).setAngle(-24).setStrokeStyle(3, 0x24343c);
    const armR = this.add.rectangle(38, -112, 36, 13, 0xf4efe5).setAngle(24).setStrokeStyle(3, 0x24343c);
    const mirrorL = this.add.circle(-48, -126, 7, 0xdce5e4).setStrokeStyle(3, 0x24343c);
    const mirrorR = this.add.circle(48, -126, 7, 0xdce5e4).setStrokeStyle(3, 0x24343c);
    const jo = this.add.text(0, -108, 'JO', { fontFamily: 'monospace', fontSize: '15px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    c.add([rearWheel, body, tail, torso, backpack, helmet, stripe, armL, armR, mirrorL, mirrorR, jo]);
    return c;
  }

  private buildPlanterProxy(): Phaser.GameObjects.Container {
    const c = this.add.container(270, 500).setVisible(false);
    const box = this.add.rectangle(0, 0, 104, 64, 0xe0b17d).setStrokeStyle(5, 0x8d6040);
    const inset = this.add.rectangle(0, 3, 78, 36, 0xf0d8b3).setStrokeStyle(2, 0x9a704f);
    const label = this.add.text(0, 4, 'PHU QUOC', { fontFamily: 'monospace', fontSize: '11px', fontStyle: 'bold', color: '#6b4632' }).setOrigin(0.5);
    const greens = [-38, -22, -6, 10, 26, 40].map((x, i) => this.add.circle(x, -37 - (i % 2) * 5, 16, i % 2 ? 0xd43b7b : 0xe45b94));
    const leaves = [-34, -14, 8, 30].map((x) => this.add.circle(x, -29, 13, 0x4f8b50));
    c.add([box, inset, ...leaves, ...greens, label]);
    return c;
  }

  private buildTutorial(): Phaser.GameObjects.Container {
    const { width, height } = this.scale;
    const layer = this.add.container(0, 0);
    const shade = this.add.rectangle(width / 2, height / 2, width, height, 0x031721, 0.64);
    const panel = this.add.rectangle(width / 2, 488, 430, 374, 0x0c3143, 0.97).setStrokeStyle(3, 0xfcbd22, 0.9);
    const eyebrow = this.add.text(width / 2, 370, 'FAST START · FRIENDLY FIRST', { fontFamily: 'monospace', fontSize: '12px', fontStyle: 'bold', color: '#8ff3a6' }).setOrigin(0.5);
    const title = this.add.text(width / 2, 414, 'NO BRAKES', { fontFamily: 'monospace', fontSize: '38px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    const copy = this.add.text(width / 2, 496, 'THE ROAD COMES AT YOU FAST.\nTAP ONCE TO HOP.\n\nFIRST 2 OBSTACLES TEACH THE RHYTHM.\nTHEY CANNOT END YOUR RUN.', { fontFamily: 'monospace', fontSize: '13px', align: 'center', color: '#d7e7eb', lineSpacing: 7 }).setOrigin(0.5);
    const start = createButton(this, width / 2, 622, 'START RIDE', () => this.startRun(), { width: 300, fontSize: 18 });
    const back = createButton(this, width / 2, 684, 'BACK TO MAP', () => flowController.go(this, SceneKeys.IslandMap), { width: 260, fontSize: 13, backgroundColor: '#164b61', color: '#ffffff' });
    layer.add([shade, panel, eyebrow, title, copy, start, back]);
    return layer;
  }

  private buildResult(): Phaser.GameObjects.Container {
    const { width, height } = this.scale;
    const layer = this.add.container(0, 0).setVisible(false);
    const shade = this.add.rectangle(width / 2, height / 2, width, height, 0x031721, 0.72);
    const panel = this.add.rectangle(width / 2, 486, 420, 354, 0x0c3143, 0.98).setStrokeStyle(3, 0xfcbd22, 0.9);
    const eyebrow = this.add.text(width / 2, 372, 'SUNSET TOWN', { fontFamily: 'monospace', fontSize: '12px', fontStyle: 'bold', color: '#fcbd22' }).setOrigin(0.5);
    const title = this.add.text(width / 2, 414, 'GAME OVER', { fontFamily: 'monospace', fontSize: '36px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    this.resultText = this.add.text(width / 2, 497, '', { fontFamily: 'monospace', fontSize: '15px', align: 'center', color: '#d7e7eb', lineSpacing: 8 }).setOrigin(0.5);
    const retry = createButton(this, width / 2, 595, 'RETRY', () => this.startRun(), { width: 250, fontSize: 18 });
    const back = createButton(this, width / 2, 657, 'BACK TO MAP', () => flowController.go(this, SceneKeys.IslandMap), { width: 250, fontSize: 13, backgroundColor: '#164b61', color: '#ffffff' });
    layer.add([shade, panel, eyebrow, title, this.resultText, retry, back]);
    return layer;
  }

  private prepareIdleState(): void {
    this.best = progressStore.getProgress().bestScores[GAME_ID] ?? 0;
    this.bestText.setText(`BEST\n${String(this.best).padStart(4, '0')}`);
    this.scoreText.setText('SCORE\n0000');
    this.joText.setText('JO\n000');
    this.speedText.setText('READY');
    this.obstacle.setVisible(false);
    this.coin.setVisible(false);
  }

  private startRun(): void {
    this.score = 0;
    this.runJo = 0;
    this.ended = false;
    this.onGround = true;
    this.velocityY = 0;
    this.player.y = PLAYER_BASE_Y;
    this.player.setAngle(0).setScale(1);
    this.playerShadow.setScale(1).setAlpha(0.28);
    this.obstaclesSpawned = 0;
    this.trainingRescueUntil = 0;
    this.best = progressStore.getProgress().bestScores[GAME_ID] ?? 0;
    this.scoreText.setText('SCORE\n0000');
    this.joText.setText('JO\n000');
    this.bestText.setText(`BEST\n${String(this.best).padStart(4, '0')}`);
    this.tutorialLayer.setVisible(false);
    this.resultLayer.setVisible(false);
    this.running = true;
    this.scheduleObstacle(this.time.now, true);
    this.scheduleCoin(this.time.now, true);
  }

  private endRun(): void {
    if (!this.running || this.ended) return;
    this.running = false;
    this.ended = true;
    if (this.runJo > 0) progressStore.addJo(this.runJo);
    this.best = progressStore.setBestScore(GAME_ID, this.score);
    this.bestText.setText(`BEST\n${String(this.best).padStart(4, '0')}`);
    this.resultText.setText(`SCORE ${this.score} · JO +${this.runJo}\nBEST ${this.best}\n\n${this.score < 5 ? 'FAST GAME. TRY THE RHYTHM AGAIN.' : 'NICE RUN.'}`);
    this.resultLayer.setVisible(true);
  }

  private jump(auto = false): void {
    if (!this.running || !this.onGround) return;
    this.velocityY = -745;
    this.onGround = false;
    this.player.setAngle(auto ? -4 : -2);
    this.time.delayedCall(150, () => this.player.setAngle(0));
  }

  private animateRide(): void {
    if (!this.onGround) return;
    const bob = Math.sin(this.rideClock / 72) * 2.4;
    this.player.y = PLAYER_BASE_Y + bob;
    this.player.setAngle(Math.sin(this.rideClock / 145) * 0.7);
  }

  private scheduleObstacle(time: number, initial = false): void {
    const d = this.difficulty();
    this.obstacleDepth = initial ? 0.08 : 0.03;
    this.obstacleTraining = this.obstaclesSpawned < 2;
    this.obstaclesSpawned += 1;
    this.nextObstacleAt = time + (initial ? 540 : Phaser.Math.Between(d.gapMinMs, d.gapMaxMs));
    this.obstacle.setVisible(true);
    this.placeObstacle();
  }

  private scheduleCoin(time: number, initial = false): void {
    this.coinDepth = initial ? 0.16 : 0.04;
    this.nextCoinAt = time + (initial ? 980 : Phaser.Math.Between(800, 1500));
    this.coin.setVisible(true);
    this.placeCoin();
  }

  private placeObstacle(): void {
    const p = this.road.project(this.obstacleDepth, 0);
    this.obstacle.setPosition(p.x, p.y - 8).setScale(p.scale);
    this.obstacle.setDepth(20 + Math.floor(this.obstacleDepth * 60));
  }

  private placeCoin(): void {
    const p = this.road.project(this.coinDepth, 0);
    this.coin.setPosition(p.x, p.y - 72 * p.scale).setScale(p.scale * 0.7);
    this.coin.setDepth(20 + Math.floor(this.coinDepth * 60));
  }

  private difficulty(): Difficulty {
    if (this.score < 5) return { depthSpeed: 0.27, gapMinMs: 720, gapMaxMs: 980 };
    if (this.score < 15) return { depthSpeed: 0.31, gapMinMs: 660, gapMaxMs: 880 };
    if (this.score < 35) return { depthSpeed: 0.35, gapMinMs: 600, gapMaxMs: 800 };
    if (this.score < 60) return { depthSpeed: 0.39, gapMinMs: 540, gapMaxMs: 720 };
    return { depthSpeed: 0.43 + Math.min(0.08, (this.score - 60) * 0.0012), gapMinMs: 500, gapMaxMs: 660 };
  }

  private toast(message: string, duration = 650): void {
    this.toastText.setText(message).setVisible(true);
    this.toastUntil = this.time.now + duration;
  }
}
