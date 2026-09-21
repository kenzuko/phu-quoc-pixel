import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { createButton } from '../ui/createButton';
import { projectGeo } from '../world-v2/geo';
import {
  ISLAND_PLACE_ANCHORS_V2,
  PHU_QUOC_BOUNDS,
  PHU_QUOC_LANDMASSES_V2
} from '../world-v2/phu-quoc';

export class IslandMapV2Scene extends Phaser.Scene {
  constructor() { super(SceneKeys.IslandMapV2); }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#052c44');

    const g = this.add.graphics();
    g.fillStyle(0x063d5b, 1);
    g.fillRect(0, 0, width, height);

    const rect = { x: 65, y: 124, width: 410, height: 690 };

    for (const landmass of PHU_QUOC_LANDMASSES_V2) {
      const polygon = landmass.points.map((point) => projectGeo(point, PHU_QUOC_BOUNDS, rect));
      g.fillStyle(landmass.id === 'phu-quoc-main' ? 0x143c43 : 0x17464a, 1);
      g.lineStyle(landmass.id === 'phu-quoc-main' ? 4 : 3, 0xe3c56c, 0.82);
      g.beginPath();
      g.moveTo(polygon[0].x, polygon[0].y);
      for (let i = 1; i < polygon.length; i += 1) g.lineTo(polygon[i].x, polygon[i].y);
      g.closePath();
      g.fillPath();
      g.strokePath();
    }

    // Subtle vegetation marks are decorative only and do not encode geography.
    g.fillStyle(0x2a6253, 0.42);
    for (let i = 0; i < 46; i += 1) {
      const x = 112 + ((i * 61) % 290);
      const y = 180 + ((i * 107) % 470);
      g.fillRect(x, y, 4, 7);
    }

    this.add.text(width / 2, 42, 'PHU QUOC · WORLD MAP V2', {
      fontFamily: 'monospace', fontSize: '19px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, 74, 'GEO ANCHORS · SEPARATE LANDMASSES', {
      fontFamily: 'monospace', fontSize: '9px', color: '#8de4df'
    }).setOrigin(0.5);

    for (const place of ISLAND_PLACE_ANCHORS_V2) {
      const p = projectGeo(place.point, PHU_QUOC_BOUNDS, rect);
      const pilot = place.status === 'pilot';
      const dot = this.add.circle(p.x, p.y, pilot ? 9 : 6, pilot ? 0xfcbd22 : 0xd8f1ec, 1)
        .setStrokeStyle(3, 0x092633, 0.9)
        .setDepth(4);

      let alignRight = p.x < width * 0.58;
      if (place.id === 'ganh-dau' || place.id === 'grand-world') alignRight = true;
      if (place.id === 'bai-sao') alignRight = false;

      const label = this.add.text(p.x + (alignRight ? 13 : -13), p.y - 4, place.label, {
        fontFamily: 'monospace',
        fontSize: pilot ? '11px' : '8px',
        fontStyle: 'bold',
        color: pilot ? '#ffe283' : '#d5ecea',
        backgroundColor: '#073044',
        padding: { x: 5, y: 3 }
      }).setOrigin(alignRight ? 0 : 1, 0.5).setDepth(5);

      if (pilot) {
        dot.setInteractive({ useHandCursor: true });
        label.setInteractive({ useHandCursor: true });
        const open = (): void => flowController.go(this, SceneKeys.SunsetWorldTour);
        dot.on('pointerdown', open);
        label.on('pointerdown', open);
      }
    }

    this.add.text(width / 2, 842,
      'SIMPLIFIED GEO TRACE · MAIN ISLAND + HON THOM\nPINS FROM VERIFIED / CROSS-CHECKED COORDINATES',
      {
        fontFamily: 'monospace', fontSize: '9px', align: 'center',
        lineSpacing: 4, color: '#87aeb7'
      }
    ).setOrigin(0.5);

    createButton(this, 115, 906, 'BACK', () => {
      flowController.go(this, SceneKeys.V2Hub);
    }, { width: 150, fontSize: 12, backgroundColor: '#164b61', color: '#ffffff' });

    createButton(this, 378, 906, 'SUNSET TOUR', () => {
      flowController.go(this, SceneKeys.SunsetWorldTour);
    }, { width: 205, fontSize: 12 });
  }
}
