/**
 * SlidingGate — a kinematic barrier that translates back and forth along
 * a track. Ball must time the shot through the gap.
 * See spec HOLE-6.
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

export interface SlidingGateOpts {
  /** Track start (gate at position 0) */
  x: number;
  y: number;
  /** Gate size */
  w: number;
  h: number;
  /** Distance the gate slides along the perpendicular of its long axis */
  range: number;
  /** Full-cycle period in seconds (0 → range → 0 = one period) */
  period: number;
}

export class SlidingGate {
  private opts: SlidingGateOpts;
  private body: MatterJS.BodyType;
  private gfx: Phaser.GameObjects.Graphics;
  private startX: number;
  private startY: number;
  private t = 0;

  constructor(scene: Phaser.Scene, opts: SlidingGateOpts) {
    this.opts = opts;
    this.startX = opts.x + opts.w / 2;
    this.startY = opts.y + opts.h / 2;
    this.body = scene.matter.add.rectangle(this.startX, this.startY, opts.w, opts.h, {
      isStatic: true,
      friction: 0.05,
      restitution: 0.6,
      label: 'gate',
    }) as MatterJS.BodyType;
    this.gfx = scene.add.graphics().setDepth(3);
  }

  update(dtMs: number): void {
    this.t += dtMs / 1000;
    // Triangle wave 0 → range → 0
    const cycle = (this.t / this.opts.period) % 1;
    const pos = cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2; // 0..1..0
    // Track direction: perpendicular to gate's long axis
    const horizontal = this.opts.w > this.opts.h;
    const offset = pos * this.opts.range;
    const cx = this.startX + (horizontal ? 0 : offset);
    const cy = this.startY + (horizontal ? offset : 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Matter = (Phaser as any).Physics.Matter.Matter;
    Matter.Body.setPosition(this.body, { x: cx, y: cy });
    this.draw(cx, cy);
  }

  private draw(cx: number, cy: number): void {
    const g = this.gfx;
    const { w, h } = this.opts;
    g.clear();
    // Track (subtle recessed rail on the perpendicular axis)
    g.lineStyle(2, 0x3a2818, 0.5);
    if (w > h) {
      // horizontal gate → track runs vertical
      g.beginPath();
      g.moveTo(this.startX, this.startY - this.opts.range / 2 - 8);
      g.lineTo(this.startX, this.startY + this.opts.range / 2 + 8);
      g.strokePath();
    } else {
      g.beginPath();
      g.moveTo(this.startX - this.opts.range / 2 - 8, this.startY);
      g.lineTo(this.startX + this.opts.range / 2 + 8, this.startY);
      g.strokePath();
    }
    // Gate body — steel-grey with rivets
    g.fillStyle(0x000000, 0.35);
    g.fillRect(cx - w / 2 + 3, cy - h / 2 + 4, w, h);
    g.fillStyle(0x6a6a6a, 1);
    g.fillRect(cx - w / 2, cy - h / 2, w, h);
    g.fillStyle(0x8a8a8a, 1);
    g.fillRect(cx - w / 2, cy - h / 2, w, 2);
    g.lineStyle(1.5, 0x2a2a2a, 1);
    g.strokeRect(cx - w / 2 + 0.75, cy - h / 2 + 0.75, w - 1.5, h - 1.5);
    // Rivets at each corner
    g.fillStyle(PAL.woodEdge, 1);
    const rr = 1.6;
    g.fillCircle(cx - w / 2 + 4, cy - h / 2 + 4, rr);
    g.fillCircle(cx + w / 2 - 4, cy - h / 2 + 4, rr);
    g.fillCircle(cx - w / 2 + 4, cy + h / 2 - 4, rr);
    g.fillCircle(cx + w / 2 - 4, cy + h / 2 - 4, rr);
  }
}
