import Phaser from 'phaser';

export interface MapPoint {
  x: number;
  y: number;
}

// Main-island bounds from public geographic map data. Hòn Thơm and the An
// Thới archipelago extend south of this box and are handled as an extension.
const LAT_MIN = 10.003722;
const LAT_MAX = 10.451278;
const LON_MIN = 103.837059;
const LON_MAX = 104.087082;

/**
 * Geography-led Phú Quốc map art.
 *
 * This is not a fantasy blob: pins are projected from latitude/longitude and
 * the coastline silhouette follows the real north-heavy, tapering south shape
 * of Phú Quốc. It stays stylised for the pixel game, but geography owns layout.
 */
export class PhuQuocMapArt {
  private readonly graphics: Phaser.GameObjects.Graphics;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly left: number,
    private readonly top: number,
    private readonly width: number,
    private readonly height: number
  ) {
    this.graphics = scene.add.graphics();
    this.draw();
  }

  geoToScreen(lat: number, lon: number): MapPoint {
    const padX = 25;
    const padTop = 22;
    const mainHeight = this.height * 0.82;

    const nx = Phaser.Math.Clamp((lon - LON_MIN) / (LON_MAX - LON_MIN), -0.2, 1.2);
    const ny = 1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN);

    // Coordinates south of the main-island bbox continue naturally into the
    // An Thới archipelago zone rather than being clamped onto An Thới town.
    if (lat < LAT_MIN) {
      const southDelta = (LAT_MIN - lat) / 0.075;
      return {
        x: this.left + padX + nx * (this.width - padX * 2),
        y: this.top + padTop + mainHeight + southDelta * (this.height * 0.12)
      };
    }

    return {
      x: this.left + padX + nx * (this.width - padX * 2),
      y: this.top + padTop + Phaser.Math.Clamp(ny, 0, 1) * mainHeight
    };
  }

  private draw(): void {
    const g = this.graphics;
    const cx = this.left + this.width / 2;
    const cy = this.top + this.height / 2;

    // Sea chart background.
    g.fillStyle(0x0b7996, 1);
    g.fillRoundedRect(this.left, this.top, this.width, this.height, 18);
    g.lineStyle(2, 0x9bdbe2, 0.25);
    for (let y = this.top + 28; y < this.top + this.height - 20; y += 34) {
      g.lineBetween(this.left + 18, y, this.left + this.width - 18, y);
    }
    for (let x = this.left + 26; x < this.left + this.width - 20; x += 42) {
      g.lineBetween(x, this.top + 18, x, this.top + this.height - 18);
    }

    // Island shadow first.
    const coast = COASTLINE.map(([lat, lon]) => this.geoToScreen(lat, lon));
    this.fillPolygon(g, coast.map((p) => ({ x: p.x + 5, y: p.y + 7 })), 0x052d38, 0.34);

    // Land mass.
    this.fillPolygon(g, coast, 0xd7d39a, 1);
    this.strokePolygon(g, coast, 0xf7e9b8, 4, 0.95);

    // National-park massing in the north-east. This is deliberately a broad
    // ecological zone, not a parcel-accurate boundary.
    const forest = [
      [10.420, 103.948], [10.430, 104.020], [10.390, 104.065], [10.320, 104.075],
      [10.280, 104.035], [10.300, 103.980], [10.350, 103.950]
    ] as const;
    this.fillPolygon(g, forest.map(([lat, lon]) => this.geoToScreen(lat, lon)), 0x4f8b57, 0.82);

    // Major road spine and coastal connectors.
    this.drawGeoLine(g, [
      [10.395, 103.900], [10.330, 103.925], [10.255, 103.950], [10.216, 103.961],
      [10.150, 103.980], [10.080, 104.000], [10.030, 104.006]
    ], 0xf4e3b5, 5, 0.9);
    this.drawGeoLine(g, [
      [10.216, 103.961], [10.205, 104.005], [10.181, 104.048]
    ], 0xf4e3b5, 4, 0.82);
    this.drawGeoLine(g, [
      [10.080, 104.000], [10.050, 104.036]
    ], 0xf4e3b5, 4, 0.82);

    // Dương Đông river cue.
    this.drawGeoLine(g, [
      [10.225, 103.990], [10.219, 103.975], [10.216, 103.958]
    ], 0x1c91b0, 4, 0.9);

    // Southern archipelago including Hòn Thơm.
    const islands = [
      { lat: 9.995, lon: 104.015, r: 5 },
      { lat: 9.982, lon: 104.018, r: 4 },
      { lat: 9.970, lon: 104.013, r: 4 },
      { lat: 9.955, lon: 104.017, r: 9 },
      { lat: 9.943, lon: 104.007, r: 4 }
    ];
    for (const island of islands) {
      const p = this.geoToScreen(island.lat, island.lon);
      g.fillStyle(0xd7d39a, 1);
      g.fillEllipse(p.x, p.y, island.r * 1.35, island.r * 2.2);
      g.lineStyle(1, 0xf7e9b8, 0.85);
      g.strokeEllipse(p.x, p.y, island.r * 1.35, island.r * 2.2);
    }

    this.drawPlaceLabel('GANH DAU', 10.37111, 103.84359, -4, -12);
    this.drawPlaceLabel('DUONG DONG', 10.21667, 103.96667, 18, -8);
    this.drawPlaceLabel('HAM NINH', 10.18058, 104.04769, 20, 0);
    this.drawPlaceLabel('AN THOI', 10.01914, 104.01499, -26, 15);

    // Compass mark.
    g.fillStyle(0xf8f1d7, 0.9);
    g.fillTriangle(this.left + this.width - 34, this.top + 24, this.left + this.width - 42, this.top + 46, this.left + this.width - 26, this.top + 46);
    g.lineStyle(2, 0xf8f1d7, 0.7);
    g.lineBetween(this.left + this.width - 34, this.top + 42, this.left + this.width - 34, this.top + 62);

    // Border.
    g.lineStyle(3, 0xf3dfaa, 0.6);
    g.strokeRoundedRect(this.left, this.top, this.width, this.height, 18);

    // Tiny decorative location crosshair at map centre.
    g.lineStyle(1, 0xffffff, 0.12);
    g.lineBetween(cx - 7, cy, cx + 7, cy);
    g.lineBetween(cx, cy - 7, cx, cy + 7);
  }

  private drawPlaceLabel(label: string, lat: number, lon: number, dx: number, dy: number): void {
    const p = this.geoToScreen(lat, lon);
    this.scene.add
      .text(p.x + dx, p.y + dy, label, {
        fontFamily: 'monospace',
        fontSize: '8px',
        fontStyle: 'bold',
        color: '#173b3f',
        backgroundColor: '#f5e9bdcc',
        padding: { x: 3, y: 2 }
      })
      .setOrigin(0.5)
      .setDepth(2);
  }

  private drawGeoLine(
    g: Phaser.GameObjects.Graphics,
    coords: ReadonlyArray<readonly [number, number]>,
    color: number,
    width: number,
    alpha: number
  ): void {
    const points = coords.map(([lat, lon]) => this.geoToScreen(lat, lon));
    g.lineStyle(width, color, alpha);
    g.beginPath();
    points.forEach((point, index) => {
      if (index === 0) g.moveTo(point.x, point.y);
      else g.lineTo(point.x, point.y);
    });
    g.strokePath();
  }

  private fillPolygon(g: Phaser.GameObjects.Graphics, points: MapPoint[], color: number, alpha: number): void {
    if (!points.length) return;
    g.fillStyle(color, alpha);
    g.beginPath();
    g.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) g.lineTo(points[i].x, points[i].y);
    g.closePath();
    g.fillPath();
  }

  private strokePolygon(
    g: Phaser.GameObjects.Graphics,
    points: MapPoint[],
    color: number,
    width: number,
    alpha: number
  ): void {
    if (!points.length) return;
    g.lineStyle(width, color, alpha);
    g.beginPath();
    g.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) g.lineTo(points[i].x, points[i].y);
    g.closePath();
    g.strokePath();
  }
}

// Clockwise coast trace in geographic coordinates. It is intentionally
// simplified to game scale while retaining the island's real visual identity:
// broad north, Gành Dầu western shoulder, east bulge and long southern taper.
const COASTLINE: ReadonlyArray<readonly [number, number]> = [
  [10.445, 103.963],
  [10.438, 104.015],
  [10.416, 104.050],
  [10.378, 104.073],
  [10.332, 104.082],
  [10.286, 104.075],
  [10.244, 104.068],
  [10.205, 104.057],
  [10.165, 104.054],
  [10.124, 104.048],
  [10.083, 104.043],
  [10.046, 104.035],
  [10.013, 104.018],
  [10.018, 103.998],
  [10.054, 103.988],
  [10.090, 103.980],
  [10.132, 103.970],
  [10.176, 103.961],
  [10.218, 103.951],
  [10.258, 103.936],
  [10.298, 103.910],
  [10.330, 103.875],
  [10.362, 103.841],
  [10.392, 103.846],
  [10.414, 103.872],
  [10.431, 103.915]
];
