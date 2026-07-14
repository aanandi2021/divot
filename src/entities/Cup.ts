/**
 * Cup — visual only. Detection is done per-frame in HoleScene using distance+velocity
 * (per Sketch 01 learnings — Matter sensor collisions alone are unreliable at speed).
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

export const CUP_RADIUS = 12;
export const CUP_CAPTURE_RADIUS = 14;
export const CUP_MAX_CAPTURE_SPEED = 3.2;

export function drawCup(scene: Phaser.Scene, cx: number, cy: number, label: string): void {
  const g = scene.add.graphics().setDepth(2);
  // grass ring
  g.fillStyle(PAL.grassDark, 0.7);
  g.fillCircle(cx, cy, CUP_RADIUS + 4);
  // hole
  g.fillStyle(PAL.cup, 1);
  g.fillCircle(cx, cy, CUP_RADIUS);
  g.lineStyle(2, 0x000000, 1);
  g.strokeCircle(cx, cy, CUP_RADIUS);
  // flag pole
  g.lineStyle(2.5, PAL.flagPole, 1);
  g.beginPath();
  g.moveTo(cx, cy);
  g.lineTo(cx + 22, cy - 32);
  g.strokePath();
  // flag
  g.fillStyle(PAL.flag, 1);
  g.beginPath();
  g.moveTo(cx + 22, cy - 32);
  g.lineTo(cx + 46, cy - 26);
  g.lineTo(cx + 28, cy - 18);
  g.closePath();
  g.fillPath();
  g.lineStyle(1, 0x701a10, 1);
  g.strokePath();

  scene.add
    .text(cx + 34, cy - 24, label, {
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: '10px',
      color: '#ffffff',
    })
    .setOrigin(0.5)
    .setDepth(3);
}
