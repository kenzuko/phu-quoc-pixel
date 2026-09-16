import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { createButton } from '../ui/createButton';

export class LandingScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Landing);
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#73c8ef');
    this.drawArrivalWorld(width, height);

    const eyebrow = this.add
      .text(width / 2, 265, 'WELCOME TO', {
        fontFamily: 'monospace',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#fcbd22',
        stroke: '#12394b',
        strokeThickness: 5
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(20);

    const title = this.add
      .text(width / 2, 348, 'PHU QUOC:\nPIXEL ISLAND', {
        fontFamily: 'monospace',
        fontSize: '42px',
        fontStyle: 'bold',
        align: 'center',
        color: '#ffffff',
        stroke: '#12394b',
        strokeThickness: 7,
        lineSpacing: 4
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(20);

    const sub = this.add
      .text(width / 2, 468, 'LAND · EXPLORE · PLAY', {
        fontFamily: 'monospace',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#eaf9ff',
        stroke: '#17485b',
        strokeThickness: 4
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(20);

    const button = createButton(this, width / 2, 735, 'ENTER THE ISLAND', () => {
      flowController.go(this, SceneKeys.Airport);
    }, { width: 320, fontSize: 18 })
      .setAlpha(0)
      .setDepth(25);

    const hint = this.add
      .text(width / 2, 800, 'YOUR PHU QUOC STORY STARTS AT PQC', {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#d5f5ff',
        stroke: '#124052',
        strokeThickness: 3
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(20);

    this.tweens.add({ targets: eyebrow, alpha: 1, y: 250, duration: 420, delay: 250, ease: 'Quad.Out' });
    this.tweens.add({ targets: title, alpha: 1, y: 330, duration: 520, delay: 430, ease: 'Back.Out' });
    this.tweens.add({ targets: sub, alpha: 1, duration: 380, delay: 760, ease: 'Sine.Out' });
    this.tweens.add({ targets: button, alpha: 1, y: 720, duration: 420, delay: 1080, ease: 'Back.Out' });
    this.tweens.add({ targets: hint, alpha: 1, duration: 320, delay: 1320 });
  }

  private drawArrivalWorld(width: number, height: number): void {
    const g = this.add.graphics().setDepth(0);

    // Warm tropical sky bands keep the pixel look without a smooth gradient.
    const skyBands = [0x72c8ee, 0x81d2ee, 0x9bdced, 0xb9e6e8, 0xf2d7a8];
    skyBands.forEach((color, index) => {
      g.fillStyle(color, 1);
      g.fillRect(0, index * 100, width, 105);
    });

    // Sunset glow and sea.
    g.fillStyle(0xffd36a, 0.95);
    g.fillCircle(width - 82, 166, 42);
    g.fillStyle(0x1686a5, 1);
    g.fillRect(0, 500, width, height - 500);
    g.fillStyle(0x3fb1c8, 0.72);
    for (let y = 520; y < height; y += 30) g.fillRect(0, y, width, 7);

    // Phu Quoc silhouette coming into view from the plane.
    g.fillStyle(0x204f45, 1);
    g.beginPath();
    g.moveTo(-20, 610);
    g.lineTo(62, 566);
    g.lineTo(128, 584);
    g.lineTo(198, 548);
    g.lineTo(286, 568);
    g.lineTo(352, 532);
    g.lineTo(438, 554);
    g.lineTo(560, 514);
    g.lineTo(560, 690);
    g.lineTo(-20, 690);
    g.closePath();
    g.fillPath();

    g.fillStyle(0x35745a, 1);
    for (let x = 16; x < width + 40; x += 46) {
      g.fillTriangle(x, 603, x + 17, 548 - (x % 3) * 9, x + 34, 603);
    }

    // A few sea sparkles.
    for (let i = 0; i < 24; i += 1) {
      const sparkle = this.add.rectangle(
        Phaser.Math.Between(8, width - 8),
        Phaser.Math.Between(535, height - 42),
        Phaser.Math.Between(4, 12),
        3,
        0xdffbff,
        Phaser.Math.FloatBetween(0.25, 0.75)
      ).setDepth(2);
      this.tweens.add({
        targets: sparkle,
        alpha: 0.08,
        duration: Phaser.Math.Between(650, 1200),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 700)
      });
    }

    this.addCloud(74, 116, 0.7, 0.48);
    this.addCloud(414, 248, 0.52, 0.38);
    this.addCloud(266, 74, 0.42, 0.28);
    this.addArrivalPlane(width);
  }

  private addCloud(x: number, y: number, scale: number, alpha: number): void {
    const cloud = this.add.container(x, y).setScale(scale).setAlpha(alpha).setDepth(4);
    const parts = [
      this.add.ellipse(-30, 8, 70, 28, 0xffffff),
      this.add.ellipse(8, 0, 92, 38, 0xffffff),
      this.add.ellipse(49, 9, 66, 25, 0xffffff)
    ];
    cloud.add(parts);
    this.tweens.add({ targets: cloud, x: x + 26, duration: 6200, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  private addArrivalPlane(width: number): void {
    const plane = this.add.container(-120, 190).setDepth(10).setAngle(3);
    const body = this.add.rectangle(0, 0, 108, 20, 0xf7fbff).setStrokeStyle(3, 0x244453, 1);
    const nose = this.add.triangle(58, 0, 0, -10, 22, 0, 0, 10, 0xf7fbff).setStrokeStyle(2, 0x244453, 1);
    const tail = this.add.triangle(-51, -9, 0, 17, 18, 17, 8, 0, 0xe95f42).setStrokeStyle(2, 0x244453, 1);
    const wing = this.add.triangle(-3, 7, 0, 0, 58, 24, -26, 18, 0xdcecf1).setStrokeStyle(2, 0x244453, 1);
    const window = this.add.rectangle(29, -2, 13, 5, 0x4b8aa3);
    plane.add([wing, body, nose, tail, window]);

    this.tweens.add({
      targets: plane,
      x: width + 140,
      y: 228,
      angle: -1,
      duration: 5200,
      repeat: -1,
      repeatDelay: 1900,
      ease: 'Sine.InOut'
    });
  }
}
