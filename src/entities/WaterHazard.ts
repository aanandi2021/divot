/**
 * WaterHazard — sensor zone that stops the ball, plays a splash, penalises
 * +1 stroke, and respawns the ball at the tee.
 * See spec FR-024 / HOLE-5 / HOLE-7.
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

export class WaterHazard {
  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number) {
    // Sensor body — no physical collision, only a trigger.
    scene.matter.add.rectangle(x + w / 2, y + h / 2, w, h, {
      isStatic: true,
      isSensor: true,
      label: 'water',
    });
    // Visual — realistic pond with coping edge + ripples
    const g = scene.add.graphics().setDepth(0.4);
    // Coping (brick edge)
    g.fillStyle(0x8a5228, 1);
    g.fillRect(x - 4, y - 4, w + 8, h + 8);
    g.lineStyle(1.5, 0x2a1808, 1);
    g.strokeRect(x - 4, y - 4, w + 8, h + 8);
    // Water body
    g.fillStyle(PAL.waterDark, 1);
    g.fillRect(x, y, w, h);
    // Highlight band
    g.fillStyle(PAL.water, 1);
    g.fillRect(x + 4, y + 4, w - 8, h - 8);
    // Ripples (concentric ellipses)
    g.lineStyle(1, PAL.waterHighlight, 0.55);
    for (let i = 0; i < 3; i++) {
      g.strokeEllipse(x + w / 2, y + h / 2, w * (0.6 - i * 0.14), h * (0.35 - i * 0.08));
    }
    // Specular
    g.fillStyle(0xffffff, 0.35);
    g.fillEllipse(x + w * 0.28, y + h * 0.28, w * 0.18, 3);
  }
}
