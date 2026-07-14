/**
 * Bumper — round static body with high restitution.
 * The ball rockets off these — chaotic but readable pinball energy.
 * See HOLE-4 · Bumper Alley.
 */
import Phaser from 'phaser';

export class Bumper {
  constructor(scene: Phaser.Scene, cx: number, cy: number, radius: number) {
    scene.matter.add.circle(cx, cy, radius, {
      isStatic: true,
      friction: 0.0,
      restitution: 1.3, // >1 gives the pinball "kick" feel
      label: 'bumper',
    });
    const g = scene.add.graphics().setDepth(3);
    // Shadow
    g.fillStyle(0x000000, 0.35);
    g.fillCircle(cx + 2, cy + 3, radius);
    // Outer ring — bright red (classic pinball bumper)
    g.fillStyle(0xd83028, 1);
    g.fillCircle(cx, cy, radius);
    // Ring highlight (white ring inside)
    g.lineStyle(3, 0xffffff, 0.85);
    g.strokeCircle(cx, cy, radius - 5);
    // Inner cap
    g.fillStyle(0xf8d848, 1);
    g.fillCircle(cx, cy, radius * 0.4);
    // Subtle top-left specular
    g.fillStyle(0xffffff, 0.55);
    g.fillCircle(cx - radius * 0.35, cy - radius * 0.35, radius * 0.18);
    // Rim
    g.lineStyle(1.5, 0x8a1010, 1);
    g.strokeCircle(cx, cy, radius);
  }
}
