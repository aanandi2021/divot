/**
 * Ferry — a kinematic platform that shuttles back and forth on a fixed
 * track (like a river ferry). The ball must land on it and ride across a
 * gap (typically water) to the far side.
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

export interface FerryOpts {
  /** Start position of the ferry (centre). */
  from: { x: number; y: number };
  /** End position (centre). */
  to: { x: number; y: number };
  /** Ferry dimensions. */
  w: number;
  h: number;
  /** Full-cycle period in seconds (from → to → from = one period). */
  period: number;
}

export class Ferry {
  private opts: FerryOpts;
  private body: MatterJS.BodyType;
  private gfx: Phaser.GameObjects.Graphics;
  private t = 0;

  constructor(scene: Phaser.Scene, opts: FerryOpts) {
    this.opts = opts;
    this.body = scene.matter.add.rectangle(opts.from.x, opts.from.y, opts.w, opts.h, {
      isStatic: true,
      friction: 0.1,
      restitution: 0.4,
      label: 'ferry',
    }) as MatterJS.BodyType;
    this.gfx = scene.add.graphics().setDepth(2.5);
    // Draw the track (rail) once
    const track = scene.add.graphics().setDepth(0.6);
    track.lineStyle(3, 0x3a2818, 0.55);
    track.beginPath();
    track.moveTo(opts.from.x, opts.from.y);
    track.lineTo(opts.to.x, opts.to.y);
    track.strokePath();
    // Track dots (like ferry stops)
    track.fillStyle(0x3a2818, 0.6);
    track.fillCircle(opts.from.x, opts.from.y, 4);
    track.fillCircle(opts.to.x, opts.to.y, 4);
  }

  update(dtMs: number): void {
    this.t += dtMs / 1000;
    // Triangle wave 0 → 1 → 0
    const cycle = (this.t / this.opts.period) % 1;
    const pos = cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2;
    const cx = this.opts.from.x + (this.opts.to.x - this.opts.from.x) * pos;
    const cy = this.opts.from.y + (this.opts.to.y - this.opts.from.y) * pos;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Matter = (Phaser as any).Physics.Matter.Matter;
    Matter.Body.setPosition(this.body, { x: cx, y: cy });
    this.draw(cx, cy);
  }

  private draw(cx: number, cy: number): void {
    const g = this.gfx;
    const { w, h } = this.opts;
    g.clear();
    // Shadow
    g.fillStyle(0x000000, 0.4);
    g.fillRect(cx - w / 2 + 3, cy - h / 2 + 4, w, h);
    // Wooden deck
    g.fillStyle(PAL.wood, 1);
    g.fillRect(cx - w / 2, cy - h / 2, w, h);
    // Plank lines
    g.lineStyle(1, PAL.woodEdge, 1);
    for (let i = 1; i < 4; i++) {
      const y = cy - h / 2 + (i * h) / 4;
      g.beginPath();
      g.moveTo(cx - w / 2, y);
      g.lineTo(cx + w / 2, y);
      g.strokePath();
    }
    // Rope railings
    g.lineStyle(2, PAL.flagPole, 1);
    g.strokeRect(cx - w / 2 + 3, cy - h / 2 + 3, w - 6, h - 6);
    // Corner posts
    g.fillStyle(PAL.woodEdge, 1);
    g.fillCircle(cx - w / 2 + 4, cy - h / 2 + 4, 2);
    g.fillCircle(cx + w / 2 - 4, cy - h / 2 + 4, 2);
    g.fillCircle(cx - w / 2 + 4, cy + h / 2 - 4, 2);
    g.fillCircle(cx + w / 2 - 4, cy + h / 2 - 4, 2);
    // Outline
    g.lineStyle(1.5, PAL.woodEdge, 1);
    g.strokeRect(cx - w / 2 + 0.75, cy - h / 2 + 0.75, w - 1.5, h - 1.5);
  }
}
