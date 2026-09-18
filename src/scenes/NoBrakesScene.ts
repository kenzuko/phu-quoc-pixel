import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { inputActions } from '../core/input/InputActions';
import { flowController } from '../core/navigation/FlowController';
import { progressStore } from '../core/progress/ProgressStore';
import { PerspectiveRoad } from '../games/no-brakes/PerspectiveRoad';
import { RideEffects } from '../games/no-brakes/RideEffects';
import {
  createObstacleVisual,
  createRiderVisual,
  type ObstacleKind,
  type ObstacleVisual
} from '../games/no-brakes/RideVisuals';
import { createButton } from '../ui/createButton';

const GAME_ID = 'no-brakes';
const PLAYER_BASE_Y = 870;
const PLAYER_DEPTH = 0.94;
const LANES = [-1, 0, 1] as const;
const OBSTACLE_KINDS: ObstacleKind[] = ['large-planter', 'electric-shuttle', 'menu-board', 'rolling-suitcase', 'cafe-chair'];

interface Difficulty {
  depthSpeed: number;
  gapMinMs: number;
  gapMaxMs: number;
}

export class NoBrakesScene extends Phaser.Scene {
  private road!: PerspectiveRoad;
  private effects!: RideEffects;
  private player!: Phaser.GameObjects.Container;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private obstacle!: Phaser.GameObjects.Container;
  private obstacleVisual!: ObstacleVisual;
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
  private crashing = false;
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
  private playerLane = 0;
  private obstacleLane = 0;
  private coinLane = 0;
  private controlsReadyAt = 0;

  constructor() {
    super(SceneKeys.NoBrakes);
  }

  preload(): void {
    this.load.image('jo-coin', './assets/games/no-brakes/collectibles/jo-coin.webp');
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#bda78c');

    this.road = new PerspectiveRoad(this);
    this.effects = new RideEffects(this);
    this.buildHud();

    const playerX = this.playerLaneX(0);
    this.playerShadow = this.add.ellipse(playerX, PLAYER_BASE_Y + 14, 94, 22, 0x13222b, 0.28).setDepth(78);
    this.player = createRiderVisual(this, playerX, PLAYER_BASE_Y).setDepth(80);
    this.obstacleVisual = createObstacleVisual(this);
    this.obstacle = this.obstacleVisual.container;
    this.coin = this.add.image(width / 2, 500, 'jo-coin').setVisible(false);

    this.speedText = this.add
      .text(width / 2, height - 22, '', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ffffff',
        stroke: '#24333a',
        strokeThickness: 3
      })
      .setOrigin(0.5)
      .setDepth(120);

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
      .setVisible(false)
      .setDepth(140);

    this.tutorialLayer = this.buildTutorial();
    this.resultLayer = this.buildResult();

    inputActions.bindRideControls(this, {
      onTap: () => {
        if (this.canControl()) this.jump();
      },
      onLeft: () => {
        if (this.canControl()) this.shiftLane(-1);
      },
      onRight: () => {
        if (this.canControl()) this.shiftLane(1);
      }
    });
    inputActions.bindBack(this, () => {
      if (!this.running && !this.crashing) flowController.go(this, SceneKeys.IslandMap);
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
        this.effects.landing(this.player.x, PLAYER_BASE_Y);
        this.cameras.main.shake(60, 0.0015);
      }
    }

    if (time >= this.nextObstacleAt) {
      this.obstacleDepth += difficulty.depthSpeed * dt;
      this.placeObstacle();

      const obstacleHitsLane = this.obstacleLane === this.playerLane;
      if (this.obstacleDepth >= 0.82 && this.obstacleDepth <= 0.98 && this.onGround && obstacleHitsLane) {
        if (this.obstacleTraining) {
          if (time >= this.trainingRescueUntil) {
            this.trainingRescueUntil = time + 500;
            this.jump(true);
            this.toast('TAP TO HOP · SWIPE TO DODGE', 820);
          }
        } else {
          this.crashRun();
          return;
        }
      }

      if (this.obstacleDepth > 1.03) {
        this.score += 1;
        this.scoreText.setText(`SCORE\n${String(this.score).padStart(4, '0')}`);
        if (this.score === 1) this.toast('THAT\'S IT.');
        if (this.score === 5) {
          this.toast('NOW WE RIDE.');
          this.effects.milestone(this.scale.width / 2, 226);
        }
        if (this.score === 25) {
          this.toast('FASTER!');
          this.effects.milestone(this.scale.width / 2, 226);
        }
        this.scheduleObstacle(time);
      }
    }

    if (time >= this.nextCoinAt) {
      this.coinDepth += difficulty.depthSpeed * 0.94 * dt;
      this.placeCoin();
      if (this.coinDepth >= 0.84 && this.coinDepth <= 0.99 && this.coinLane === this.playerLane) {
        this.effects.coinPickup(this.coin.x, this.coin.y);
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
    const g = this.add.graphics().setDepth(120);

    // One continuous pixel HUD band keeps the stats inside the same visual world
    // instead of three floating debug boxes.
    const drawPixelPolygon = (points: ReadonlyArray<readonly [number, number]>, fill: number, alpha: number, stroke: number, strokeAlpha: number): void => {
      g.fillStyle(fill, alpha);
      g.beginPath();
      g.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i += 1) g.lineTo(points[i][0], points[i][1]);
      g.closePath();
      g.fillPath();
      g.lineStyle(3, stroke, strokeAlpha);
      g.strokePath();
    };

    const hudFrame = [
      [31, 21],
      [width - 31, 21],
      [width - 21, 31],
      [width - 21, 88],
      [width - 31, 98],
      [31, 98],
      [21, 88],
      [21, 31]
    ] as const;
    drawPixelPolygon(hudFrame, 0x102f3d, 0.94, 0xf0c67d, 0.96);

    // Internal dividers and tiny decorative notches repeat the facade / signage
    // pixel language used in Sunset Town.
    g.lineStyle(2, 0xe8d7ad, 0.48);
    g.lineBetween(178, 30, 178, 89);
    g.lineBetween(362, 30, 362, 89);
    g.fillStyle(0xe84e78, 1);
    g.fillRect(31, 29, 13, 5);
    g.fillRect(width - 44, 29, 13, 5);
    g.fillStyle(0x397b76, 1);
    g.fillRect(width / 2 - 14, 28, 28, 5);

    // JO coin icon is deliberately pixel-built so it belongs to the HUD rather
    // than looking like a separate image pasted over the scene.
    g.fillStyle(0x8c5a28, 1);
    g.fillRect(width / 2 - 50, 48, 22, 22);
    g.fillStyle(0xf3b645, 1);
    g.fillRect(width / 2 - 47, 45, 22, 22);
    g.fillStyle(0xffdc74, 1);
    g.fillRect(width / 2 - 42, 49, 8, 4);
    g.fillRect(width / 2 - 42, 55, 4, 8);

    this.scoreText = this.hudText(100, 59, 'SCORE\n0000');
    this.joText = this.hudText(width / 2 + 18, 59, 'JO\n000');
    this.bestText = this.hudText(width - 100, 59, 'BEST\n0000');

    // Compact title plaque sits on the same art system without covering the
    // horizon, which is the important gameplay/readability zone.
    const titlePlaque = [
      [width / 2 - 118, 106],
      [width / 2 + 118, 106],
      [width / 2 + 128, 116],
      [width / 2 + 118, 145],
      [width / 2 - 118, 145],
      [width / 2 - 128, 116]
    ] as const;
    drawPixelPolygon(titlePlaque, 0x9d493d, 0.96, 0xf6dfb3, 0.9);

    this.add
      .text(width / 2, 116, 'SUNSET TOWN · PHU QUOC', {
        fontFamily: 'monospace',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#fff0ce'
      })
      .setOrigin(0.5)
      .setDepth(121);

    this.add
      .text(width / 2, 135, 'NO BRAKES', {
        fontFamily: 'monospace',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#6f342d',
        strokeThickness: 2
      })
      .setOrigin(0.5)
      .setDepth(121);
  }

  private hudText(x: number, y: number, text: string): Phaser.GameObjects.Text {
    return this.add
      .text(x, y, text, {
        fontFamily: 'monospace',
        fontSize: '16px',
        fontStyle: 'bold',
        align: 'center',
        color: '#fff4d7',
        stroke: '#10242c',
        strokeThickness: 3,
        lineSpacing: 1
      })
      .setOrigin(0.5)
      .setDepth(121);
  }

  private buildTutorial(): Phaser.GameObjects.Container {
    const { width, height } = this.scale;
    const layer = this.add.container(0, 0).setDepth(200);
    const shade = this.add.rectangle(width / 2, height / 2, width, height, 0x031721, 0.64);
    const panel = this.add.rectangle(width / 2, 488, 430, 398, 0x0c3143, 0.97).setStrokeStyle(3, 0xfcbd22, 0.9);
    const eyebrow = this.add.text(width / 2, 354, 'FAST START · TWO MOVES', { fontFamily: 'monospace', fontSize: '12px', fontStyle: 'bold', color: '#8ff3a6' }).setOrigin(0.5);
    const title = this.add.text(width / 2, 398, 'NO BRAKES', { fontFamily: 'monospace', fontSize: '38px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    const copy = this.add.text(width / 2, 492, 'TAP TO HOP.\nSWIPE LEFT / RIGHT TO DODGE.\n\nKEYBOARD: SPACE + ← →\nFIRST 2 OBSTACLES CANNOT END YOUR RUN.', { fontFamily: 'monospace', fontSize: '13px', align: 'center', color: '#d7e7eb', lineSpacing: 7 }).setOrigin(0.5);
    const start = createButton(this, width / 2, 624, 'START RIDE', () => this.startRun(), { width: 300, fontSize: 18 });
    const back = createButton(this, width / 2, 686, 'BACK TO MAP', () => flowController.go(this, SceneKeys.IslandMap), { width: 260, fontSize: 13, backgroundColor: '#164b61', color: '#ffffff' });
    layer.add([shade, panel, eyebrow, title, copy, start, back]);
    return layer;
  }

  private buildResult(): Phaser.GameObjects.Container {
    const { width, height } = this.scale;
    const layer = this.add.container(0, 0).setVisible(false).setDepth(200);
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
    this.crashing = false;
    this.onGround = true;
    this.velocityY = 0;
    this.playerLane = 0;
    this.tweens.killTweensOf(this.player);
    this.tweens.killTweensOf(this.playerShadow);
    this.player.setPosition(this.playerLaneX(0), PLAYER_BASE_Y).setAngle(0).setScale(1);
    this.playerShadow.setPosition(this.playerLaneX(0), PLAYER_BASE_Y + 14).setScale(1).setAlpha(0.28);
    this.obstaclesSpawned = 0;
    this.trainingRescueUntil = 0;
    this.best = progressStore.getProgress().bestScores[GAME_ID] ?? 0;
    this.scoreText.setText('SCORE\n0000');
    this.joText.setText('JO\n000');
    this.bestText.setText(`BEST\n${String(this.best).padStart(4, '0')}`);
    this.tutorialLayer.setVisible(false);
    this.resultLayer.setVisible(false);
    this.running = true;
    this.controlsReadyAt = this.time.now + 260;
    this.scheduleObstacle(this.time.now, true);
    this.scheduleCoin(this.time.now, true);
  }

  private crashRun(): void {
    if (!this.running || this.ended || this.crashing) return;

    this.running = false;
    this.crashing = true;
    const fallDirection = this.playerLane < 0 ? -1 : this.playerLane > 0 ? 1 : Phaser.Math.Between(0, 1) === 0 ? -1 : 1;

    this.effects.crash(this.player.x, this.player.y);
    this.cameras.main.shake(240, 0.006);
    this.cameras.main.flash(80, 255, 221, 158, false);
    this.tweens.killTweensOf(this.player);
    this.tweens.add({
      targets: this.player,
      angle: fallDirection * 14,
      y: PLAYER_BASE_Y + 17,
      x: this.player.x + fallDirection * 18,
      duration: 260,
      ease: 'Quad.Out'
    });
    this.tweens.add({
      targets: this.playerShadow,
      x: this.playerShadow.x + fallDirection * 16,
      scaleX: 1.15,
      alpha: 0.2,
      duration: 260,
      ease: 'Quad.Out'
    });

    this.time.delayedCall(340, () => this.endRun());
  }

  private endRun(): void {
    if (this.ended) return;
    this.running = false;
    this.crashing = false;
    this.ended = true;
    if (this.runJo > 0) progressStore.addJo(this.runJo);
    this.best = progressStore.setBestScore(GAME_ID, this.score);
    this.bestText.setText(`BEST\n${String(this.best).padStart(4, '0')}`);
    this.resultText.setText(`SCORE ${this.score} · JO +${this.runJo}\nBEST ${this.best}\n\n${this.score < 5 ? 'TAP OR DODGE. FIND YOUR LINE.' : 'NICE RUN.'}`);
    this.resultLayer.setVisible(true);
  }

  private canControl(): boolean {
    return this.running && !this.ended && !this.crashing && this.time.now >= this.controlsReadyAt;
  }

  private jump(auto = false): void {
    if (!this.running || !this.onGround) return;
    this.velocityY = -745;
    this.onGround = false;
    this.player.setAngle(auto ? -4 : -2);
    this.time.delayedCall(150, () => {
      if (this.player.active) this.player.setAngle(0);
    });
  }

  private shiftLane(direction: -1 | 1): void {
    const nextLane = Phaser.Math.Clamp(this.playerLane + direction, -1, 1);
    if (nextLane === this.playerLane) return;

    this.effects.laneSkid(this.player.x, PLAYER_BASE_Y, direction);
    this.playerLane = nextLane;
    const targetX = this.playerLaneX(nextLane);
    const lean = direction * 8;

    this.tweens.killTweensOf(this.player);
    this.tweens.killTweensOf(this.playerShadow);
    this.tweens.add({
      targets: this.player,
      x: targetX,
      angle: lean,
      duration: 120,
      ease: 'Quad.Out',
      onComplete: () => {
        if (!this.player.active) return;
        this.tweens.add({ targets: this.player, angle: 0, duration: 105, ease: 'Quad.Out' });
      }
    });
    this.tweens.add({ targets: this.playerShadow, x: targetX, duration: 120, ease: 'Quad.Out' });
  }

  private animateRide(): void {
    if (!this.onGround) return;
    const bob = Math.sin(this.rideClock / 72) * 2.4;
    this.player.y = PLAYER_BASE_Y + bob;
    if (!this.tweens.isTweening(this.player)) this.player.setAngle(Math.sin(this.rideClock / 145) * 0.7);
  }

  private scheduleObstacle(time: number, initial = false): void {
    const d = this.difficulty();
    this.obstacleDepth = initial ? 0.08 : 0.03;
    this.obstacleTraining = this.obstaclesSpawned < 2;
    // Keep the first two training hazards and the first live hazard centred.
    // The player learns the timing first; lane randomness begins after that.
    this.obstacleLane = this.obstaclesSpawned < 3 ? 0 : Phaser.Utils.Array.GetRandom([...LANES]);
    const kind = Phaser.Utils.Array.GetRandom(OBSTACLE_KINDS);
    this.obstacleVisual.setKind(kind);
    this.obstaclesSpawned += 1;
    this.nextObstacleAt = time + (initial ? 540 : Phaser.Math.Between(d.gapMinMs, d.gapMaxMs));
    this.obstacle.setVisible(true);
    this.placeObstacle();
  }

  private scheduleCoin(time: number, initial = false): void {
    this.coinDepth = initial ? 0.16 : 0.04;
    this.coinLane = initial ? 0 : Phaser.Utils.Array.GetRandom([...LANES]);
    this.nextCoinAt = time + (initial ? 980 : Phaser.Math.Between(800, 1500));
    this.coin.setVisible(true);
    this.placeCoin();
  }

  private placeObstacle(): void {
    const p = this.road.project(this.obstacleDepth, this.obstacleLane);
    this.obstacle.setPosition(p.x, p.y - 8).setScale(p.scale);
    this.obstacle.setDepth(20 + Math.floor(this.obstacleDepth * 60));
  }

  private placeCoin(): void {
    const p = this.road.project(this.coinDepth, this.coinLane);
    this.coin.setPosition(p.x, p.y - 72 * p.scale).setScale(p.scale * 0.7);
    this.coin.setDepth(20 + Math.floor(this.coinDepth * 60));
  }

  private playerLaneX(lane: number): number {
    return this.road.project(PLAYER_DEPTH, lane).x;
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
