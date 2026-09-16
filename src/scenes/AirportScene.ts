import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { createButton } from '../ui/createButton';

export class AirportScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Airport);
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#70c8ec');
    this.drawAirportWorld(width, height);

    const airportLabel = this.add
      .text(width / 2, 68, 'PHU QUOC INTERNATIONAL AIRPORT · PQC', {
        fontFamily: 'monospace',
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#173f50',
        strokeThickness: 4
      })
      .setOrigin(0.5)
      .setDepth(40);

    const touchdown = this.add
      .text(width / 2, 118, 'TOUCHDOWN', {
        fontFamily: 'monospace',
        fontSize: '30px',
        fontStyle: 'bold',
        color: '#fcbd22',
        stroke: '#163849',
        strokeThickness: 6
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setScale(0.8)
      .setDepth(40);

    const plane = this.createLandingPlane(width / 2, 250);
    this.tweens.add({
      targets: plane,
      y: 542,
      scaleX: 1.62,
      scaleY: 1.62,
      angle: 0,
      duration: 1500,
      ease: 'Quad.In',
      onComplete: () => {
        this.cameras.main.shake(110, 0.0025);
        this.spawnTouchdownPuffs(width / 2, 578);
        this.tweens.add({ targets: touchdown, alpha: 1, scale: 1, duration: 180, ease: 'Back.Out' });
        this.time.delayedCall(720, () => this.tweens.add({ targets: touchdown, alpha: 0, duration: 260 }));
      }
    });

    const dialogue = this.buildKenArrivalCard(width, height).setAlpha(0).setY(38);
    this.tweens.add({ targets: dialogue, alpha: 1, y: 0, duration: 460, delay: 1750, ease: 'Back.Out' });

    const button = createButton(this, width / 2, 850, "MEET YOUR TRAVELER", () => {
      flowController.go(this, SceneKeys.Character);
    }, { width: 330, fontSize: 16 })
      .setAlpha(0)
      .setDepth(80);

    this.tweens.add({ targets: button, alpha: 1, y: 830, duration: 400, delay: 2180, ease: 'Back.Out' });

    this.tweens.add({
      targets: airportLabel,
      alpha: 0.78,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut'
    });
  }

  private drawAirportWorld(width: number, height: number): void {
    const g = this.add.graphics();

    // Tropical morning sky.
    const bands = [0x70c7ed, 0x83d1ef, 0x9fdcf0, 0xbce6ec];
    bands.forEach((color, index) => {
      g.fillStyle(color, 1);
      g.fillRect(0, index * 105, width, 110);
    });

    // Distant Phu Quoc tree line.
    g.fillStyle(0x315d4d, 1);
    g.fillRect(0, 365, width, 95);
    g.fillStyle(0x477b5b, 1);
    for (let x = -10; x < width + 20; x += 34) {
      g.fillTriangle(x, 390, x + 17, 332 - (x % 4) * 7, x + 34, 390);
    }

    // Terminal and control tower silhouettes.
    g.fillStyle(0xe9e3d2, 1);
    g.fillRect(34, 402, 212, 74);
    g.fillStyle(0x3f7180, 1);
    for (let x = 48; x < 228; x += 30) g.fillRect(x, 417, 20, 22);
    g.fillStyle(0xe9e3d2, 1);
    g.fillRect(415, 328, 34, 128);
    g.fillStyle(0x294f5e, 1);
    g.fillRect(405, 316, 54, 24);
    g.fillStyle(0xf6c760, 1);
    g.fillRect(420, 334, 24, 8);

    // Runway perspective from horizon to camera.
    g.fillStyle(0x36434a, 1);
    g.beginPath();
    g.moveTo(width / 2 - 45, 430);
    g.lineTo(width / 2 + 45, 430);
    g.lineTo(width + 72, height);
    g.lineTo(-72, height);
    g.closePath();
    g.fillPath();

    // Runway shoulders.
    g.fillStyle(0x78936d, 1);
    g.beginPath();
    g.moveTo(0, 430);
    g.lineTo(width / 2 - 48, 430);
    g.lineTo(-74, height);
    g.lineTo(0, height);
    g.closePath();
    g.fillPath();
    g.beginPath();
    g.moveTo(width / 2 + 48, 430);
    g.lineTo(width, 430);
    g.lineTo(width, height);
    g.lineTo(width + 74, height);
    g.closePath();
    g.fillPath();

    // Perspective centreline.
    g.fillStyle(0xf6f2d9, 0.95);
    for (let i = 0; i < 9; i += 1) {
      const depth = i / 9;
      const y = 470 + Math.pow(depth, 1.8) * 380;
      const w = 5 + depth * 17;
      const h = 12 + depth * 32;
      g.fillRect(width / 2 - w / 2, y, w, h);
    }

    // Runway edge lights.
    for (let i = 0; i < 10; i += 1) {
      const t = i / 9;
      const y = 458 + Math.pow(t, 1.7) * 420;
      const spread = 58 + t * 248;
      const size = 3 + t * 5;
      const left = this.add.circle(width / 2 - spread, y, size, 0xffd96a, 0.95).setDepth(8);
      const right = this.add.circle(width / 2 + spread, y, size, 0xffd96a, 0.95).setDepth(8);
      this.tweens.add({
        targets: [left, right],
        alpha: 0.25,
        duration: 520 + i * 35,
        yoyo: true,
        repeat: -1,
        delay: i * 55
      });
    }
  }

  private createLandingPlane(x: number, y: number): Phaser.GameObjects.Container {
    const plane = this.add.container(x, y).setScale(0.34).setAngle(-2).setDepth(30);
    const wing = this.add.triangle(0, 24, 0, 0, 132, 44, -132, 44, 0xddebf0).setStrokeStyle(4, 0x274755, 1);
    const body = this.add.ellipse(0, 0, 88, 176, 0xf7fbff).setStrokeStyle(4, 0x274755, 1);
    const nose = this.add.circle(0, 76, 25, 0xf7fbff).setStrokeStyle(4, 0x274755, 1);
    const tail = this.add.triangle(0, -72, 0, 0, 0, -70, 42, -8, 0xe86043).setStrokeStyle(4, 0x274755, 1);
    const window = this.add.rectangle(0, 57, 32, 10, 0x4b8da6);
    const leftWheel = this.add.circle(-24, 62, 9, 0x20292d);
    const rightWheel = this.add.circle(24, 62, 9, 0x20292d);
    plane.add([wing, body, nose, tail, window, leftWheel, rightWheel]);
    return plane;
  }

  private spawnTouchdownPuffs(x: number, y: number): void {
    for (let i = 0; i < 10; i += 1) {
      const puff = this.add
        .circle(x + Phaser.Math.Between(-75, 75), y + Phaser.Math.Between(-8, 12), Phaser.Math.Between(5, 11), 0xf3f4e9, 0.72)
        .setDepth(24);
      this.tweens.add({
        targets: puff,
        x: puff.x + Phaser.Math.Between(-36, 36),
        y: puff.y - Phaser.Math.Between(18, 44),
        alpha: 0,
        scale: 1.8,
        duration: Phaser.Math.Between(420, 760),
        onComplete: () => puff.destroy()
      });
    }
  }

  private buildKenArrivalCard(width: number, height: number): Phaser.GameObjects.Container {
    const layer = this.add.container(0, 0).setDepth(70);
    const panel = this.add.rectangle(width / 2, 700, 448, 194, 0x082e3f, 0.96).setStrokeStyle(3, 0xfcbd22, 0.9);
    const avatarRing = this.add.circle(96, 674, 42, 0x174f60, 1).setStrokeStyle(3, 0xfcbd22, 1);
    const head = this.add.circle(96, 665, 16, 0xd99a69, 1);
    const hair = this.add.arc(96, 658, 18, 180, 360, false, 0x202b2f, 1);
    const shirt = this.add.triangle(96, 700, 0, 0, 31, 0, 15, -30, 0x77944c, 1);
    const name = this.add.text(158, 642, 'KEN · LOCAL GUIDE', {
      fontFamily: 'monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#fcbd22'
    });
    const copy = this.add.text(158, 678, 'Welcome to Phu Quoc.\nYour island starts here.', {
      fontFamily: 'monospace',
      fontSize: '17px',
      color: '#ffffff',
      lineSpacing: 7
    });
    const tag = this.add.text(158, 747, 'BAGS READY · RIDE WAITING OUTSIDE', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#9fd9df'
    });
    layer.add([panel, avatarRing, head, hair, shirt, name, copy, tag]);
    return layer;
  }
}
