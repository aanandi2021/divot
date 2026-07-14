/**
 * Pendulum — a rectangular bar swinging on a pivot, driven by a sine
 * oscillation of its angle each frame. Kinematic (static body position
 * updated manually), same pattern as Windmill.
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

export interface PendulumOpts {
  /** Pivot point (top of the pendulum). */
  pivot: { x: number; y: number };
  /** Length of the rod from pivot to bar centre. */
  length: number;
  /** Bar dimensions. */
  barLength: number;
  barWidth: number;
  /** Full-cycle period in seconds. */
  period: number;
  /** Peak swing angle in radians (typical 0.6–1.0). */
  amplitude: number;
}

export class Pendulum {
  private opts: PendulumOpts;
  private body: MatterJS.BodyType;
  private gfx: Phaser.GameObjects.Graphics;
  private t = 0;

  constructor(scene: Phaser.Scene, opts: PendulumOpts) {
    this.opts = opts;
    // Bar body — position + angle updated each frame
    this.body = scene.matter.add.rectangle(
      opts.pivot.x,
      opts.pivot.y + opts.length,
      opts.barLength,
      opts.barWidth,
      { isStatic: true, friction: 0.05, restitution: 0.7, label: 'pendulum' }
    ) as MatterJS.BodyType;
    this.gfx = scene.add.graphics().setDepth(3);
  }

  update(dtMs: number): void {
    this.t += dtMs / 1000;
    // Sine oscillation from -amp to +amp
    const swingAngle = Math.sin((this.t / this.opts.period) * Math.PI * 2) * this.opts.amplitude;
    const barCx = this.opts.pivot.x + Math.sin(swingAngle) * this.opts.length;
    const barCy = this.opts.pivot.y + Math.cos(swingAngle) * this.opts.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Matter = (Phaser as any).Physics.Matter.Matter;
    Matter.Body.setPosition(this.body, { x: barCx, y: barCy });
    Matter.Body.setAngle(this.body, swingAngle + Math.PI / 2);
    this.draw(barCx, barCy, swingAngle);
  }

  private draw(barCx: number, barCy: number, swingAngle: number): void {
    const g = this.gfx;
    const { pivot, barLength, barWidth } = this.opts;
    g.clear();
    // Rod from pivot to bar centre
    g.lineStyle(3, 0x3a2818, 1);
    g.beginPath();
    g.moveTo(pivot.x, pivot.y);
    g.lineTo(barCx, barCy);
    g.strokePath();
    // Pivot cap
    g.fillStyle(PAL.woodEdge, 1);
    g.fillCircle(pivot.x, pivot.y, 5);
    g.fillStyle(0xf0c840, 1);
    g.fillCircle(pivot.x, pivot.y, 2);
    // Bar — dark iron with rivets
    g.save();
    g.translateCanvas(barCx, barCy);
    g.rotateCanvas(swingAngle + Math.PI / 2);
    g.fillStyle(0x000000, 0.35);
    g.fillRect(-barLength / 2 + 3, -barWidth / 2 + 4, barLength, barWidth);
    g.fillStyle(0x3a3a3a, 1);
    g.fillRect(-barLength / 2, -barWidth / 2, barLength, barWidth);
    g.fillStyle(0x5a5a5a, 1);
    g.fillRect(-barLength / 2, -barWidth / 2, barLength, 2);
    g.lineStyle(1, 0x000000, 1);
    g.strokeRect(-barLength / 2 + 0.5, -barWidth / 2 + 0.5, barLength - 1, barWidth - 1);
    // Rivets
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(-barLength / 2 + 6, 0, 2);
    g.fillCircle(barLength / 2 - 6, 0, 2);
    g.fillCircle(0, 0, 2);
    g.restore();
  }
}
