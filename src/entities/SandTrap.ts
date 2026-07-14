/**
 * SandTrap — sensor zone that dramatically increases friction while the ball
 * is inside, stopping the ball within ~1 second. No stroke penalty.
 * See spec FR-025.
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';
import type { Ball } from '@/entities/Ball';

const HIGH_FRICTION = 0.18; // ~7x the fairway friction

export class SandTrap {
  constructor(scene: Phaser.Scene, ball: Ball, x: number, y: number, w: number, h: number) {
    // Visual — beige rectangle with brick coping + subtle grain
    const g = scene.add.graphics().setDepth(0.4);
    g.fillStyle(0x8a5228, 1);
    g.fillRect(x - 3, y - 3, w + 6, h + 6);
    g.lineStyle(1.5, 0x2a1808, 1);
    g.strokeRect(x - 3, y - 3, w + 6, h + 6);
    g.fillStyle(PAL.sand, 1);
    g.fillRect(x, y, w, h);
    g.lineStyle(1, PAL.sandEdge, 1);
    g.strokeRect(x, y, w, h);
    // grain speckle
    for (let i = 0; i < Math.floor((w * h) / 200); i++) {
      g.fillStyle(0x8a6820, 0.5);
      g.fillCircle(x + Math.random() * w, y + Math.random() * h, 0.6);
    }
    // rake marks
    g.lineStyle(0.8, 0xc89838, 0.6);
    for (let i = 0; i < 5; i++) {
      const yy = y + (i + 0.5) * (h / 5);
      g.beginPath();
      g.moveTo(x, yy);
      g.lineTo(x + w, yy);
      g.strokePath();
    }
    // Sensor-based friction change: apply high friction while inside, reset outside.
    scene.matter.world.on('beforeupdate', () => {
      const bx = ball.x, by = ball.y;
      const inside = bx >= x && bx <= x + w && by >= y && by <= y + h;
      const cur = (ball.body as unknown as { frictionAir: number }).frictionAir;
      if (inside && cur < HIGH_FRICTION) ball.setFrictionAir(HIGH_FRICTION);
      else if (!inside && cur > 0.03) ball.setFrictionAir(0.025);
    });
  }
}
