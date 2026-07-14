/**
 * Windmill — a compound static body (base circle + 4 blades) rotated each frame
 * via Matter.Body.setAngle. Validated in µ2-windmill.html micro-MVP.
 * See Constitution IX + spec HOLE-3.
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

const BLADE_WIDTH = 14;

interface WindmillOpts {
  cx: number;
  cy: number;
  baseRadius: number;
  bladeLength: number;
  rpm: number;
}

export class Windmill {
  private opts: WindmillOpts;
  private body: MatterJS.BodyType;
  private gfx: Phaser.GameObjects.Graphics;
  private angle = 0;

  constructor(scene: Phaser.Scene, opts: WindmillOpts) {
    this.opts = opts;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Matter = (Phaser as any).Physics.Matter.Matter as {
      Bodies: {
        circle: (x: number, y: number, r: number, opts?: object) => object;
        rectangle: (x: number, y: number, w: number, h: number, opts?: object) => object;
      };
      Body: {
        create: (opts: object) => object;
        setAngle: (body: object, angle: number) => void;
      };
    };
    const parts: object[] = [
      Matter.Bodies.circle(opts.cx, opts.cy, opts.baseRadius, { label: 'windmill-base' }),
    ];
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const bx = opts.cx + Math.cos(a) * (opts.bladeLength / 2);
      const by = opts.cy + Math.sin(a) * (opts.bladeLength / 2);
      const blade = Matter.Bodies.rectangle(bx, by, opts.bladeLength, BLADE_WIDTH);
      Matter.Body.setAngle(blade, a);
      parts.push(blade);
    }
    this.body = Matter.Body.create({ parts, isStatic: true, label: 'windmill' }) as MatterJS.BodyType;
    scene.matter.world.add(this.body);
    this.gfx = scene.add.graphics().setDepth(3);
  }

  update(dtMs: number): void {
    const dtSec = dtMs / 1000;
    this.angle += ((this.opts.rpm * Math.PI * 2) / 60) * dtSec;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Matter = (Phaser as any).Physics.Matter.Matter;
    Matter.Body.setAngle(this.body, this.angle);
    this.draw();
  }

  private draw(): void {
    const g = this.gfx;
    const { cx, cy, baseRadius, bladeLength } = this.opts;
    g.clear();
    // Shadow of blades
    g.save();
    g.translateCanvas(cx + 4, cy + 5);
    g.rotateCanvas(this.angle);
    g.fillStyle(0x000000, 0.35);
    for (let i = 0; i < 4; i++) {
      g.save();
      g.rotateCanvas((i * Math.PI) / 2);
      g.fillRect(0, -BLADE_WIDTH / 2, bladeLength, BLADE_WIDTH);
      g.restore();
    }
    g.restore();
    // Stone base
    g.fillStyle(PAL.woodHighlight, 1);
    g.fillCircle(cx, cy, baseRadius);
    g.lineStyle(2, PAL.woodEdge, 1);
    g.strokeCircle(cx, cy, baseRadius);
    // Radial brick hint
    g.lineStyle(1, 0x60401a, 0.5);
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2;
      g.beginPath();
      g.moveTo(cx + Math.cos(ang) * 4, cy + Math.sin(ang) * 4);
      g.lineTo(cx + Math.cos(ang) * baseRadius, cy + Math.sin(ang) * baseRadius);
      g.strokePath();
    }
    // Blades
    g.save();
    g.translateCanvas(cx, cy);
    g.rotateCanvas(this.angle);
    for (let i = 0; i < 4; i++) {
      g.save();
      g.rotateCanvas((i * Math.PI) / 2);
      g.fillStyle(0xe8d8b0, 1);
      g.fillRect(0, -BLADE_WIDTH / 2, bladeLength, BLADE_WIDTH);
      g.lineStyle(1.2, PAL.woodEdge, 1);
      g.strokeRect(0.5, -BLADE_WIDTH / 2 + 0.5, bladeLength - 1, BLADE_WIDTH - 1);
      // rivets on blade
      g.fillStyle(PAL.woodEdge, 1);
      g.fillCircle(bladeLength - 8, -BLADE_WIDTH / 2 + 2, 1.2);
      g.fillCircle(bladeLength - 8, BLADE_WIDTH / 2 - 2, 1.2);
      g.restore();
    }
    g.restore();
    // Hub
    g.fillStyle(0x2a1808, 1);
    g.fillCircle(cx, cy, 8);
    g.fillStyle(0xd8a848, 1);
    g.fillCircle(cx, cy, 3);
  }
}
