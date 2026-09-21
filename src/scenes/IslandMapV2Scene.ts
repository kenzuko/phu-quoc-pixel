import Phaser from 'phaser';
import { SceneKeys } from '../app/scene-keys';
import { flowController } from '../core/navigation/FlowController';
import { createButton } from '../ui/createButton';
import { projectGeo, type GeoBounds } from '../world-v2/geo';
import {
  ISLAND_MAP_FEATURES_V2,
  PHU_QUOC_BOUNDS,
  PHU_QUOC_LANDMASSES_V2
} from '../world-v2/phu-quoc';
import type { GeoPoint, IslandMapFeature } from '../world-v2/types';

interface MapRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class IslandMapV2Scene extends Phaser.Scene {
  constructor() { super(SceneKeys.IslandMapV2); }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#052c44');

    const g = this.add.graphics();
    g.fillStyle(0x063d5b, 1);
    g.fillRect(0, 0, width, height);

    const rect: MapRect = { x: 58, y: 120, width: 424, height: 700 };

    this.drawLandmasses(g, rect);
    this.drawFeatureGeometry(g, rect);

    this.add.text(width / 2, 38, 'PHU QUOC · WORLD MAP V2', {
      fontFamily: 'monospace', fontSize: '19px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, 70, 'GEOJSON COAST · POINT / AREA / COAST FEATURES', {
      fontFamily: 'monospace', fontSize: '8px', color: '#8de4df'
    }).setOrigin(0.5);

    for (const feature of ISLAND_MAP_FEATURES_V2) {
      this.drawFeatureLabel(feature, rect);
    }

    const buildId = String(import.meta.env.VITE_BUILD_SHA ?? 'dev').slice(0, 7);

    this.add.text(width / 2, 842,
      `COASTLINE: ADMIN GEOJSON · MAP SEMANTICS V2\nBAI SAO / RACH VEM = COAST · GRAND WORLD / SAFARI = AREA\nBUILD ${buildId}`,
      {
        fontFamily: 'monospace',
        fontSize: '8px',
        align: 'center',
        lineSpacing: 4,
        color: '#87aeb7'
      }
    ).setOrigin(0.5);

    createButton(this, 115, 906, 'BACK', () => {
      flowController.go(this, SceneKeys.V2Hub);
    }, { width: 150, fontSize: 12, backgroundColor: '#164b61', color: '#ffffff' });

    createButton(this, 378, 906, 'SUNSET TOUR', () => {
      flowController.go(this, SceneKeys.SunsetWorldTour);
    }, { width: 205, fontSize: 12 });
  }

  private drawLandmasses(g: Phaser.GameObjects.Graphics, rect: MapRect): void {
    for (const landmass of PHU_QUOC_LANDMASSES_V2) {
      const polygon = landmass.points.map((point) => projectGeo(point, PHU_QUOC_BOUNDS, rect));
      if (polygon.length < 3) continue;

      g.fillStyle(landmass.id === 'phu-quoc-main' ? 0x143c43 : 0x17464a, 1);
      g.lineStyle(landmass.id === 'phu-quoc-main' ? 3 : 2, 0xdac776, 0.9);
      g.beginPath();
      g.moveTo(polygon[0].x, polygon[0].y);
      for (let i = 1; i < polygon.length; i += 1) g.lineTo(polygon[i].x, polygon[i].y);
      g.closePath();
      g.fillPath();
      g.strokePath();
    }
  }

  private drawFeatureGeometry(g: Phaser.GameObjects.Graphics, rect: MapRect): void {
    for (const feature of ISLAND_MAP_FEATURES_V2) {
      if (feature.kind === 'coast' && feature.path && feature.path.length > 1) {
        const path = feature.path.map((point) => projectGeo(point, PHU_QUOC_BOUNDS, rect));
        g.lineStyle(7, feature.id === 'bai-sao' ? 0xf2e0a2 : 0x8bd9d2, 0.84);
        g.beginPath();
        g.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i += 1) g.lineTo(path[i].x, path[i].y);
        g.strokePath();
        continue;
      }

      if (feature.kind === 'area' && feature.approxRadiusKm) {
        const p = projectGeo(feature.point, PHU_QUOC_BOUNDS, rect);
        const radius = this.projectRadius(feature.point, feature.approxRadiusKm, PHU_QUOC_BOUNDS, rect);
        const pilot = feature.status === 'pilot';
        g.fillStyle(pilot ? 0xfcbd22 : 0x8bd9d2, pilot ? 0.14 : 0.08);
        g.fillEllipse(p.x, p.y, radius.x * 2, radius.y * 2);
        g.lineStyle(pilot ? 3 : 2, pilot ? 0xfcbd22 : 0x8bd9d2, pilot ? 0.9 : 0.52);
        g.strokeEllipse(p.x, p.y, radius.x * 2, radius.y * 2);
      }
    }
  }

  private drawFeatureLabel(feature: IslandMapFeature, rect: MapRect): void {
    const { width } = this.scale;
    const p = projectGeo(feature.point, PHU_QUOC_BOUNDS, rect);
    const pilot = feature.status === 'pilot';

    let marker: Phaser.GameObjects.Arc | undefined;
    if (feature.kind !== 'coast') {
      marker = this.add.circle(
        p.x,
        p.y,
        pilot ? 7 : feature.kind === 'area' ? 4 : 5,
        pilot ? 0xfcbd22 : 0xd8f1ec,
        1
      ).setStrokeStyle(2, 0x092633, 0.9).setDepth(4);
    }

    const offset = this.labelOffset(feature.id, p.x, width);
    const label = this.add.text(p.x + offset.x, p.y + offset.y, feature.label, {
      fontFamily: 'monospace',
      fontSize: pilot ? '10px' : '7px',
      fontStyle: 'bold',
      color: pilot ? '#ffe283' : feature.kind === 'coast' ? '#dff7ef' : '#d5ecea',
      backgroundColor: '#073044',
      padding: { x: 4, y: 3 }
    }).setOrigin(offset.originX, 0.5).setDepth(5);

    if (pilot) {
      marker?.setInteractive({ useHandCursor: true });
      label.setInteractive({ useHandCursor: true });
      const open = (): void => flowController.go(this, SceneKeys.SunsetWorldTour);
      marker?.on('pointerdown', open);
      label.on('pointerdown', open);
    }
  }

  private projectRadius(point: GeoPoint, radiusKm: number, bounds: GeoBounds, rect: MapRect): { x: number; y: number } {
    const latDegrees = radiusKm / 111;
    const lonDegrees = radiusKm / (111 * Math.cos(Phaser.Math.DegToRad(point.lat)));
    const center = projectGeo(point, bounds, rect);
    const east = projectGeo({ lat: point.lat, lon: point.lon + lonDegrees }, bounds, rect);
    const north = projectGeo({ lat: point.lat + latDegrees, lon: point.lon }, bounds, rect);
    return {
      x: Math.max(5, Math.abs(east.x - center.x)),
      y: Math.max(5, Math.abs(north.y - center.y))
    };
  }

  private labelOffset(id: string, x: number, width: number): { x: number; y: number; originX: number } {
    const fixed: Readonly<Record<string, { x: number; y: number; originX: number }>> = {
      'ganh-dau': { x: 12, y: -10, originX: 0 },
      'rach-vem': { x: -12, y: -7, originX: 1 },
      'vinpearl-safari': { x: 12, y: 10, originX: 0 },
      'grand-world': { x: -12, y: 9, originX: 1 },
      'bai-sao': { x: -12, y: -3, originX: 1 },
      'sunset-town': { x: -12, y: -8, originX: 1 },
      'an-thoi': { x: -12, y: 10, originX: 1 },
      'hon-thom': { x: -12, y: 0, originX: 1 }
    };
    return fixed[id] ?? (x < width * 0.58
      ? { x: 12, y: -4, originX: 0 }
      : { x: -12, y: -4, originX: 1 });
  }
}
