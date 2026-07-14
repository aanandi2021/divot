/**
 * Draws a rubber tee mat with a "TEE N" label.
 */
import Phaser from 'phaser';
import { FONT_MONO } from '@/util/fonts';
import { PAL } from '@/util/palette';

export function drawTeeMat(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string
): void {
  const g = scene.add.graphics().setDepth(2);
  g.fillStyle(0x000000, 0.35);
  g.fillRect(x + 2, y + 3, w, h);
  g.fillStyle(PAL.tee, 1);
  g.fillRect(x, y, w, h);
  g.lineStyle(2, 0x000000, 1);
  g.strokeRect(x + 1, y + 1, w - 2, h - 2);
  scene.add
    .text(x + w / 2, y + h / 2, label, {
      fontFamily: FONT_MONO,
      fontSize: '10px',
      color: '#e8c848',
      fontStyle: '700',
    })
    .setOrigin(0.5)
    .setDepth(3);
}
