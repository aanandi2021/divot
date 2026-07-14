/**
 * WaterHazard — sensor zone with an animated rippling surface.
 * On ball entry: splash + +1 stroke + respawn at tee (spec FR-024).
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

export class WaterHazard {
  private ripples: Phaser.GameObjects.Graphics;
  private specular: Phaser.GameObjects.Graphics;
  private x: number;
  private y: number;
  private w: number;
  private h: number;
  private t = 0;
  private phase: number;

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.phase = Math.random() * Math.PI * 2;
    // Sensor body
    scene.matter.add.rectangle(x + w / 2, y + h / 2, w, h, {
      isStatic: true,
      isSensor: true,
      label: 'water',
    });
    // Static parts — coping, water body, base tint
    const g = scene.add.graphics().setDepth(0.4);
    g.fillStyle(0x8a5228, 1);
    g.fillRect(x - 4, y - 4, w + 8, h + 8);
    g.lineStyle(1.5, 0x2a1808, 1);
    g.strokeRect(x - 4, y - 4, w + 8, h + 8);
    g.fillStyle(PAL.waterDark, 1);
    g.fillRect(x, y, w, h);
    g.fillStyle(PAL.water, 1);
    g.fillRect(x + 4, y + 4, w - 8, h - 8);
    // Animated ripples layer
    this.ripples = scene.add.graphics().setDepth(0.42);
    // Animated specular highlight
    this.specular = scene.add.graphics().setDepth(0.43);
    this.update(0);
  }

  update(dtMs: number): void {
    this.t += dtMs / 1000;
    const g = this.ripples;
    g.clear();
    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;
    // Draw 4 concentric elliptical ripples that each pulse in scale
    // and drift in opacity — creating a gently animated water look.
    const wind = this.t * 1.4 + this.phase;
    for (let i = 0; i < 4; i++) {
      const localPhase = wind + i * 0.6;
      const scale = 0.35 + 0.1 * Math.sin(localPhase * 1.2);
      const alpha = 0.35 + 0.3 * Math.cos(localPhase * 0.7);
      g.lineStyle(1, PAL.waterHighlight, alpha * 0.55);
      const rx = this.w * (0.42 - i * 0.06 + scale * 0.04);
      const ry = this.h * (0.25 - i * 0.04 + scale * 0.03);
      if (rx > 4 && ry > 2) g.strokeEllipse(cx, cy, rx * 2, ry * 2);
    }
    // A few smaller drifting wavelets
    for (let i = 0; i < 5; i++) {
      const localPhase = wind * 1.6 + i * 1.7 + this.phase * 3;
      const wx = cx + Math.sin(localPhase) * this.w * 0.32;
      const wy = cy + Math.cos(localPhase * 0.9) * this.h * 0.28;
      g.lineStyle(1, 0xffffff, 0.4 + 0.25 * Math.cos(localPhase * 1.5));
      g.strokeEllipse(wx, wy, 12, 2);
    }
    // Moving specular highlight (upper-left, drifts slightly)
    const sg = this.specular;
    sg.clear();
    const spx = this.x + this.w * 0.28 + Math.sin(wind * 0.6) * 6;
    const spy = this.y + this.h * 0.28 + Math.cos(wind * 0.4) * 3;
    sg.fillStyle(0xffffff, 0.32);
    sg.fillEllipse(spx, spy, this.w * 0.18, 3.5);
    sg.fillStyle(0xffffff, 0.22);
    sg.fillEllipse(spx + this.w * 0.08, spy + 5, this.w * 0.06, 2);
  }
}
