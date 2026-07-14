/**
 * Cup — visual + animated flag that waves in the wind. Detection is done
 * per-frame in HoleScene using distance+velocity (per Sketch 01 findings).
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';
import { FONT_MONO } from '@/util/fonts';

export const CUP_RADIUS = 12;
export const CUP_CAPTURE_RADIUS = 14;
export const CUP_MAX_CAPTURE_SPEED = 3.2;

export class Cup {
  private cx: number;
  private cy: number;
  private flagGfx: Phaser.GameObjects.Graphics;
  private t = 0;
  /** Randomised offset so different flags don't wave in sync. */
  private phase: number;

  constructor(scene: Phaser.Scene, cx: number, cy: number, label: string) {
    this.cx = cx;
    this.cy = cy;
    this.phase = Math.random() * Math.PI * 2;
    // Static parts (grass ring, hole, pole)
    const g = scene.add.graphics().setDepth(2);
    g.fillStyle(PAL.grassDark, 0.7);
    g.fillCircle(cx, cy, CUP_RADIUS + 4);
    g.fillStyle(PAL.cup, 1);
    g.fillCircle(cx, cy, CUP_RADIUS);
    g.lineStyle(2, 0x000000, 1);
    g.strokeCircle(cx, cy, CUP_RADIUS);
    // Flag pole
    g.lineStyle(2.5, PAL.flagPole, 1);
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx + 22, cy - 32);
    g.strokePath();
    // Animated flag (drawn on separate graphics we redraw each frame)
    this.flagGfx = scene.add.graphics().setDepth(3);
    scene.add
      .text(cx + 34, cy - 24, label, {
        fontFamily: FONT_MONO,
        fontSize: '10px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2)
      .setDepth(4);
    // Draw first frame
    this.update(0);
  }

  update(dtMs: number): void {
    this.t += dtMs / 1000;
    const g = this.flagGfx;
    g.clear();
    const poleTopX = this.cx + 22;
    const poleTopY = this.cy - 32;
    // Wind direction: subtle rotation of the flag geometry
    const wind = this.t * 2 + this.phase;
    const flapA = Math.sin(wind * 2) * 3; // top-edge flutter
    const flapB = Math.sin(wind * 2 + 0.7) * 3; // bottom-edge flutter
    // Base attachments to the pole
    const baseTopX = poleTopX;
    const baseTopY = poleTopY;
    const baseBotX = poleTopX;
    const baseBotY = poleTopY + 14;
    // Trailing edge (tip) waves further from the pole with wind
    const tipX = poleTopX + 22 + Math.sin(wind) * 1.5;
    const tipY = poleTopY + 6 + Math.cos(wind * 1.3) * 1.5;
    // Draw the flag as a slightly wavy quad
    g.fillStyle(PAL.flag, 1);
    g.beginPath();
    g.moveTo(baseTopX, baseTopY);
    g.lineTo(tipX + flapA, tipY + flapA * 0.4);
    g.lineTo(tipX - 6 + flapB * 0.5, tipY + 6 + flapB * 0.6);
    g.lineTo(baseBotX, baseBotY);
    g.closePath();
    g.fillPath();
    // Fold seam through the middle for depth
    g.lineStyle(1, 0x8a1e10, 0.6);
    g.beginPath();
    g.moveTo(baseTopX + 4, baseTopY + 3);
    g.lineTo(tipX + flapA - 4, tipY + 3 + flapA * 0.3);
    g.strokePath();
  }
}

/** Backwards-compat wrapper matching the old `drawCup` signature. */
export function drawCup(scene: Phaser.Scene, cx: number, cy: number, label: string): Cup {
  return new Cup(scene, cx, cy, label);
}
