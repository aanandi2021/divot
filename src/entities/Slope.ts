/**
 * Slope — a rectangular zone that applies a directional gravity force
 * to the ball while it's inside. Validated in µ3-slope.html.
 * See spec §HOLE-5.
 */
import Phaser from 'phaser';
import type { Ball } from '@/entities/Ball';

export interface SlopeOpts {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Force vector applied per Matter tick. Magnitude ~0.0006 feels natural. */
  gravity: { x: number; y: number };
}

export class Slope {
  private opts: SlopeOpts;
  private ball: Ball;

  constructor(scene: Phaser.Scene, ball: Ball, opts: SlopeOpts) {
    this.opts = opts;
    this.ball = ball;
    // Visual: soft tan slope panel with contour lines + downhill arrow
    const g = scene.add.graphics().setDepth(0.5);
    g.fillStyle(0xd8a878, 0.5);
    g.fillRect(opts.x, opts.y, opts.w, opts.h);
    // Direction of arrow follows gravity vector
    const angle = Math.atan2(opts.gravity.y, opts.gravity.x);
    const cx = opts.x + opts.w / 2;
    const cy = opts.y + opts.h / 2;
    g.fillStyle(0x8a6828, 0.65);
    g.save();
    g.translateCanvas(cx, cy);
    g.rotateCanvas(angle);
    g.fillTriangle(-30, -6, 30, 0, -30, 6);
    g.restore();
    // Contour hatch perpendicular to gravity
    g.lineStyle(1, 0x8a6828, 0.4);
    const perp = angle + Math.PI / 2;
    const px = Math.cos(perp), py = Math.sin(perp);
    for (let d = -Math.max(opts.w, opts.h); d < Math.max(opts.w, opts.h); d += 22) {
      const x1 = cx + px * d - Math.cos(angle) * 500;
      const y1 = cy + py * d - Math.sin(angle) * 500;
      const x2 = cx + px * d + Math.cos(angle) * 500;
      const y2 = cy + py * d + Math.sin(angle) * 500;
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.strokePath();
    }
    // Register the beforeupdate force application
    scene.matter.world.on('beforeupdate', () => this.applyForce(scene));
  }

  private applyForce(scene: Phaser.Scene): void {
    const bx = this.ball.x, by = this.ball.y;
    const { x, y, w, h, gravity } = this.opts;
    if (bx >= x && bx <= x + w && by >= y && by <= y + h) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Matter = (Phaser as any).Physics.Matter.Matter;
      Matter.Body.applyForce(this.ball.body, { x: bx, y: by }, gravity);
    }
    // silence unused: keep scene reference for potential future needs
    void scene;
  }
}
